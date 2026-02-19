import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
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
