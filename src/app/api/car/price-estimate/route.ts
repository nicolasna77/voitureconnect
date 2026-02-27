import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";
import { estimatePrice, type Condition } from "@/lib/pricing/depreciation";

const VALID_CONDITIONS: Condition[] = ["excellent", "bon", "moyen", "mauvais"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const generationId = parseInt(searchParams.get("generationId") ?? "");
  const vehicleYear  = parseInt(searchParams.get("year") ?? "");
  const km           = parseInt(searchParams.get("km") ?? "");
  const condition    = searchParams.get("condition") as Condition;
  const lang         = searchParams.get("lang") === "en" ? "en" : "fr";

  if (
    isNaN(generationId) ||
    isNaN(vehicleYear)  ||
    isNaN(km)           ||
    !VALID_CONDITIONS.includes(condition)
  ) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const Model = lang === "en" ? prisma.carGenerationEN : prisma.carGenerationFR;

  const generation = await (Model as typeof prisma.carGenerationFR).findUnique({
    where: { id_car_generation: generationId },
    select: { price_new: true, year_begin: true },
  });

  if (!generation?.price_new) {
    return NextResponse.json(
      { error: "Prix neuf non renseigné pour cette génération" },
      { status: 404 }
    );
  }

  const estimate = estimatePrice({
    priceNew: generation.price_new,
    vehicleYear,
    km,
    condition,
  });

  return NextResponse.json(estimate);
}
