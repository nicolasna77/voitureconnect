import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

const REFERRAL_BONUS_CREDITS = 3;

export async function GET() {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const referralCode = await prisma.referralCode.findUnique({
      where: { userId: session.user.id },
      select: { usedCount: true },
    });

    const totalReferrals = referralCode?.usedCount || 0;
    const creditsEarned = totalReferrals * REFERRAL_BONUS_CREDITS;

    return NextResponse.json({
      totalReferrals,
      creditsEarned,
      bonusPerReferral: REFERRAL_BONUS_CREDITS,
    });
  } catch (error) {
    console.error("Referral stats error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
