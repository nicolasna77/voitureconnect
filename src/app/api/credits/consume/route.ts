import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { SPECIFICATION_CREDIT_COST } from "@/config/credits";
import { getCachedSession } from "@/lib/cached-session";

export async function POST(req: NextRequest) {
  try {
    const [session, body] = await Promise.all([getCachedSession(), req.json()]);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { specificationId, specificationType } = body;

    if (!specificationId || !specificationType) {
      return NextResponse.json(
        { error: "Parametres manquants" },
        { status: 400 }
      );
    }

    const specId = parseInt(specificationId, 10);

    // Check user role first
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    // Admin users have unrestricted access - no need to consume credits
    if (user?.role === "ADMIN") {
      return NextResponse.json({
        success: true,
        message: "Acces admin accorde",
        alreadyHadAccess: true,
      });
    }

    // Check existing access and user credits in parallel (async-parallel)
    const [existingAccess, userCredit] = await Promise.all([
      prisma.specificationAccess.findUnique({
        where: {
          userId_specificationId_specificationType: {
            userId: session.user.id,
            specificationId: specId,
            specificationType,
          },
        },
      }),
      prisma.userCredit.findUnique({
        where: { userId: session.user.id },
      }),
    ]);

    if (existingAccess) {
      return NextResponse.json({
        success: true,
        message: "Acces deja accorde",
        alreadyHadAccess: true,
      });
    }

    const balance = userCredit?.balance || 0;

    if (balance < SPECIFICATION_CREDIT_COST) {
      return NextResponse.json(
        {
          error: "Credits insuffisants",
          balance,
          required: SPECIFICATION_CREDIT_COST,
        },
        { status: 402 }
      );
    }

    // Debit credits and grant access
    await prisma.$transaction(async (tx) => {
      // Deduct credits
      await tx.userCredit.update({
        where: { userId: session.user.id },
        data: {
          balance: {
            decrement: SPECIFICATION_CREDIT_COST,
          },
        },
      });

      // Record transaction
      await tx.creditTransaction.create({
        data: {
          userId: session.user.id,
          type: "CONSUMPTION",
          amount: -SPECIFICATION_CREDIT_COST,
          description: `Deblocage fiche technique ${specificationType} #${specificationId}`,
          referenceId: `${specificationType}-${specificationId}`,
        },
      });

      // Grant access
      await tx.specificationAccess.create({
        data: {
          userId: session.user.id,
          specificationId: specId,
          specificationType,
          creditCost: SPECIFICATION_CREDIT_COST,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Acces accorde",
      newBalance: balance - SPECIFICATION_CREDIT_COST,
    });
  } catch (error) {
    console.error("Consume credits error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la consommation des credits" },
      { status: 500 }
    );
  }
}
