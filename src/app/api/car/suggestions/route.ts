import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Aucun terme de recherche fourni" },
      { status: 400 }
    );
  }

  try {
    // Rechercher les marques, modèles et générations
    const carMakes = await prisma.carMake.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id_car_make: true,
        name: true,
      },
    });

    const carModels = await prisma.carModel.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        carMake: {
          select: {
            name: true,
          },
        },
      },
    });

    const carGenerations = await prisma.carGeneration.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
        carModel: {
          select: {
            name: true,
            carMake: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    let suggestions = [
      ...carMakes.map((make) => [make.name, "", ""]),
      ...carModels
        .filter((model) => model.name !== null)
        .map((model) => [model.carMake.name, model.name, ""]),
      ...carGenerations.map((generation) => [
        generation.carModel.carMake.name,
        generation.carModel.name,
        generation.name,
      ]),
    ];

    // Limiter les suggestions à 10
    suggestions = suggestions.slice(0, 10);

    return NextResponse.json({ data: suggestions });
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
