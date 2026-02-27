/**
 * scrape-prices.ts
 *
 * Récupère les prix neufs (prix catalogue) depuis AutoScout24
 * en cherchant des véhicules quasi-neufs (< 500 km, immatriculés depuis 2023).
 * Le prix minimum trouvé est enregistré comme `price_new` sur la génération.
 *
 * Usage :
 *   npx tsx scripts/scrape-prices.ts                     # toutes les générations sans price_new
 *   npx tsx scripts/scrape-prices.ts --make=Peugeot      # une seule marque
 *   npx tsx scripts/scrape-prices.ts --model=308         # un seul modèle
 *   npx tsx scripts/scrape-prices.ts --overwrite         # réécrit les prix déjà renseignés
 *   npx tsx scripts/scrape-prices.ts --lang=en           # table EN (défaut : fr)
 *   npx tsx scripts/scrape-prices.ts --dry-run           # affiche sans écrire
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
const LIMIT     = (() => { const f = args.find(a => a.startsWith("--limit=")); return f ? parseInt(f.split("=")[1], 10) : Infinity; })();
const OVERWRITE = args.includes("--overwrite");
const DRY_RUN   = args.includes("--dry-run");
const LANG      = args.find(a => a.startsWith("--lang="))?.split("=")[1] ?? "fr";
const MAKE_FILTER  = args.find(a => a.startsWith("--make="))?.split("=")[1]?.toLowerCase();
const MODEL_FILTER = args.find(a => a.startsWith("--model="))?.split("=")[1]?.toLowerCase();

const DELAY_MS = 2000; // délai poli entre requêtes
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// ── Slug AutoScout24 ──────────────────────────────────────────────────────────

// Correspondances connues pour les cas particuliers (AS24 utilise son propre slug)
const MAKE_OVERRIDES: Record<string, string> = {
  "mercedes-benz": "mercedes-benz",
  "mercedes":      "mercedes-benz",
  "vw":            "volkswagen",
  "alfa romeo":    "alfa-romeo",
  "land rover":    "land-rover",
  "aston martin":  "aston-martin",
  "rolls-royce":   "rolls-royce",
  "ds automobiles":"ds",
};

const MODEL_OVERRIDES: Record<string, string> = {
  // BMW
  "serie 1": "1er", "série 1": "1er",
  "serie 2": "2er", "série 2": "2er",
  "serie 3": "3er", "série 3": "3er",
  "serie 4": "4er", "série 4": "4er",
  "serie 5": "5er", "série 5": "5er",
  "serie 7": "7er", "série 7": "7er",
  // Mercedes
  "classe a": "a-klasse",
  "classe b": "b-klasse",
  "classe c": "c-klasse",
  "classe e": "e-klasse",
  "classe s": "s-klasse",
  "classe g": "g-klasse",
  // Autres
  "polo gti": "polo",
};

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function makeSlug(make: string): string {
  const lower = make.toLowerCase();
  return MAKE_OVERRIDES[lower] ?? toSlug(make);
}

function modelSlug(model: string): string {
  const lower = model.toLowerCase();
  return MODEL_OVERRIDES[lower] ?? toSlug(model);
}

// ── Scraping AutoScout24 ──────────────────────────────────────────────────────

interface AS24Listing {
  price?: number | { priceFormatted?: string };
  prices?: { public?: number };
  tracking?: { price?: number };
}

function parseAS24Price(listing: AS24Listing): number | null {
  const p = listing?.price;
  if (typeof p === "number") return p;
  if (typeof p === "object" && p?.priceFormatted) {
    // "€ 14 256" → 14256
    const n = parseInt(p.priceFormatted.replace(/[^\d]/g, ""), 10);
    return isNaN(n) ? null : n;
  }
  const fallback = listing?.prices?.public ?? listing?.tracking?.price;
  return typeof fallback === "number" ? fallback : null;
}

const DEBUG = args.includes("--debug");

async function doFetch(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9",
        "Cache-Control": "no-cache",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (DEBUG) console.log(`   [debug] ${res.status} ${url}`);
    if (!res.ok) return null;
    return res.text();
  } catch (e) {
    if (DEBUG) console.log(`   [debug] fetch error: ${e}`);
    return null;
  }
}

function extractPrices(html: string): number[] {
  // Extrait __NEXT_DATA__
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) {
    if (DEBUG) console.log(`   [debug] __NEXT_DATA__ absent. HTML début:\n${html.slice(0, 600)}`);
    return [];
  }

  let nextData: Record<string, unknown>;
  try { nextData = JSON.parse(match[1]); }
  catch { return []; }

  const pageProps = (nextData?.props as Record<string, unknown>)?.pageProps as Record<string, unknown> | undefined;
  if (DEBUG) console.log(`   [debug] pageProps keys: [${Object.keys(pageProps ?? {}).join(", ")}]`);
  if (DEBUG) console.log(`   [debug] numberOfResults: ${(pageProps as Record<string,unknown>)?.numberOfResults}`);
  if (DEBUG) console.log(`   [debug] listings raw: ${JSON.stringify((pageProps as Record<string,unknown>)?.listings).slice(0, 600)}`);

  const rawListings = (pageProps as Record<string, unknown>)?.listings;

  const listings: AS24Listing[] =
    (Array.isArray(rawListings) ? rawListings : null) ??
    (rawListings as { data?: AS24Listing[] })?.data ??
    (pageProps?.searchResults as { listings?: AS24Listing[] })?.listings ??
    (pageProps?.data as { listings?: AS24Listing[] })?.listings ??
    (pageProps?.initialState as { listings?: AS24Listing[] })?.listings ??
    [];

  if (DEBUG) console.log(`   [debug] listings trouvés: ${listings.length}`);
  if (listings.length > 0 && DEBUG) {
    console.log(`   [debug] 1er listing keys: [${Object.keys(listings[0]).join(", ")}]`);
    console.log(`   [debug] 1er listing: ${JSON.stringify(listings[0]).slice(0, 400)}`);
  }

  if (listings.length > 0) {
    return listings
      .map(l => parseAS24Price(l))
      .filter((p): p is number => p !== null && p > 2_000 && p < 300_000);
  }

  // Fallback : regex sur le JSON brut pour trouver des champs "price"
  const rawJson = match[1];
  const priceMatches = [...rawJson.matchAll(/"price"\s*:\s*(\d+)/g)];
  if (DEBUG) console.log(`   [debug] regex "price" matches: ${priceMatches.length}`);
  return priceMatches
    .map(m => parseInt(m[1], 10))
    .filter(p => p > 2_000 && p < 300_000);
}

async function fetchMinPriceAS24(make: string, model: string): Promise<number | null> {
  const mSlug  = makeSlug(make);
  const moSlug = modelSlug(model);

  const url = `https://www.autoscout24.fr/lst/${mSlug}/${moSlug}?atype=C&kmto=500&fregfrom=2023&sort=price&desc=0`;
  const html = await doFetch(url);
  if (!html) return null;

  const prices = extractPrices(html).sort((a, b) => a - b);
  return prices[0] ?? null;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const isFR  = LANG !== "en";
  const Model = isFR ? prisma.carGenerationFR : prisma.carGenerationEN;
  const where = OVERWRITE ? {} : { price_new: null };

  // Récupère toutes les générations sans price_new, groupées par marque+modèle
  const generations = await (Model as typeof prisma.carGenerationFR).findMany({
    where,
    include: { carModel: { include: { carMake: true } } },
    orderBy: [
      { carModel: { carMake: { name: "asc" } } },
      { carModel: { name: "asc" } },
    ],
  });

  // Filtre CLI
  const filtered = generations.filter(g => {
    const make  = g.carModel?.carMake?.name?.toLowerCase() ?? "";
    const model = g.carModel?.name?.toLowerCase() ?? "";
    if (MAKE_FILTER  && !make.includes(MAKE_FILTER))   return false;
    if (MODEL_FILTER && !model.includes(MODEL_FILTER)) return false;
    return true;
  });

  console.log(`\n💶  scrape-prices [lang=${LANG}] [overwrite=${OVERWRITE}] [dry-run=${DRY_RUN}]`);
  console.log(`   Générations à traiter : ${filtered.length}`);

  if (!filtered.length) {
    console.log("   Rien à faire.\n");
    return;
  }

  // Grouper par marque + modèle pour ne scraper AS24 qu'une fois par modèle
  const groups = new Map<string, { make: string; model: string; ids: number[] }>();
  for (const g of filtered) {
    const make  = g.carModel?.carMake?.name ?? "";
    const model = g.carModel?.name ?? "";
    const key   = `${make}__${model}`;
    if (!groups.has(key)) groups.set(key, { make, model, ids: [] });
    groups.get(key)!.ids.push(g.id_car_generation);
  }

  let ok = 0, nope = 0, processed = 0;

  for (const { make, model, ids } of groups.values()) {
    if (processed >= LIMIT) break;

    process.stdout.write(`   🔍  ${make} ${model} … `);

    const price = await fetchMinPriceAS24(make, model);
    await sleep(DELAY_MS);

    if (!price) {
      console.log("❌  non trouvé");
      nope++;
      continue;
    }

    const priceK = Math.round(price / 100) * 100; // arrondi à la centaine
    console.log(`✅  ${priceK.toLocaleString("fr-FR")} € (${ids.length} génération${ids.length > 1 ? "s" : ""})`);

    if (!DRY_RUN) {
      await (Model as typeof prisma.carGenerationFR).updateMany({
        where: { id_car_generation: { in: ids } },
        data:  { price_new: priceK },
      });
    }

    ok++;
    processed += ids.length;
  }

  console.log(`\n   ✅ Mis à jour  : ${ok} modèles`);
  console.log(`   ❌ Non trouvés : ${nope} modèles\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
