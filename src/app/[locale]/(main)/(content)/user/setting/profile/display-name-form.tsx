"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { Loader2 } from "lucide-react";

export function DisplayNameForm({ session }: { session: Session }) {
  const { update } = useSession();
  const queryClient = useQueryClient();

  const { mutate: updateDisplayName, isPending } = useMutation({
    mutationFn: async (newDisplayName: string) => {
      const response = await axios.put(
        `/api/user/settings?userId=${session?.user?.id}`,
        {
          name: newDisplayName,
        }
      );
      return response.data;
    },
    onSuccess: async (newDisplayName) => {
      await update({ name: newDisplayName });
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      toast({
        title: "Succès",
        variant: "default",
        description: "Votre nom d'affichage a été mis à jour.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        variant: "destructive",
        description:
          "Une erreur est survenue lors de la mise à jour du nom d'affichage.",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDisplayName = formData.get("display_name") as string;
    updateDisplayName(newDisplayName);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Nom d&apos;affichage
          </CardTitle>
          <CardDescription>
            Entrez un nom que vous aimeriez voir affiché aux autres
            utilisateurs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="display_name" className="sr-only">
              Nom d&apos;affichage
            </Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="John Smith"
              defaultValue={session?.user?.name || ""}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
