import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/../prisma";

import { authConfig } from "../../auth.config";
import NextAuth from "next-auth";
import { Role } from "@prisma/client";
import Resend from "next-auth/providers/resend";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: "onboarding@resend.dev",
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },

    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name;
      }

      if (!token.sub) {
        return token;
      }
      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
      });
      if (!existingUser) {
        return token;
      }
      token.role = existingUser.role;
      token.id = existingUser.id;
      token.name = existingUser.name;
      token.email = existingUser.email;
      return token;
    },
  },
});
