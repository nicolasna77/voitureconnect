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
      return NextResponse.json({ ids: [] });
    }

    const accesses = await prisma.specificationAccess.findMany({
      where: { userId: session.user.id },
      select: { specificationId: true },
    });

    const ids = accesses.map((a) => a.specificationId);

    return NextResponse.json({ ids });
  } catch {
    return NextResponse.json({ ids: [] });
  }
}
