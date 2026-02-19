import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";

export async function GET(req: NextRequest) {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const vehicleId = searchParams.get("vehicleId");

    if (!vehicleId) {
      return NextResponse.json({ error: "vehicleId requis" }, { status: 400 });
    }

    // Verify ownership
    const vehicle = await prisma.ownedVehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle || vehicle.userId !== session.user.id) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }

    const entries = await prisma.maintenanceEntry.findMany({
      where: { ownedVehicleId: vehicleId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Maintenance GET error:", error);
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
      ownedVehicleId,
      type,
      label,
      date,
      km,
      notes,
      nextDueDate,
      nextDueKm,
    } = body;

    if (!ownedVehicleId || !type || !date) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Verify ownership
    const vehicle = await prisma.ownedVehicle.findUnique({
      where: { id: ownedVehicleId },
    });
    if (!vehicle || vehicle.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const entry = await prisma.maintenanceEntry.create({
      data: {
        ownedVehicleId,
        type,
        label: label || null,
        date: new Date(date),
        km: km ? Number(km) : null,
        notes: notes || null,
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        nextDueKm: nextDueKm ? Number(nextDueKm) : null,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Maintenance POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
