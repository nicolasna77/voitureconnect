import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { AI_ANALYSIS_CREDIT_COST } from "@/config/credits";
import { getCachedSession } from "@/lib/cached-session";

export async function POST(req: NextRequest) {
  try {
    const [session, body] = await Promise.all([getCachedSession(), req.json()]);

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { generationId } = body;

    if (!generationId) {
      return NextResponse.json(
        { error: "generationId manquant" },
        { status: 400 }
      );
    }

    const genId = parseInt(generationId, 10);

    // Check user role first
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const userRole = user?.role || "USER";

    // ADMIN and PRO users have FREE access - no credits consumed
    if (userRole === "ADMIN" || userRole === "PRO") {
      return NextResponse.json({
        success: true,
        message: "Acces gratuit (role privilegie)",
        alreadyHadAccess: true,
        newBalance: Infinity,
      });
    }

    // USER role: check existing access and credits
    const [existingAccess, userCredit] = await Promise.all([
      prisma.specificationAccess.findUnique({
        where: {
          userId_specificationId_specificationType: {
            userId: session.user.id,
            specificationId: genId,
            specificationType: "ai_analysis",
          },
        },
      }),
      prisma.userCredit.findUnique({
        where: { userId: session.user.id },
      }),
    ]);

    // Already has access for this vehicle
    if (existingAccess) {
      return NextResponse.json({
        success: true,
        message: "Acces deja accorde",
        alreadyHadAccess: true,
        newBalance: userCredit?.balance || 0,
      });
    }

    const balance = userCredit?.balance || 0;

    if (balance < AI_ANALYSIS_CREDIT_COST) {
      return NextResponse.json(
        {
          error: "Credits insuffisants",
          balance,
          required: AI_ANALYSIS_CREDIT_COST,
        },
        { status: 402 }
      );
    }

    // Debit credits and grant AI access
    await prisma.$transaction(async (tx) => {
      // Deduct credits
      await tx.userCredit.update({
        where: { userId: session.user.id },
        data: {
          balance: {
            decrement: AI_ANALYSIS_CREDIT_COST,
          },
        },
      });

      // Record transaction
      await tx.creditTransaction.create({
        data: {
          userId: session.user.id,
          type: "CONSUMPTION",
          amount: -AI_ANALYSIS_CREDIT_COST,
          description: `Analyse IA vehicule #${generationId}`,
          referenceId: `ai_analysis-${generationId}`,
        },
      });

      // Grant AI access for this vehicle
      await tx.specificationAccess.create({
        data: {
          userId: session.user.id,
          specificationId: genId,
          specificationType: "ai_analysis",
          creditCost: AI_ANALYSIS_CREDIT_COST,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Acces analyse IA accorde",
      newBalance: balance - AI_ANALYSIS_CREDIT_COST,
    });
  } catch (error) {
    console.error("AI Consume credits error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la consommation des credits" },
      { status: 500 }
    );
  }
}
