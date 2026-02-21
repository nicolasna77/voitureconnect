import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const generationId = searchParams.get("generationId");
    const trimId = searchParams.get("trimId");

    if (!generationId) {
      return NextResponse.json({ error: "generationId requis" }, { status: 400 });
    }

    const session = await getCachedSession();

    const where = {
      generationId: Number(generationId),
      trimId: trimId ? Number(trimId) : 0,
    };

    const [ratings, userRating] = await Promise.all([
      prisma.rating.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, picture: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      session?.user
        ? prisma.rating.findUnique({
            where: {
              userId_generationId_trimId: {
                userId: session.user.id,
                generationId: Number(generationId),
                trimId: trimId ? Number(trimId) : 0,
              },
            },
          })
        : null,
    ]);

    const totalStars = ratings.reduce(
      (sum: number, r: { stars: number }) => sum + r.stars,
      0
    );
    const average = ratings.length > 0 ? totalStars / ratings.length : 0;

    const distribution = [1, 2, 3, 4, 5].map((star) => ({
      star,
      count: ratings.filter((r: { stars: number }) => r.stars === star).length,
    }));

    return NextResponse.json({
      ratings,
      average: Math.round(average * 10) / 10,
      count: ratings.length,
      distribution,
      userRating: userRating || null,
    });
  } catch (error) {
    console.error("Ratings GET error:", error);
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
    const { generationId, trimId, stars, title, comment } = body;

    if (!generationId || !stars || stars < 1 || stars > 5) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_generationId_trimId: {
          userId: session.user.id,
          generationId: Number(generationId),
          trimId: trimId ? Number(trimId) : 0,
        },
      },
      create: {
        userId: session.user.id,
        generationId: Number(generationId),
        trimId: trimId ? Number(trimId) : 0,
        stars: Number(stars),
        title: title || null,
        comment: comment || null,
      },
      update: {
        stars: Number(stars),
        title: title || null,
        comment: comment || null,
      },
    });

    return NextResponse.json(rating, { status: 201 });
  } catch (error) {
    console.error("Ratings POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
