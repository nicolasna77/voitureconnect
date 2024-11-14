"use client";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const verifyEmail = async (token: string | null) => {
  if (!token) throw new Error("Token manquant");
  const { data } = await axios.get(`/api/verify-email?token=${token}`);
  return data;
};

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    data: message,
    status,
    error,
  } = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: () => verifyEmail(token),
    retry: false,
    enabled: !!token,
  });

  const isLoading = status === "pending";
  const isError = status === "error";
  const isSuccess = status === "success";

  return (
    <main className="flex items-center justify-center min-h-[calc(100vh_-_theme(spacing.16))]">
      <div className="relative mx-auto flex w-full max-w-md  flex-col space-y-2.5 p-4 md:-mt-32">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Vérification de l&apos;email
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {isLoading && (
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <p>Vérification en cours...</p>
              </div>
            )}

            {isSuccess && (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
                <p className="text-center">{message}</p>
                <Button asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-16 w-16 text-red-500" />
                <p className="text-center text-red-500">
                  {error instanceof Error
                    ? error.message
                    : "Une erreur est survenue"}
                </p>
                <Button asChild variant="outline">
                  <Link href="/register">Retour à l&apos;inscription</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
