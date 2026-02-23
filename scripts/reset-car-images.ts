import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not defined");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const fr = await prisma.carGenerationFR.updateMany({
    where: { image_url: { not: null } },
    data: { image_url: null },
  });
  const en = await prisma.carGenerationEN.updateMany({
    where: { image_url: { not: null } },
    data: { image_url: null },
  });
  console.log(`FR reset: ${fr.count}`);
  console.log(`EN reset: ${en.count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
