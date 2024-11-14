import { v4 as uuidv4 } from "uuid";
import prisma from "@/prisma";

export const generateVerificationToken = async (email: string) => {
  // Generate a random token
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hours
  const lowerCaseEmail = email.toLowerCase();
  // Check if a token already exists for the user
  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      email: lowerCaseEmail,
    },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        email_token: {
          email: lowerCaseEmail,
          token: existingToken.token,
        },
      },
    });
  }

  // Create a new verification token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires: new Date(expires),
    },
  });

  return verificationToken;
};
