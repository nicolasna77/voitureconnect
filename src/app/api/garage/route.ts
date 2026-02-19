import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET() {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const vehicles = await prisma.ownedVehicle.findMany({
      where: { userId: session.user.id },
      include: {
        maintenances: {
          orderBy: { date: "desc" },
          take: 5,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Garage GET error:", error);
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
    const {
      generationId,
      trimId,
      makeName,
      modelName,
      generationName,
      trimName,
      year,
      km,
      color,
      notes,
      purchaseDate,
    } = body;

    if (!generationId || !makeName || !modelName || !generationName) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const vehicle = await prisma.ownedVehicle.create({
      data: {
        userId: session.user.id,
        generationId: Number(generationId),
        trimId: trimId ? Number(trimId) : null,
        makeName,
        modelName,
        generationName,
        trimName: trimName || null,
        year: year ? Number(year) : null,
        km: km ? Number(km) : null,
        color: color || null,
        notes: notes || null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ce véhicule est déjà dans votre garage" },
        { status: 409 }
      );
    }
    console.error("Garage POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
