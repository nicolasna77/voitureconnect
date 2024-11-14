import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const garage = await prisma.garage.findUnique({
      where: {
        id: params.uid,
      },
      include: {
        Adresse: true,
        adID: {
          include: {
            car: {
              include: {
                pictures: true,
                carMakeEN: {
                  select: {
                    name: true,
                  },
                },
                carModelEN: {
                  select: {
                    name: true,
                  },
                },
                Option: true,
              },
            },
            likes: {
              select: {
                id: true,
                userId: true,
              },
            },
            address: true,
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                picture: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    if (!garage) {
      return NextResponse.json({ error: "Garage non trouvé" }, { status: 404 });
    }

    const transformedGarage = {
      ...garage,
      adID: garage.adID.map((ad) => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        address: ad.address,
        createdAt: ad.createdAt,
        updatedAt: ad.updatedAt,
        car: {
          ...ad.car,
          price: ad.car.price,
          Kms: ad.car.Kms,
          year: ad.car.year,
          gearbox: ad.car.gearbox,
          fuelType: ad.car.fuelType,
          pictures: ad.car.pictures,
          carMake: ad.car.carMakeEN,
          carModel: ad.car.carModelEN,
        },
        isLiked: ad.likes.length > 0,
        idLike: ad.likes[0]?.id,
      })),
    };

    return NextResponse.json(transformedGarage, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération du garage:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du garage" },
      { status: 500 }
    );
  }
}
