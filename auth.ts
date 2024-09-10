import NextAuth, { User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/../prisma";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";



export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      if (pathname.startsWith("/login") && !isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
    },
  },
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Github,
    Credentials({
      credentials: {
        email: { label: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;
        if (!credentials) {
          throw new Error("Credentials not provided");
        }
        const prisma = new PrismaClient();

        const { email, password } = credentials;

        const passwordHash = await bcrypt.hash(password as string, 10);
        user = await prisma.user.findUnique({
          where: {
            email: email as string,
          },
        });

        const compare = await bcrypt.compare(
          password as string,
          user?.password as string
        );

        if (!user) {
          throw new Error("User not found.");
        }

        if (!compare) {
          throw new Error("Invalid password.");
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
});
