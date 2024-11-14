"use server";

import { auth, signIn } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../../route";
import { AuthError } from "next-auth";

export async function authenticate(formData: FormData) {
  const result = (await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: true,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  })) as { error?: string };

  return { success: true, result, AuthError };
}

export async function getSession() {
  const session = await auth();
  return session;
}
