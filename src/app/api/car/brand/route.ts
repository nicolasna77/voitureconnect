import prisma from "@/prisma";
import { getLocale } from "next-intl/server";

export const GET = async () => {
  const locale = await getLocale();
  const tableName = locale.toLowerCase() === "fr" ? "carMakeFR" : "carMakeEN";

  try {
    const data = await (
      prisma[tableName as "carMakeFR" | "carMakeEN"] as any
    ).findMany({
      select: {
        name: true,
      },
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
