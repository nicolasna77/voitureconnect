import "dotenv/config";
import prisma from "../src/prisma.js";

async function check() {
  const [typesFR, makesFR, modelsFR, trimsFR] = await Promise.all([
    prisma.carTypeFR.count(),
    prisma.carMakeFR.count(),
    prisma.carModelFR.count(),
    prisma.carTrimFR.count(),
  ]);
  const [typesEN, makesEN, modelsEN, trimsEN] = await Promise.all([
    prisma.carTypeEN.count(),
    prisma.carMakeEN.count(),
    prisma.carModelEN.count(),
    prisma.carTrimEN.count(),
  ]);
  console.log("=== FR ===");
  console.log(`Types: ${typesFR} | Marques: ${makesFR} | Modeles: ${modelsFR} | Trims: ${trimsFR}`);
  console.log("=== EN ===");
  console.log(`Types: ${typesEN} | Makes: ${makesEN} | Models: ${modelsEN} | Trims: ${trimsEN}`);
  await prisma.$disconnect();
}

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
