import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  const whereClause = name ? { carMake: { name } } : {};

  const data = await prisma.carModel.findMany({
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
