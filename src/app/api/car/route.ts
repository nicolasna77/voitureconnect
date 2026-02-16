import prisma from "@/prisma";
import { NextRequest } from "next/server";
import { getLocale } from "next-intl/server";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const locale = await getLocale();
  const searchParams = req.nextUrl.searchParams;

  const marque = searchParams.get("marque") || undefined;
  const model = searchParams.get("model") || undefined;
  const generation = searchParams.get("generation") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const isFR = locale.toLowerCase() === "fr";

  try {
    const where: Record<string, unknown> = {};

    if (marque) {
      where.carModel = {
        carMake: { name: marque },
        ...(model ? { name: model } : {}),
      };
    }

    if (generation) {
      where.name = { contains: generation, mode: "insensitive" };
    }

    const generationModel = isFR
      ? prisma.carGenerationFR
      : prisma.carGenerationEN;

    const [data, totalCars] = await Promise.all([
      (generationModel as typeof prisma.carGenerationFR).findMany({
        where,
        include: {
          carModel: {
            include: {
              carMake: true,
            },
          },
          carType: true,
        },
        orderBy: [
          { carModel: { carMake: { name: "asc" } } },
          { carModel: { name: "asc" } },
          { name: "asc" },
        ],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      (generationModel as typeof prisma.carGenerationFR).count({ where }),
    ]);

    return Response.json({
      data,
      pagination: {
        totalCars,
        totalPages: Math.ceil(totalCars / PAGE_SIZE),
        currentPage: page,
        pageSize: PAGE_SIZE,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des véhicules:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
