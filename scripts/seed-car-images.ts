/**
 * seed-car-images.ts v5
 *
 * Sources d'images (par ordre de priorité) :
 *  1. Wikipedia direct lookup → infobox photo  (article spécifique à la génération)
 *  2. Wikimedia Commons search + année         (photos year-specific)
 *  3. Wikipedia listing photo                  (fallback généraliste)
 *
 * Améliorations v5 :
 *  - Normalisation du nom de modèle ("2 CV" → essaie aussi "2CV")
 *  - Wikimedia Commons comme 2e source (recherche par année)
 *  - Déduplication par modèle (une URL ≠ deux générations)
 *  - Score par année dans les noms de fichiers
 *
 * Usage :
 *   npx tsx scripts/seed-car-images.ts
 *   npx tsx scripts/seed-car-images.ts --limit=20
 *   npx tsx scripts/seed-car-images.ts --overwrite
 *   npx tsx scripts/seed-car-images.ts --lang=en
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// ── Prisma ────────────────────────────────────────────────────────────────────

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not defined");
const adapter = new PrismaPg({ connectionString });
const prisma  = new PrismaClient({ adapter });

// ── CLI ───────────────────────────────────────────────────────────────────────

const args      = process.argv.slice(2);
const LIMIT     = (() => { const f = args.find((a) => a.startsWith("--limit=")); return f ? parseInt(f.split("=")[1], 10) : Infinity; })();
const OVERWRITE = args.includes("--overwrite");
const LANG      = args.find((a) => a.startsWith("--lang="))?.split("=")[1] ?? "fr";

const WIKI_EN   = "https://en.wikipedia.org/w/api.php";
const WIKI_FR   = "https://fr.wikipedia.org/w/api.php";
const COMMONS   = "https://commons.wikimedia.org/w/api.php";

const DELAY_MS  = 600;
const UA        = "DriveMetric/1.0 (car-image-seeder)";

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function wikiGet(base: string, params: Record<string, string>): Promise<unknown> {
  const u = new URL(base);
  u.searchParams.set("format", "json");
  u.searchParams.set("origin", "*");
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const r = await fetch(u.toString(), {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SKIP = /logo|icon|badge|flag|coat|seal|symbol|emblem|map|sign|blank|silhouet|schema|diagram|schéma/i;

/** Nettoie le nom de génération (supprime brackets, "génération", etc.) */
function cleanGen(raw: string): string {
  return raw
    .replace(/\[.*?\]/g, "")
    .replace(/\b(génération|generation|gen\.?)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isGenericGen(s: string): boolean {
  return /^[IVXLCDM\d\s]*$/.test(s) || s === "";
}

/** Extrait le numéro de génération depuis "1 génération", "2 génération", etc. */
function extractGenNumber(gen: string): number | null {
  const m = gen.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/** Convertit un entier (1-10) en chiffre romain */
function toRoman(n: number): string {
  const map: [number, string][] = [
    [10, "X"], [9, "IX"], [8, "VIII"], [7, "VII"], [6, "VI"],
    [5, "V"],  [4, "IV"], [3, "III"],  [2, "II"],  [1, "I"],
  ];
  let r = "";
  for (const [v, s] of map) { while (n >= v) { r += s; n -= v; } }
  return r;
}

/**
 * Produit des variantes normalisées du nom de modèle.
 * "2 CV" → ["2 CV", "2CV"]   "C3" → ["C3"]
 */
function modelVariants(model: string): string[] {
  const base = model.trim();
  const noInternalSpaces = base.replace(/(\d)\s+([A-Za-z])/g, "$1$2").replace(/([A-Za-z])\s+(\d)/g, "$1$2");
  return noInternalSpaces !== base ? [base, noInternalSpaces] : [base];
}

// ── Candidates pour la recherche Wikipedia ────────────────────────────────────

function buildCandidates(make: string, model: string, gen: string, year?: string | null): string[] {
  const y       = year?.replace("NULL", "").trim();
  const cGen    = cleanGen(gen);
  const generic = isGenericGen(cGen);
  const models  = modelVariants(model);
  const candidates: string[] = [];

  // 1. Cas où le gen apporte une info réelle (ex: "Clio V", "Sahara", "BX Sport")
  if (!generic && cGen.toLowerCase() !== model.toLowerCase()) {
    const genHasModel = cGen.toLowerCase().includes(model.toLowerCase());
    for (const m of models) {
      if (genHasModel) {
        candidates.push(`${make} ${cGen}`);
        if (y) candidates.push(`${make} ${cGen} ${y}`);
      } else {
        candidates.push(`${make} ${m} ${cGen}`);
        if (y) candidates.push(`${make} ${m} ${cGen} ${y}`);
        candidates.push(`${make} ${cGen}`);
      }
    }
  }

  // 2. Article spécifique à la génération via chiffre romain ("Citroën C3 I", "Citroën C3 II")
  const genNum = extractGenNumber(gen);
  if (genNum && genNum <= 10) {
    const roman = toRoman(genNum);
    for (const m of models) {
      candidates.push(`${make} ${m} ${roman}`);
    }
  }

  // 3. Fallback modèle seul
  for (const m of models) {
    if (y) candidates.push(`${make} ${m} ${y}`);
    candidates.push(`${make} ${m}`);
  }

  return [...new Set(candidates)];
}

// ── Normalisation pour comparaison (supprime accents + espaces internes) ──────

/** "Citroën 2CV" → "citroen 2cv"  |  "2 CV" → "2 cv" */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Vérifie que le titre Wikipedia correspond à la marque ET au modèle. */
function titleMatchesCar(title: string, make: string, model: string): boolean {
  const t = norm(title);
  const makeN = norm(make);
  // Toutes les variantes du modèle (avec/sans espace interne) normalisées
  const modelNorms = modelVariants(model).map(norm);
  return t.includes(makeN) && modelNorms.some((m) => t.includes(m));
}

// ── Wikipedia : lookup direct ─────────────────────────────────────────────────

async function directLookup(
  title: string,
  make: string,
  model: string,
  apiBase: string
): Promise<string | null> {
  try {
    const json = await wikiGet(apiBase, {
      action: "query",
      titles: title,
      redirects: "1",
    }) as { query?: { pages?: Record<string, { title: string; missing?: string }> } };

    const page = Object.values(json?.query?.pages ?? {})[0];
    if (!page || "missing" in page) return null;
    if (titleMatchesCar(page.title, make, model)) return page.title;
  } catch { /* fall through */ }
  return null;
}

// ── Wikipedia : recherche texte avec validation marque + modèle ───────────────

async function searchTitle(
  query: string,
  make: string,
  model: string,
  apiBase: string
): Promise<string | null> {
  try {
    const json = await wikiGet(apiBase, {
      action: "query",
      list: "search",
      srsearch: query,
      srlimit: "8",
    }) as { query?: { search?: { title: string }[] } };

    for (const r of json?.query?.search ?? []) {
      if (titleMatchesCar(r.title, make, model)) return r.title;
    }
  } catch { /* fall through */ }
  return null;
}

async function findWikiTitle(
  make: string,
  model: string,
  gen: string,
  year: string | null | undefined,
  apiBase: string
): Promise<string | null> {
  const candidates = buildCandidates(make, model, gen, year);

  // 1. Direct lookup sur les 2 premiers candidats
  for (const c of candidates.slice(0, 2)) {
    const title = await directLookup(c, make, model, apiBase);
    if (title) return title;
    await sleep(100);
  }

  // 2. Recherche texte sur tous les candidats (avec validation marque + modèle)
  for (const c of candidates) {
    const title = await searchTitle(c, make, model, apiBase);
    if (title) return title;
    await sleep(150);
  }

  return null;
}

// ── Wikipedia : infobox photo ─────────────────────────────────────────────────

async function infoboxPhoto(title: string, apiBase: string): Promise<string | null> {
  try {
    const json = await wikiGet(apiBase, {
      action: "query",
      titles: title,
      prop: "pageimages",
      pithumbsize: "800",
      pilimit: "1",
    }) as { query?: { pages?: Record<string, { thumbnail?: { source: string; width: number } }> } };

    const thumb = Object.values(json?.query?.pages ?? {})[0]?.thumbnail;
    if (thumb && thumb.width >= 300) return thumb.source;
  } catch { /* fall through */ }
  return null;
}

// ── Wikimedia Commons : recherche par année ───────────────────────────────────

async function commonsPhoto(
  make: string,
  model: string,
  year: string | null | undefined,
  usedUrls: Set<string>
): Promise<string | null> {
  const cleanYear = year?.replace("NULL", "").trim();
  const models    = modelVariants(model);

  // Requêtes par ordre de précision (avec année d'abord)
  const queries: string[] = [];
  for (const m of models) {
    if (cleanYear) queries.push(`${make} ${m} ${cleanYear}`);
    queries.push(`${make} ${m}`);
  }

  for (const q of [...new Set(queries)]) {
    try {
      const searchJson = await wikiGet(COMMONS, {
        action: "query",
        list: "search",
        srsearch: q,
        srnamespace: "6",   // namespace File uniquement
        srlimit: "10",
      }) as { query?: { search?: { title: string }[] } };

      const files = (searchJson?.query?.search ?? [])
        .map((r) => r.title.replace(/^File:/i, ""))
        .filter((f) => /\.(jpe?g|webp|png)$/i.test(f) && !SKIP.test(f));

      // Score : préfère les fichiers contenant l'année
      const scored = files.map((f) => ({
        file: f,
        score: cleanYear && f.includes(cleanYear) ? 1 : 0,
      }));
      scored.sort((a, b) => b.score - a.score);

      for (const { file } of scored.slice(0, 6)) {
        try {
          const infoJson = await wikiGet(COMMONS, {
            action: "query",
            titles: `File:${file}`,
            prop: "imageinfo",
            iiprop: "url|dimensions",
            iiurlwidth: "640",
          }) as { query?: { pages?: Record<string, { imageinfo?: { thumburl: string; width: number }[] }> } };

          const info = Object.values(infoJson?.query?.pages ?? {})[0]?.imageinfo?.[0];
          if (info?.thumburl && info.width >= 350 && !usedUrls.has(info.thumburl)) {
            return info.thumburl;
          }
        } catch { /* try next */ }
        await sleep(100);
      }
    } catch { /* try next query */ }
    await sleep(150);
  }

  return null;
}

// ── Wikipedia : listing photo (fallback) ─────────────────────────────────────

async function listingPhoto(
  title: string,
  apiBase: string,
  year?: string | null,
  usedUrls?: Set<string>
): Promise<string | null> {
  try {
    const listJson = await wikiGet(apiBase, {
      action: "query",
      titles: title,
      prop: "images",
      imlimit: "40",
    }) as { query?: { pages?: Record<string, { images?: { title: string }[] }> } };

    const page  = Object.values(listJson?.query?.pages ?? {})[0];
    const files = (page?.images ?? [])
      .map((i) => i.title.replace(/^File:/i, ""))
      .filter((f) => /\.(jpe?g|webp|png)$/i.test(f) && !SKIP.test(f));

    if (files.length === 0) return null;

    const cleanYear = year?.replace("NULL", "").trim();
    const scored = files.map((f) => ({
      file: f,
      score: cleanYear && f.includes(cleanYear) ? 1 : 0,
    }));
    scored.sort((a, b) => b.score - a.score);

    for (const { file } of scored.slice(0, 8)) {
      try {
        const infoJson = await wikiGet(apiBase, {
          action: "query",
          titles: `File:${file}`,
          prop: "imageinfo",
          iiprop: "url|dimensions",
          iiurlwidth: "640",
        }) as { query?: { pages?: Record<string, { imageinfo?: { thumburl: string; width: number }[] }> } };

        const info = Object.values(infoJson?.query?.pages ?? {})[0]?.imageinfo?.[0];
        if (info?.thumburl && info.width >= 350) {
          if (usedUrls?.has(info.thumburl)) continue;
          return info.thumburl;
        }
      } catch { /* try next */ }
      await sleep(150);
    }
  } catch { /* fall through */ }
  return null;
}

// ── Orchestrator ──────────────────────────────────────────────────────────────

async function getPhoto(
  make: string,
  model: string,
  gen: string,
  year: string | null | undefined,
  usedUrls: Set<string>
): Promise<{ url: string; method: string } | null> {
  const cleanYear = year?.replace("NULL", "").trim();

  // ── Étape 1 : Commons avec année (plus précis pour différencier les générations)
  if (cleanYear) {
    const commons = await commonsPhoto(make, model, year, usedUrls);
    if (commons) return { url: commons, method: `commons:${make} ${model} ${cleanYear}` };
    await sleep(200);
  }

  // ── Étape 2 : Wikipedia infobox (article le plus spécifique trouvé)
  for (const [lang, apiBase] of [["en", WIKI_EN], ["fr", WIKI_FR]] as const) {
    const title = await findWikiTitle(make, model, gen, year, apiBase);
    if (!title) continue;
    await sleep(200);
    const infobox = await infoboxPhoto(title, apiBase);
    if (infobox && !usedUrls.has(infobox)) {
      return { url: infobox, method: `infobox(${lang}):${title}` };
    }
    await sleep(200);
  }

  // ── Étape 3 : Commons sans année (fallback)
  if (!cleanYear) {
    const commons = await commonsPhoto(make, model, year, usedUrls);
    if (commons) return { url: commons, method: `commons:${make} ${model}` };
    await sleep(200);
  }

  // ── Étape 4 : Wikipedia listing (dernier recours)
  for (const [lang, apiBase] of [["en", WIKI_EN], ["fr", WIKI_FR]] as const) {
    const title = await findWikiTitle(make, model, gen, year, apiBase);
    if (!title) continue;
    const listing = await listingPhoto(title, apiBase, year, usedUrls);
    if (listing) return { url: listing, method: `listing(${lang}):${title}` };
    await sleep(200);
  }

  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const isFR    = LANG === "fr";
  const dbModel = isFR ? prisma.carGenerationFR : prisma.carGenerationEN;
  const where   = OVERWRITE ? {} : { image_url: null };

  const total = await (dbModel as typeof prisma.carGenerationFR).count({ where });
  const cap   = isFinite(LIMIT) ? Math.min(total, LIMIT) : total;

  console.log(`\n🚗  seed-car-images v5 [lang=${LANG}] [overwrite=${OVERWRITE}]`);
  console.log(`   Sans image   : ${total}`);
  console.log(`   À traiter    : ${cap}\n`);

  const rows = await (dbModel as typeof prisma.carGenerationFR).findMany({
    where,
    include: { carModel: { include: { carMake: true } } },
    take: isFinite(LIMIT) ? LIMIT : undefined,
    orderBy: [
      { carModel: { carMake: { name: "asc" } } },
      { carModel: { name: "asc" } },
      { year_begin: "asc" },
    ],
  });

  const usedPerModel = new Map<string, Set<string>>();

  let ok = 0, nope = 0;

  for (let i = 0; i < rows.length; i++) {
    const row   = rows[i];
    const make  = row.carModel.carMake.name;
    const model = row.carModel.name;
    const gen   = row.name;
    const year  = row.year_begin;

    const modelKey = `${make}|${model}`;
    if (!usedPerModel.has(modelKey)) usedPerModel.set(modelKey, new Set());
    const usedUrls = usedPerModel.get(modelKey)!;

    process.stdout.write(`[${i + 1}/${rows.length}] ${make} ${model} — ${gen} (${year ?? "?"}) … `);

    const result = await getPhoto(make, model, gen, year, usedUrls);

    if (result) {
      await (dbModel as typeof prisma.carGenerationFR).update({
        where: { id_car_generation: row.id_car_generation },
        data: { image_url: result.url },
      });
      usedUrls.add(result.url);
      console.log(`✅  [${result.method}]`);
      ok++;
    } else {
      console.log("❌  not found");
      nope++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n─────────────────────────────`);
  console.log(`✅  Trouvé      : ${ok}`);
  console.log(`❌  Introuvable : ${nope}`);
  console.log(`─────────────────────────────\n`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
