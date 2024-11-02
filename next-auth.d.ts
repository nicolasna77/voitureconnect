import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@prisma/client";

export type ExtendedUser = NextAuth.User & {
  role?: Role;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}
