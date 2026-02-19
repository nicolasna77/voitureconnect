"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

export function DeleteAccountForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const CONFIRM_PHRASE = "SUPPRIMER";
  const isConfirmed = confirmText === CONFIRM_PHRASE;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsPending(true);
    setError(null);

    try {
      // Use Better Auth's built-in deleteUser
      const result = await deleteUser({
        password: password || undefined,
      });

      if (result.error) {
        setError(result.error.message || "Erreur lors de la suppression");
        setIsPending(false);
        return;
      }

      toast.success("Compte supprimé", {
        description: "Votre compte a été supprimé. Vous allez être déconnecté.",
      });

      // Sign out and redirect
      await signOut();
      router.push("/");
    } catch {
      setError("Une erreur est survenue lors de la suppression du compte.");
      setIsPending(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setConfirmText("");
      setPassword("");
      setError(null);
    }
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          La suppression de votre compte est <strong>permanente</strong> et ne peut pas être annulée.
          Toutes vos données, y compris vos crédits et favoris, seront définitivement perdues.
        </AlertDescription>
      </Alert>

      <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Supprimer mon compte
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Supprimer votre compte ?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Cette action est <strong>irréversible</strong>. Toutes vos données seront
                définitivement supprimées, y compris :
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Votre profil et vos informations personnelles</li>
                <li>Vos crédits restants</li>
                <li>Votre historique d&apos;analyses</li>
                <li>Vos véhicules favoris</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password-confirm">
                Mot de passe (optionnel pour les comptes sociaux)
              </Label>
              <Input
                id="password-confirm"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-delete">
                Tapez <strong className="text-destructive">{CONFIRM_PHRASE}</strong> pour confirmer
              </Label>
              <Input
                id="confirm-delete"
                type="text"
                placeholder={CONFIRM_PHRASE}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                className="font-mono"
                autoComplete="off"
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!isConfirmed || isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Suppression…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Supprimer définitivement
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
