import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur
  const user = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    },
  });

  // Créer un garage
  const garage = await prisma.garage.create({
    data: {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      ownerId: user.id,
    },
  });

  // Récupérer toutes les voitures existantes
  const existingCars = await prisma.car.findMany();

  // Créer des annonces pour les voitures existantes
  for (const car of existingCars) {
    const ad = await prisma.ad.create({
      data: {
        carId: car.id,
        garageId: garage.id,
        Kms: faker.number.int({ min: 0, max: 200000 }),
        price: faker.number.float({
          min: 1000,
          max: 100000,
          fractionDigits: 2,
        }),
        year: car.yearStart,
        color: faker.vehicle.color(),
        fuelType: faker.helpers.arrayElement([
          "Essence",
          "Diesel",
          "Électrique",
          "Hybride",
        ]),
        gearbox: faker.helpers.arrayElement(["Manuelle", "Automatique"]),
        title: `${car.brand} ${car.model} ${car.generation}`,
        description: faker.lorem.paragraph(),
        vin: faker.vehicle.vin(),
        userId: user.id,
      },
    });

    // Ajouter quelques options à l'annonce
    for (let j = 0; j < 3; j++) {
      await prisma.option.create({
        data: {
          name: faker.vehicle.type(),
          adId: ad.id,
        },
      });
    }
  }

  console.log("Seed terminé avec succès");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
