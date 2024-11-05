import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "../../auth.config";
import NextAuth from "next-auth";
import { Role } from "@prisma/client";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/error",
  },
  providers: [...authConfig.providers],
  callbacks: {
    // Simplifier les callbacks pour déboguer
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as Role) || "USER";
      }
      return session;
    },
    async jwt({ token }) {
      try {
        if (!token.sub) return token;

        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { id: true, role: true, name: true, email: true },
        });

        if (!user) return token;

        return {
          ...token,
          role: user.role,
          name: user.name,
          email: user.email,
        };
      } catch (error) {
        console.error("JWT Callback Error:", error);
        return token;
      }
    },
  },
});
