"use client";

import { useState } from "react";
import { changePassword } from "@/lib/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check, Eye, EyeOff, Key } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsPending(true);

    try {
      const result = await changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        setError(result.error.message || "Erreur lors du changement de mot de passe.");
        return;
      }

      setIsSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Mot de passe modifié", {
        description: "Votre mot de passe a été mis à jour. Les autres sessions ont été déconnectées.",
      });

      setTimeout(() => setIsSuccess(false), 2000);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300 motion-reduce:animate-none">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Current password */}
        <div className="space-y-2">
          <Label htmlFor="current_password" className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Mot de passe actuel
          </Label>
          <div className="relative">
            <Input
              id="current_password"
              type={showCurrent ? "text" : "password"}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              aria-label={showCurrent ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div className="space-y-2">
          <Label htmlFor="new_password" className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Nouveau mot de passe
          </Label>
          <div className="relative">
            <Input
              id="new_password"
              type={showNew ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              aria-label={showNew ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Minimum 8 caractères</p>
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <Label htmlFor="confirm_new_password" className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Confirmer
          </Label>
          <div className="relative">
            <Input
              id="confirm_new_password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className={cn(
                confirmPassword && newPassword && confirmPassword !== newPassword && "border-destructive"
              )}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!currentPassword || !newPassword || !confirmPassword || isPending}
        className={cn("min-w-40 transition-colors", isSuccess && "bg-emerald-600 hover:bg-emerald-600")}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Enregistrement…
          </>
        ) : isSuccess ? (
          <>
            <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            Mot de passe modifié
          </>
        ) : (
          "Modifier le mot de passe"
        )}
      </Button>
    </form>
  );
}
