import { NextRequest, NextResponse } from "next/server";
import { getCachedSession } from "@/lib/cached-session";
import { generateObject } from "ai";
import { z } from "zod";
import { getOllamaModel } from "@/lib/ai/ollama";

const TopicsSchema = z.object({
  topics: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string()),
        sourceUrls: z.array(z.string()),
      })
    )
    .min(3)
    .max(10),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getCachedSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { articles } = body as {
      articles: { title: string; text: string; url?: string }[];
    };

    if (!Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(
        { error: "articles array is required" },
        { status: 400 }
      );
    }

    const articlesContext = articles
      .slice(0, 15)
      .map(
        (a, i) =>
          `Article ${i + 1} — ${a.title}${a.url ? ` (${a.url})` : ""}\n${a.text.slice(0, 500)}`
      )
      .join("\n\n---\n\n");

    const { object } = await generateObject({
      model: getOllamaModel(),
      schema: TopicsSchema,
      prompt: `Tu es un rédacteur en chef d'un blog automobile francophone.

Voici des articles récents issus de sites automobiles :

${articlesContext}

Génère entre 5 et 10 sujets d'articles originaux pour notre blog automobile francophone.
Pour chaque sujet, fournis :
- un titre accrocheur
- une description courte (2-3 phrases) expliquant l'angle éditorial
- 3-5 mots-clés SEO
- les URLs des articles sources qui ont inspiré ce sujet (peut être vide)

Les sujets doivent être variés : essais, guides d'achat, actualités, conseils d'entretien, etc.`,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("Error in POST /api/admin/blog/topics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
