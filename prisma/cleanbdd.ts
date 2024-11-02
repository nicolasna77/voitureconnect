import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    // Nettoyage du schéma dataCarFR
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_option_value" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_specification_value" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_equipment" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_trim" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_serie" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_generation" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_model" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_make" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_type" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_option" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarFR"."car_specification" CASCADE`;

    // Nettoyage du schéma dataCarEN
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_option_value" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_specification_value" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_equipment" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_trim" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_serie" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_generation" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_model" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_make" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_type" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_option" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "dataCarEN"."car_specification" CASCADE`;

    console.log("Base de données nettoyée avec succès");
  } catch (error) {
    console.error("Erreur lors du nettoyage:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
