import { notFound } from "next/navigation";
import prisma from "@/prisma";
import { BlogPostStatus } from "@prisma/client";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const revalidate = 3600; // revalidate every hour
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: BlogPostStatus.PUBLISHED },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, status: BlogPostStatus.PUBLISHED },
    include: {
      author: { select: { name: true, picture: true } },
    },
  });

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(
        locale === "fr" ? "fr-FR" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-64 sm:h-80 w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {post.author.name}
        </div>
        {publishedDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {publishedDate}
          </div>
        )}
      </div>

      {post.excerpt && (
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {post.excerpt}
        </p>
      )}

      <Separator className="mb-8" />

      {/* Article content — rendered as HTML from Tiptap */}
      <article
        className="prose prose-sm sm:prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
