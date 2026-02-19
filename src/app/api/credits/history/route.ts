import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET() {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const [userCredit, transactions] = await Promise.all([
      prisma.userCredit.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.creditTransaction.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    return NextResponse.json({
      balance: userCredit?.balance || 0,
      transactions,
    });
  } catch (error) {
    console.error("Credit history error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de l'historique" },
      { status: 500 },
    );
  }
}
