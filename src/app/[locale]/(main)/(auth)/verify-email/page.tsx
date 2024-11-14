"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token manquant");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.text();

        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
        setMessage(data);
      } catch (error) {
        setStatus("error");
        setMessage("Une erreur est survenue lors de la vérification");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="container max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Vérification de l&apos;email
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p>Vérification en cours...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-center">{message}</p>
              <Button asChild>
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-center text-red-500">{message}</p>
              <Button asChild variant="outline">
                <Link href="/register">Retour à l&apos;inscription</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default VerifyEmailPage;
