"use server";

import { signIn } from "./auth";
import { AuthError } from "next-auth";

enum ResponseForm {
  InvalidCredentials = "Identifiants invalides.",
  SomethingWentWrong = "Une erreur est survenue.",
}

export async function authentication(
  prevState: string | null,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: true,
      redirectTo: "/",
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return ResponseForm.InvalidCredentials;
        default:
          return ResponseForm.SomethingWentWrong;
      }
    }
    throw error;
  }
}
