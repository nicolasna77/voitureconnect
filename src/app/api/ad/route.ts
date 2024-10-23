import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;

  try {
    if (id) {
      const data = await prisma.ad.findUnique({
        where: { id },
        include: {
          car: {
            include: {
              carMake: true,
              carModel: true,
              carTrim: true,
              carGeneration: true,
              carSerie: true,
              carEquipment: true,
              carOption: true,
              carOptionValue: true,
              carSpecification: true,
              carSpecificationValue: true,
            },
          },
          User: true,
          likes: userId
            ? {
                where: { userId: userId },
                select: { id: true },
              }
            : false,
          garage: true,
        },
      });

      if (!data) {
        return NextResponse.json(
          { error: "Annonce non trouvée" },
          { status: 404 }
        );
      }

      const isLiked = userId ? data.likes.length > 0 : false;

      return NextResponse.json({ data: { ...data, isLiked } });
    } else {
      const skip = (page - 1) * limit;
      const whereClause = buildWhereClause(searchParams);

      const [data, total] = await Promise.all([
        prisma.ad.findMany({
          where: whereClause,
          take: limit,
          skip,
          include: {
            car: {
              include: {
                carMake: true,
                carModel: true,
                carTrim: true,
                carGeneration: true,
                carSerie: true,
                carEquipment: true,
                carOption: true,
                carOptionValue: true,
                carSpecification: true,
                carSpecificationValue: true,
              },
            },
            likes: true,
            garage: true,
            User: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.ad.count({ where: whereClause }),
      ]);

      const dataWithLikeInfo = await Promise.all(
        data.map(async (ad) => {
          let isLiked = false;
          let idLike = null;

          if (userId) {
            const like = await prisma.like.findFirst({
              where: { adId: ad.id, userId: userId },
              select: { id: true },
            });
            isLiked = !!like;
            idLike = like ? like.id : null;
          }

          return {
            ...ad,
            isLiked,
            idLike,
          };
        })
      );

      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        data: dataWithLikeInfo,
        page,
        totalPages,
        total,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des annonces:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
};

function buildWhereClause(searchParams: URLSearchParams) {
  const whereClause: any = {};

  // Ajoutez des conditions seulement si les paramètres sont présents
  if (searchParams.get("marque")) {
    whereClause.car = {
      ...whereClause.car,
      carMake: {
        name: { contains: searchParams.get("marque"), mode: "insensitive" },
      },
    };
  }

  if (searchParams.get("model")) {
    whereClause.car = {
      ...whereClause.car,
      carModel: {
        name: { contains: searchParams.get("model"), mode: "insensitive" },
      },
    };
  }

  return whereClause;
}
