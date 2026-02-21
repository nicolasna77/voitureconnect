import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCachedSession } from "@/lib/cached-session";
import { BlogPostStatus } from "@prisma/client";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCachedSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const newStatus =
      existing.status === BlogPostStatus.PUBLISHED
        ? BlogPostStatus.DRAFT
        : BlogPostStatus.PUBLISHED;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt:
          newStatus === BlogPostStatus.PUBLISHED
            ? existing.publishedAt ?? new Date()
            : null,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error in POST /api/admin/blog/[id]/publish:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
