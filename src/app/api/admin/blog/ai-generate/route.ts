import { NextRequest } from "next/server";
import { getCachedSession } from "@/lib/cached-session";
import { streamText } from "ai";
import { getOllamaModel } from "@/lib/ai/ollama";

export async function POST(request: NextRequest) {
  const session = await getCachedSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { topic, sourceContent } = body as {
    topic: {
      title: string;
      description: string;
      keywords: string[];
    };
    sourceContent?: string;
  };

  if (!topic?.title) {
    return new Response("topic.title is required", { status: 400 });
  }

  const keywordsList = (topic.keywords ?? []).join(", ");
  const sourceSection = sourceContent
    ? `\nVoici du contenu source pour t'inspirer :\n${sourceContent.slice(0, 2000)}\n`
    : "";

  const result = streamText({
    model: getOllamaModel(),
    prompt: `Tu es un rédacteur automobile francophone expert. Rédige un article de blog complet en français sur le sujet suivant.

Sujet : ${topic.title}
Description : ${topic.description}
Mots-clés SEO : ${keywordsList}
${sourceSection}
INSTRUCTIONS STRICTES :
- Rédige uniquement du HTML valide avec des balises <h2>, <p>, <ul>, <li>, <strong> (PAS de <h1>, PAS de balise <html>/<body>)
- Longueur : environ 800 mots
- Commence directement par un <p> d'introduction, puis des sections avec <h2>
- Termine par une conclusion en <p>
- Ton professionnel mais accessible
- Ne répète pas le titre en <h1>
- N'inclus pas de balises \`\`\`html ou de délimiteurs Markdown`,
    maxOutputTokens: 2000,
  });

  return result.toTextStreamResponse();
}
