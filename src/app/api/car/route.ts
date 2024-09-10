import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  const data = await prisma.car.findMany();

  return Response.json({ data });
};
