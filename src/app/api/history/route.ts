import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET() {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const history = await prisma.viewHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { visitedAt: "desc" },
      take: 20,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("History GET error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await prisma.viewHistory.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("History DELETE error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCachedSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { generationId, makeName, modelName, generationName, imageUrl } =
      body;

    if (!generationId || !makeName || !modelName || !generationName) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Deduplicate: skip if same generation visited in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recent = await prisma.viewHistory.findFirst({
      where: {
        userId: session.user.id,
        generationId: Number(generationId),
        visitedAt: { gte: fiveMinutesAgo },
      },
    });

    if (recent) {
      return NextResponse.json({ deduplicated: true });
    }

    const entry = await prisma.viewHistory.create({
      data: {
        userId: session.user.id,
        generationId: Number(generationId),
        makeName,
        modelName,
        generationName,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("History POST error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}
