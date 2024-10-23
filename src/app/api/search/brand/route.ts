import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  const data = await prisma.carMake.findMany({
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
