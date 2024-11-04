import { prisma } from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const locale = await getLocale();

  try {
    if (locale === "fr") {
      const data = await prisma.carGenerationFR.findMany({
        where: model
          ? {
              carModel: {
                name: model,
              },
            }
          : undefined,
        include: {
          carModel: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
      return Response.json({ data });
    } else {
      const data = await prisma.carGenerationEN.findMany({
        where: model
          ? {
              carModel: {
                name: model,
              },
            }
          : undefined,
        include: {
          carModel: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
      return Response.json({ data });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des générations:", error);
    return Response.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
};
