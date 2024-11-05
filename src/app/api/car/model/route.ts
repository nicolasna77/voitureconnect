import { prisma } from "@/lib/prisma";
import { getLocale } from "next-intl/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const locale = await getLocale();
  const tableName = locale.toLowerCase() === "fr" ? "carModelFR" : "carModelEN";
  const model = prisma[tableName] as typeof prisma.carModelFR;

  try {
    const data = await model.findMany({
      where: name
        ? {
            carMake: {
              name: name,
            },
          }
        : undefined,
      select: {
        name: true,
      },
      distinct: ["name"],
      orderBy: {
        name: "asc",
      },
    });

    return Response.json({ data });
  } catch (error) {
    return Response.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
};
