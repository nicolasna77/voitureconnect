import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  const page = Number(searchParams.get("page")) || 1;
  const lang = searchParams.get("lang") || "FR";
  const limit = 12;

  const carModels = {
    carMake: lang === "FR" ? "carMakeFR" : "carMakeEN",
    carModel: lang === "FR" ? "carModelFR" : "carModelEN",
    carTrim: lang === "FR" ? "carTrimFR" : "carTrimEN",
    carGeneration: lang === "FR" ? "carGenerationFR" : "carGenerationEN",
    carSerie: lang === "FR" ? "carSerieFR" : "carSerieEN",
    carEquipment: lang === "FR" ? "carEquipmentFR" : "carEquipmentEN",
    carType: lang === "FR" ? "carTypeFR" : "carTypeEN",
  } as const;

  console.log("Paramètres reçus:", Object.fromEntries(searchParams));

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
              Option: true,
              carType: true,
            },
          },
          User: true,
          garage: true,
        },
      });

      console.log("Données trouvées pour l'ID:", data);

      if (!data) {
        return NextResponse.json(
          { error: "Annonce non trouvée" },
          { status: 404 }
        );
      }

      let isLiked = false;

      if (userId) {
        const like = await prisma.like.findFirst({
          where: { adId: id, userId: userId },
          select: { id: true },
        });
        isLiked = !!like;
      }

      return NextResponse.json({ data: { ...data, isLiked } });
    } else {
      const skip = (page - 1) * limit;
      const whereClause = buildWhereClause(searchParams, lang);

      console.log("Where clause construite:", whereClause);

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
                Option: true,
                carType: true,
              },
            },
            garage: true,
            User: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.ad.count({ where: whereClause }),
      ]);

      console.log("Nombre total d'annonces trouvées:", total);
      console.log("Données récupérées:", data);

      let dataWithLikeInfo = data;

      if (userId) {
        const likes = await prisma.like.findMany({
          where: {
            adId: { in: data.map((ad) => ad.id) },
            userId: userId,
          },
          select: { id: true, adId: true },
        });

        const likesMap = new Map(likes.map((like) => [like.adId, like.id]));

        dataWithLikeInfo = data.map((ad) => {
          const likeId = likesMap.get(ad.id);
          return {
            ...ad,
            isLiked: !!likeId,
            idLike: likeId || null,
          };
        });
      }

      const totalPages = Math.ceil(total / limit);

      return NextResponse.json({
        data: dataWithLikeInfo,
        page,
        totalPages,
        total,
      });
    }
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
};

function buildWhereClause(searchParams: URLSearchParams, lang: string) {
  const whereClause: any = {};
  const carMakeModel = lang === "FR" ? "carMakeFR" : "carMakeEN";
  const carModelModel = lang === "FR" ? "carModelFR" : "carModelEN";

  if (searchParams.get("marque")) {
    whereClause.car = {
      ...whereClause.car,
      [carMakeModel]: {
        name: { contains: searchParams.get("marque"), mode: "insensitive" },
      },
    };
  }

  if (searchParams.get("model")) {
    whereClause.car = {
      ...whereClause.car,
      [carModelModel]: {
        name: { contains: searchParams.get("model"), mode: "insensitive" },
      },
    };
  }

  return whereClause;
}
