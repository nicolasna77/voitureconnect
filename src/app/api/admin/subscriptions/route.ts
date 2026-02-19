import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCachedSession } from "@/lib/cached-session";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  try {
    const session = await getCachedSession();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const plan = searchParams.get("plan") || "";
    const status = searchParams.get("status") || "";

    const where: Prisma.SubscriptionWhereInput = {
      ...(plan && { plan: plan as any }),
      ...(status && { status }),
      ...(search && {
        user: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      }),
    };

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.subscription.count({ where }),
    ]);

    return NextResponse.json({
      subscriptions,
      total,
      pages: Math.ceil(total / PAGE_SIZE),
    });
  } catch (error) {
    console.error("[ADMIN_SUBSCRIPTIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
