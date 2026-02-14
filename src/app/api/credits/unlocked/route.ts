import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "fr";

    // Get all unlocked specifications for this user
    const unlockedSpecs = await prisma.specificationAccess.findMany({
      where: { userId: session.user.id },
      orderBy: { accessedAt: "desc" },
    });

    // Fetch vehicle details based on locale
    const specsWithDetails = await Promise.all(
      unlockedSpecs.map(async (spec) => {
        let vehicleDetails = null;

        if (spec.specificationType === "trim") {
          if (locale === "fr") {
            const trim = await prisma.carTrimFR.findUnique({
              where: { id_car_trim: spec.specificationId },
              include: {
                carModel: {
                  include: {
                    carMake: true,
                  },
                },
                carSerie: true,
              },
            });

            if (trim) {
              vehicleDetails = {
                make: trim.carModel.carMake.name,
                model: trim.carModel.name,
                serie: trim.carSerie?.name || null,
                trim: trim.name,
                years:
                  trim.start_production_year && trim.end_production_year
                    ? `${trim.start_production_year} - ${trim.end_production_year}`
                    : trim.start_production_year || null,
              };
            }
          } else {
            const trim = await prisma.carTrimEN.findUnique({
              where: { id_car_trim: spec.specificationId },
              include: {
                carModel: {
                  include: {
                    carMake: true,
                  },
                },
                carSerie: true,
              },
            });

            if (trim) {
              vehicleDetails = {
                make: trim.carModel.carMake.name,
                model: trim.carModel.name,
                serie: trim.carSerie?.name || null,
                trim: trim.name,
                years:
                  trim.start_production_year && trim.end_production_year
                    ? `${trim.start_production_year} - ${trim.end_production_year}`
                    : trim.start_production_year || null,
              };
            }
          }
        }

        return {
          id: spec.id,
          specificationId: spec.specificationId,
          specificationType: spec.specificationType,
          creditCost: spec.creditCost,
          accessedAt: spec.accessedAt,
          vehicle: vehicleDetails,
        };
      })
    );

    return NextResponse.json({
      unlocked: specsWithDetails.filter((s) => s.vehicle !== null),
    });
  } catch (error) {
    console.error("Unlocked specs error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des fiches" },
      { status: 500 }
    );
  }
}
