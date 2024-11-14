import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma";

// Obtenir les informations de l'utilisateur
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "ID utilisateur manquant" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Mettre à jour les informations de l'utilisateur
export async function PUT(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "ID utilisateur manquant ou invalide" },
      { status: 400 }
    );
  }

  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Le nom d'affichage est requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom d'affichage:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du nom d'affichage" },
      { status: 500 }
    );
  }
}

// Supprimer le compte utilisateur
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Supprimer d'abord toutes les relations
    await prisma.$transaction(async (tx) => {
      // Supprimer les relations Account
      await tx.account.deleteMany({
        where: { userId: userId },
      });

      // Supprimer les relations Session
      await tx.session.deleteMany({
        where: { userId: userId },
      });

      // Ajouter ici d'autres suppressions de relations si nécessaire
      // Par exemple:
      // await tx.userOrganization.deleteMany({ where: { userId: userId } });
      // await tx.post.deleteMany({ where: { authorId: userId } });

      // Enfin, supprimer l'utilisateur
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du compte utilisateur:",
      error
    );
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
