import { streamText } from "ai";
import { NextRequest } from "next/server";
import prisma from "@/prisma";
import { getCachedSession } from "@/lib/cached-session";
import { getAIModel } from "@/lib/ai/provider";
import { AI_ANALYSIS_CREDIT_COST } from "@/config/credits";

export const maxDuration = 60;

const CONDITION_LABELS: Record<string, string> = {
  excellent: "Excellent (comme neuf, zéro défaut)",
  bon: "Bon (quelques petites rayures, bon état général)",
  moyen: "Moyen (carrosserie marquée, mécanique correcte)",
  mauvais: "Mauvais (dommages significatifs, problèmes mécaniques)",
};

export async function POST(request: NextRequest) {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { generationId, trimId, year, km, condition, options } = body as {
      generationId: number;
      trimId?: number;
      year: number;
      km: number;
      condition: "excellent" | "bon" | "moyen" | "mauvais";
      options?: string[];
    };

    if (!generationId || !year || km === undefined || !condition) {
      return new Response(JSON.stringify({ error: "Données manquantes" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    const userRole = user?.role || "USER";

    // For USER role: check and consume credit
    if (userRole === "USER") {
      const userCredit = await prisma.userCredit.findUnique({
        where: { userId: session.user.id },
      });
      const balance = userCredit?.balance || 0;

      if (balance < AI_ANALYSIS_CREDIT_COST) {
        return new Response(
          JSON.stringify({
            error: "Crédits insuffisants",
            code: "INSUFFICIENT_CREDITS",
            balance,
            required: AI_ANALYSIS_CREDIT_COST,
          }),
          {
            status: 402,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Consume 1 credit
      await prisma.$transaction(async (tx) => {
        await tx.userCredit.update({
          where: { userId: session.user.id },
          data: { balance: { decrement: AI_ANALYSIS_CREDIT_COST } },
        });
        await tx.creditTransaction.create({
          data: {
            userId: session.user.id,
            type: "CONSUMPTION",
            amount: -AI_ANALYSIS_CREDIT_COST,
            description: `Estimation valeur marché — véhicule #${generationId}`,
            referenceId: `market_value-${generationId}`,
          },
        });
      });
    }

    // Fetch vehicle info
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
      },
    });

    let trimName = "";
    if (trimId) {
      const trim = await prisma.carTrimFR.findUnique({
        where: { id_car_trim: trimId },
        select: { name: true },
      });
      trimName = trim?.name || "";
    }

    const makeName = generation?.carModel?.carMake?.name || "";
    const modelName = generation?.carModel?.name || "";
    const genName = generation?.name || "";
    const yearRange = `${generation?.year_begin || "?"}–${generation?.year_end || "présent"}`;
    const conditionLabel = CONDITION_LABELS[condition] || condition;

    const systemPrompt = `Tu es un expert en évaluation de véhicules d'occasion sur le marché français et européen.
Tu fournis des estimations précises et réalistes basées sur les conditions actuelles du marché (2025-2026).
Tu cites des références de marché réelles (L'Argus, La Centrale, AutoScout24, LeBonCoin, etc.).
Réponds toujours en français. Sois précis sur les fourchettes de prix.`;

    const userPrompt = `Estime la valeur marchande du véhicule suivant sur le marché de l'occasion français :

**Véhicule :** ${makeName} ${modelName} ${genName}${trimName ? ` — ${trimName}` : ""}
**Production :** ${yearRange}
**Année du véhicule à estimer :** ${year}
**Kilométrage :** ${km.toLocaleString("fr-FR")} km
**État :** ${conditionLabel}${options?.length ? `\n**Options/caractéristiques :** ${options.join(", ")}` : ""}

Fournis une analyse complète avec :
1. **Fourchette de prix** — Prix minimum, prix moyen, prix maximum en euros (marché particulier à particulier)
2. **Analyse détaillée** — Justification des prix en fonction de l'année, du kilométrage et de l'état
3. **Facteurs de valorisation** — Ce qui booste ou diminue la valeur pour ce modèle spécifique
4. **Conseils de vente** — Meilleure stratégie pour vendre (ou acheter) à ce prix
5. **Références de marché** — Quelques références de sites ou publications sur lesquelles tu bases ton estimation`;

    const result = streamText({
      model: getAIModel(),
      system: systemPrompt,
      prompt: userPrompt,
      maxOutputTokens: 1200,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Market Value AI error:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'estimation" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
