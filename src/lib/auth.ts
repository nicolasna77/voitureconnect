import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "../../auth.config";
import NextAuth from "next-auth";
import prisma from "@/prisma";

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
  ...authConfig,
  callbacks: {
    async session({ token, session }) {
      if (!token) return session;
      return {
        ...session,
        user: {
          ...session.user,
          name: token.name,
          email: token.email,
          picture: token.picture,
          id: token.sub,
          role: token.role,
          isOAuth: token.isOAuth,
        },
      };
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      try {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            role: true,
            name: true,
            email: true,
            picture: true,
          },
        });

        if (!user) return token;

        token.name = user.name;
        token.email = user.email;
        token.picture = user.picture;
        token.role = user.role;
        token.isOAuth = true;

        return token;
      } catch (error) {
        console.error("JWT Callback Error:", error);
        return token;
      }
    },
    async signIn({ user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email ?? "" },
        select: { emailVerified: true },
      });

      if (user.email && !dbUser?.emailVerified) {
        throw new Error(
          "Veuillez vérifier votre email avant de vous connecter"
        );
      }
      return true;
    },
  },
});
