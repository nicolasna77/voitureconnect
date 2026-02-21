import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCachedSession } from "@/lib/cached-session";
import { BlogPostStatus } from "@prisma/client";

export async function GET() {
  try {
    const session = await getCachedSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in GET /api/admin/blog:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCachedSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "title, slug et content sont requis" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        status: (status as BlogPostStatus) || BlogPostStatus.DRAFT,
        authorId: session.user.id,
        publishedAt:
          status === BlogPostStatus.PUBLISHED ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ce slug est déjà utilisé" },
        { status: 409 }
      );
    }
    console.error("Error in POST /api/admin/blog:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
