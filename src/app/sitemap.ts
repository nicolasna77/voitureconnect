import { MetadataRoute } from "next";
import prisma from "@/prisma";
import { BlogPostStatus } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://voitureconnect.fr";

  const [posts, generations] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: BlogPostStatus.PUBLISHED },
      select: { slug: true, updatedAt: true },
    }),
    prisma.carGenerationFR.findMany({
      select: { id_car_generation: true },
      take: 5000,
    }),
  ]);

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...generations.map((g) => ({
      url: `${baseUrl}/specification/${g.id_car_generation}`,
      lastModified: new Date(),
    })),
  ];
}
