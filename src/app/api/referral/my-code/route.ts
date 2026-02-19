import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET() {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get or create referral code
    let referralCode = await prisma.referralCode.findUnique({
      where: { userId: session.user.id },
      include: {
        referrals: {
          include: {
            referredUser: { select: { id: true, name: true, createdAt: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!referralCode) {
      // Generate a unique code
      let code = generateCode();
      let attempts = 0;
      while (attempts < 10) {
        const existing = await prisma.referralCode.findUnique({
          where: { code },
        });
        if (!existing) break;
        code = generateCode();
        attempts++;
      }

      referralCode = await prisma.referralCode.create({
        data: {
          userId: session.user.id,
          code,
        },
        include: {
          referrals: {
            include: {
              referredUser: { select: { id: true, name: true, createdAt: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    return NextResponse.json(referralCode);
  } catch (error) {
    console.error("Referral code GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
