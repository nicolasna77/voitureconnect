import { ImageResponse } from "next/og";
import prisma from "@/prisma";
import { BlogPostStatus } from "@prisma/client";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Article VoitureConnect";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, status: BlogPostStatus.PUBLISHED },
    select: {
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
      author: { select: { name: true } },
    },
  });

  const title = post?.title ?? "VoitureConnect";
  const excerpt = post?.excerpt ?? "Articles et actualités automobiles";
  const authorName = post?.author?.name ?? "VoitureConnect";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const coverImage = post?.coverImage;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f172a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Cover image background */}
        {coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.25,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.97) 60%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            padding: "56px 64px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#3b82f6",
              }}
            />
            <span
              style={{ color: "#64748b", fontSize: 22, fontFamily: "sans-serif" }}
            >
              VoitureConnect Blog
            </span>
          </div>

          {/* Title + excerpt */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: title.length > 60 ? 48 : 56,
                fontWeight: 700,
                color: "#f8fafc",
                lineHeight: 1.15,
                maxWidth: 960,
                fontFamily: "sans-serif",
              }}
            >
              {title.length > 80 ? title.slice(0, 80) + "…" : title}
            </div>
            {excerpt && (
              <div
                style={{
                  fontSize: 24,
                  color: "#94a3b8",
                  maxWidth: 840,
                  fontFamily: "sans-serif",
                  lineHeight: 1.5,
                }}
              >
                {excerpt.length > 110 ? excerpt.slice(0, 110) + "…" : excerpt}
              </div>
            )}
          </div>

          {/* Author row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "sans-serif",
              }}
            >
              {authorInitial}
            </div>
            <span
              style={{ color: "#e2e8f0", fontSize: 22, fontFamily: "sans-serif" }}
            >
              {authorName}
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
