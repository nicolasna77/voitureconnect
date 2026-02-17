import prisma from "@/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const generationId = parseInt(searchParams.get("generationId") || "0");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    if (!generationId) {
      return new NextResponse("Missing generationId", { status: 400 });
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { generationId, parentId: null },
        include: {
          user: { select: { id: true, name: true, picture: true } },
          replies: {
            include: {
              user: { select: { id: true, name: true, picture: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where: { generationId, parentId: null } }),
    ]);

    return NextResponse.json({
      comments,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in GET /api/comments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { generationId, content, parentId } = await request.json();

    if (!generationId || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length < 1 || trimmedContent.length > 2000) {
      return new NextResponse("Content must be between 1 and 2000 characters", {
        status: 400,
      });
    }

    // If replying, verify parent is a root comment (no nesting > 1 level)
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { parentId: true },
      });

      if (!parentComment) {
        return new NextResponse("Parent comment not found", { status: 404 });
      }

      if (parentComment.parentId !== null) {
        return new NextResponse("Cannot reply to a reply", { status: 400 });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        generationId,
        content: trimmedContent,
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, picture: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, picture: true } },
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/comments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
