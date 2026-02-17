import prisma from "@/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { commentId } = await params;
    const { content } = await request.json();

    if (!content) {
      return new NextResponse("Missing content", { status: 400 });
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length < 1 || trimmedContent.length > 2000) {
      return new NextResponse("Content must be between 1 and 2000 characters", {
        status: 400,
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: trimmedContent, isEdited: true },
      include: {
        user: { select: { id: true, name: true, picture: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error in PATCH /api/comments/[commentId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { commentId } = await params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    const isOwner = comment.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/comments/[commentId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
