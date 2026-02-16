import prisma from "@/prisma";
import { NextRequest } from "next/server";
import {
  categorizeSpecifications,
  sortTrimsByEngineAndFinition,
  getCommonSpecifications,
} from "@/lib/car-specs";

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
