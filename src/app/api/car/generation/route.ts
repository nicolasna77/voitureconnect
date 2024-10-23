import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");

  const whereClause = model ? { carModel: { name: model } } : {};

  const data = await prisma.carGeneration.findMany({
    where: whereClause,
    select: {
      name: true,
    },
    distinct: ["name"],
    orderBy: {
      name: "asc",
    },
  });

  return Response.json({ data });
};
