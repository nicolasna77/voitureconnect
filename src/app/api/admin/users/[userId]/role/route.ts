import prisma from "@/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import authOptions from "@/../auth.config";

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { role } = await request.json();

  const user = await prisma.user.update({
    where: { id: params.userId },
    data: { role },
  });

  return NextResponse.json(user);
}
