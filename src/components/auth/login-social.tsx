"use client";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const LoginSocial = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/",
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
      className="w-full gap-3 h-11 text-sm font-medium transition-all duration-200 hover:bg-accent/80"
      type="button"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <FcGoogle className="h-5 w-5" />
          Continuer avec Google
        </>
      )}
    </Button>
  );
};

export default LoginSocial;
