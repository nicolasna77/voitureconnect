import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import prisma from "./client";
import { Prisma, SubscriptionPlan } from "@prisma/client";

// Constantes pour le nombre d'entrées à générer
const NUM_USERS = 50;
const NUM_GARAGES = 10;
const NUM_CARS = 100;
const NUM_ADS = 80;
const NUM_OFFERS = 150;
const NUM_TRANSACTIONS = 30;
const NUM_PICTURES_PER_CAR = 3;

// Ajout des constantes pour les plans
const SUBSCRIPTION_PLANS = [
  {
    name: "BASIC",
    price: 0,
    isAnnual: false,
  },
  {
    name: "PRO_STANDARD",
    price: 29.99,

    isAnnual: false,
  },
  {
    name: "PRO_PREMIUM",
    price: 49.99,
    isAnnual: false,
  },
];

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

          // Création d'une image de fond pour le garage
          const picture = await prisma.picture.create({
            data: {
              url: faker.image.urlLoremFlickr({ category: "business" }),
              alt: "Image de fond du garage",
              isShown: true,
              carId: (await prisma.car.findFirst())?.id || "", // Nécessite au moins une voiture
            },
          });

          return prisma.garage.create({
            data: {
              name: faker.company.name(),
              AdresseId: address.id,
              phone: faker.phone.number(),
              ownerId: faker.helpers.arrayElement(users).id,
              image: faker.image.urlLoremFlickr({ category: "business" }),
              backgroundId: picture.id,
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
            // Récupérer d'abord tous les types de voitures avec leurs marques et modèles compatibles
            const carType = await prisma.carTypeFR.findFirst({
              where: {
                carMakes: {
                  some: {
                    carModels: {
                      some: {
                        trims: {
                          some: {},
                        },
                      },
                    },
                  },
                },
              },
              include: {
                carMakes: {
                  include: {
                    carModels: {
                      include: {
                        trims: {
                          include: {
                            equipments: true,
                          },
                        },
                        generations: true,
                        series: true,
                      },
                    },
                  },
                },
              },
            });

            if (!carType) {
              throw new Error("Aucun type de voiture trouvé");
            }

            const randomMake = faker.helpers.arrayElement(carType.carMakes);
            const randomModel = faker.helpers.arrayElement(
              randomMake.carModels
            );
            const randomTrim = faker.helpers.arrayElement(randomModel.trims);
            const randomEquipment = faker.helpers.arrayElement(
              randomTrim.equipments
            );

            // Création de la voiture avec les données validées
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
                carTypeId: carType.id_car_type,
                carMakeId: randomMake.id_car_make,
                carModelId: randomModel.id_car_model,
                carTrimId: randomTrim.id_car_trim,
                carEquipmentId: randomEquipment.id_car_equipment,
                carGenerationId:
                  randomModel.generations[0]?.id_car_generation ?? 1,
                carSerieId: randomModel.series[0]?.id_car_serie ?? 1,

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
              description: faker.lorem.paragraph(8),
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

    // Création des abonnements
    console.log("Création des abonnements...");

    // Créer un abonnement pour chaque type de plan
    const subscriptions = await Promise.all(
      Object.values(SubscriptionPlan).map(async (planType) => {
        try {
          // Sélectionner un utilisateur aléatoire
          const randomUser = faker.helpers.arrayElement(users);
          const plan = SUBSCRIPTION_PLANS.find((p) => p.name === planType);

          if (!plan) {
            console.error(`Plan non trouvé pour le type ${planType}`);
            return null;
          }

          const isAnnual = faker.datatype.boolean();
          const startDate = faker.date.past();

          return await prisma.subscription.create({
            data: {
              userId: randomUser.id,
              plan: planType,
              status: "active", // On met actif par défaut pour les tests
              startDate: startDate,
              endDate: faker.date.future({ refDate: startDate }),
              isAnnual: isAnnual,
              amount: new Prisma.Decimal(
                isAnnual ? plan.price * 10 : plan.price
              ),
              createdAt: startDate,
              updatedAt: faker.date.recent(),
            },
          });
        } catch (error) {
          console.error(
            `Erreur lors de la création de l'abonnement pour le plan ${planType}:`,
            error
          );
          return null;
        }
      })
    );

    const validSubscriptions = subscriptions.filter((sub) => sub !== null);
    console.log(
      `✅ ${validSubscriptions.length} abonnements créés (un par type de plan)`
    );

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
