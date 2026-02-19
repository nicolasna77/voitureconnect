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
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return new Response("Paramètre ids manquant", { status: 400 });
    }

    const ids = idsParam.split(",").map(Number).filter(Boolean);

    if (ids.length < 2 || ids.length > 3) {
      return new Response("2 ou 3 ids requis", { status: 400 });
    }

    // Phase 1: fetch all generations in parallel
    const generations = await Promise.all(
      ids.map((id) =>
        prisma.carGenerationFR.findUnique({
          where: { id_car_generation: id },
          include: {
            carModel: {
              include: {
                carMake: true,
              },
            },
          },
        })
      )
    );

    // Phase 2: fetch all trims in parallel (now that we have all model IDs)
    const trimsPerGeneration = await Promise.all(
      generations.map((generation) => {
        if (!generation) return Promise.resolve(null);
        return prisma.carTrimFR.findMany({
          where: { id_car_model: generation.id_car_model },
          include: {
            specifications: {
              include: {
                carSpecification: {
                  select: { name: true, id_parent: true },
                },
              },
              orderBy: [{ carSpecification: { name: "asc" } }],
            },
          },
        });
      })
    );

    const vehicles = generations.map((generation, idx) => {
      if (!generation) return null;

      const trims = trimsPerGeneration[idx];
      if (!trims) return null;

      const sortedTrims = sortTrimsByEngineAndFinition(trims);

      const virtualSeries =
        sortedTrims.length > 0
          ? [
              {
                id_car_serie: 0,
                name: generation.carModel?.name || "Motorisations",
                trims: sortedTrims,
              },
            ]
          : [];

      const series = virtualSeries.map((serie) => {
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
                    cs.carSpecification.name ===
                      spec.carSpecification.name &&
                    cs.value === spec.value &&
                    cs.unit === spec.unit
                )
            );

            return {
              ...trim,
              specificationsByCategory:
                categorizeSpecifications(uniqueSpecs),
            };
          }),
        };
      });

      return {
        ...generation,
        series,
      };
    });

    const validVehicles = vehicles.filter(Boolean);

    return new Response(JSON.stringify(validVehicles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Compare error:", error);
    return new Response(
      JSON.stringify({
        error: "Une erreur est survenue",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      { status: 500 }
    );
  }
}
