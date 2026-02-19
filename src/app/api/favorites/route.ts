import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET() {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Favorites GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { generationId, makeName, modelName, generationName, imageUrl } = body;

    if (!generationId || !makeName || !modelName || !generationName) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Toggle: if already favorited, remove it
    const existing = await prisma.favorite.findUnique({
      where: { userId_generationId: { userId: session.user.id, generationId: Number(generationId) } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    }

    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        generationId: Number(generationId),
        makeName,
        modelName,
        generationName,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ favorited: true }, { status: 201 });
  } catch (error) {
    console.error("Favorites POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
