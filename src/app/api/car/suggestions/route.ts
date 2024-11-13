import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const suggestions = await prisma.$queryRaw`
      SELECT DISTINCT 
        'marque' as type,
        cm.name as brand,
        NULL as model,
        NULL as generation
      FROM "dataCarFR"."car_make" cm
      WHERE LOWER(cm.name) LIKE LOWER(${`%${query}%`})
      
      UNION ALL
      
      SELECT DISTINCT 
        'model' as type,
        cm.name as brand,
        cmod.name as model,
        NULL as generation
      FROM "dataCarFR"."car_model" cmod
      JOIN "dataCarFR"."car_make" cm ON cm.id_car_make = cmod.id_car_make
      WHERE LOWER(cmod.name) LIKE LOWER(${`%${query}%`})
      
      UNION ALL
      
      SELECT DISTINCT 
        'generation' as type,
        cm.name as brand,
        cmod.name as model,
        cg.name as generation
      FROM "dataCarFR"."car_generation" cg
      JOIN "dataCarFR"."car_model" cmod ON cmod.id_car_model = cg.id_car_model
      JOIN "dataCarFR"."car_make" cm ON cm.id_car_make = cmod.id_car_make
      WHERE LOWER(cg.name) LIKE LOWER(${`%${query}%`})
      
      LIMIT 10;
    `;

    return new Response(JSON.stringify({ data: suggestions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
