import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET() {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const userCredit = await prisma.userCredit.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      balance: userCredit?.balance || 0,
    });
  } catch (error) {
    console.error("Balance check error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation du solde" },
      { status: 500 }
    );
  }
}
