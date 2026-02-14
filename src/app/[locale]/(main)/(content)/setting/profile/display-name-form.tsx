"use client";

import { useState } from "react";
import { useSession, updateUser } from "@/lib/auth-client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function DisplayNameForm() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const hasChanges = name !== session?.user?.name && name.trim().length > 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasChanges) return;

    setIsPending(true);
    setIsSuccess(false);

    try {
      await updateUser({
        name: name.trim(),
      });

      setIsSuccess(true);
      toast.success("Profil mis à jour", {
        description: "Votre nom d'affichage a été modifié avec succès.",
      });

      // Reset success state after 2 seconds
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la mise à jour.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="display_name" className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Nom d'affichage
          </Label>
          <Input
            id="display_name"
            name="display_name"
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(
              "transition-all",
              hasChanges && "border-primary/50 bg-primary/5"
            )}
          />
          <p className="text-xs text-muted-foreground">
            Ce nom sera visible par les autres utilisateurs.
          </p>
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground">
            Adresse email
          </Label>
          <Input
            id="email"
            type="email"
            value={session?.user?.email || ""}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            L'email ne peut pas être modifié.
          </p>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={!hasChanges || isPending}
          className={cn(
            "min-w-32 transition-all",
            isSuccess && "bg-emerald-600 hover:bg-emerald-600"
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Enregistrement…
            </>
          ) : isSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" aria-hidden="true" />
              Enregistré
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>

        {hasChanges && !isPending && (
          <span className="text-sm text-muted-foreground">
            Modifications non enregistrées
          </span>
        )}
      </div>
    </form>
  );
}
