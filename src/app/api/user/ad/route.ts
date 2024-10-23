import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const idUser = request.nextUrl.searchParams.get("idUser");
    console.log(idUser);
    if (!idUser) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userAds = await prisma.ad.findMany({
      where: {
        userId: idUser,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        car: true,
      },
    });

    return NextResponse.json(userAds);
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
