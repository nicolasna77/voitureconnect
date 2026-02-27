import { NextRequest, NextResponse } from "next/server";
import { getCachedSession } from "@/lib/cached-session";
import * as cheerio from "cheerio";

const MAX_ARTICLES = 30;

interface ScrapedArticle {
  url: string;
  title: string;
  text: string;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function extractArticleLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const origin = new URL(baseUrl).origin;
  const links = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    let absolute: string;
    try {
      absolute = href.startsWith("http")
        ? href
        : new URL(href, origin).toString();
    } catch {
      return;
    }

    if (!absolute.startsWith(origin)) return;

    const path = new URL(absolute).pathname;
    // Heuristic: article paths often have depth ≥ 2 and aren't just category pages
    const segments = path.split("/").filter(Boolean);
    if (segments.length >= 2) {
      links.add(absolute.split("?")[0].split("#")[0]);
    }
  });

  return Array.from(links);
}

function extractArticleContent(
  html: string,
  url: string
): ScrapedArticle | null {
  const $ = cheerio.load(html);

  const title =
    $("h1").first().text().trim() ||
    $("title").text().trim().split("|")[0].trim();

  if (!title) return null;

  // Try to extract main content
  const contentEl =
    $("article").first() ||
    $("main").first() ||
    $('[role="main"]').first() ||
    $(".article-content").first() ||
    $(".post-content").first();

  let text = contentEl.text().trim();

  if (!text || text.length < 100) {
    text = $("body").text().trim();
  }

  // Normalise whitespace
  text = text.replace(/\s+/g, " ").slice(0, 3000);

  if (text.length < 100) return null;

  return { url, title, text };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCachedSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { urls } = body as { urls: string[] };

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "urls array is required" },
        { status: 400 }
      );
    }

    const articles: ScrapedArticle[] = [];

    for (const baseUrl of urls) {
      try {
        const indexHtml = await fetchHtml(baseUrl);
        const articleLinks = extractArticleLinks(indexHtml, baseUrl);

        // Shuffle a bit and take a reasonable slice
        const candidates = articleLinks.slice(0, 50);

        for (const link of candidates) {
          if (articles.length >= MAX_ARTICLES) break;
          try {
            const html = await fetchHtml(link);
            const article = extractArticleContent(html, link);
            if (article) articles.push(article);
          } catch {
            // silently skip unreachable pages
          }
        }
      } catch {
        // silently skip unreachable base URLs
      }

      if (articles.length >= MAX_ARTICLES) break;
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error in POST /api/admin/blog/scrape:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
