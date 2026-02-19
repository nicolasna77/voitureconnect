import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getCachedSession } from "@/lib/cached-session";

export async function GET(request: Request) {
  try {
    const session = await getCachedSession();
    const { searchParams } = new URL(request.url);

    if (!session?.user || session?.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") || undefined;

    const skip = (page - 1) * limit;

    const where = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {},
        roleFilter && roleFilter !== "ALL"
          ? {
              role: roleFilter as Role,
            }
          : {},
      ],
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          picture: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getCachedSession();

    if (!session?.user || session?.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        picture: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in PATCH /api/admin/users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCachedSession();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!session?.user || session?.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return new NextResponse(
        "Impossible de supprimer cet utilisateur car il a des données associées",
        { status: 400 }
      );
    }
    console.error("Error in DELETE /api/admin/users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
