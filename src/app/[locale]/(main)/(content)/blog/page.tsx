import React from "react";
import type { Metadata } from "next";
import prisma from "@/prisma";
import { BlogPostStatus } from "@prisma/client";
import { BlogCard } from "@/components/blog/blog-card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Rss } from "lucide-react";

export const revalidate = 3600;

const PAGE_SIZE = 9;

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

function buildHref(page: number, q: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

function PaginationBar({
  currentPage,
  totalPages,
  q,
}: {
  currentPage: number;
  totalPages: number;
  q: string;
}) {
  if (totalPages <= 1) return null;

  // Pages to show: always first, last, current ±1
  const pages = new Set([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(currentPage - 1, q)}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {sorted.map((page, i) => {
          const prev = sorted[i - 1];
          return (
            <React.Fragment key={page}>
              {prev && page - prev > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={buildHref(page, q)}
                  isActive={page === currentPage}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </React.Fragment>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={buildHref(currentPage + 1, q)}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { q = "", page: pageParam = "1" } = await searchParams;

  const currentPage = Math.max(1, parseInt(pageParam) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where = {
    status: BlogPostStatus.PUBLISHED,
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { excerpt: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold">Blog</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
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

      {/* Search — reset to page 1 on new query */}
      <form method="GET" className="mb-8">
        <label htmlFor="blog-search" className="sr-only">
          Rechercher un article
        </label>
        <Input
          id="blog-search"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un article…"
          className="max-w-sm"
          autoComplete="off"
        />
      </form>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          {q
            ? `Aucun article trouvé pour « ${q} ».`
            : "Aucun article publié pour l'instant."}
        </p>
      ) : (
        <>
          {total > PAGE_SIZE && (
            <p className="text-sm text-muted-foreground mb-4">
              {total} article{total > 1 ? "s" : ""}
              {q ? ` pour « ${q} »` : ""} — page {currentPage}/{totalPages}
            </p>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} locale={locale} />
            ))}
          </div>

          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            q={q}
          />
        </>
      )}
    </div>
  );
}
