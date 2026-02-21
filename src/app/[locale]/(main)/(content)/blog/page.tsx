import type { Metadata } from "next";
import prisma from "@/prisma";
import { BlogPostStatus } from "@prisma/client";
import { BlogCard } from "@/components/blog/blog-card";
import { Input } from "@/components/ui/input";
import { Rss } from "lucide-react";

export const revalidate = 3600; // revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog | VoitureConnect",
    description: "Articles et actualités automobiles",
    openGraph: {
      title: "Blog VoitureConnect",
      description: "Articles et actualités automobiles",
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q = "" } = await searchParams;

  const posts = await prisma.blogPost.findMany({
    where: {
      status: BlogPostStatus.PUBLISHED,
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Blog</h1>
        <a
          href="/api/blog/feed"
          title="Flux RSS"
          aria-label="S'abonner au flux RSS"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Rss className="h-5 w-5" />
        </a>
      </div>
      <p className="text-muted-foreground mb-6">
        Actualités, guides et conseils sur l&apos;automobile
      </p>

      {/* Search */}
      <form method="GET" className="mb-8">
        <Input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un article…"
          className="max-w-sm"
        />
      </form>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          {q
            ? `Aucun article trouvé pour « ${q} ».`
            : "Aucun article publié pour l'instant."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
