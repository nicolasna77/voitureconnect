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
