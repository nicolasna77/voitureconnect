import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { seedData, seedUsers, seedCars, seedAds } from "@/../../prisma/seed";

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log("Début de l'importation des données...");

    await seedData(
      "public/data/car_type.csv",
      "carType",
      (row: any) => ({
        id_car_type: parseInt(row.id_car_type),
        name: row.name,
      }),
      "id_car_type"
    );

    // Ajoutez ici tous les autres appels à seedData pour les différentes tables

    await seedUsers();
    await seedCars();
    await seedAds();

    console.log("Importation des données terminée avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'importation des données:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Planifiez la tâche pour s'exécuter le premier jour de chaque mois à 00:00
cron.schedule("0 0 1 * *", () => {
  console.log("Exécution de l'importation mensuelle des données...");
  importData();
});

console.log(
  "Le planificateur d'importation de données est en cours d'exécution..."
);

// Gardez le processus en vie
process.stdin.resume();
