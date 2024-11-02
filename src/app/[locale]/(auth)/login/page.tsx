import LoginForm from "@/components/auth/login-form";

import React from "react";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh_-_theme(spacing.16))]">
      <div className="relative mx-auto flex w-full max-w-md  flex-col space-y-2.5 p-4 md:-mt-32">
        <LoginForm />
      </div>
    </main>
  );
}
