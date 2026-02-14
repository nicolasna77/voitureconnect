import prisma from "@/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Search across makes, models, and generations with a combined query
    const suggestions = await prisma.$queryRaw`
      SELECT DISTINCT
        'marque' as type,
        cm.name as brand,
        NULL as model,
        NULL as generation,
        NULL::integer as id_car_generation,
        NULL as year_begin,
        NULL as year_end
      FROM "dataCarFR"."car_make" cm
      WHERE LOWER(cm.name) LIKE LOWER(${`%${query}%`})

      UNION ALL

      SELECT DISTINCT
        'model' as type,
        cm.name as brand,
        cmod.name as model,
        NULL as generation,
        NULL::integer as id_car_generation,
        NULL as year_begin,
        NULL as year_end
      FROM "dataCarFR"."car_model" cmod
      JOIN "dataCarFR"."car_make" cm ON cm.id_car_make = cmod.id_car_make
      WHERE LOWER(cmod.name) LIKE LOWER(${`%${query}%`})
         OR LOWER(CONCAT(cm.name, ' ', cmod.name)) LIKE LOWER(${`%${query}%`})

      UNION ALL

      SELECT DISTINCT
        'generation' as type,
        cm.name as brand,
        cmod.name as model,
        cg.name as generation,
        cg.id_car_generation,
        cg.year_begin,
        cg.year_end
      FROM "dataCarFR"."car_generation" cg
      JOIN "dataCarFR"."car_model" cmod ON cmod.id_car_model = cg.id_car_model
      JOIN "dataCarFR"."car_make" cm ON cm.id_car_make = cmod.id_car_make
      WHERE LOWER(cg.name) LIKE LOWER(${`%${query}%`})
         OR LOWER(CONCAT(cm.name, ' ', cmod.name)) LIKE LOWER(${`%${query}%`})
         OR LOWER(CONCAT(cm.name, ' ', cmod.name, ' ', cg.name)) LIKE LOWER(${`%${query}%`})

      ORDER BY type, brand, model, generation
      LIMIT 15;
    `;

    return new Response(JSON.stringify({ data: suggestions }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la recherche de suggestions:", error);
    return new Response(
      JSON.stringify({
        error: "Erreur lors de la recherche",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      { status: 500 }
    );
  }
}
