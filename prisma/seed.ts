import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import prisma from "./client";

// Constantes pour le nombre d'entrées à générer
const NUM_USERS = 50;
const NUM_GARAGES = 10;
const NUM_CARS = 100;
const NUM_ADS = 80;
const NUM_OFFERS = 150;
const NUM_TRANSACTIONS = 30;

async function main() {
  try {
    console.log("🌱 Début du seeding...");

    // Création des utilisateurs
    const users = await Promise.all(
      Array(NUM_USERS)
        .fill(null)
        .map(async () => {
          return prisma.user.create({
            data: {
              name: faker.person.fullName(),
              email: faker.internet.email(),
              password: await bcrypt.hash("password123", 10),
              role: faker.helpers.arrayElement(["USER", "PRO", "ADMIN"]),
            },
          });
        })
    );
    console.log(`✅ ${NUM_USERS} utilisateurs créés`);

    // Création des adresses et garages
    const garages = await Promise.all(
      Array(NUM_GARAGES)
        .fill(null)
        .map(async () => {
          const address = await prisma.address.create({
            data: {
              street: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              zip: faker.location.zipCode(),
              country: "France",
            },
          });

          return prisma.garage.create({
            data: {
              name: faker.company.name(),
              AdresseId: address.id,
              phone: faker.phone.number(),
              ownerId: faker.helpers.arrayElement(users).id,
            },
          });
        })
    );
    console.log(`✅ ${NUM_GARAGES} garages créés`);

    // Création des voitures
    const carTypes = await prisma.carTypeFR.findMany();
    const carMakes = await prisma.carMakeFR.findMany();
    const carModels = await prisma.carModelFR.findMany();
    const carTrims = await prisma.carTrimFR.findMany();
    const carGenerations = await prisma.carGenerationFR.findMany();
    const carSeries = await prisma.carSerieFR.findMany();
    const carEquipments = await prisma.carEquipmentFR.findMany();

    const cars = await Promise.all(
      Array(NUM_CARS)
        .fill(null)
        .map(async () => {
          const randomType = faker.helpers.arrayElement(carTypes);
          const randomMake = faker.helpers.arrayElement(carMakes);
          const randomModel = faker.helpers.arrayElement(carModels);
          const randomGeneration = faker.helpers.arrayElement(carGenerations);
          const randomTrim = faker.helpers.arrayElement(carTrims);
          const randomSerie = faker.helpers.arrayElement(carSeries);
          const randomEquipment = faker.helpers.arrayElement(carEquipments);
          const randomOptions = Array(faker.number.int({ min: 1, max: 5 }))
            .fill(null)
            .map(() => faker.string.uuid());

          return prisma.car.create({
            data: {
              userId: faker.helpers.arrayElement(users).id,
              garageId: faker.helpers.maybe(
                () => faker.helpers.arrayElement(garages).id
              ),
              Kms: faker.number.int({ min: 0, max: 200000 }),
              price: faker.number.float({
                min: 1000,
                max: 100000,
                fractionDigits: 2,
              }),
              year: faker.number.int({ min: 2000, max: 2024 }),
              color: faker.vehicle.color(),
              fuelType: faker.helpers.arrayElement([
                "Essence",
                "Diesel",
                "Électrique",
                "Hybride",
              ]),
              vin: faker.vehicle.vin(),
              gearbox: faker.helpers.arrayElement(["Manuelle", "Automatique"]),
              carTypeId: randomType.id_car_type,
              carMakeId: randomMake.id_car_make,
              carModelId: randomModel.id_car_model,
              carTrimId: randomTrim.id_car_trim,
              carGenerationId: randomGeneration.id_car_generation,
              carSerieId: randomSerie.id_car_serie,
              carEquipmentId: randomEquipment.id_car_equipment,
              optionsID: randomOptions,
            },
          });
        })
    );
    console.log(`✅ ${NUM_CARS} voitures créées`);

    // Création des annonces
    const availableCars = [...cars]; // Créer une copie du tableau des voitures
    const ads = await Promise.all(
      Array(Math.min(NUM_ADS, cars.length)) // Limiter le nombre d'annonces au nombre de voitures disponibles
        .fill(null)
        .map(async (_, index) => {
          const randomIndex = faker.number.int({
            min: 0,
            max: availableCars.length - 1,
          });
          const randomCar = availableCars.splice(randomIndex, 1)[0]; // Retirer la voiture utilisée

          return prisma.ad.create({
            data: {
              carId: randomCar.id,
              userId: faker.helpers.arrayElement(users).id,
              title: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
              description: faker.lorem.paragraphs(2),
              garageId: randomCar.garageId,
            },
          });
        })
    );
    console.log(`✅ ${ads.length} annonces créées`);

    // Création des offres et transactions
    await Promise.all(
      Array(NUM_OFFERS)
        .fill(null)
        .map(async () => {
          const randomAd = faker.helpers.arrayElement(ads);
          const buyer = faker.helpers.arrayElement(users);

          const offer = await prisma.offer.create({
            data: {
              adId: randomAd.id,
              userId: buyer.id,
              offerAmount: faker.number.float({
                min: 500,
                max: 50000,
                fractionDigits: 2,
              }),
              status: faker.helpers.arrayElement([
                "PENDING",
                "ACCEPTED",
                "REJECTED",
              ]),
            },
          });

          // Créer une transaction pour certaines offres acceptées
          if (offer.status === "ACCEPTED" && NUM_TRANSACTIONS > 0) {
            await prisma.transaction.create({
              data: {
                offerId: offer.id,
                buyerId: buyer.id,
                sellerId: randomAd.userId!,
                amount: offer.offerAmount,
                status: "COMPLETED",
              },
            });
          }
        })
    );
    console.log(`✅ ${NUM_OFFERS} offres créées`);

    console.log("✨ Seeding terminé avec succès!");
  } catch (error) {
    console.error("❌ Erreur pendant le seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
