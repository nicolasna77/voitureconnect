import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const maxDuration = 60;

const BASE_URL = "https://www.logo-voiture.com";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function fetchUrl(url: string): Promise<{ body: Buffer; contentType: string }> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    body: Buffer.from(arrayBuffer),
    contentType: response.headers.get("content-type") || "",
  };
}

function extractLogoUrl(html: string, brandName: string): string | null {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  const brandSlug = slugify(brandName);
  const brandLower = brandName.toLowerCase();

  const candidates: string[] = [];

  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    const srcLower = src.toLowerCase();

    if (srcLower.includes("gravatar") || srcLower.includes("favicon")) continue;

    if (srcLower.includes("logo") && (srcLower.includes(brandSlug) || srcLower.includes(brandLower.replace(/\s+/g, "-")))) {
      return src;
    }

    if (srcLower.includes("logo")) {
      candidates.push(src);
    }

    if (srcLower.includes("wp-content/uploads") && (srcLower.includes(brandSlug) || srcLower.includes(brandLower.replace(/\s+/g, "-")))) {
      candidates.push(src);
    }
  }

  return candidates[0] || null;
}

function getFileExtension(url: string, contentType: string): string {
  const urlMatch = url.match(/\.(png|jpg|jpeg|gif|svg|webp)(\?|$)/i);
  if (urlMatch) return urlMatch[1].toLowerCase();

  if (contentType.includes("png")) return "png";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  if (contentType.includes("svg")) return "svg";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";

  return "png";
}

async function downloadAndUploadLogo(brandName: string): Promise<{ url: string | null; error?: string }> {
  const slug = slugify(brandName);
  const pageUrl = `${BASE_URL}/${slug}/`;

  try {
    const { body: pageBody } = await fetchUrl(pageUrl);
    const html = pageBody.toString("utf-8");

    const logoUrl = extractLogoUrl(html, brandName);
    if (!logoUrl) {
      return { url: null, error: "No logo found on page" };
    }

    const absoluteLogoUrl = logoUrl.startsWith("http")
      ? logoUrl
      : new URL(logoUrl, pageUrl).toString();

    const { body: imageBody, contentType } = await fetchUrl(absoluteLogoUrl);
    const ext = getFileExtension(absoluteLogoUrl, contentType);
    const filename = `logos/${slug}.${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, imageBody, {
      access: "public",
      contentType: contentType || `image/${ext}`,
    });

    return { url: blob.url };
  } catch (error) {
    return { url: null, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "list": {
        const brandsFR = await prisma.carMakeFR.findMany({
          select: { name: true },
          orderBy: { name: "asc" },
        });

        const uniqueBrands = [...new Set(brandsFR.map((b) => b.name))];
        return NextResponse.json({ brands: uniqueBrands, total: uniqueBrands.length });
      }

      case "download-batch": {
        const { brands } = body as { brands: string[] };
        if (!brands || !Array.isArray(brands)) {
          return NextResponse.json({ error: "brands array required" }, { status: 400 });
        }

        const results: { brand: string; url: string | null; error?: string }[] = [];

        for (const brandName of brands) {
          const result = await downloadAndUploadLogo(brandName);

          if (result.url) {
            // Update FR and EN tables
            await prisma.carMakeFR.updateMany({
              where: { name: brandName },
              data: { logo_url: result.url },
            });
            await prisma.carMakeEN.updateMany({
              where: { name: brandName },
              data: { logo_url: result.url },
            });
          }

          results.push({ brand: brandName, ...result });

          // Small delay between brands
          await new Promise((r) => setTimeout(r, 300));
        }

        return NextResponse.json({ results });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("[DOWNLOAD_LOGOS]", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
