import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/../prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { authConfig } from "../../auth.config";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        if (!credentials) {
          throw new Error("Identifiants non fournis");
        }
        const prisma = new PrismaClient();

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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
});
