import prisma from "@/prisma";
import auth from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.user.delete({
    where: { id: params.userId },
  });

  return new NextResponse(null, { status: 204 });
}
