import { PrismaClient } from "@prisma/client";
import { getLocale } from "next-intl/server";

const prisma = new PrismaClient();

export const GET = async () => {
  const locale = await getLocale();

  const tableName = locale === "fr" ? "carMakeFR" : "carMakeEN";

  const data = await (
    prisma[tableName as "carMakeFR" | "carMakeEN"] as any
  ).findMany();

  return Response.json({ data });
};
