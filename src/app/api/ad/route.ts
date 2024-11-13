import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Car, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Définir les interfaces pour les relations de voiture
interface CarRelation {
  id_car_type: number;
  name: string;
}

interface Picture {
  id: string;
  url: string;
  alt: string;
  isShown: boolean;
}

interface Option {
  id: string;
  name: string;
}

interface BaseCarData {
  id: string;
  price: Decimal;
  year: number;
  Kms: number;
  color: string;
  fuelType: string;
  gearbox: string;
  pictures: Picture[];
  Option: Option[];
  vin: string;
}

interface CarDataFR extends BaseCarData {
  carType: { name: string; id_car_type: number } | null;
  carMake: { name: string; id_car_make: number } | null;
  carModel: { name: string; id_car_model: number } | null;
  carGeneration: { name: string; id_car_generation: number } | null;
  carSerie: { name: string; id_car_serie: number } | null;
  carTrim: { name: string; id_car_trim: number } | null;
  carEquipment: { name: string; id_car_equipment: number } | null;
}

interface CarDataEN extends BaseCarData {
  carTypeEN: { name: string; id_car_type: number } | null;
  carMakeEN: { name: string; id_car_make: number } | null;
  carModelEN: { name: string; id_car_model: number } | null;
  carGenerationEN: { name: string; id_car_generation: number } | null;
  carSerieEN: { name: string; id_car_serie: number } | null;
  carTrimEN: { name: string; id_car_trim: number } | null;
  carEquipmentEN: { name: string; id_car_equipment: number } | null;
}

// Fonction utilitaire pour transformer les données de voiture
function transformCarData(
  car: any,
  lang: string
): CarDataFR | CarDataEN | null {
  if (!car) return null;

  const baseData = {
    id: car.id,
    price: car.price instanceof Decimal ? car.price : new Decimal(car.price),
    year: car.year,
    Kms: car.Kms,
    color: car.color,
    fuelType: car.fuelType,
    gearbox: car.gearbox,
    pictures: car.pictures || [],
    Option: car.Option || [],
    vin: car.vin,
  };

  if (lang === "fr") {
    return {
      ...baseData,
      carType: car.carType,
      carMake: car.carMake,
      carModel: car.carModel,
      carGeneration: car.carGeneration,
      carSerie: car.carSerie,
      carTrim: car.carTrim,
      carEquipment: car.carEquipment,
    } as CarDataFR;
  }

  return {
    ...baseData,
    carTypeEN: car.carTypeEN,
    carMakeEN: car.carMakeEN,
    carModelEN: car.carModelEN,
    carGenerationEN: car.carGenerationEN,
    carSerieEN: car.carSerieEN,
    carTrimEN: car.carTrimEN,
    carEquipmentEN: car.carEquipmentEN,
  } as CarDataEN;
}

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = request.headers.get("X-User-Id");
    const lang = (searchParams.get("lang") || "en").toLowerCase();
    const page = Number(searchParams.get("page")) || 1;
    const sort = searchParams.get("sort");
    const limit = 12;

    // Définir l'ordre de tri en fonction du paramètre sort
    const getOrderBy = (
      sort: string | null
    ): Prisma.AdOrderByWithRelationInput => {
      switch (sort) {
        case "price_desc":
          return { car: { price: "desc" } };
        case "price_asc":
          return { car: { price: "asc" } };
        case "date_desc":
          return { createdAt: "desc" };
        case "date_asc":
          return { createdAt: "asc" };
        default:
          return { createdAt: "desc" }; // Tri par défaut
      }
    };

    if (id) {
      const data = await prisma.ad.findUnique({
        where: { id },
        include: {
          address: true,
          car: {
            include: {
              pictures: true,
              Option: true,
              ...(lang === "fr"
                ? {
                    carType: true,
                    carMake: true,
                    carModel: true,
                    carGeneration: true,
                    carSerie: true,
                    carTrim: true,
                    carEquipment: true,
                  }
                : {
                    carTypeEN: true,
                    carMakeEN: true,
                    carModelEN: true,
                    carGenerationEN: true,
                    carSerieEN: true,
                    carTrimEN: true,
                    carEquipmentEN: true,
                  }),
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

      if (!data) {
        return NextResponse.json(
          { error: "Annonce non trouvée" },
          { status: 404 }
        );
      }

      // Transformer les données pour normaliser la structure
      const transformedData = {
        ...data,
        car: transformCarData(data.car, lang),
      };

      if (userId) {
        const like = await prisma.like.findFirst({
          where: { adId: id, userId },
          select: { id: true },
        });
        return NextResponse.json({
          data: {
            ...transformedData,
            isLiked: !!like,
          },
        });
      }

      return NextResponse.json(transformedData);
    }

    // Pagination et filtres
    const skip = (page - 1) * limit;
    const whereClause = buildWhereClause(searchParams, lang);

    const [data, total] = await Promise.all([
      prisma.ad.findMany({
        where: whereClause,
        take: limit,
        skip,
        include: {
          car: {
            include: {
              pictures: true,
              Option: true,
              ...(lang === "fr"
                ? {
                    carType: true,
                    carMake: true,
                    carModel: true,
                    carGeneration: true,
                    carSerie: true,
                    carTrim: true,
                    carEquipment: true,
                  }
                : {
                    carTypeEN: true,
                    carMakeEN: true,
                    carModelEN: true,
                    carGenerationEN: true,
                    carSerieEN: true,
                    carTrimEN: true,
                    carEquipmentEN: true,
                  }),
            },
          },
          garage: true,
          User: {
            select: {
              id: true,
              name: true,
            },
          },
          ...(userId
            ? {
                likes: {
                  where: { userId },
                  select: { id: true },
                },
              }
            : {}),
        },
        orderBy: getOrderBy(sort),
      }),
      prisma.ad.count({ where: whereClause }),
    ]);

    let transformedData = data.map((item) => ({
      ...item,
      isLiked: userId ? (item.likes?.length ?? 0) > 0 : false,
      car: transformCarData(item.car, lang),
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: transformedData,
      page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
};

function buildWhereClause(searchParams: URLSearchParams, lang: string) {
  const whereClause: Prisma.AdWhereInput = {};
  const carFilters: any = {};

  // Filtres existants
  if (searchParams.get("marque")) {
    carFilters[lang === "fr" ? "carMake" : "carMakeEN"] = {
      name: {
        contains: searchParams.get("marque"),
        mode: "insensitive",
      },
    };
  }

  // Nouveaux filtres
  if (searchParams.get("fuelType")) {
    carFilters.fuelType = searchParams.get("fuelType");
  }

  if (searchParams.get("vehicleType")) {
    carFilters[lang === "fr" ? "carType" : "carTypeEN"] = {
      name: {
        equals: searchParams.get("vehicleType"),
        mode: "insensitive",
      },
    };
  }

  if (searchParams.get("yearMin") || searchParams.get("yearMax")) {
    carFilters.year = {};
    if (searchParams.get("yearMin")) {
      carFilters.year.gte = parseInt(searchParams.get("yearMin")!);
    }
    if (searchParams.get("yearMax")) {
      carFilters.year.lte = parseInt(searchParams.get("yearMax")!);
    }
  }

  if (searchParams.get("priceMin") || searchParams.get("priceMax")) {
    carFilters.price = {};
    if (searchParams.get("priceMin")) {
      carFilters.price.gte = new Decimal(searchParams.get("priceMin")!);
    }
    if (searchParams.get("priceMax")) {
      carFilters.price.lte = new Decimal(searchParams.get("priceMax")!);
    }
  }

  if (searchParams.get("kmMin") || searchParams.get("kmMax")) {
    carFilters.Kms = {};
    if (searchParams.get("kmMin")) {
      carFilters.Kms.gte = parseInt(searchParams.get("kmMin")!);
    }
    if (searchParams.get("kmMax")) {
      carFilters.Kms.lte = parseInt(searchParams.get("kmMax")!);
    }
  }

  if (Object.keys(carFilters).length > 0) {
    whereClause.car = carFilters;
  }

  return whereClause;
}
