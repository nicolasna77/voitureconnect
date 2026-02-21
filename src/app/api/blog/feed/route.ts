import prisma from "@/prisma";
import { BlogPostStatus } from "@prisma/client";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { status: BlogPostStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: { author: { select: { name: true } } },
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://voitureconnect.fr";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VoitureConnect Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Articles et actualités automobiles</description>
    <language>fr</language>
    <atom:link href="${baseUrl}/api/blog/feed" rel="self" type="application/rss+xml" />
    ${posts
      .map(
        (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <description><![CDATA[${p.excerpt ?? ""}]]></description>
      <pubDate>${p.publishedAt?.toUTCString() ?? ""}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${p.slug}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
