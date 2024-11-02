import { PrismaClient, Prisma } from "@prisma/client";
import { parse } from "csv-parse";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// Configuration des tables avec leurs dépendances
const tableConfig = {
  car_type: {
    requiredFields: ["id_car_type", "name", "date_create"],
    dependencies: [],
  },
  car_make: {
    requiredFields: ["id_car_make", "name", "date_create", "id_car_type"],
    dependencies: ["car_type"],
  },
  car_model: {
    requiredFields: [
      "id_car_model",
      "name",
      "date_create",
      "id_car_make",
      "id_car_type",
    ],
    dependencies: ["car_make", "car_type"],
  },
  // ... autres configurations
};

async function readCSVFile(filePath: string): Promise<any[]> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          delimiter: ",",
          quote: "'",
          escape: "'",
          relax_column_count: false,
          columns: true,
          skip_empty_lines: true,
          trim: true,
          relax_quotes: true,
          on_record: (record) => {
            const cleanedRecord: any = {};
            Object.entries(record).forEach(([key, value]) => {
              // Nettoyer les clés et les valeurs
              const cleanKey = key.replace(/^['"]|['"]$/g, "").trim();
              let cleanValue = String(value)
                .replace(/^['"]|['"]$/g, "")
                .trim();
              cleanValue = cleanValue === "NULL" ? null : cleanValue;
              cleanedRecord[cleanKey] = cleanValue;
            });
            return cleanedRecord;
          },
        },
        (err, records) => {
          if (err) reject(err);
          else resolve(records);
        }
      );
    });
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return [];
  }
}

// Constantes globales
const BATCH_SIZE = 500; // Augmentation de la taille du lot
const CONCURRENT_BATCHES = 3; // Nombre de lots traités simultanément

// Cache pour les vérifications de dépendances
const dependencyCache = new Map<string, boolean>();

// Optimisation de insertBatch
async function insertBatch(
  schema: string,
  table: string,
  records: any[]
): Promise<void> {
  try {
    if (!records?.length) return;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const cleanedRecords = records.map((record) => ({
      ...record,
      date_create: record.date_create || currentTimestamp,
    }));

    // Traitement parallèle des lots
    const batches = [];
    for (let i = 0; i < cleanedRecords.length; i += BATCH_SIZE) {
      batches.push(cleanedRecords.slice(i, i + BATCH_SIZE));
    }

    await Promise.all(
      batches.map(async (batch) => {
        const columns = Object.keys(batch[0]);
        const values = batch
          .map(
            (record) =>
              `(${columns
                .map((col) => {
                  const val = record[col];
                  if (!val || val === "NULL")
                    return col === "date_create" ? currentTimestamp : "NULL";
                  return col.startsWith("id_") || col === "date_create"
                    ? val
                    : `'${String(val).replace(/'/g, "''")}'`;
                })
                .join(", ")})`
          )
          .join(",\n");

        const query = `
          INSERT INTO "${schema}"."${table}" ("${columns.join('", "')}")
          VALUES ${values}
          ON CONFLICT ("${getPrimaryKey(table)}")
          DO UPDATE SET
            ${columns
              .filter((col) => col !== getPrimaryKey(table))
              .map((col) => `"${col}" = EXCLUDED."${col}"`)
              .join(",\n          ")};
        `;

        await prisma.$executeRawUnsafe(query);
      })
    );
  } catch (error) {
    console.error(`Erreur lors de l'insertion dans ${schema}.${table}:`, error);
    throw error;
  }
}

// Fonction utilitaire pour obtenir la clé primaire
function getPrimaryKey(table: string): string {
  const primaryKeys: Record<string, string> = {
    car_type: "id_car_type",
    car_make: "id_car_make",
    car_model: "id_car_model",
    car_generation: "id_car_generation",
    car_serie: "id_car_serie",
    car_trim: "id_car_trim",
    car_specification: "id_car_specification",
    car_equipment: "id_car_equipment",
    car_option: "id_car_option",
    car_specification_value: "id_car_specification_value",
    car_option_value: "id_car_option_value",
  };
  return primaryKeys[table] || "id";
}

// Modifier la fonction runSync pour gérer l'ordre des tables correctement
async function runSync() {
  try {
    console.log("Début de la synchronisation\n");

    // Définir l'ordre strict de synchronisation basé sur les dépendances
    const tableOrder = [
      "car_type", // Pas de dépendances
      "car_make", // Dépend de car_type
      "car_model", // Dépend de car_make et car_type
      "car_generation", // Dépend de car_model
      "car_serie", // Dépend de car_model et car_generation
      "car_trim", // Dépend de car_serie et car_model
      "car_specification", // Dépend de car_type
      "car_equipment", // Dépend de car_trim
      "car_option", // Dépend de car_type
      "car_specification_value", // Dépend de car_specification et car_trim
      "car_option_value", // Dépend de car_option et car_equipment
    ];

    // Synchroniser les tables dans l'ordre
    for (const table of tableOrder) {
      console.log(`\nSynchronisation de ${table}`);
      await startSync(table);

      // Attendre un peu entre chaque synchronisation pour éviter les problèmes de concurrence
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\nSynchronisation terminée avec succès");
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
  }
}

// Optimisation de startSync
async function startSync(table: string): Promise<boolean> {
  try {
    // Vérification des dépendances en parallèle
    const deps = tableConfig[table]?.dependencies || [];
    const depChecks = await Promise.all(
      deps.map(async (dep) => ({
        dep,
        exists: await checkTableHasData(dep),
      }))
    );

    const missingDeps = depChecks.filter(({ exists }) => !exists);
    if (missingDeps.length) {
      missingDeps.forEach(({ dep }) =>
        console.log(
          `Attention: La table ${dep} doit être synchronisée avant ${table}`
        )
      );
      return false;
    }

    // Lecture parallèle des fichiers
    const [frRecords, enRecords] = await Promise.all([
      readCSVFile(
        path.join(
          process.cwd(),
          "public",
          "data",
          "car2db_fr_cut",
          `${table}.csv`
        )
      ),
      readCSVFile(
        path.join(
          process.cwd(),
          "public",
          "data",
          "car2db_en_cut",
          `${table}.csv`
        )
      ),
    ]);

    // Traitement parallèle des insertions
    await Promise.all([
      frRecords.length && insertBatch("dataCarFR", table, frRecords),
      enRecords.length && insertBatch("dataCarEN", table, enRecords),
    ]);

    return true;
  } catch (error) {
    console.error(`Erreur lors de la synchronisation de ${table}:`, error);
    return false;
  }
}

// Optimisation de checkTableHasData avec cache
async function checkTableHasData(table: string): Promise<boolean> {
  const cacheKey = `${table}_hasData`;
  if (dependencyCache.has(cacheKey)) {
    return dependencyCache.get(cacheKey)!;
  }

  try {
    const result = await prisma.$queryRaw<[{ count: number }]>`
      SELECT EXISTS(
        SELECT 1 FROM "dataCarFR".${Prisma.raw(table)}
        WHERE ${Prisma.raw(getPrimaryKey(table))} IS NOT NULL
        LIMIT 1
      ) as count;
    `;

    const hasData = Boolean(result[0].count);
    dependencyCache.set(cacheKey, hasData);
    return hasData;
  } catch (error) {
    console.error(`Erreur lors de la vérification de ${table}:`, error);
    return false;
  }
}

async function validateData(
  schema: string,
  table: string,
  record: any
): Promise<boolean> {
  try {
    // Échapper les noms de colonnes qui sont des mots réservés SQL
    const reservedWords = ["type", "option", "admission", "angle"];
    const escapeColumnName = (name: string) => {
      return reservedWords.includes(name.toLowerCase()) ? `"${name}"` : name;
    };

    // Vérification des dépendances
    for (const dep of tableConfig[table]?.dependencies || []) {
      const foreignKey = `id_${dep}`;
      if (!record[foreignKey]) continue;

      const query = `
        SELECT EXISTS (
          SELECT 1 FROM "${schema}"."${dep}"
          WHERE ${escapeColumnName(`${dep}_id`)} = $1
        );
      `;

      const exists = await prisma.$queryRaw`${query}`;

      if (!exists[0].exists) {
        console.log(
          `Dépendance manquante: ${dep} avec ID ${record[foreignKey]}`
        );
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`Erreur lors de la validation:`, error);
    return false;
  }
}

async function checkTableStructure(
  schema: string,
  table: string
): Promise<void> {
  const query = `
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = '${schema}' 
    AND table_name = '${table}';
  `;

  const columns = await prisma.$queryRawUnsafe(query);
  console.log(`Structure de la table ${schema}.${table}:`, columns);
}

// Au début du fichier, ajoutez les exports nécessaires
export { runSync };
