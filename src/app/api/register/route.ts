"use server";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

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

  try {
    await prisma.user.create({
      data: {
        name,
        role: "USER",
        email,
        password: hashedPassword,
      },
    });
    return new NextResponse("L'utilisateur a été enregistré avec succès", {
      status: 200,
    });
  } catch (err: any) {
    return new NextResponse(
      "Erreur lors de l'enregistrement de l'utilisateur",
      {
        status: 500,
      }
    );
  }
};
