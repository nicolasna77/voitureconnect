import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      credentials: {
        email: { label: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (!credentials) {
          throw new Error("Identifiants non fournis");
        }

        const { email, password } = credentials;
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: email as string,
            },
          });
          if (!user) {
            throw new Error("User not found");
          }

          const compare = await bcrypt.compare(
            password as string,
            user.password as string
          );
          if (!compare) {
            throw new Error("Password is not correct");
          } else {
            return user;
          }
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
