import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Types pour améliorer la lisibilité
interface CarSpecification {
  name: string;
  id_parent: string | null;
}

interface SpecificationValue {
  carSpecification: CarSpecification;
  value: string;
  unit: string | null;
}

interface CarTrim {
  id_car_trim: number;
  name: string;
  specifications: SpecificationValue[];
}

interface CarSerie {
  id_car_serie: number;
  name: string;
  trims: CarTrim[];
}

interface TransformedSpecification {
  name: string;
  value: string;
  unit: string | null;
}

// Fonction pour catégoriser les spécifications
const categorizeSpecifications = (
  specifications: SpecificationValue[]
): Record<string, TransformedSpecification[]> => {
  const categoryKeywords = {
    chassis: [
      "dimension",
      "weight",
      "volume",
      "length",
      "width",
      "height",
      "wheelbase",
      "track",
      "ground",
      "curb",
      "trunk",
      "cargo",
    ],
    engine: [
      "engine",
      "motor",
      "capacity",
      "power",
      "torque",
      "injection",
      "cylinder",
      "valve",
      "bore",
      "stroke",
    ],
    gearbox: ["transmission", "gearbox", "drive", "speed"],
    suspension: ["suspension", "brake", "disc", "steering"],
    performance: [
      "performance",
      "consumption",
      "speed",
      "acceleration",
      "fuel",
      "emission",
      "co2",
    ],
  };

  return specifications.reduce((acc, spec) => {
    const specName = spec.carSpecification.name.toLowerCase();
    let category = "other";

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => specName.includes(keyword))) {
        category = cat;
        break;
      }
    }

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push({
      name: spec.carSpecification.name,
      value: spec.value,
      unit: spec.unit,
    });

    return acc;
  }, {} as Record<string, TransformedSpecification[]>);
};

// Fonction pour extraire les spécifications communes
const getCommonSpecifications = (trims: CarTrim[]): SpecificationValue[] => {
  if (!trims?.length) return [];

  const firstTrimSpecs = trims[0].specifications;
  return firstTrimSpecs.filter((spec) =>
    trims.every((trim) =>
      trim.specifications.some(
        (s) =>
          s.carSpecification.name === spec.carSpecification.name &&
          s.value === spec.value &&
          s.unit === spec.unit
      )
    )
  );
};

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return new Response("ID de génération manquant", { status: 400 });
    }

    const generation = await prisma.carGenerationFR.findUnique({
      where: {
        id_car_generation: parseInt(id),
      },
      include: {
        carModel: {
          include: {
            carMake: true,
          },
        },
        series: {
          include: {
            trims: {
              include: {
                specifications: {
                  include: {
                    carSpecification: {
                      select: {
                        name: true,
                        id_parent: true,
                      },
                    },
                  },
                  orderBy: [
                    {
                      carSpecification: {
                        name: "asc",
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
    });

    if (!generation) {
      return new Response("Génération non trouvée", { status: 404 });
    }

    const transformedData = {
      ...generation,
      series: generation.series.map((serie) => {
        const commonSpecs = getCommonSpecifications(serie.trims);
        const commonSpecsByCategory = categorizeSpecifications(commonSpecs);

        return {
          ...serie,
          commonSpecifications: commonSpecsByCategory,
          trims: serie.trims.map((trim) => {
            const uniqueSpecs = trim.specifications.filter(
              (spec) =>
                !commonSpecs.some(
                  (cs) =>
                    cs.carSpecification.name === spec.carSpecification.name &&
                    cs.value === spec.value &&
                    cs.unit === spec.unit
                )
            );

            return {
              ...trim,
              specificationsByCategory: categorizeSpecifications(uniqueSpecs),
            };
          }),
        };
      }),
    };

    return new Response(JSON.stringify(transformedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return new Response(
      JSON.stringify({
        error: "Une erreur est survenue",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      { status: 500 }
    );
  }
}
