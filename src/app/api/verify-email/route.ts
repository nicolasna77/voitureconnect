import { NextResponse } from "next/server";
import prisma from "@/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse("Token manquant", { status: 400 });
  }

  try {
    console.log("Recherche du token:", token);
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
    });
    console.log("Token trouvé:", verificationToken);

    if (!verificationToken) {
      return new NextResponse(
        "Token invalide ou expiré. Veuillez vous réinscrire.",
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    // Supprimer le token utilisé
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return new NextResponse(
      "Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.",
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      "Une erreur est survenue lors de la vérification de l'email",
      { status: 500 }
    );
  }
}
