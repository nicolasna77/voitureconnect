"use client";
import React from "react";
import { signIn } from "../../lib/auth";
import { Button } from "../../components/ui/button";
import { FcGoogle } from "react-icons/fc";

const LoginSocial = () => {
  return (
    <>
      <form onSubmit={() => signIn("google", { redirectTo: "/dashboard" })}>
        <Button
          variant={"outline"}
          className=" m-auto mb-4 w-full border flex gap-2"
          type="submit"
          size={"lg"}
        >
          <FcGoogle size={24} height={24} width={24} />
          {" S'identifier avec Google"}
        </Button>
      </form>
    </>
  );
};
export default LoginSocial;
