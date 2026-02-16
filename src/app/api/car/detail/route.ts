import prisma from "@/prisma";
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

// Fonction pour catégoriser les spécifications (FR + EN)
const categorizeSpecifications = (
  specifications: SpecificationValue[]
): Record<string, TransformedSpecification[]> => {
  const categoryKeywords = {
    dimensions: [
      // FR
      "longueur",
      "largeur",
      "hauteur",
      "empattement",
      "voie avant",
      "voie arrière",
      "voie ar",
      // EN
      "length",
      "width",
      "height",
      "wheelbase",
      "track",
    ],
    weights: [
      // FR
      "poids",
      "charge utile",
      "remorque",
      "coffre",
      "réservoir",
      "places",
      "volume",
      // EN
      "weight",
      "payload",
      "trunk",
      "cargo",
      "tank",
      "seats",
    ],
    engine: [
      // FR
      "puissance",
      "couple",
      "cylindrée",
      "cylindres",
      "soupapes",
      "architecture",
      "régime",
      "alimentation",
      // EN
      "power",
      "torque",
      "displacement",
      "cylinder",
      "valve",
      "engine",
      "rpm",
    ],
    gearbox: [
      // FR
      "boîte",
      "rapports",
      "roues motrices",
      "transmission",
      // EN
      "gearbox",
      "transmission",
      "drive",
      "gear",
    ],
    fuel: [
      // FR
      "carburant",
      "consommation",
      "émission",
      "co2",
      // EN
      "fuel",
      "consumption",
      "emission",
    ],
    performance: [
      // FR
      "vitesse max",
      "accélération",
      "0-100",
      // EN
      "top speed",
      "acceleration",
    ],
    suspension: [
      // FR
      "suspension",
      "freins",
      "frein",
      "direction",
      // EN
      "brake",
      "steering",
    ],
    body: [
      // FR
      "carrosserie",
      "portes",
      // EN
      "body",
      "doors",
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

// Tri des trims par moteur (cylindrée, type) puis finition
const sortTrimsByEngineAndFinition = (trims: CarTrim[]): CarTrim[] => {
  return [...trims].sort((a, b) => {
    const parseEngine = (name: string) => {
      // Extract displacement like "1.6", "2.0", "1.5" at the start or after a space
      const displacementMatch = name.match(/(\d+[.,]\d+)/);
      const displacement = displacementMatch
        ? parseFloat(displacementMatch[1].replace(",", "."))
        : 999;

      // Extract engine type: diesel (HDi, TDI, dCi, CDTi, D, d), electric, hybrid, or petrol
      const nameLower = name.toLowerCase();
      let engineType = 2; // default: petrol
      if (/\b(hdi|tdi|dci|cdti|jtd|crdi|d\b|diesel|bluehdi|ecoblue|hpi)/i.test(name)) {
        engineType = 1; // diesel
      } else if (/\b(e-|electric|ev|electrique|électrique)\b/i.test(name)) {
        engineType = 3; // electric
      } else if (/\b(hybrid|hybride|phev|plug-in)\b/i.test(name)) {
        engineType = 4; // hybrid
      }

      // Extract power like "110", "150" before ch/cv/hp/ps or standalone
      const powerMatch = name.match(/(\d{2,3})\s*(?:ch|cv|hp|ps|bhp)/i);
      const power = powerMatch ? parseInt(powerMatch[1]) : 0;

      // Remaining part = finition (everything after engine info)
      const finition = name
        .replace(/[\d.,]+\s*[a-zA-Zé-]*\s*\d*\s*(?:ch|cv|hp|ps|bhp)?/i, "")
        .trim();

      return { displacement, engineType, power, finition };
    };

    const ea = parseEngine(a.name);
    const eb = parseEngine(b.name);

    // 1. Sort by engine type (diesel, petrol, electric, hybrid)
    if (ea.engineType !== eb.engineType) return ea.engineType - eb.engineType;
    // 2. Sort by displacement
    if (ea.displacement !== eb.displacement) return ea.displacement - eb.displacement;
    // 3. Sort by power
    if (ea.power !== eb.power) return ea.power - eb.power;
    // 4. Sort by finition name
    return ea.finition.localeCompare(eb.finition);
  });
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

    console.log("[API car/detail] Received request with id:", id);

    if (!id) {
      return new Response("ID de génération manquant", { status: 400 });
    }

    console.log("[API car/detail] Fetching generation from database...");

    // First, get the generation with its model
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
      },
    });

    console.log("[API car/detail] Generation found:", generation ? "yes" : "no");

    if (!generation) {
      return new Response("Génération non trouvée", { status: 404 });
    }

    // The database has no series - trims are linked directly to models
    // So we load trims directly and create a virtual "series" structure for display
    const trims = await prisma.carTrimFR.findMany({
      where: {
        id_car_model: generation.id_car_model,
      },
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
    });

    console.log("[API car/detail] Trims count:", trims?.length || 0);

    // Sort trims by engine type, displacement, power, then finition
    const sortedTrims = sortTrimsByEngineAndFinition(trims);

    // Create a virtual series structure with sorted trims
    const virtualSeries = sortedTrims.length > 0 ? [{
      id_car_serie: 0,
      name: generation.carModel?.name || "Motorisations",
      trims: sortedTrims,
    }] : [];

    // Combine generation with virtual series
    const generationWithSeries = {
      ...generation,
      series: virtualSeries,
    };

    const transformedData = {
      ...generationWithSeries,
      series: generationWithSeries.series.map((serie) => {
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
