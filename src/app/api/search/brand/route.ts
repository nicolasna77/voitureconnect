import { getLocale } from "next-intl/server";
import prisma from "@/prisma";

export const GET = async () => {
  const locale = await getLocale();

  const data =
    locale === "fr"
      ? await prisma.carMakeFR.findMany({
          distinct: ["name"],
          orderBy: {
            name: "asc",
          },
          select: {
            name: true,
          },
        })
      : await prisma.carMakeEN.findMany({
          distinct: ["name"],
          orderBy: {
            name: "asc",
          },
          select: {
            name: true,
          },
        });

  return Response.json({ data });
};
