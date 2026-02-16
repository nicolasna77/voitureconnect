import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const maxDuration = 60;

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

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      return handleParse(formData);
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "setup":
        return handleSetup(body);
      case "import-batch":
        return handleImportBatch(body);
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("[IMPORT_CAR_DATA_EN]", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

async function handleParse(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const allData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
  // EN file has 2 header rows
  const rows = allData.slice(2);

  const bodyTypes = [
    ...new Set(rows.map((row) => row[COLUMNS.BODY_TYPE]).filter(Boolean)),
  ];
  const makes = [
    ...new Set(rows.map((row) => row[COLUMNS.MAKE]).filter(Boolean)),
  ];

  const modelEntries: Record<string, { make: string; model: string; type: string }> = {};
  const genEntries: Record<string, { make: string; model: string; gen: string; yearBegin: string; yearEnd: string; type: string }> = {};

  for (const row of rows) {
    const make = row[COLUMNS.MAKE];
    const model = row[COLUMNS.MODEL];
    const gen = row[COLUMNS.GENERATION];
    const yearBegin = row[COLUMNS.YEAR_BEGIN]?.toString() || "";
    const yearEnd = row[COLUMNS.YEAR_END]?.toString() || "";
    const type = row[COLUMNS.BODY_TYPE];

    if (make && model && type) {
      const modelKey = `${make}|${model}`;
      if (!modelEntries[modelKey]) {
        modelEntries[modelKey] = { make, model, type };
      }
    }

    if (make && model && gen && type) {
      const genKey = `${make}|${model}|${gen}`;
      if (!genEntries[genKey]) {
        genEntries[genKey] = { make, model, gen, yearBegin, yearEnd, type };
      }
    }
  }

  return NextResponse.json({
    totalRows: rows.length,
    rows,
    bodyTypes,
    makes,
    modelEntries: Object.entries(modelEntries).map(([key, val]) => ({ key, ...val })),
    genEntries: Object.entries(genEntries).map(([key, val]) => ({ key, ...val })),
    specifications: SPECIFICATIONS.map((s) => s.name),
  });
}

async function handleSetup(body: {
  bodyTypes: string[];
  makes: string[];
  modelEntries: { key: string; make: string; model: string; type: string }[];
  genEntries: { key: string; make: string; model: string; gen: string; yearBegin: string; yearEnd: string; type: string }[];
  specifications: string[];
}) {
  const timestamp = Math.floor(Date.now() / 1000);
  const typeMap: Record<string, number> = {};
  const makeMap: Record<string, number> = {};
  const modelMap: Record<string, number> = {};
  const generationMap: Record<string, number> = {};
  const specMap: Record<string, number> = {};

  // 1. Body types
  for (const typeName of body.bodyTypes) {
    const existing = await prisma.carTypeEN.findFirst({ where: { name: typeName } });
    if (existing) {
      typeMap[typeName] = existing.id_car_type;
    } else {
      const created = await prisma.carTypeEN.create({
        data: { name: typeName, date_create: timestamp },
      });
      typeMap[typeName] = created.id_car_type;
    }
  }

  // 2. Makes
  const firstTypeId = Object.values(typeMap)[0];
  for (const makeName of body.makes) {
    const existing = await prisma.carMakeEN.findFirst({ where: { name: makeName } });
    if (existing) {
      makeMap[makeName] = existing.id_car_make;
    } else {
      const created = await prisma.carMakeEN.create({
        data: { name: makeName, date_create: timestamp, id_car_type: firstTypeId },
      });
      makeMap[makeName] = created.id_car_make;
    }
  }

  // 3. Models
  for (const entry of body.modelEntries) {
    const existing = await prisma.carModelEN.findFirst({
      where: { name: entry.model, carMake: { name: entry.make } },
    });
    if (existing) {
      modelMap[entry.key] = existing.id_car_model;
    } else {
      const makeId = makeMap[entry.make];
      const typeId = typeMap[entry.type];
      if (!makeId || !typeId) continue;
      const created = await prisma.carModelEN.create({
        data: { name: entry.model, date_create: timestamp, id_car_make: makeId, id_car_type: typeId },
      });
      modelMap[entry.key] = created.id_car_model;
    }
  }

  // 4. Generations
  for (const entry of body.genEntries) {
    const modelKey = `${entry.make}|${entry.model}`;
    const modelId = modelMap[modelKey];
    const typeId = typeMap[entry.type];
    if (!modelId || !typeId) continue;

    const existing = await prisma.carGenerationEN.findFirst({
      where: { name: entry.gen, id_car_model: modelId },
    });
    if (existing) {
      generationMap[entry.key] = existing.id_car_generation;
    } else {
      const created = await prisma.carGenerationEN.create({
        data: {
          name: entry.gen,
          date_create: timestamp,
          id_car_model: modelId,
          id_car_type: typeId,
          year_begin: entry.yearBegin || null,
          year_end: entry.yearEnd || null,
        },
      });
      generationMap[entry.key] = created.id_car_generation;
    }
  }

  // 5. Specifications
  for (const specName of body.specifications) {
    const existing = await prisma.carSpecificationEN.findFirst({
      where: { name: specName },
    });
    if (existing) {
      specMap[specName] = existing.id_car_specification;
    } else {
      const created = await prisma.carSpecificationEN.create({
        data: { name: specName, date_create: timestamp, id_car_type: firstTypeId },
      });
      specMap[specName] = created.id_car_specification;
    }
  }

  return NextResponse.json({
    typeMap,
    makeMap,
    modelMap,
    generationMap,
    specMap,
    counts: {
      types: Object.keys(typeMap).length,
      makes: Object.keys(makeMap).length,
      models: Object.keys(modelMap).length,
      generations: Object.keys(generationMap).length,
      specifications: Object.keys(specMap).length,
    },
  });
}

async function handleImportBatch(body: {
  rows: any[][];
  modelMap: Record<string, number>;
  typeMap: Record<string, number>;
  specMap: Record<string, number>;
}) {
  const { rows, modelMap, typeMap, specMap } = body;
  const timestamp = Math.floor(Date.now() / 1000);

  let trimCount = 0;
  let specValueCount = 0;
  const trimCache: Record<string, number> = {};

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

    const modelId = modelMap[modelKey];
    const typeId = typeMap[type];

    if (!modelId || !typeId) continue;

    let trimId = trimCache[trimKey];

    if (!trimId) {
      const existing = await prisma.carTrimEN.findFirst({
        where: { name: trim, id_car_model: modelId },
      });

      if (existing) {
        trimId = existing.id_car_trim;
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
        trimCount++;
      }
      trimCache[trimKey] = trimId;
    }

    for (const spec of SPECIFICATIONS) {
      const value = row[spec.index];
      if (value !== undefined && value !== null && value !== "") {
        const specId = specMap[spec.name];
        if (!specId) continue;

        const existingValue = await prisma.carSpecificationValueEN.findFirst({
          where: { id_car_trim: trimId, id_car_specification: specId },
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
  }

  return NextResponse.json({
    processed: rows.length,
    trimCount,
    specValueCount,
  });
}
