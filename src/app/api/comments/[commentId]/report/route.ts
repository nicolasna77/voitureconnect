import prisma from "@/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
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
    const { reason } = await request.json();

    if (!reason) {
      return new NextResponse("Missing reason", { status: 400 });
    }

    const trimmedReason = reason.trim();
    if (trimmedReason.length < 1 || trimmedReason.length > 500) {
      return new NextResponse("Reason must be between 1 and 500 characters", {
        status: 400,
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    // Check for duplicate report
    const existing = await prisma.commentReport.findUnique({
      where: {
        commentId_reporterId: {
          commentId,
          reporterId: session.user.id,
        },
      },
    });

    if (existing) {
      return new NextResponse("You have already reported this comment", {
        status: 409,
      });
    }

    const report = await prisma.commentReport.create({
      data: {
        commentId,
        reporterId: session.user.id,
        reason: trimmedReason,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/comments/[commentId]/report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
