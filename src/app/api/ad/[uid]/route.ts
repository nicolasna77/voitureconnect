import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const get = async ({ params }: { params: { slug: string } }) => {
  const data = await prisma.ad.findUnique({
    where: {
      id: params.slug,
    },
  });

  return Response.json({ data });
};
