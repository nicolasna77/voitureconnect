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
          address: true,
          car: {
            include: {
              pictures: true,
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
          User: {
            select: {
              id: true,
              name: true,
            },
          },
          garage: {
            select: {
              id: true,
              name: true,
              Adresse: true,
            },
          },
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
                pictures: true,
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
            User: {
              select: {
                id: true,
                name: true,
              },
            },
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

  // Filtre de base pour la voiture
  whereClause.car = {
    AND: [],
  };

  // Filtre par marque
  if (searchParams.get("marque")) {
    whereClause.car.AND.push({
      carMake: {
        name: {
          contains: searchParams.get("marque"),
          mode: "insensitive",
        },
      },
    });
  }

  // Filtre par modèle
  if (searchParams.get("model")) {
    whereClause.car.AND.push({
      carModel: {
        name: {
          contains: searchParams.get("model"),
          mode: "insensitive",
        },
      },
    });
  }

  // Filtre par année
  if (searchParams.get("year")) {
    whereClause.car.AND.push({
      year: parseInt(searchParams.get("year")!),
    });
  }

  // Filtre par prix
  if (searchParams.get("minPrice") || searchParams.get("maxPrice")) {
    const priceFilter: any = {};
    if (searchParams.get("minPrice")) {
      priceFilter.gte = parseFloat(searchParams.get("minPrice")!);
    }
    if (searchParams.get("maxPrice")) {
      priceFilter.lte = parseFloat(searchParams.get("maxPrice")!);
    }
    whereClause.car.AND.push({ price: priceFilter });
  }

  // Si aucun filtre n'est appliqué, supprimez le tableau AND vide
  if (whereClause.car.AND.length === 0) {
    delete whereClause.car.AND;
  }

  return whereClause;
}
