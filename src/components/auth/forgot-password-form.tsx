"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { AtSign, Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordReset } from "@/lib/auth-client";

// Hoisted success state component (vercel-react-best-practices: rendering-hoist-jsx)
function SuccessState({ email }: { email: string }) {
  return (
    <Card className="rounded-lg px-6 pb-4 pt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Email envoyé</h2>
            <p className="text-muted-foreground text-sm">
              Si un compte existe avec l'adresse <strong>{email}</strong>,
              vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Retour à la connexion
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stable callback (vercel-react-best-practices: rerender-functional-setstate)
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      try {
        const result = await requestPasswordReset({
          email,
          redirectTo: "/reset-password",
        });

        if (result.error) {
          setError(result.error.message || "Une erreur est survenue.");
        } else {
          setIsSuccess(true);
        }
      } catch {
        setError("Une erreur est survenue. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    },
    [email]
  );

  // Early return for success state (vercel-react-best-practices: js-early-exit)
  if (isSuccess) {
    return <SuccessState email={email} />;
  }

  return (
    <Card className="rounded-lg px-6 pb-4 pt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">Mot de passe oublié ?</CardTitle>
        <CardDescription>
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
              <AtSign
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le lien"
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-1 h-3 w-3" aria-hidden="true" />
              Retour à la connexion
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
