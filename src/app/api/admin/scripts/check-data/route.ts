import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [typesFR, makesFR, modelsFR, generationsFR, trimsFR] =
      await Promise.all([
        prisma.carTypeFR.count(),
        prisma.carMakeFR.count(),
        prisma.carModelFR.count(),
        prisma.carGenerationFR.count(),
        prisma.carTrimFR.count(),
      ]);

    const [typesEN, makesEN, modelsEN, generationsEN, trimsEN] =
      await Promise.all([
        prisma.carTypeEN.count(),
        prisma.carMakeEN.count(),
        prisma.carModelEN.count(),
        prisma.carGenerationEN.count(),
        prisma.carTrimEN.count(),
      ]);

    return NextResponse.json({
      fr: {
        types: typesFR,
        makes: makesFR,
        models: modelsFR,
        generations: generationsFR,
        trims: trimsFR,
      },
      en: {
        types: typesEN,
        makes: makesEN,
        models: modelsEN,
        generations: generationsEN,
        trims: trimsEN,
      },
    });
  } catch (error) {
    console.error("[CHECK_DATA]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
