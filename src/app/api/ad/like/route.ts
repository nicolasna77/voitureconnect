"use server";
import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "ID utilisateur manquant" },
        { status: 400 }
      );
    }

    const data = await prisma.like.findMany({
      where: { userId },
      include: {
        ad: {
          include: {
            car: {
              include: {
                pictures: true,
                carMake: true,
                carModel: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur lors de la récupération des likes:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { userId, adId } = await request.json();

    if (!userId || !adId) {
      return NextResponse.json(
        { success: false, error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Vérifier si le like existe déjà
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_adId: {
          userId,
          adId,
        },
      },
    });

    if (existingLike) {
      // Si le like existe déjà, on le supprime
      return NextResponse.json({
        success: true,
        message: "Like supprimé",
        action: "removed",
      });
    }

    // Sinon, on crée le nouveau like
    const data = await prisma.like.create({
      data: { userId, adId },
    });

    return NextResponse.json({ success: true, data, action: "added" });
  } catch (error) {
    console.error("Erreur lors de la création du like:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID manquant" },
        { status: 400 }
      );
    }

    const deletedLike = await prisma.like.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: deletedLike });
  } catch (error) {
    console.error("Erreur lors de la suppression du like:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression du like" },
      { status: 500 }
    );
  }
};
