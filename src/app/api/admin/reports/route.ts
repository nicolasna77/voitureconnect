import prisma from "@/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { CommentReportStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const status = searchParams.get("status") || "PENDING";

    const skip = (page - 1) * limit;

    const where =
      status === "ALL" ? {} : { status: status as CommentReportStatus };

    const [reports, total] = await Promise.all([
      prisma.commentReport.findMany({
        where,
        include: {
          comment: {
            include: {
              user: { select: { id: true, name: true, picture: true } },
            },
          },
          reporter: { select: { id: true, name: true, picture: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.commentReport.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/reports:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { reportId, action } = await request.json();

    if (!reportId || !action) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const report = await prisma.commentReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    switch (action) {
      case "resolve":
        await prisma.commentReport.update({
          where: { id: reportId },
          data: {
            status: "RESOLVED",
            resolvedAt: new Date(),
            resolvedBy: session.user.id,
          },
        });
        break;

      case "dismiss":
        await prisma.commentReport.update({
          where: { id: reportId },
          data: {
            status: "DISMISSED",
            resolvedAt: new Date(),
            resolvedBy: session.user.id,
          },
        });
        break;

      case "delete_comment":
        // Deleting the comment will cascade delete all its reports
        await prisma.comment.delete({
          where: { id: report.commentId },
        });
        break;

      default:
        return new NextResponse("Invalid action", { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PATCH /api/admin/reports:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
