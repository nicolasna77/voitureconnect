import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return new Response("ID de génération manquant", { status: 400 });
  }

  const generation = await prisma.carGeneration.findUnique({
    where: { id_car_generation: parseInt(id) },
    include: {
      carModel: {
        include: {
          carMake: true,
        },
      },
      carType: true,
      carSeries: {
        include: {
          carTrims: {
            include: {
              carSpecificationValues: {
                include: {
                  carSpecification: true,
                },
              },
            },
          },
        },
      },
      cars: {
        include: {
          carTrim: {
            include: {
              carEquipments: {
                include: {
                  carOptionValues: {
                    include: {
                      carOption: true,
                    },
                  },
                },
              },
              carSpecificationValues: {
                include: {
                  carSpecification: true,
                },
              },
            },
          },
          carEquipment: true,
          carOption: true,
          carOptionValue: true,
          carSpecification: true,
          carSpecificationValue: true,
        },
      },
    },
  });

  if (!generation) {
    return new Response("Génération non trouvée", { status: 404 });
  }

  return Response.json(generation);
};
