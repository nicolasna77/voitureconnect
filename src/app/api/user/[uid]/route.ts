import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.uid,
      },
      include: {
        Car: {
          include: {
            carMake: {
              select: {
                name: true,
              },
            },
            carModel: {
              select: {
                name: true,
              },
            },
            pictures: {
              select: {
                url: true,
                alt: true,
              },
            },
            carType: {
              select: {
                name: true,
              },
            },
            carGeneration: {
              select: {
                name: true,
              },
            },
            carSerie: {
              select: {
                name: true,
              },
            },
            carTrim: {
              select: {
                name: true,
              },
            },
            carEquipment: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const transformedUser = {
      ...user,
      Car: user.Car.map((car) => ({
        id: car.id,
        year: car.year,
        color: car.color,
        kms: car.Kms,
        price: car.price,
        fuelType: car.fuelType,
        gearbox: car.gearbox,
        pictures: car.pictures,
        make: car.carMake?.name,
        model: car.carModel?.name,
        type: car.carType?.name,
        generation: car.carGeneration?.name,
        serie: car.carSerie?.name,
        trim: car.carTrim?.name,
        equipment: car.carEquipment?.name,
      })),
    };

    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
