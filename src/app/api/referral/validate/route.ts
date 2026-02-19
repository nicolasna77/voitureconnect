import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

const REFERRAL_BONUS_CREDITS = 3;

export async function POST(req: NextRequest) {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { code } = body as { code: string };

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code requis" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Check if user has already been referred
    const alreadyReferred = await prisma.referral.findUnique({
      where: { referredUserId: session.user.id },
    });

    if (alreadyReferred) {
      return NextResponse.json(
        { error: "Vous avez déjà utilisé un code de parrainage" },
        { status: 409 }
      );
    }

    // Find the referral code
    const referralCode = await prisma.referralCode.findUnique({
      where: { code: normalizedCode },
      include: { user: { select: { id: true } } },
    });

    if (!referralCode) {
      return NextResponse.json(
        { error: "Code de parrainage invalide" },
        { status: 404 }
      );
    }

    // Cannot use own code
    if (referralCode.userId === session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas utiliser votre propre code" },
        { status: 400 }
      );
    }

    // Apply referral in a transaction
    await prisma.$transaction(async (tx) => {
      // Create referral record
      await tx.referral.create({
        data: {
          referralCodeId: referralCode.id,
          referredUserId: session.user.id,
          rewardGiven: true,
        },
      });

      // Increment code usage count
      await tx.referralCode.update({
        where: { id: referralCode.id },
        data: { usedCount: { increment: 1 } },
      });

      // Give credits to referrer (parrain)
      await tx.userCredit.upsert({
        where: { userId: referralCode.userId },
        create: {
          userId: referralCode.userId,
          balance: REFERRAL_BONUS_CREDITS,
        },
        update: { balance: { increment: REFERRAL_BONUS_CREDITS } },
      });

      await tx.creditTransaction.create({
        data: {
          userId: referralCode.userId,
          type: "BONUS",
          amount: REFERRAL_BONUS_CREDITS,
          description: `Bonus parrainage — nouveau filleul`,
          referenceId: `referral-${session.user.id}`,
        },
      });

      // Give credits to referred user (filleul)
      await tx.userCredit.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          balance: REFERRAL_BONUS_CREDITS,
        },
        update: { balance: { increment: REFERRAL_BONUS_CREDITS } },
      });

      await tx.creditTransaction.create({
        data: {
          userId: session.user.id,
          type: "BONUS",
          amount: REFERRAL_BONUS_CREDITS,
          description: `Bonus code de parrainage utilisé`,
          referenceId: `referred-by-${referralCode.userId}`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: `Code appliqué ! Vous et votre parrain avez reçu ${REFERRAL_BONUS_CREDITS} crédits chacun.`,
      bonusCredits: REFERRAL_BONUS_CREDITS,
    });
  } catch (error) {
    console.error("Referral validate error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
