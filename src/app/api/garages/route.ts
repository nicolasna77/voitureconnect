import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const garages = await prisma.garage.findMany({
      include: {
        Adresse: true,
        adID: {
          include: {
            car: {
              include: {
                pictures: true,
                carMake: true,
                carModel: true,
              },
            },
            likes: true,
            Option: true,
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

    return NextResponse.json(garages, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des garages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des garages" },
      { status: 500 }
    );
  }
}
