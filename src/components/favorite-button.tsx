"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  generationId: number;
  makeName: string;
  modelName: string;
  generationName: string;
  imageUrl?: string | null;
  className?: string;
}

export function FavoriteButton({
  generationId,
  makeName,
  modelName,
  generationName,
  imageUrl,
  className,
}: FavoriteButtonProps) {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const { data: ids = [] } = useQuery<number[]>({
    queryKey: ["favoriteIds"],
    queryFn: async () => {
      const res = await axios.get("/api/favorites/ids");
      return res.data.ids;
    },
    enabled: !!sessionData?.user,
    staleTime: 60 * 1000,
  });

  const isFavorited = optimistic !== null ? optimistic : ids.includes(generationId);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/favorites", {
        generationId,
        makeName,
        modelName,
        generationName,
        imageUrl,
      });
      return res.data as { favorited: boolean };
    },
    onMutate: () => {
      setOptimistic(!isFavorited);
    },
    onSuccess: (data) => {
      setOptimistic(null);
      queryClient.setQueryData<number[]>(["favoriteIds"], (old = []) => {
        if (data.favorited) {
          return [...old, generationId];
        }
        return old.filter((id) => id !== generationId);
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: () => {
      setOptimistic(null);
    },
  });

  if (!sessionData?.user) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => mutate()}
      disabled={isPending}
      aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={cn("bg-background/60 backdrop-blur-sm", className)}
    >
      <Heart
        className={cn("h-4 w-4 mr-2 transition-colors", isFavorited && "fill-red-500 text-red-500")}
        aria-hidden="true"
      />
      {isFavorited ? "Sauvegardé" : "Sauvegarder"}
    </Button>
  );
}
