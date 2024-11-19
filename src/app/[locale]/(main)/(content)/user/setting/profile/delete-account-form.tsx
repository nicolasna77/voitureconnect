"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Session } from "next-auth";

export function DeleteAccountForm({ session }: { session: Session | null }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: deleteAccount, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.delete(
        `/api/user/settings?userId=${session?.user?.id}`
      );
      return response.data;
    },
    onSuccess: async () => {
      toast({
        variant: "default",
        title: "Votre compte a été supprimé. Vous allez être déconnecté.",
      });
      setTimeout(async () => {
        await signOut({ callbackUrl: "/" });
      }, 1000);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Une erreur est survenue lors de la suppression du compte.",
      });
    },
  });

  const handleDeleteAccount = async () => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Erreur: Utilisateur non identifié",
      });
      return;
    }
    deleteAccount();
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Supprimer le compte</CardTitle>
        <CardDescription>
          Supprimer définitivement toutes les données de profil dans toutes les
          organisations auxquelles vous appartenez.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <p className="text-sm">
          <span className="font-bold">Attention :</span> Cette action est
          immédiate et ne peut pas être annulée.
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Supprimer le compte</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Êtes-vous sûr de vouloir supprimer votre compte ?
              </DialogTitle>
              <DialogDescription>
                Cette action est irréversible. Toutes vos données seront
                définitivement supprimées.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isPending}
              >
                {isPending ? "Suppression..." : "Confirmer la suppression"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
