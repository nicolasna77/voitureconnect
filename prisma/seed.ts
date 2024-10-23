const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const csv = require("csv-parser");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

type ModelName =
  | "carEquipment"
  | "carGeneration"
  | "carMake"
  | "carModel"
  | "carOption"
  | "carOptionValue"
  | "carSerie"
  | "carSpecification"
  | "carSpecificationValue"
  | "carTrim"
  | "carType";

async function seedData(
  filePath: string,
  model: ModelName,
  mapRowToData: (row: any) => any,
  uniqueField: string
): Promise<void> {
  const results: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: "," }))
      .on("data", (data: any) => {
        const cleanedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key.replace(/['"]/g, ""),
            typeof value === "string" ? value.replace(/['"]/g, "") : value,
          ])
        );
        results.push(cleanedData);
      })
      .on("end", async () => {
        try {
          for (const row of results) {
            const data = mapRowToData(row);
            // Vérification des clés étrangères pour CarEquipment
            if (model === "carEquipment") {
              const trimExists = await prisma.carTrim.findUnique({
                where: { id_car_trim: data.id_car_trim },
              });
              if (!trimExists) {
                console.warn(
                  `Skipping row due to missing foreign key: ${JSON.stringify(
                    row
                  )}`
                );
                continue;
              }
            }
            if (
              Object.values(data).some(
                (value) =>
                  value === undefined ||
                  value === null ||
                  (typeof value === "number" && isNaN(value))
              )
            ) {
              console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
              continue;
            }
            if (model === "carSerie") {
              if (
                await checkForeignKeysExist(
                  data.id_car_model,
                  data.id_car_generation
                )
              ) {
                await (prisma[model] as any).upsert({
                  where: {
                    [uniqueField]: data[uniqueField],
                  },
                  update: data,
                  create: data,
                });
              } else {
                console.warn(
                  `Skipping row due to missing foreign keys: ${JSON.stringify(
                    row
                  )}`
                );
                continue;
              }
            } else {
              try {
                await (prisma[model] as any).upsert({
                  where: {
                    [uniqueField]: data[uniqueField],
                  },
                  update: data,
                  create: data,
                });
              } catch (error) {
                if (error instanceof Error) {
                  console.error(
                    `Erreur lors de l'insertion de carOption: ${error.message}`
                  );
                  console.error(
                    `Données problématiques: ${JSON.stringify(data)}`
                  );
                } else {
                  console.error(
                    `Erreur inconnue lors de l'insertion de carOption: ${JSON.stringify(
                      error
                    )}`
                  );
                }
              }
            }
          }
          console.log(`${String(model)} seeded successfully`);
          resolve();
        } catch (error) {
          console.error(`Error seeding ${String(model)}:`, error);
          reject(error);
        }
      });
  });
}

async function checkForeignKeys(model: string, data: any): Promise<boolean> {
  switch (model) {
    case "carEquipment":
      const carTrim = await prisma.carTrim.findUnique({
        where: { id_car_trim: data.id_car_trim },
      });
      return !!carTrim;
    default:
      return true;
  }
}

async function checkCarEquipmentForeignKeys(data: any): Promise<boolean> {
  const carTrim = await prisma.carTrim.findUnique({
    where: { id_car_trim: data.id_car_trim },
  });
  return !!carTrim;
}

async function checkCarOptionForeignKeys(data: any): Promise<boolean> {
  const carType = await prisma.carType.findUnique({
    where: { id_car_type: data.id_car_type },
  });
  return !!carType;
}

async function checkForeignKeysExist(
  id_car_model: number,
  id_car_generation: number
): Promise<boolean> {
  const modelExists = await prisma.carModel.findUnique({
    where: { id_car_model },
  });
  const generationExists = await prisma.carGeneration.findUnique({
    where: { id_car_generation },
  });
  return !!modelExists && !!generationExists;
}

async function seedUsers() {
  const users = [];
  for (let i = 0; i < 5; i++) {
    users.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "USER",
    });
  }
  await prisma.user.createMany({ data: users });
  return users;
}

async function seedAds(): Promise<any[]> {
  const ads = [];
  const cars = await prisma.car.findMany();
  const users = await prisma.user.findMany();

  if (cars.length === 0 || users.length === 0) {
    console.warn(
      "Aucune voiture ou utilisateur trouvé. Impossible de créer des annonces."
    );
    return [];
  }

  const usedCarIds = new Set();

  for (let i = 0; i < 20; i++) {
    let randomCar;
    do {
      randomCar = faker.helpers.arrayElement(cars);
    } while (usedCarIds.has(randomCar.id));

    usedCarIds.add(randomCar.id);
    const randomUser = faker.helpers.arrayElement(users);

    ads.push({
      id: faker.string.uuid(),
      carId: randomCar.id,
      title: `${randomCar.carMake.name} ${randomCar.carModel.name}`,
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      userId: randomUser.id,
    });
  }

  // Utilisez createMany avec skipDuplicates: true
  await prisma.ad.createMany({
    data: ads,
    skipDuplicates: true,
  });
  return ads;
}

async function seedCars() {
  const cars = [];

  const users = await prisma.user.findMany();
  const carModels = await prisma.carModel.findMany({
    select: { id_car_model: true },
  });
  const carTypes = await prisma.carType.findMany({
    select: { id_car_type: true },
  });
  const carTrims = await prisma.carTrim.findMany({
    select: { id_car_trim: true },
  });
  const carMakes = await prisma.carMake.findMany({
    select: { id_car_make: true },
  });

  for (let i = 0; i < 20; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    const randomCarModel = faker.helpers.arrayElement(carModels);
    const randomCarTrim = faker.helpers.arrayElement(carTrims);
    const randomCarType = faker.helpers.arrayElement(carTypes);
    const randomCarMake = faker.helpers.arrayElement(carMakes);

    cars.push({
      id: faker.string.uuid(),
      userId: randomUser.id,
      Kms: faker.number.int({ min: 0, max: 200000 }),
      price: faker.number.float({ min: 1000, max: 50000, precision: 0.01 }),
      year: faker.number.int({ min: 2000, max: 2023 }),
      color: faker.color.human(),
      fuelType: faker.helpers.arrayElement([
        "Gasoline",
        "Diesel",
        "Electric",
        "Hybrid",
      ]),
      vin: faker.vehicle.vin(),
      gearbox: faker.helpers.arrayElement(["Manual", "Automatic"]),
      carModelId: randomCarModel.id_car_model,
      carTrimId: randomCarTrim.id_car_trim,
      carTypeId: randomCarType.id_car_type,
      carMakeId: randomCarMake.id_car_make,
      carGenerationId: null,
      carSerieId: null,
      carEquipmentId: null,
      carOptionId: null,
      carSpecificationId: null,
      carOptionValueId: null,
      carSpecificationValueId: null,
    });
  }

  await prisma.car.createMany({ data: cars });
  return cars;
}

async function main() {
  try {
    await seedData(
      "public/data/car_type.csv",
      "carType",
      (row: any) => ({
        id_car_type: parseInt(row.id_car_type),
        name: row.name,
      }),
      "id_car_type"
    );

    await seedData(
      "public/data/car_make.csv",
      "carMake",
      (row: any) => ({
        id_car_make: parseInt(row.id_car_make),
        name: row.name,
        date_create: parseInt(row.date_create),
        date_update: row.date_update ? parseInt(row.date_update) : null,
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_make"
    );

    await seedData(
      "public/data/car_model.csv",
      "carModel",
      (row: any) => ({
        id_car_model: parseInt(row.id_car_model),
        id_car_make: parseInt(row.id_car_make),
        name: row.name,
        date_create: parseInt(row.date_create),
        date_update: parseInt(row.date_update),
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_model"
    );

    await seedData(
      "public/data/car_generation.csv",
      "carGeneration",
      (row: any) => ({
        id_car_generation: parseInt(row.id_car_generation),
        id_car_model: parseInt(row.id_car_model),
        name: row.name,
        year_begin: row.year_begin ? parseInt(row.year_begin) : null,
        year_end: row.year_end ? parseInt(row.year_end) : null,
        date_create: parseInt(row.date_create),
        date_update: row.date_update ? parseInt(row.date_update) : null,
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_generation"
    );

    await seedData(
      "public/data/car_serie.csv",
      "carSerie",
      (row: any) => ({
        id_car_serie: parseInt(row.id_car_serie),
        id_car_model: parseInt(row.id_car_model),
        id_car_generation: parseInt(row.id_car_generation),
        name: row.name,
        date_create: parseInt(row.date_create),
        date_update: row.date_update ? parseInt(row.date_update) : null,
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_serie"
    );

    await seedData(
      "public/data/car_trim.csv",
      "carTrim",
      (row: any) => ({
        id_car_trim: parseInt(row.id_car_trim),
        id_car_serie: parseInt(row.id_car_serie),
        id_car_model: parseInt(row.id_car_model),
        name: row.name,
        start_production_year:
          row.start_production_year !== "NULL"
            ? parseInt(row.start_production_year)
            : null,
        end_production_year:
          row.end_production_year !== "NULL"
            ? parseInt(row.end_production_year)
            : null,
        date_create: parseInt(row.date_create),
        date_update:
          row.date_update !== "NULL" ? parseInt(row.date_update) : null,
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_trim"
    );

    await seedData(
      "public/data/car_equipment.csv",
      "carEquipment",
      (row: any) => ({
        id_car_equipment: parseInt(row.id_car_equipment),
        id_car_trim: parseInt(row.id_car_trim),
        name: row.name,
        year: parseInt(row.year),
        date_create: parseInt(row.date_create),
        date_update: parseInt(row.date_update),
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_equipment"
    );

    await seedData(
      "public/data/car_option.csv",
      "carOption",
      (row: any) => ({
        id_car_option: parseInt(row.id_car_option),
        name: row.name,
        id_parent: row.id_parent ? parseInt(row.id_parent) : null,
        date_create: parseInt(row.date_create),
        date_update: parseInt(row.date_update),
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_option"
    );

    await seedData(
      "public/data/car_option_value.csv",
      "carOptionValue",
      (row: any) => ({
        id_car_option_value: parseInt(row.id_car_option_value),
        id_car_option: parseInt(row.id_car_option),
        id_car_equipment: parseInt(row.id_car_equipment),
        is_base: row.is_base === "1",
        date_create: parseInt(row.date_create),
        date_update: parseInt(row.date_update),
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_option_value"
    );

    await seedData(
      "public/data/car_specification.csv",
      "carSpecification",
      (row: any) => ({
        id_car_specification: parseInt(row.id_car_specification),
        name: row.name,
        id_parent: row.id_parent ? parseInt(row.id_parent) : null,
        date_create: parseInt(row.date_create),
        date_update: parseInt(row.date_update),
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_specification"
    );

    await seedData(
      "public/data/car_specification_value.csv",
      "carSpecificationValue",
      (row: any) => ({
        id_car_specification_value: parseInt(row.id_car_specification_value),
        id_car_trim: parseInt(row.id_car_trim),
        id_car_specification: parseInt(row.id_car_specification),
        value: row.value,
        unit: row.unit,
        date_create: parseInt(row.date_create),
        date_update: row.date_update ? parseInt(row.date_update) : null,
        id_car_type: parseInt(row.id_car_type),
      }),
      "id_car_specification_value"
    );

    await seedUsers();

    await seedCars();

    await seedAds();

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
