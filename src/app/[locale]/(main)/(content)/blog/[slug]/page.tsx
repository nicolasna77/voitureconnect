import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/prisma";
import { BlogPostStatus } from "@prisma/client";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import sanitizeHtml from "sanitize-html";

export const revalidate = 3600; // revalidate every hour
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { status: BlogPostStatus.PUBLISHED },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string; locale: string }> };

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: BlogPostStatus.PUBLISHED },
    include: {
      author: { select: { name: true, picture: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | VoitureConnect`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;

  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(
        locale === "fr" ? "fr-FR" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: post.author.name },
    image: post.coverImage ?? undefined,
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4 text-balance">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4" aria-hidden="true" />
          {post.author.name}
        </div>
        {publishedDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" aria-hidden="true" />
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
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption"]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ["src", "alt", "width", "height", "loading"],
            "*": ["class"],
          },
        }) }}
      />
    </div>
  );
}
