"use server";

import { signIn, signOut } from "@/lib/auth";

export async function authenticate(formData: FormData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: true,
      callbackUrl: "/",
      redirectTo: "/",
    });

    return response;
  } catch (err) {
    throw err;
  }
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}
