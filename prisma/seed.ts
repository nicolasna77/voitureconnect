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
const NUM_PICTURES_PER_CAR = 3;

async function main() {
  try {
    console.log("🌱 Début du seeding...");

    // Vérification des données de référence
    const carTypes = await prisma.carTypeFR.findMany();
    if (carTypes.length === 0) {
      throw new Error(
        "Aucun CarType trouvé. Veuillez d'abord importer les données de référence."
      );
    }

    const carMakes = await prisma.carMakeFR.findMany();
    if (carMakes.length === 0) {
      throw new Error(
        "Aucune CarMake trouvée. Veuillez d'abord importer les données de référence."
      );
    }

    // Ajout de vérifications supplémentaires
    const randomType = faker.helpers.arrayElement(carTypes);
    const compatibleMakes = carMakes.filter(
      (make) => make.id_car_type === randomType.id_car_type
    );

    if (compatibleMakes.length === 0) {
      throw new Error(
        `Aucune marque compatible trouvée pour le type ${randomType.name}`
      );
    }

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
    const cars = await Promise.all(
      Array(NUM_CARS)
        .fill(null)
        .map(async () => {
          try {
            // Vérifier les carTypes disponibles
            const carTypes = await prisma.carTypeFR.findMany();
            if (carTypes.length === 0) {
              console.log("Aucun type de voiture disponible");
              return null;
            }
            const randomType = faker.helpers.arrayElement(carTypes);

            // Vérifier les marques compatibles
            const compatibleMakes = await prisma.carMakeFR.findMany({
              where: { id_car_type: randomType.id_car_type },
            });
            if (compatibleMakes.length === 0) {
              console.log(
                `Aucune marque compatible pour le type ${randomType.name}`
              );
              return null;
            }
            const randomMake = faker.helpers.arrayElement(compatibleMakes);

            // Vérifier les modèles compatibles
            const compatibleModels = await prisma.carModelFR.findMany({
              where: {
                id_car_make: randomMake.id_car_make,
                id_car_type: randomType.id_car_type,
              },
            });
            if (compatibleModels.length === 0) {
              console.log(
                `Aucun modèle compatible pour la marque ${randomMake.name}`
              );
              return null;
            }
            const randomModel = faker.helpers.arrayElement(compatibleModels);

            // Vérifier les trims compatibles
            const validTrims = await prisma.carTrimFR.findMany({
              where: {
                id_car_model: randomModel.id_car_model,
                id_car_type: randomType.id_car_type,
              },
            });
            if (validTrims.length === 0) {
              console.log(
                `Aucun trim compatible pour le modèle ${randomModel.name}`
              );
              return null;
            }
            const randomTrim = faker.helpers.arrayElement(validTrims);

            // Vérifier les équipements compatibles
            const validEquipments = await prisma.carEquipmentFR.findMany({
              where: {
                id_car_trim: randomTrim.id_car_trim,
                id_car_type: randomType.id_car_type,
              },
            });

            // Ajouter cette ligne
            const randomEquipment = faker.helpers.arrayElement(validEquipments);

            // Vérifier si un équipement valide existe
            if (!randomEquipment) {
              console.log(
                `Aucun équipement compatible pour le trim ${randomTrim.name}`
              );
              return null;
            }

            // Ajouter la vérification pour generation et serie
            const validGeneration = await prisma.carGenerationFR.findFirst({
              where: { id_car_model: randomModel.id_car_model },
            });
            const validSerie = await prisma.carSerieFR.findFirst({
              where: { id_car_model: randomModel.id_car_model },
            });

            if (!validGeneration || !validSerie) {
              console.log(
                `Aucune génération ou série compatible pour le modèle ${randomModel.name}`
              );
              return null;
            }

            // Création de la voiture avec les données valides
            return await prisma.car.create({
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
                gearbox: faker.helpers.arrayElement([
                  "Manuelle",
                  "Automatique",
                ]),
                carTypeId: randomType.id_car_type,
                carMakeId: randomMake.id_car_make,
                carModelId: randomModel.id_car_model,
                carTrimId: randomTrim.id_car_trim,
                carEquipmentId: randomEquipment.id_car_equipment,
                carGenerationId: validGeneration.id_car_generation,
                carSerieId: validSerie.id_car_serie,

                pictures: {
                  create: Array(NUM_PICTURES_PER_CAR)
                    .fill(null)
                    .map(() => ({
                      url: faker.image.urlLoremFlickr({
                        category: "car",
                        width: 800,
                        height: 600,
                      }),
                      alt: faker.vehicle.vehicle(),
                      isShown: true,
                    })),
                },
              },
              include: { pictures: true },
            });
          } catch (error) {
            console.error("Erreur lors de la création d'une voiture:", error);
            return null;
          }
        })
    );

    // Filtrer les voitures null
    const validCars = cars.filter(
      (car): car is NonNullable<typeof car> => car !== null
    );
    console.log(`✅ ${validCars.length} voitures créées`);

    // Création des annonces
    const availableCars = [...validCars]; // Créer une copie du tableau des voitures
    const ads = await Promise.all(
      Array(Math.min(NUM_ADS, validCars.length)) // Limiter le nombre d'annonces au nombre de voitures disponibles
        .fill(null)
        .map(async (_, index) => {
          const randomIndex = faker.number.int({
            min: 0,
            max: availableCars.length - 1,
          });
          const randomCar = availableCars.splice(randomIndex, 1)[0]; // Retirer la voiture utilisée

          // Créer une nouvelle adresse pour l'annonce
          const address = await prisma.address.create({
            data: {
              street: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              zip: faker.location.zipCode(),
              country: "France",
            },
          });

          return prisma.ad.create({
            data: {
              carId: randomCar.id,
              userId: faker.helpers.arrayElement(users).id,
              title: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
              description: faker.lorem.paragraphs(2),
              garageId: randomCar.garageId,
              addressId: address.id, // Ajouter l'ID de l'adresse
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
