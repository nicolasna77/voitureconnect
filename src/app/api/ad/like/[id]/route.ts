import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID du like manquant" },
        { status: 400 }
      );
    }

    const existingLike = await prisma.like.findUnique({
      where: { id },
    });

    if (!existingLike) {
      return NextResponse.json(
        { success: false, error: "Like non trouvé" },
        { status: 404 }
      );
    }

    const deletedLike = await prisma.like.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: deletedLike });
  } catch (error) {
    console.error("Erreur lors de la suppression du like:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
