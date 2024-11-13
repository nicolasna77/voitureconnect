"use client";
import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "../../components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { DEFAULT_LOGIN_REDIRECT } from "../../../route";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const LoginSocial = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await signIn("google", {
        callbackUrl: DEFAULT_LOGIN_REDIRECT,
        redirect: true,
      });
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="m-auto mb-4 w-full border flex gap-2"
      type="button"
      size="lg"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <FcGoogle size={24} />
          S&apos;identifier avec Google
        </>
      )}
    </Button>
  );
};

export default LoginSocial;
