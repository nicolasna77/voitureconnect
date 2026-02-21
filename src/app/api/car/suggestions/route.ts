import prisma from "@/prisma";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

const SIMILARITY_THRESHOLD = 0.15;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");
    const brand = searchParams.get("brand");

    if (!query || query.length < 2) {
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const q = query;
    const likeQ = `%${query}%`;
    const threshold = SIMILARITY_THRESHOLD;

    // Run SET LOCAL search_path + the query in the same transaction so
    // pg_trgm functions (similarity, word_similarity) are always reachable
    // regardless of the connection's default search_path setting.
    let suggestions: unknown[];

    if (brand) {
      const [, result] = await prisma.$transaction([
        prisma.$executeRaw`SET LOCAL search_path TO base, public, "dataCarFR", "dataCarEN"`,
        prisma.$queryRaw<unknown[]>(Prisma.sql`
          SELECT type, brand, model, generation, id_car_generation, year_begin, year_end, logo_url
          FROM (
            SELECT
              'model'::text as type,
              cm.name as brand,
              cmod.name as model,
              NULL::text as generation,
              NULL::integer as id_car_generation,
              NULL::text as year_begin,
              NULL::text as year_end,
              cm.logo_url as logo_url,
              GREATEST(
                similarity(cmod.name, ${q}::text),
                word_similarity(${q}::text, cmod.name)
              ) as score
            FROM "dataCarFR"."car_model" cmod
            JOIN "dataCarFR"."car_make" cm ON cm.id_car_make = cmod.id_car_make
            WHERE LOWER(cm.name) = LOWER(${brand}::text)
              AND (
                similarity(cmod.name, ${q}::text) > ${threshold}::real
                OR word_similarity(${q}::text, cmod.name) > ${threshold}::real
                OR LOWER(cmod.name) LIKE LOWER(${likeQ}::text)
              )

            UNION ALL

            SELECT
              'generation'::text as type,
              cm.name as brand,
              cmod.name as model,
              cg.name as generation,
              cg.id_car_generation,
              cg.year_begin::text,
              cg.year_end::text,
              cm.logo_url as logo_url,
              GREATEST(
                similarity(cg.name, ${q}::text),
                word_similarity(${q}::text, cg.name),
                word_similarity(${q}::text, CONCAT(cmod.name, ' ', cg.name))
              ) as score
            FROM "dataCarFR"."car_generation" cg
            JOIN "dataCarFR"."car_model" cmod ON cmod.id_car_model = cg.id_car_model
            JOIN "dataCarFR"."car_make" cm ON cm.id_car_make = cmod.id_car_make
            WHERE LOWER(cm.name) = LOWER(${brand}::text)
              AND (
                similarity(cg.name, ${q}::text) > ${threshold}::real
                OR word_similarity(${q}::text, cg.name) > ${threshold}::real
                OR LOWER(cg.name) LIKE LOWER(${likeQ}::text)
                OR LOWER(CONCAT(cmod.name, ' ', cg.name)) LIKE LOWER(${likeQ}::text)
              )
          ) sub
          ORDER BY
            CASE type WHEN 'model' THEN 1 ELSE 2 END,
            score DESC,
            brand, model, generation
          LIMIT 15
        `),
      ]);
      suggestions = result;
    } else {
      const [, result] = await prisma.$transaction([
        prisma.$executeRaw`SET LOCAL search_path TO base, public, "dataCarFR", "dataCarEN"`,
        prisma.$queryRaw<unknown[]>(Prisma.sql`
          SELECT type, brand, model, generation, id_car_generation, year_begin, year_end, logo_url
          FROM (
            SELECT
              'marque'::text as type,
              cm.name as brand,
              NULL::text as model,
              NULL::text as generation,
              NULL::integer as id_car_generation,
              NULL::text as year_begin,
              NULL::text as year_end,
              cm.logo_url as logo_url,
              GREATEST(
                similarity(cm.name, ${q}::text),
                word_similarity(${q}::text, cm.name)
              ) as score
            FROM "dataCarFR"."car_make" cm
            WHERE
              similarity(cm.name, ${q}::text) > ${threshold}::real
              OR word_similarity(${q}::text, cm.name) > ${threshold}::real
              OR LOWER(cm.name) LIKE LOWER(${likeQ}::text)

            UNION ALL

            SELECT
              'model'::text as type,
              cm.name as brand,
              cmod.name as model,
              NULL::text as generation,
              NULL::integer as id_car_generation,
              NULL::text as year_begin,
              NULL::text as year_end,
              cm.logo_url as logo_url,
              GREATEST(
                similarity(cmod.name, ${q}::text),
                word_similarity(${q}::text, CONCAT(cm.name, ' ', cmod.name))
              ) as score
            FROM "dataCarFR"."car_model" cmod
            JOIN "dataCarFR"."car_make" cm ON cm.id_car_make = cmod.id_car_make
            WHERE
              similarity(cmod.name, ${q}::text) > ${threshold}::real
              OR word_similarity(${q}::text, CONCAT(cm.name, ' ', cmod.name)) > ${threshold}::real
              OR LOWER(cmod.name) LIKE LOWER(${likeQ}::text)
              OR LOWER(CONCAT(cm.name, ' ', cmod.name)) LIKE LOWER(${likeQ}::text)

            UNION ALL

            SELECT
              'generation'::text as type,
              cm.name as brand,
              cmod.name as model,
              cg.name as generation,
              cg.id_car_generation,
              cg.year_begin::text,
              cg.year_end::text,
              cm.logo_url as logo_url,
              GREATEST(
                similarity(cg.name, ${q}::text),
                word_similarity(${q}::text, CONCAT(cm.name, ' ', cmod.name, ' ', cg.name))
              ) as score
            FROM "dataCarFR"."car_generation" cg
            JOIN "dataCarFR"."car_model" cmod ON cmod.id_car_model = cg.id_car_model
            JOIN "dataCarFR"."car_make" cm ON cm.id_car_make = cmod.id_car_make
            WHERE
              similarity(cg.name, ${q}::text) > ${threshold}::real
              OR word_similarity(${q}::text, CONCAT(cm.name, ' ', cmod.name, ' ', cg.name)) > ${threshold}::real
              OR LOWER(cg.name) LIKE LOWER(${likeQ}::text)
              OR LOWER(CONCAT(cm.name, ' ', cmod.name, ' ', cg.name)) LIKE LOWER(${likeQ}::text)
          ) sub
          ORDER BY
            CASE type WHEN 'marque' THEN 1 WHEN 'model' THEN 2 ELSE 3 END,
            score DESC,
            brand, model, generation
          LIMIT 15
        `),
      ]);
      suggestions = result;
    }

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
