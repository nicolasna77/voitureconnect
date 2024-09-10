import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  const data = await prisma.ad.findMany({
    include: {
      car: true,
    },
  });

  return Response.json({ data });
};
