"use server";

import { auth, signIn } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../../route";

export async function authenticate(formData: FormData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: true,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return response;
  } catch (err) {
    throw err;
  }
}

export async function getSession() {
  const session = await auth();
  return session;
}
