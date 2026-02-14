import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

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
