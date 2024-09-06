"use server";
import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export const POST = async (request: any) => {
  const { email, password } = await request.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return new NextResponse("Email is already in use", { status: 400 });
  }

  // const hashedPassword = await bcrypt.hash(password, 5);

  await prisma.user.create({
    data: {
      name: "",
      role: "User",
      email,
      password: password,
    },
  });
  try {
    return new NextResponse("user is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
