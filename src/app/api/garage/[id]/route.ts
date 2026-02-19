import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { km, color, notes, purchaseDate } = body;

    const vehicle = await prisma.ownedVehicle.findUnique({ where: { id } });
    if (!vehicle || vehicle.userId !== session.user.id) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }

    const updated = await prisma.ownedVehicle.update({
      where: { id },
      data: {
        km: km !== undefined ? Number(km) : undefined,
        color: color !== undefined ? color : undefined,
        notes: notes !== undefined ? notes : undefined,
        purchaseDate:
          purchaseDate !== undefined
            ? purchaseDate
              ? new Date(purchaseDate)
              : null
            : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Garage PUT error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const vehicle = await prisma.ownedVehicle.findUnique({ where: { id } });
    if (!vehicle || vehicle.userId !== session.user.id) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }

    await prisma.ownedVehicle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Garage DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
