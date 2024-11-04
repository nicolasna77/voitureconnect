"use server";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (userId) {
    const data = await prisma.like.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        ad: {
          include: {
            car: true,
          },
        },
      },
    });
    return Response.json({ success: true, data });
  } else {
    return Response.json(
      { success: false, error: "ID utilisateur manquant" },
      { status: 400 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  const { userId, adId } = await request.json();
  if (userId && adId) {
    try {
      const data = await prisma.like.create({
        data: {
          userId: userId,
          adId: adId,
        },
      });
      return Response.json({ success: true, data });
    } catch (error) {
      console.error("Erreur lors de la création du like:", error);
      return Response.json(
        { success: false, error: "Erreur lors de la création du like" },
        { status: 500 }
      );
    }
  } else {
    return Response.json(
      { success: false, error: "Données manquantes" },
      { status: 400 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const adId = searchParams.get("adId");
    if (userId && adId) {
      try {
        const deletedLike = await prisma.like.deleteMany({
          where: {
            userId: userId,
            adId: adId,
          },
        });

        if (deletedLike.count > 0) {
          return Response.json({ success: true, deletedLike });
        } else {
          return Response.json(
            { success: false, error: "Like non trouvé" },
            { status: 404 }
          );
        }
      } catch (error) {
        console.error("Erreur lors de la suppression du like:", error);
        return Response.json(
          { success: false, error: "Erreur lors de la suppression du like" },
          { status: 500 }
        );
      }
    } else {
      return Response.json(
        { success: false, error: "Données manquantes" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'analyse du JSON:", error);
    return Response.json(
      { success: false, error: "Erreur lors de l'analyse des données" },
      { status: 400 }
    );
  }
};
