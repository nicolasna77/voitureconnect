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

    const entry = await prisma.maintenanceEntry.findUnique({
      where: { id },
      include: { ownedVehicle: true },
    });

    if (!entry || entry.ownedVehicle.userId !== session.user.id) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }

    const updated = await prisma.maintenanceEntry.update({
      where: { id },
      data: {
        type: body.type,
        label: body.label !== undefined ? body.label : undefined,
        date: body.date ? new Date(body.date) : undefined,
        km: body.km !== undefined ? Number(body.km) : undefined,
        notes: body.notes !== undefined ? body.notes : undefined,
        nextDueDate:
          body.nextDueDate !== undefined
            ? body.nextDueDate
              ? new Date(body.nextDueDate)
              : null
            : undefined,
        nextDueKm:
          body.nextDueKm !== undefined ? Number(body.nextDueKm) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Maintenance PUT error:", error);
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

    const entry = await prisma.maintenanceEntry.findUnique({
      where: { id },
      include: { ownedVehicle: true },
    });

    if (!entry || entry.ownedVehicle.userId !== session.user.id) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }

    await prisma.maintenanceEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Maintenance DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
