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
  BODY_TYPE: 6,
  TRIM: 7,
};

const SPECIFICATIONS = [
  { name: "Type de carrosserie", index: 8 },
  { name: "Nombre de places", index: 9 },
  { name: "Longueur (mm)", index: 10 },
  { name: "Largeur (mm)", index: 11 },
  { name: "Hauteur (mm)", index: 12 },
  { name: "Empattement (mm)", index: 13 },
  { name: "Voie avant (mm)", index: 14 },
  { name: "Voie arrière (mm)", index: 15 },
  { name: "Poids à vide (kg)", index: 20 },
  { name: "Charge utile (kg)", index: 22 },
  { name: "Poids remorque freinée (kg)", index: 23 },
  { name: "Volume coffre (L)", index: 25 },
  { name: "Type de carburant", index: 27 },
  { name: "Cylindrée (cm³)", index: 28 },
  { name: "Puissance (ch)", index: 29 },
  { name: "Régime puissance max", index: 30 },
  { name: "Couple (Nm)", index: 31 },
  { name: "Alimentation", index: 32 },
  { name: "Architecture moteur", index: 33 },
  { name: "Nombre de cylindres", index: 34 },
  { name: "Alésage (mm)", index: 36 },
  { name: "Course (mm)", index: 37 },
  { name: "Soupapes par cylindre", index: 38 },
  { name: "Régime couple max", index: 39 },
  { name: "Type de boîte", index: 41 },
  { name: "Roues motrices", index: 42 },
  { name: "Nombre de rapports", index: 44 },
  { name: "Type de carburant recommandé", index: 45 },
  { name: "Vitesse max (km/h)", index: 46 },
  { name: "Consommation (L/100km)", index: 48 },
  { name: "Réservoir (L)", index: 52 },
  { name: "Freins avant", index: 54 },
  { name: "Freins arrière", index: 55 },
  { name: "Suspension avant", index: 56 },
  { name: "Suspension arrière", index: 57 },
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
    console.error("[IMPORT_CAR_DATA_FR]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
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
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  const bodyTypes = [
    ...new Set(data.map((row) => row[COLUMNS.BODY_TYPE]).filter(Boolean)),
  ];
  const makes = [
    ...new Set(data.map((row) => row[COLUMNS.MAKE]).filter(Boolean)),
  ];

  const modelEntries: Record<
    string,
    { make: string; model: string; type: string }
  > = {};
  const genEntries: Record<
    string,
    {
      make: string;
      model: string;
      gen: string;
      yearBegin: string;
      yearEnd: string;
      type: string;
    }
  > = {};

  for (const row of data) {
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
    totalRows: data.length,
    rows: data,
    bodyTypes,
    makes,
    modelEntries: Object.entries(modelEntries).map(([key, val]) => ({
      key,
      ...val,
    })),
    genEntries: Object.entries(genEntries).map(([key, val]) => ({
      key,
      ...val,
    })),
    specifications: SPECIFICATIONS.map((s) => s.name),
  });
}

async function handleSetup(body: {
  bodyTypes: string[];
  makes: string[];
  modelEntries: { key: string; make: string; model: string; type: string }[];
  genEntries: {
    key: string;
    make: string;
    model: string;
    gen: string;
    yearBegin: string;
    yearEnd: string;
    type: string;
  }[];
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
    const existing = await prisma.carTypeFR.findFirst({
      where: { name: typeName },
    });
    if (existing) {
      typeMap[typeName] = existing.id_car_type;
    } else {
      const created = await prisma.carTypeFR.create({
        data: { name: typeName, date_create: timestamp },
      });
      typeMap[typeName] = created.id_car_type;
    }
  }

  // 2. Makes
  const firstTypeId = Object.values(typeMap)[0];
  for (const makeName of body.makes) {
    const existing = await prisma.carMakeFR.findFirst({
      where: { name: makeName },
    });
    if (existing) {
      makeMap[makeName] = existing.id_car_make;
    } else {
      const created = await prisma.carMakeFR.create({
        data: {
          name: makeName,
          date_create: timestamp,
          id_car_type: firstTypeId,
        },
      });
      makeMap[makeName] = created.id_car_make;
    }
  }

  // 3. Models
  for (const entry of body.modelEntries) {
    const existing = await prisma.carModelFR.findFirst({
      where: { name: entry.model, carMake: { name: entry.make } },
    });
    if (existing) {
      modelMap[entry.key] = existing.id_car_model;
    } else {
      const makeId = makeMap[entry.make];
      const typeId = typeMap[entry.type];
      if (!makeId || !typeId) continue;
      const created = await prisma.carModelFR.create({
        data: {
          name: entry.model,
          date_create: timestamp,
          id_car_make: makeId,
          id_car_type: typeId,
        },
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

    const existing = await prisma.carGenerationFR.findFirst({
      where: { name: entry.gen, id_car_model: modelId },
    });
    if (existing) {
      generationMap[entry.key] = existing.id_car_generation;
    } else {
      const created = await prisma.carGenerationFR.create({
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
    const existing = await prisma.carSpecificationFR.findFirst({
      where: { name: specName },
    });
    if (existing) {
      specMap[specName] = existing.id_car_specification;
    } else {
      const created = await prisma.carSpecificationFR.create({
        data: {
          name: specName,
          date_create: timestamp,
          id_car_type: firstTypeId,
        },
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
      const existing = await prisma.carTrimFR.findFirst({
        where: { name: trim, id_car_model: modelId },
      });

      if (existing) {
        trimId = existing.id_car_trim;
      } else {
        const created = await prisma.carTrimFR.create({
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

        const existingValue = await prisma.carSpecificationValueFR.findFirst({
          where: { id_car_trim: trimId, id_car_specification: specId },
        });

        if (!existingValue) {
          await prisma.carSpecificationValueFR.create({
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
