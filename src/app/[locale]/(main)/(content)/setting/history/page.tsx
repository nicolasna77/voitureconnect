"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { History, ExternalLink, Trash2, CarFront } from "lucide-react";
import Image from "next/image";

interface HistoryEntry {
  id: string;
  generationId: number;
  makeName: string;
  modelName: string;
  generationName: string;
  imageUrl: string | null;
  visitedAt: string;
}

function HistorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const queryClient = useQueryClient();

  const { data: history, isLoading } = useQuery<HistoryEntry[]>({
    queryKey: ["viewHistory"],
    queryFn: async () => {
      const res = await axios.get("/api/history");
      return res.data;
    },
  });

  const { mutate: clearHistory, isPending: isClearing } = useMutation({
    mutationFn: async () => {
      await axios.delete("/api/history");
    },
    onSuccess: () => {
      queryClient.setQueryData(["viewHistory"], []);
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <History className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Historique de consultation</CardTitle>
                <CardDescription>
                  {history
                    ? `${history.length} fiche${history.length !== 1 ? "s" : ""} consultée${history.length !== 1 ? "s" : ""} récemment`
                    : "Chargement…"}
                </CardDescription>
              </div>
            </div>

            {history && history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Effacer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Effacer l&apos;historique ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera définitivement tout votre historique de consultation.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => clearHistory()}
                      disabled={isClearing}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Effacer tout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <HistorySkeleton />
      ) : history && history.length > 0 ? (
        <div className="space-y-2">
          {history.map((entry) => (
            <Card key={entry.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Logo */}
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {entry.imageUrl ? (
                      <Image
                        src={entry.imageUrl}
                        alt={entry.makeName}
                        width={40}
                        height={40}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <CarFront className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {entry.makeName} {entry.modelName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{entry.generationName}</p>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                    {new Date(entry.visitedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {/* Link */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    asChild
                  >
                    <Link href={`/specification/${entry.generationId}`} aria-label="Voir la fiche">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <History className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
            <p className="text-muted-foreground font-medium">Aucune consultation récente</p>
            <p className="text-sm text-muted-foreground mt-1">
              Les fiches techniques que vous consultez apparaîtront ici.
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
