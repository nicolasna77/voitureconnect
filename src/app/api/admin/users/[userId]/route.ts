import prisma from "@/prisma";
import { NextResponse } from "next/server";
import { getCachedSession } from "@/lib/cached-session";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const session = await getCachedSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return new NextResponse(null, { status: 204 });
}
