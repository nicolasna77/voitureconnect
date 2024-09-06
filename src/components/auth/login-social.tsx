"use client";
import React from "react";
import { signIn } from "../../../auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const LoginSocial = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <Button
          variant={"outline"}
          className="px-4 m-auto py-2 border flex gap-2"
          type="submit"
          size={"lg"}
        >
          <Image src="/google.svg" height={24} width={24} alt="icon google" />
          Sign in with Google
        </Button>
      </form>
      <form
        action={async () => {
          "use server";

          await signIn("github", { redirectTo: "/dashboard" });
        }}
      >
        <Button
          variant={"outline"}
          className="px-4 m-auto py-2 border flex gap-2"
          type="submit"
          size={"lg"}
        >
          <GitHubLogoIcon width={24} height={24} />
          Sign in with GitHub
        </Button>
      </form>
    </>
  );
};
export default LoginSocial;
