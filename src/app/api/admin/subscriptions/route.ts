import { auth } from "@/lib/auth";
import prisma from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscriptions = await prisma.subscription.findMany({
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
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("[ADMIN_SUBSCRIPTIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
