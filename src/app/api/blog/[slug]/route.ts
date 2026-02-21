import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { BlogPostStatus } from "@prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findFirst({
      where: { slug, status: BlogPostStatus.PUBLISHED },
      include: {
        author: { select: { name: true, picture: true } },
      },
    });

    if (!post) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error in GET /api/blog/[slug]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
