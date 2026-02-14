import "dotenv/config";
import XLSX from "xlsx";
import prisma from "../src/prisma.js";

// Mapping des colonnes du fichier Excel
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

// Spécifications avec leur nom et index de colonne
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

async function importCarData(filePath: string) {
  console.log("📖 Lecture du fichier Excel...");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  console.log(`📊 ${data.length} lignes trouvées`);

  // Maps pour stocker les IDs créés
  const typeMap = new Map<string, number>();
  const makeMap = new Map<string, number>();
  const modelMap = new Map<string, number>();
  const generationMap = new Map<string, number>();
  const trimMap = new Map<string, number>();
  const specMap = new Map<string, number>();

  const timestamp = Math.floor(Date.now() / 1000);

  // 1. Créer les types de carrosserie
  console.log("\n🚗 Import des types de carrosserie...");
  const bodyTypes = [...new Set(data.map((row) => row[COLUMNS.BODY_TYPE]).filter(Boolean))];

  for (const typeName of bodyTypes) {
    const existing = await prisma.carTypeFR.findFirst({ where: { name: typeName } });
    if (existing) {
      typeMap.set(typeName, existing.id_car_type);
    } else {
      const created = await prisma.carTypeFR.create({
        data: { name: typeName, date_create: timestamp },
      });
      typeMap.set(typeName, created.id_car_type);
    }
  }
  console.log(`✅ ${typeMap.size} types de carrosserie`);

  // 2. Créer les marques
  console.log("\n🏭 Import des marques...");
  const makes = [...new Set(data.map((row) => row[COLUMNS.MAKE]).filter(Boolean))];

  for (const makeName of makes) {
    const existing = await prisma.carMakeFR.findFirst({ where: { name: makeName } });
    if (existing) {
      makeMap.set(makeName, existing.id_car_make);
    } else {
      // Utiliser le premier type disponible
      const firstTypeId = typeMap.values().next().value!;
      const created = await prisma.carMakeFR.create({
        data: {
          name: makeName,
          date_create: timestamp,
          id_car_type: firstTypeId,
        },
      });
      makeMap.set(makeName, created.id_car_make);
    }
  }
  console.log(`✅ ${makeMap.size} marques`);

  // 3. Créer les modèles
  console.log("\n📝 Import des modèles...");
  const modelEntries = new Map<string, { make: string; model: string; type: string }>();

  for (const row of data) {
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
    const existing = await prisma.carModelFR.findFirst({
      where: { name: model, carMake: { name: make } },
    });
    if (existing) {
      modelMap.set(key, existing.id_car_model);
    } else {
      const makeId = makeMap.get(make)!;
      const typeId = typeMap.get(type)!;
      const created = await prisma.carModelFR.create({
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
  console.log(`✅ ${modelMap.size} modèles`);

  // 4. Créer les générations
  console.log("\n📅 Import des générations...");
  const genEntries = new Map<string, { make: string; model: string; gen: string; yearBegin: string; yearEnd: string; type: string }>();

  for (const row of data) {
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

    const existing = await prisma.carGenerationFR.findFirst({
      where: { name: gen, id_car_model: modelId },
    });

    if (existing) {
      generationMap.set(key, existing.id_car_generation);
    } else {
      const created = await prisma.carGenerationFR.create({
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
  console.log(`✅ ${generationMap.size} générations`);

  // 5. Créer les spécifications
  console.log("\n📋 Import des spécifications...");
  const firstTypeId = typeMap.values().next().value!;

  for (const spec of SPECIFICATIONS) {
    const existing = await prisma.carSpecificationFR.findFirst({
      where: { name: spec.name },
    });
    if (existing) {
      specMap.set(spec.name, existing.id_car_specification);
    } else {
      const created = await prisma.carSpecificationFR.create({
        data: {
          name: spec.name,
          date_create: timestamp,
          id_car_type: firstTypeId,
        },
      });
      specMap.set(spec.name, created.id_car_specification);
    }
  }
  console.log(`✅ ${specMap.size} spécifications`);

  // 6. Créer les trims et leurs valeurs de spécification
  console.log("\n🔧 Import des finitions et spécifications...");
  let trimCount = 0;
  let specValueCount = 0;

  for (const row of data) {
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

    // Vérifier si le trim existe déjà
    let trimId = trimMap.get(trimKey);

    if (!trimId) {
      const existing = await prisma.carTrimFR.findFirst({
        where: { name: trim, id_car_model: modelId },
      });

      if (existing) {
        trimId = existing.id_car_trim;
        trimMap.set(trimKey, trimId);
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
        trimMap.set(trimKey, trimId);
        trimCount++;
      }
    }

    // Créer les valeurs de spécification
    for (const spec of SPECIFICATIONS) {
      const value = row[spec.index];
      if (value !== undefined && value !== null && value !== "") {
        const specId = specMap.get(spec.name);
        if (!specId) continue;

        const existingValue = await prisma.carSpecificationValueFR.findFirst({
          where: {
            id_car_trim: trimId,
            id_car_specification: specId,
          },
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

    // Log progress
    if (trimCount % 100 === 0 && trimCount > 0) {
      console.log(`  ... ${trimCount} finitions traitées`);
    }
  }

  console.log(`✅ ${trimCount} finitions créées`);
  console.log(`✅ ${specValueCount} valeurs de spécification créées`);

  console.log("\n✨ Import terminé avec succès!");

  // Afficher un résumé
  const totalGens = await prisma.carGenerationFR.count();
  const totalTrims = await prisma.carTrimFR.count();
  console.log(`\n📊 Résumé de la base de données:`);
  console.log(`   - Types: ${typeMap.size}`);
  console.log(`   - Marques: ${makeMap.size}`);
  console.log(`   - Modèles: ${modelMap.size}`);
  console.log(`   - Générations: ${totalGens}`);
  console.log(`   - Finitions: ${totalTrims}`);
}

import path from "node:path";
const filePath = process.argv[2] || path.join(__dirname, "..", "data", "Car2DB_fra_cut.xlsx");

importCarData(filePath)
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
