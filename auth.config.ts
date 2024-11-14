import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/prisma";
import authCredentials from "next-auth/providers/credentials";

export default {
  providers: [
    Google,
    authCredentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Veuillez remplir tous les champs");
        }

        const { email, password } = credentials;

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: email as string,
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              password: true,
              emailVerified: true,
            },
          });

          if (!user) {
            throw new Error("Email ou mot de passe incorrect");
          }

          if (!user.emailVerified) {
            throw new Error(
              "Veuillez vérifier votre email avant de vous connecter"
            );
          }

          const isValid = await bcrypt.compare(
            password as string,
            user.password
          );

          if (!isValid) {
            throw Error("Type d'erreur", {
              cause: { server_message: "Email ou mot de passe invalide" },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
