import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  const data = await prisma.carMake.findMany({
    select: {
      name: true,
    },
    distinct: ["name"],
  });

  return Response.json({ data });
};
