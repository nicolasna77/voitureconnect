"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ExternalLink, Trash2, CarFront } from "lucide-react";
import Image from "next/image";

interface Favorite {
  id: string;
  generationId: number;
  makeName: string;
  modelName: string;
  generationName: string;
  imageUrl: string | null;
  createdAt: string;
}

function FavoriteSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FavoritesPage() {
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery<Favorite[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await axios.get("/api/favorites");
      return res.data;
    },
  });

  const { mutate: removeFavorite } = useMutation({
    mutationFn: async (fav: Favorite) => {
      await axios.post("/api/favorites", {
        generationId: fav.generationId,
        makeName: fav.makeName,
        modelName: fav.modelName,
        generationName: fav.generationName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteIds"] });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Mes favoris</CardTitle>
              <CardDescription>
                {favorites ? `${favorites.length} véhicule${favorites.length !== 1 ? "s" : ""} sauvegardé${favorites.length !== 1 ? "s" : ""}` : "Chargement…"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <FavoriteSkeleton />
      ) : favorites && favorites.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <Card key={fav.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Logo */}
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {fav.imageUrl ? (
                      <Image
                        src={fav.imageUrl}
                        alt={fav.makeName}
                        width={48}
                        height={48}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <CarFront className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {fav.makeName} {fav.modelName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{fav.generationName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(fav.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                      <Link href={`/specification/${fav.generationId}`} aria-label="Voir la fiche">
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:text-destructive"
                      onClick={() => removeFavorite(fav)}
                      aria-label="Retirer des favoris"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
            <p className="text-muted-foreground font-medium">Aucun favori pour l&apos;instant</p>
            <p className="text-sm text-muted-foreground mt-1">
              Explorez les fiches techniques et sauvegardez vos véhicules préférés.
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/specification">Parcourir les fiches</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
