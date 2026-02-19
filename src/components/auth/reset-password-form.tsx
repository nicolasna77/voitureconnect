"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Key, Loader2, ArrowLeft, ShieldCheck, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPassword } from "@/lib/auth-client";

function InvalidTokenState({ message }: { message: string }) {
  return (
    <Card className="rounded-lg px-6 pb-4 pt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Lien invalide</h2>
            <p className="text-muted-foreground text-sm">{message}</p>
          </div>
          <div className="flex flex-col gap-2 w-full pt-4">
            <Button asChild className="w-full">
              <Link href="/forgot-password">Demander un nouveau lien</Link>
            </Button>
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

function SuccessState() {
  return (
    <Card className="rounded-lg px-6 pb-4 pt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Mot de passe réinitialisé</h2>
            <p className="text-muted-foreground text-sm">
              Votre mot de passe a été modifié avec succès.
              Vous allez être redirigé vers la page de connexion.
            </p>
          </div>
          <Button asChild className="w-full mt-4">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }

      if (password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }

      if (!token) {
        setError("Token de réinitialisation manquant.");
        return;
      }

      setIsLoading(true);

      try {
        const result = await resetPassword({
          newPassword: password,
          token,
        });

        if (result.error) {
          setError(result.error.message || "Une erreur est survenue.");
        } else {
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } catch {
        setError("Une erreur est survenue. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    },
    [password, confirmPassword, token, router]
  );

  if (!token) {
    return <InvalidTokenState message="Le lien de réinitialisation est invalide ou a expiré." />;
  }

  if (isSuccess) {
    return <SuccessState />;
  }

  return (
    <Card className="rounded-lg px-6 pb-4 pt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">Nouveau mot de passe</CardTitle>
        <CardDescription>
          Choisissez un nouveau mot de passe sécurisé pour votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <Key
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <Key
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                aria-label={showConfirm ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Réinitialisation…
              </>
            ) : (
              "Réinitialiser le mot de passe"
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
