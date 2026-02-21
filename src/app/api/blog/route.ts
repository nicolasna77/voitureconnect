import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { BlogPostStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: BlogPostStatus.PUBLISHED },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
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
      prisma.blogPost.count({ where: { status: BlogPostStatus.PUBLISHED } }),
    ]);

    return NextResponse.json({
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in GET /api/blog:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
