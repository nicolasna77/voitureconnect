import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCachedSession } from "@/lib/cached-session";
import { BlogPostStatus } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCachedSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, status } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "title, slug et content sont requis" },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const wasPublished = existing.status === BlogPostStatus.PUBLISHED;
    const nowPublished = status === BlogPostStatus.PUBLISHED;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        status: (status as BlogPostStatus) || BlogPostStatus.DRAFT,
        publishedAt:
          nowPublished && !wasPublished
            ? new Date()
            : !nowPublished
              ? null
              : existing.publishedAt,
      },
    });

    return NextResponse.json(post);
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
    console.error("Error in PUT /api/admin/blog/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCachedSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await prisma.blogPost.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/admin/blog/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
