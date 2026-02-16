import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const LOGOS_DIR = path.join(process.cwd(), "public", "logos");
const BASE_URL = "https://www.logo-voiture.com";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function fetchUrl(url: string): Promise<{ body: Buffer; contentType: string }> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith("http")
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        return fetchUrl(redirectUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () =>
        resolve({
          body: Buffer.concat(chunks),
          contentType: res.headers["content-type"] || "",
        })
      );
      res.on("error", reject);
    }).on("error", reject);
  });
}

function extractLogoUrl(html: string, brandName: string): string | null {
  // Look for <img> tags with src containing logo-related patterns
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  const brandSlug = slugify(brandName);
  const brandLower = brandName.toLowerCase();

  const candidates: string[] = [];

  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    const srcLower = src.toLowerCase();

    // Skip tiny icons, gravatar, etc.
    if (srcLower.includes("gravatar") || srcLower.includes("favicon")) continue;

    // Priority 1: src contains "Logo-" and brand name
    if (srcLower.includes("logo") && (srcLower.includes(brandSlug) || srcLower.includes(brandLower.replace(/\s+/g, "-")))) {
      return src;
    }

    // Priority 2: src contains "logo"
    if (srcLower.includes("logo")) {
      candidates.push(src);
    }

    // Priority 3: src in wp-content/uploads containing brand name
    if (srcLower.includes("wp-content/uploads") && (srcLower.includes(brandSlug) || srcLower.includes(brandLower.replace(/\s+/g, "-")))) {
      candidates.push(src);
    }
  }

  return candidates[0] || null;
}

function getFileExtension(url: string, contentType: string): string {
  // Try from URL first
  const urlMatch = url.match(/\.(png|jpg|jpeg|gif|svg|webp)(\?|$)/i);
  if (urlMatch) return urlMatch[1].toLowerCase();

  // Fallback to content-type
  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("svg")) return "svg";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";

  return "png"; // default
}

async function downloadLogo(brandName: string): Promise<string | null> {
  const slug = slugify(brandName);
  const pageUrl = `${BASE_URL}/${slug}/`;

  try {
    console.log(`  Fetching page: ${pageUrl}`);
    const { body: pageBody } = await fetchUrl(pageUrl);
    const html = pageBody.toString("utf-8");

    const logoUrl = extractLogoUrl(html, brandName);
    if (!logoUrl) {
      console.log(`  ⚠ No logo found on page for "${brandName}"`);
      return null;
    }

    // Resolve relative URLs
    const absoluteLogoUrl = logoUrl.startsWith("http")
      ? logoUrl
      : new URL(logoUrl, pageUrl).toString();

    console.log(`  Downloading logo: ${absoluteLogoUrl}`);
    const { body: imageBody, contentType } = await fetchUrl(absoluteLogoUrl);

    const ext = getFileExtension(absoluteLogoUrl, contentType);
    const filename = `${slug}.${ext}`;
    const filepath = path.join(LOGOS_DIR, filename);

    fs.writeFileSync(filepath, imageBody);
    console.log(`  ✓ Saved: ${filename} (${(imageBody.length / 1024).toFixed(1)} KB)`);

    return `/logos/${filename}`;
  } catch (error) {
    console.log(`  ✗ Error for "${brandName}": ${error instanceof Error ? error.message : error}`);
    return null;
  }
}

async function main() {
  // Ensure logos directory exists
  if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
    console.log(`Created directory: ${LOGOS_DIR}`);
  }

  // Get all unique brand names from CarMakeFR
  const brandsFR = await prisma.carMakeFR.findMany({
    select: { id_car_make: true, name: true },
    orderBy: { name: "asc" },
  });

  // Deduplicate by name (multiple entries per car type)
  const uniqueBrands = new Map<string, number[]>();
  for (const brand of brandsFR) {
    const existing = uniqueBrands.get(brand.name) || [];
    existing.push(brand.id_car_make);
    uniqueBrands.set(brand.name, existing);
  }

  console.log(`Found ${uniqueBrands.size} unique brands to process\n`);

  let success = 0;
  let failed = 0;

  for (const [brandName, ids] of uniqueBrands) {
    console.log(`[${success + failed + 1}/${uniqueBrands.size}] Processing: ${brandName}`);

    const logoPath = await downloadLogo(brandName);

    if (logoPath) {
      // Update all CarMakeFR entries with this name
      await prisma.carMakeFR.updateMany({
        where: { name: brandName },
        data: { logo_url: logoPath },
      });

      // Update all CarMakeEN entries with this name
      await prisma.carMakeEN.updateMany({
        where: { name: brandName },
        data: { logo_url: logoPath },
      });

      success++;
    } else {
      failed++;
    }

    // Small delay to be polite to the server
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n--- Done ---`);
  console.log(`Success: ${success}/${uniqueBrands.size}`);
  console.log(`Failed: ${failed}/${uniqueBrands.size}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  prisma.$disconnect();
  process.exit(1);
});
