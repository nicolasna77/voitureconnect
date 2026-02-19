import { streamObject } from "ai";
import { NextRequest } from "next/server";

import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";
import {
  getSystemPrompt,
  getReportPrompt,
  type Locale,
} from "@/lib/ai/prompts";
import { reliabilityReportSchema } from "@/lib/ai/schemas";
import {
  formatVehicleContext,
  type VehicleData,
} from "@/lib/ai/vehicle-context";
import { getAIModel } from "@/lib/ai/provider";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generationId, locale = "fr" } = body as {
      generationId: number;
      locale?: Locale;
    };

    if (!generationId) {
      return new Response(
        JSON.stringify({ error: "generationId is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Check authentication
    const session = await getCachedSession();

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Check user role and access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const userRole = user?.role || "USER";

    // ADMIN and PRO have free access - no credit check needed
    if (userRole === "USER") {
      // Check if user has AI access for this vehicle
      const aiAccess = await prisma.specificationAccess.findUnique({
        where: {
          userId_specificationId_specificationType: {
            userId: session.user.id,
            specificationId: generationId,
            specificationType: "ai_analysis",
          },
        },
      });

      if (!aiAccess) {
        return new Response(
          JSON.stringify({
            error: "AI access required",
            code: "AI_ACCESS_REQUIRED",
            message: "Vous devez debloquer l'analyse IA pour ce vehicule"
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    const validLocale: Locale = locale === "en" ? "en" : "fr";

    // Fetch vehicle data based on locale
    let vehicleData: VehicleData;

    if (validLocale === "fr") {
      const generation = await prisma.carGenerationFR.findUnique({
        where: { id_car_generation: generationId },
        select: {
          name: true,
          year_begin: true,
          year_end: true,
          carModel: {
            select: {
              name: true,
              carMake: { select: { name: true } },
            },
          },
          carType: { select: { name: true } },
          series: {
            select: {
              name: true,
              trims: {
                select: {
                  name: true,
                  specifications: {
                    select: {
                      value: true,
                      unit: true,
                      carSpecification: { select: { name: true } },
                    },
                    take: 20,
                  },
                },
                take: 1,
              },
            },
            take: 1,
          },
        },
      });

      if (!generation) {
        return new Response(JSON.stringify({ error: "Vehicle not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const trim = generation.series[0]?.trims[0];

      vehicleData = {
        type: generation.carType?.name,
        make: generation.carModel?.carMake?.name,
        model: generation.carModel?.name,
        generation: generation.name,
        serie: generation.series[0]?.name,
        trim: trim?.name,
        yearBegin: generation.year_begin ?? undefined,
        yearEnd: generation.year_end ?? undefined,
        specifications: trim?.specifications?.map((spec) => ({
          name: spec.carSpecification.name,
          value: spec.value,
          unit: spec.unit ?? undefined,
        })),
      };
    } else {
      const generation = await prisma.carGenerationEN.findUnique({
        where: { id_car_generation: generationId },
        select: {
          name: true,
          year_begin: true,
          year_end: true,
          carModel: {
            select: {
              name: true,
              carMake: { select: { name: true } },
            },
          },
          carType: { select: { name: true } },
          series: {
            select: {
              name: true,
              trims: {
                select: {
                  name: true,
                  specifications: {
                    select: {
                      value: true,
                      unit: true,
                      carSpecification: { select: { name: true } },
                    },
                    take: 20,
                  },
                },
                take: 1,
              },
            },
            take: 1,
          },
        },
      });

      if (!generation) {
        return new Response(JSON.stringify({ error: "Vehicle not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const trim = generation.series[0]?.trims[0];

      vehicleData = {
        type: generation.carType?.name,
        make: generation.carModel?.carMake?.name,
        model: generation.carModel?.name,
        generation: generation.name,
        serie: generation.series[0]?.name,
        trim: trim?.name,
        yearBegin: generation.year_begin ?? undefined,
        yearEnd: generation.year_end ?? undefined,
        specifications: trim?.specifications?.map((spec) => ({
          name: spec.carSpecification.name,
          value: spec.value,
          unit: spec.unit ?? undefined,
        })),
      };
    }

    const vehicleContext = formatVehicleContext(vehicleData, validLocale);
    const systemPrompt = getSystemPrompt(validLocale, "report");
    const userPrompt = getReportPrompt(validLocale, vehicleContext);

    const result = streamObject({
      model: getAIModel(),
      schema: reliabilityReportSchema,
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Report Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate report" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
