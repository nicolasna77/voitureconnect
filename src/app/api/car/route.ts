"use server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const marque = searchParams.get("marque");
  const model = searchParams.get("model");
  const generation = searchParams.get("generation");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10;

  let whereClause: any = {};

  if (marque) {
    whereClause.carModel = {
      carMake: {
        name: { contains: marque, mode: "insensitive" },
      },
    };
  }

  if (model) {
    whereClause.carModel = {
      ...whereClause.carModel,
      name: { contains: model, mode: "insensitive" },
    };
  }

  if (generation) {
    whereClause.name = { contains: generation, mode: "insensitive" };
  }

  const skip = (page - 1) * limit;

  const [totalCars, data] = await Promise.all([
    prisma.carGenerationFR.count({
      where: whereClause,
    }),
    prisma.carGenerationFR.findMany({
      where: whereClause,
      include: {
        carModel: {
          include: {
            carMake: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(totalCars / limit);

  return Response.json({
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalCars,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
};
