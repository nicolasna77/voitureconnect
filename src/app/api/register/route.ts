"use server";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "@/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export const POST = async (request: any) => {
  const { name, email, password } = await request.json();

  // Vérification de l'email
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUserByEmail) {
    return new NextResponse("Cet email est déjà utilisé", { status: 400 });
  }

  // Vérification du nom d'utilisateur
  const existingUserByName = await prisma.user.findFirst({
    where: { name },
  });
  if (existingUserByName) {
    return new NextResponse("Ce nom d'utilisateur est déjà pris", {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

  try {
    const user = await prisma.user.create({
      data: {
        name,
        role: "USER",
        email,
        password: hashedPassword,
      },
    });

    // Créer le token de vérification
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires: tokenExpires,
      },
    });

    // Envoyer l'email de vérification
    await sendVerificationEmail({
      email: user.email,
      token: verificationToken,
      name: user.name,
    });

    return new NextResponse(
      "L'utilisateur a été enregistré avec succès. Veuillez vérifier votre email.",
      {
        status: 200,
      }
    );
  } catch (err: any) {
    console.error(err);
    return new NextResponse(
      "Erreur lors de l'enregistrement de l'utilisateur",
      {
        status: 500,
      }
    );
  }
};
