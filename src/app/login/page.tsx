import LoginForm from "@/components/auth/login-form";
import { cookies } from "next/headers";
import { auth } from "../../../auth";

export default async function LoginPage() {
  const session = await auth();
  let csrfToken = ""; // Declare csrfToken variable
  if (!session?.user) {
    csrfToken = cookies().get("authjs.csrf-token")?.value ?? ""; // Assign value to csrfToken
  }
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-md  flex-col space-y-2.5 p-4 md:-mt-32">
        <LoginForm csrfToken={csrfToken ? csrfToken : ""} />
      </div>
    </main>
  );
}
