import { NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET() {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ ids: [] });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      select: { generationId: true },
    });

    return NextResponse.json({ ids: favorites.map((f) => f.generationId) });
  } catch (error) {
    console.error("Favorites IDs error:", error);
    return NextResponse.json({ ids: [] });
  }
}
