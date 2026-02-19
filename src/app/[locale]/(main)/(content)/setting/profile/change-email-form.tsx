"use client";

import { useState } from "react";
import { useSession, changeEmail } from "@/lib/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AtSign, Mail, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChangeEmailForm() {
  const { data: session } = useSession();
  const [newEmail, setNewEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentEmail = session?.user?.email || "";
  const hasChanges = newEmail.trim() !== "" && newEmail.trim() !== currentEmail;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!hasChanges) return;

    setIsPending(true);

    try {
      const result = await changeEmail({ newEmail: newEmail.trim() });

      if (result.error) {
        setError(result.error.message || "Erreur lors du changement d'email.");
        return;
      }

      setIsSent(true);
      setNewEmail("");
      toast.success("Email de vérification envoyé", {
        description: `Un lien de confirmation a été envoyé à ${newEmail.trim()}.`,
      });
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSent && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <Mail className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-400">
            Un email de confirmation a été envoyé. Cliquez sur le lien pour valider le changement.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Current email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="current_email" className="text-muted-foreground flex items-center gap-2">
            <AtSign className="h-4 w-4" aria-hidden="true" />
            Email actuel
          </Label>
          <Input
            id="current_email"
            type="email"
            value={currentEmail}
            disabled
            className="bg-muted"
            aria-readonly="true"
          />
        </div>

        {/* New email */}
        <div className="space-y-2">
          <Label htmlFor="new_email" className="flex items-center gap-2">
            <AtSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Nouvel email
          </Label>
          <Input
            id="new_email"
            type="email"
            placeholder="nouveau@email.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            autoComplete="email"
            spellCheck={false}
            className={cn("transition-all", hasChanges && "border-primary/50 bg-primary/5")}
          />
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
        <span>Un email de confirmation sera envoyé à la nouvelle adresse. Le changement sera effectif après validation.</span>
      </div>

      <Button
        type="submit"
        disabled={!hasChanges || isPending}
        className="min-w-40"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Envoi en cours…
          </>
        ) : (
          "Changer l'email"
        )}
      </Button>
    </form>
  );
}
