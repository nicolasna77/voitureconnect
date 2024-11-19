import NextAuth from "next-auth";
import authConfig from "../../auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma";

// Extraire les callbacks existants de authConfig
const { callbacks: authConfigCallbacks, ...restAuthConfig } = authConfig;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data: any) => {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          picture: data.image,
          emailVerified: data.emailVerified,
        },
      });
      return user;
    },
  },
  callbacks: {
    ...authConfigCallbacks, // Fusionner avec les callbacks de authConfig
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.picture = token.picture as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        select: {
          id: true,
          role: true,
          picture: true,
        },
      });

      if (user) {
        token.role = user.role ?? undefined;
        token.picture = user.picture;
      }

      return token;
    },
  },
  session: { strategy: "jwt" },
  ...restAuthConfig,
});
