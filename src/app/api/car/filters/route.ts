import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

function buildWhereClause(searchParams: URLSearchParams, lang: string) {
  const filters: any = {
    car: {},
  };

  // Ajout des filtres de base
  if (searchParams.has("fuelType")) {
    filters.car.fuelType = searchParams.get("fuelType");
  }
  if (searchParams.has("gearbox")) {
    filters.car.gearbox = searchParams.get("gearbox");
  }

  return filters;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "fr").toLowerCase();

  try {
    const whereClause = buildWhereClause(searchParams, lang);

    const availableOptions = await prisma.car.findMany({
      where: whereClause.car || {},
      select: {
        fuelType: true,
        gearbox: true,
        year: true,
        price: true,
        Kms: true,
        carType: {
          select: {
            name: true,
          },
        },
      },
      distinct: ["fuelType", "gearbox"],
    });

    // Ajouter un comptage des voitures par type de boîte
    const gearboxCounts = await prisma.car.groupBy({
      by: ["gearbox"],
      _count: true,
      where: whereClause.car || {},
    });

    const totalCount = await prisma.car.count({
      where: whereClause.car || {},
    });

    // Transformer les données pour le frontend
    const options = {
      carTypes: [
        ...new Set(
          availableOptions.map((car) => car.carType?.name).filter(Boolean)
        ),
      ],
      fuelTypes: [...new Set(availableOptions.map((car) => car.fuelType))],
      gearboxTypes: [...new Set(availableOptions.map((car) => car.gearbox))],
      gearboxCounts: Object.fromEntries(
        gearboxCounts.map(({ gearbox, _count }) => [gearbox, _count])
      ),
      yearRange: availableOptions.length
        ? {
            min: Math.min(...availableOptions.map((car) => car.year)),
            max: Math.max(...availableOptions.map((car) => car.year)),
          }
        : { min: 0, max: 0 },
      priceRange: availableOptions.length
        ? {
            min: Math.min(...availableOptions.map((car) => Number(car.price))),
            max: Math.max(...availableOptions.map((car) => Number(car.price))),
          }
        : { min: 0, max: 0 },
      kmRange: availableOptions.length
        ? {
            min: Math.min(...availableOptions.map((car) => car.Kms)),
            max: Math.max(...availableOptions.map((car) => car.Kms)),
          }
        : { min: 0, max: 0 },
      totalCount,
    };

    return Response.json({ success: true, data: options });
  } catch (error) {
    return Response.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
