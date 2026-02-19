import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET() {
  try {
    const session = await getCachedSession();

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
