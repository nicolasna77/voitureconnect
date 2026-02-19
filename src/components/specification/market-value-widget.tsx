"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrendingUp, Loader2, AlertCircle, Coins } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Link } from "@/i18n/routing";

interface MarketValueWidgetProps {
  generationId: number;
  trimId?: string;
  makeName: string;
  modelName: string;
}

const CONDITIONS = [
  { value: "excellent", label: "Excellent — comme neuf" },
  { value: "bon", label: "Bon — état général satisfaisant" },
  { value: "moyen", label: "Moyen — usure visible" },
  { value: "mauvais", label: "Mauvais — dommages significatifs" },
] as const;

export function MarketValueWidget({
  generationId,
  trimId,
  makeName,
  modelName,
}: MarketValueWidgetProps) {
  const { data: sessionData } = useSession();
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");
  const [condition, setCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [hasEstimated, setHasEstimated] = useState(false);

  const handleEstimate = async () => {
    if (!year || !km || !condition) return;

    setIsLoading(true);
    setResult("");
    setError("");

    try {
      const response = await fetch("/api/ai/market-value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationId,
          trimId: trimId ? Number(trimId) : undefined,
          year: Number(year),
          km: Number(km),
          condition,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 402) {
          setError(
            `Crédits insuffisants. Il vous faut 1 crédit pour cette estimation (solde : ${data.balance}).`
          );
        } else if (response.status === 401) {
          setError("Vous devez être connecté pour utiliser cette fonctionnalité.");
        } else {
          setError(data.error || "Erreur lors de l'estimation");
        }
        return;
      }

      setHasEstimated(true);

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Parse SSE: extract text content from stream
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const parsed = JSON.parse(line.slice(2));
              text += parsed;
              setResult(text);
            } catch {
              // non-JSON chunk, skip
            }
          }
        }
      }
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setYear("");
    setKm("");
    setCondition("");
    setResult("");
    setError("");
    setHasEstimated(false);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-emerald-500" aria-hidden="true" />
          Estimation valeur marché
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Obtenez une estimation IA de la valeur marchande d&apos;un{" "}
          <span className="font-medium text-foreground">
            {makeName} {modelName}
          </span>{" "}
          selon son année, kilométrage et état.
        </p>

        {!sessionData?.user ? (
          <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Connectez-vous
            </Link>{" "}
            pour estimer la valeur (1 crédit)
          </div>
        ) : (
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (!o) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" aria-hidden="true" />
                Estimer la valeur
                <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Coins className="h-3 w-3" aria-hidden="true" />1 crédit
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Estimation valeur — {makeName} {modelName}
                </DialogTitle>
              </DialogHeader>

              {!hasEstimated ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="mv-year">Année *</Label>
                      <Input
                        id="mv-year"
                        type="number"
                        placeholder="ex: 2018"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        min={1990}
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mv-km">Kilométrage *</Label>
                      <Input
                        id="mv-km"
                        type="number"
                        placeholder="ex: 85000"
                        value={km}
                        onChange={(e) => setKm(e.target.value)}
                        min={0}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>État général *</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'état" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle
                        className="h-4 w-4 mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Coins className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>1 crédit sera consommé pour cette estimation</span>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!year || !km || !condition || isLoading}
                    onClick={handleEstimate}
                  >
                    {isLoading ? (
                      <>
                        <Loader2
                          className="h-4 w-4 mr-2 animate-spin"
                          aria-hidden="true"
                        />
                        Estimation en cours…
                      </>
                    ) : (
                      "Estimer la valeur"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {isLoading && !result && (
                    <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
                      <Loader2
                        className="h-5 w-5 animate-spin"
                        aria-label="Chargement"
                      />
                      <span className="text-sm">Analyse en cours…</span>
                    </div>
                  )}

                  {result && (
                    <div className="prose prose-sm max-w-none">
                      <div
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        aria-live="polite"
                        aria-label="Résultat de l'estimation"
                      >
                        {result}
                      </div>
                    </div>
                  )}

                  {!isLoading && result && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={resetForm}
                    >
                      Nouvelle estimation
                    </Button>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
