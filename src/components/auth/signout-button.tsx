"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

const SignoutButton = () => {
  return (
    <Button
      variant={"outline"}
      className="w-full"
      onClick={() => signOut({ redirect: true })}
    >
      Déconnexion
    </Button>
  );
};

export default SignoutButton;
