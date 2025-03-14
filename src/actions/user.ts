"use server";

import { auth } from "@/lib/auth";

export async function getUser() {
  const session = await auth();
  return session?.user;
}
