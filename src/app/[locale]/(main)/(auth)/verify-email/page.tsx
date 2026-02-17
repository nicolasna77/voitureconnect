"use client";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
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
    <Card className="rounded-lg px-6 pb-4 pt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {isLoading && (
            <>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary animate-pulse" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Vérification en cours</h2>
                <p className="text-muted-foreground text-sm">
                  Nous vérifions votre adresse email...
                </p>
              </div>
              <div className="flex gap-1 pt-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
              </div>
            </>
          )}

          {isSuccess && (
            <>
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Email vérifié</h2>
                <p className="text-muted-foreground text-sm">{message}</p>
              </div>
              <Button asChild className="w-full mt-2">
                <Link href="/login">Se connecter</Link>
              </Button>
            </>
          )}

          {isError && (
            <>
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Erreur de vérification</h2>
                <p className="text-muted-foreground text-sm">
                  {error instanceof Error
                    ? error.message
                    : "Une erreur est survenue"}
                </p>
              </div>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href="/register">Retour à l&apos;inscription</Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyEmailPage;
