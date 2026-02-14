import "dotenv/config";
import path from "node:path";
import XLSX from "xlsx";
import prisma from "../src/prisma.js";

// Mapping des colonnes du fichier Excel EN
// Row 0 = category headers, Row 1 = column headers, Data starts at row 2
const COLUMNS = {
  ID: 0,
  MAKE: 1,
  MODEL: 2,
  GENERATION: 3,
  YEAR_BEGIN: 4,
  YEAR_END: 5,
  SERIE: 6,
  TRIM: 7,
  BODY_TYPE: 16,
};

// Spécifications avec leur nom anglais et index de colonne
const SPECIFICATIONS = [
  { name: "Body type", index: 16 },
  { name: "Number of seats", index: 13 },
  { name: "Length (mm)", index: 12 },
  { name: "Width (mm)", index: 9 },
  { name: "Height (mm)", index: 17 },
  { name: "Wheelbase (mm)", index: 25 },
  { name: "Front track (mm)", index: 24 },
  { name: "Rear track (mm)", index: 8 },
  { name: "Curb weight (kg)", index: 11 },
  { name: "Payload (kg)", index: 23 },
  { name: "Permitted road-train weight (kg)", index: 22 },
  { name: "Trunk capacity (L)", index: 14 },
  { name: "Engine type", index: 39 },
  { name: "Displacement (cm3)", index: 38 },
  { name: "Engine power (bhp)", index: 37 },
  { name: "Max power RPM", index: 35 },
  { name: "Maximum torque (Nm)", index: 34 },
  { name: "Injection type", index: 32 },
  { name: "Cylinder layout", index: 33 },
  { name: "Number of cylinders", index: 40 },
  { name: "Cylinder bore (mm)", index: 28 },
  { name: "Stroke cycle (mm)", index: 27 },
  { name: "Valves per cylinder", index: 31 },
  { name: "Max torque RPM", index: 36 },
  { name: "Gearbox type", index: 41 },
  { name: "Drive wheels", index: 43 },
  { name: "Number of gears", index: 42 },
  { name: "Fuel type", index: 46 },
  { name: "Max speed (km/h)", index: 50 },
  { name: "Fuel consumption (L/100km)", index: 53 },
  { name: "Fuel tank capacity (L)", index: 48 },
  { name: "Front brakes", index: 55 },
  { name: "Rear brakes", index: 54 },
  { name: "Front suspension", index: 57 },
  { name: "Rear suspension", index: 56 },
];

async function importCarDataEN(filePath: string) {
  console.log("[EN] Reading Excel file...");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  // Skip header rows (row 0 = categories, row 1 = column names)
  const rows = data.slice(2);
  console.log(`[EN] ${rows.length} data rows found`);

  const typeMap = new Map<string, number>();
  const makeMap = new Map<string, number>();
  const modelMap = new Map<string, number>();
  const generationMap = new Map<string, number>();
  const trimMap = new Map<string, number>();
  const specMap = new Map<string, number>();

  const timestamp = Math.floor(Date.now() / 1000);

  // 1. Body types
  console.log("\n[EN] Importing body types...");
  const bodyTypes = [...new Set(rows.map((row) => row[COLUMNS.BODY_TYPE]).filter(Boolean))];

  for (const typeName of bodyTypes) {
    const existing = await prisma.carTypeEN.findFirst({ where: { name: typeName } });
    if (existing) {
      typeMap.set(typeName, existing.id_car_type);
    } else {
      const created = await prisma.carTypeEN.create({
        data: { name: typeName, date_create: timestamp },
      });
      typeMap.set(typeName, created.id_car_type);
    }
  }
  console.log(`[EN] ${typeMap.size} body types`);

  // 2. Makes
  console.log("\n[EN] Importing makes...");
  const makes = [...new Set(rows.map((row) => row[COLUMNS.MAKE]).filter(Boolean))];

  for (const makeName of makes) {
    const existing = await prisma.carMakeEN.findFirst({ where: { name: makeName } });
    if (existing) {
      makeMap.set(makeName, existing.id_car_make);
    } else {
      const firstTypeId = typeMap.values().next().value!;
      const created = await prisma.carMakeEN.create({
        data: {
          name: makeName,
          date_create: timestamp,
          id_car_type: firstTypeId,
        },
      });
      makeMap.set(makeName, created.id_car_make);
    }
  }
  console.log(`[EN] ${makeMap.size} makes`);

  // 3. Models
  console.log("\n[EN] Importing models...");
  const modelEntries = new Map<string, { make: string; model: string; type: string }>();

  for (const row of rows) {
    const make = row[COLUMNS.MAKE];
    const model = row[COLUMNS.MODEL];
    const type = row[COLUMNS.BODY_TYPE];
    if (make && model && type) {
      const key = `${make}|${model}`;
      if (!modelEntries.has(key)) {
        modelEntries.set(key, { make, model, type });
      }
    }
  }

  for (const [key, { make, model, type }] of modelEntries) {
    const existing = await prisma.carModelEN.findFirst({
      where: { name: model, carMake: { name: make } },
    });
    if (existing) {
      modelMap.set(key, existing.id_car_model);
    } else {
      const makeId = makeMap.get(make)!;
      const typeId = typeMap.get(type)!;
      const created = await prisma.carModelEN.create({
        data: {
          name: model,
          date_create: timestamp,
          id_car_make: makeId,
          id_car_type: typeId,
        },
      });
      modelMap.set(key, created.id_car_model);
    }
  }
  console.log(`[EN] ${modelMap.size} models`);

  // 4. Generations
  console.log("\n[EN] Importing generations...");
  const genEntries = new Map<string, { make: string; model: string; gen: string; yearBegin: string; yearEnd: string; type: string }>();

  for (const row of rows) {
    const make = row[COLUMNS.MAKE];
    const model = row[COLUMNS.MODEL];
    const gen = row[COLUMNS.GENERATION];
    const yearBegin = row[COLUMNS.YEAR_BEGIN]?.toString() || "";
    const yearEnd = row[COLUMNS.YEAR_END]?.toString() || "";
    const type = row[COLUMNS.BODY_TYPE];

    if (make && model && gen && type) {
      const key = `${make}|${model}|${gen}`;
      if (!genEntries.has(key)) {
        genEntries.set(key, { make, model, gen, yearBegin, yearEnd, type });
      }
    }
  }

  for (const [key, { make, model, gen, yearBegin, yearEnd, type }] of genEntries) {
    const modelKey = `${make}|${model}`;
    const modelId = modelMap.get(modelKey);
    const typeId = typeMap.get(type);

    if (!modelId || !typeId) continue;

    const existing = await prisma.carGenerationEN.findFirst({
      where: { name: gen, id_car_model: modelId },
    });

    if (existing) {
      generationMap.set(key, existing.id_car_generation);
    } else {
      const created = await prisma.carGenerationEN.create({
        data: {
          name: gen,
          date_create: timestamp,
          id_car_model: modelId,
          id_car_type: typeId,
          year_begin: yearBegin || null,
          year_end: yearEnd || null,
        },
      });
      generationMap.set(key, created.id_car_generation);
    }
  }
  console.log(`[EN] ${generationMap.size} generations`);

  // 5. Specifications
  console.log("\n[EN] Importing specifications...");
  const firstTypeId = typeMap.values().next().value!;

  for (const spec of SPECIFICATIONS) {
    const existing = await prisma.carSpecificationEN.findFirst({
      where: { name: spec.name },
    });
    if (existing) {
      specMap.set(spec.name, existing.id_car_specification);
    } else {
      const created = await prisma.carSpecificationEN.create({
        data: {
          name: spec.name,
          date_create: timestamp,
          id_car_type: firstTypeId,
        },
      });
      specMap.set(spec.name, created.id_car_specification);
    }
  }
  console.log(`[EN] ${specMap.size} specifications`);

  // 6. Trims and specification values
  console.log("\n[EN] Importing trims and specifications...");
  let trimCount = 0;
  let specValueCount = 0;

  for (const row of rows) {
    const make = row[COLUMNS.MAKE];
    const model = row[COLUMNS.MODEL];
    const gen = row[COLUMNS.GENERATION];
    const trim = row[COLUMNS.TRIM];
    const type = row[COLUMNS.BODY_TYPE];

    if (!make || !model || !trim || !type) continue;

    const modelKey = `${make}|${model}`;
    const genKey = `${make}|${model}|${gen}`;
    const trimKey = `${genKey}|${trim}`;

    const modelId = modelMap.get(modelKey);
    const typeId = typeMap.get(type);

    if (!modelId || !typeId) continue;

    let trimId = trimMap.get(trimKey);

    if (!trimId) {
      const existing = await prisma.carTrimEN.findFirst({
        where: { name: trim, id_car_model: modelId },
      });

      if (existing) {
        trimId = existing.id_car_trim;
        trimMap.set(trimKey, trimId);
      } else {
        const created = await prisma.carTrimEN.create({
          data: {
            name: trim,
            date_create: timestamp,
            id_car_model: modelId,
            id_car_type: typeId,
          },
        });
        trimId = created.id_car_trim;
        trimMap.set(trimKey, trimId);
        trimCount++;
      }
    }

    for (const spec of SPECIFICATIONS) {
      const value = row[spec.index];
      if (value !== undefined && value !== null && value !== "") {
        const specId = specMap.get(spec.name);
        if (!specId) continue;

        const existingValue = await prisma.carSpecificationValueEN.findFirst({
          where: {
            id_car_trim: trimId,
            id_car_specification: specId,
          },
        });

        if (!existingValue) {
          await prisma.carSpecificationValueEN.create({
            data: {
              id_car_trim: trimId,
              id_car_specification: specId,
              id_car_type: typeId,
              value: String(value),
              date_create: timestamp,
            },
          });
          specValueCount++;
        }
      }
    }

    if (trimCount % 100 === 0 && trimCount > 0) {
      console.log(`  ... ${trimCount} trims processed`);
    }
  }

  console.log(`[EN] ${trimCount} trims created`);
  console.log(`[EN] ${specValueCount} specification values created`);

  console.log("\n[EN] Import completed!");

  const totalGens = await prisma.carGenerationEN.count();
  const totalTrims = await prisma.carTrimEN.count();
  console.log(`\n[EN] Database summary:`);
  console.log(`   - Types: ${typeMap.size}`);
  console.log(`   - Makes: ${makeMap.size}`);
  console.log(`   - Models: ${modelMap.size}`);
  console.log(`   - Generations: ${totalGens}`);
  console.log(`   - Trims: ${totalTrims}`);
}

const filePath = process.argv[2] || path.join(__dirname, "..", "data", "Car2DB_eng_cut.xlsx");

importCarDataEN(filePath)
  .catch((error) => {
    console.error("[EN] Error:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
