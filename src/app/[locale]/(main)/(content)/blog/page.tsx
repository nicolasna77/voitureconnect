import prisma from "@/prisma";
import { BlogPostStatus } from "@prisma/client";
import { BlogCard } from "@/components/blog/blog-card";

export const revalidate = 3600; // revalidate every hour

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const posts = await prisma.blogPost.findMany({
    where: { status: BlogPostStatus.PUBLISHED },
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
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">
        Actualités, guides et conseils sur l&apos;automobile
      </p>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          Aucun article publié pour l&apos;instant.
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
