"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { CheckCircle, Coins, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreditsSuccessPage() {
  const t = useTranslations("Credits");
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [credits, setCredits] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyAndCredit() {
      if (!sessionId) {
        setStatus("error");
        setError("Session ID manquant");
        return;
      }

      try {
        const response = await fetch("/api/credits/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setError(data.error || "Erreur lors de la verification");
          return;
        }

        setCredits(data.credits);
        setBalance(data.balance);
        setStatus("success");

        // Invalidate credit balance cache
        queryClient.invalidateQueries({ queryKey: ["creditBalance"] });
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setError("Erreur de connexion");
      }
    }

    verifyAndCredit();
  }, [sessionId, queryClient]);

  if (status === "loading") {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">{t("success.processing")}</CardTitle>
            <CardDescription>{t("success.processingDescription")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <AlertCircle className="w-16 h-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">{t("success.errorTitle")}</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3">
            <Link href="/credits" className="w-full">
              <Button variant="outline" className="w-full">
                {t("success.backToCredits")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">{t("success.title")}</CardTitle>
          <CardDescription>{t("success.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 mb-4">
            <p className="text-sm text-muted-foreground mb-1">{t("success.creditsAdded")}</p>
            <p className="text-3xl font-bold text-green-600">+{credits} {t("credits")}</p>
          </div>
          {balance !== null && (
            <p className="text-muted-foreground">
              {t("success.newBalance")}: <span className="font-semibold">{balance} {t("credits")}</span>
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Link href="/credits" className="w-full">
            <Button variant="outline" className="w-full">
              <Coins className="w-4 h-4 mr-2" />
              {t("success.viewBalance")}
            </Button>
          </Link>
          <Link href="/specification" className="w-full">
            <Button className="w-full">{t("success.browseSpecs")}</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
