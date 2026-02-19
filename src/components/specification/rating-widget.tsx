"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Star, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";

interface RatingData {
  id: string;
  userId: string;
  generationId: number;
  trimId: number | null;
  stars: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string; picture: string };
}

interface RatingsResponse {
  ratings: RatingData[];
  average: number;
  count: number;
  distribution: { star: number; count: number }[];
  userRating: RatingData | null;
}

interface RatingWidgetProps {
  generationId: number;
  trimId?: string;
}

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex gap-1"
      role="group"
      aria-label="Sélectionner une note"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <Star
            className={cn(
              "h-7 w-7 transition-colors",
              (hovered || value) >= star
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex gap-0.5" aria-label={`${value} étoiles sur 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            cls,
            star <= value
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/20"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function RatingWidget({ generationId, trimId }: RatingWidgetProps) {
  const { data: sessionData } = useSession();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [stars, setStars] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const ratingKey = ["ratings", generationId, trimId ?? null];

  const { data, isLoading } = useQuery<RatingsResponse>({
    queryKey: ratingKey,
    queryFn: async () => {
      const params = new URLSearchParams({ generationId: String(generationId) });
      if (trimId) params.set("trimId", trimId);
      const res = await axios.get(`/api/ratings?${params}`);
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const { mutate: submitRating, isPending } = useMutation({
    mutationFn: () =>
      axios.post("/api/ratings", {
        generationId,
        trimId: trimId ? Number(trimId) : null,
        stars,
        title: title || null,
        comment: comment || null,
      }),
    onSuccess: () => {
      toast.success(data?.userRating ? "Avis mis à jour" : "Avis publié !");
      queryClient.invalidateQueries({ queryKey: ratingKey });
      setShowForm(false);
    },
    onError: () => toast.error("Erreur lors de la publication"),
  });

  const { mutate: deleteRating } = useMutation({
    mutationFn: () =>
      axios.delete(`/api/ratings/${data?.userRating?.id}`),
    onSuccess: () => {
      toast.success("Avis supprimé");
      queryClient.invalidateQueries({ queryKey: ratingKey });
    },
    onError: () => toast.error("Erreur lors de la suppression"),
  });

  const openForm = (existing?: RatingData | null) => {
    if (existing) {
      setStars(existing.stars);
      setTitle(existing.title || "");
      setComment(existing.comment || "");
    } else {
      setStars(0);
      setTitle("");
      setComment("");
    }
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse motion-reduce:animate-none">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="h-16 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const { average = 0, count = 0, distribution = [], userRating, ratings = [] } = data || {};

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="h-5 w-5 text-amber-400" aria-hidden="true" />
          Avis de la communauté
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p
              className="text-4xl font-bold tabular-nums"
              aria-label={`Moyenne : ${average} sur 5`}
            >
              {count > 0 ? average.toFixed(1) : "—"}
            </p>
            <StarDisplay value={Math.round(average)} size="lg" />
            <p className="text-xs text-muted-foreground mt-1">
              {count} avis
            </p>
          </div>

          {count > 0 && (
            <div className="flex-1 space-y-1" aria-label="Distribution des notes">
              {[5, 4, 3, 2, 1].map((star) => {
                const entry = distribution.find((d) => d.star === star);
                const pct = count > 0 ? ((entry?.count || 0) / count) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-right tabular-nums">{star}</span>
                    <Star
                      className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0"
                      aria-hidden="true"
                    />
                    <div
                      className="flex-1 h-2 rounded-full bg-muted overflow-hidden"
                      role="progressbar"
                      aria-valuenow={Math.round(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${star} étoiles : ${entry?.count || 0} avis`}
                    >
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right tabular-nums text-muted-foreground">
                      {entry?.count || 0}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Auth gate / user action */}
        {!sessionData?.user ? (
          <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Connectez-vous
            </Link>{" "}
            pour laisser un avis
          </div>
        ) : showForm ? (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="space-y-1">
              <Label>Votre note *</Label>
              <StarSelector value={stars} onChange={setStars} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rating-title">Titre (optionnel)</Label>
              <Input
                id="rating-title"
                placeholder="ex: Fiable et économique"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rating-comment">Commentaire (optionnel)</Label>
              <Textarea
                id="rating-comment"
                placeholder="Partagez votre expérience…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </Button>
              <Button
                className="flex-1"
                disabled={stars === 0 || isPending}
                onClick={() => submitRating()}
              >
                {isPending ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : userRating ? (
                  "Mettre à jour"
                ) : (
                  "Publier"
                )}
              </Button>
            </div>
          </div>
        ) : userRating ? (
          <div className="rounded-lg bg-muted/50 p-3 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarDisplay value={userRating.stars} />
                <span className="text-sm font-medium">Mon avis</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => openForm(userRating)}
                >
                  Modifier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive"
                  onClick={() => deleteRating()}
                >
                  Supprimer
                </Button>
              </div>
            </div>
            {userRating.title && (
              <p className="text-sm font-medium">{userRating.title}</p>
            )}
            {userRating.comment && (
              <p className="text-sm text-muted-foreground">{userRating.comment}</p>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => openForm(null)}
          >
            <Star className="h-4 w-4 mr-2" aria-hidden="true" />
            Laisser un avis
          </Button>
        )}

        {/* Recent reviews */}
        {ratings.filter((r) => r.userId !== sessionData?.user?.id).length > 0 && (
          <div className="space-y-3 pt-2 border-t">
            <h3 className="text-sm font-medium text-muted-foreground">
              Avis récents
            </h3>
            {ratings
              .filter((r) => r.userId !== sessionData?.user?.id)
              .slice(0, 3)
              .map((r) => (
                <div key={r.id} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StarDisplay value={r.stars} />
                    <span className="text-xs text-muted-foreground">
                      {r.user.name} ·{" "}
                      {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {r.title && (
                    <p className="text-sm font-medium">{r.title}</p>
                  )}
                  {r.comment && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
