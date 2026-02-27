"use client";

import { useState } from "react";
import axios from "axios";
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
import { Calculator, AlertCircle, Info } from "lucide-react";
import type { PriceEstimate } from "@/lib/pricing/depreciation";

interface Props {
  generationId: number;
  yearBegin?: string | null;
  yearEnd?: string | null;
  locale?: "fr" | "en";
}

const CONDITIONS = [
  { value: "excellent", label: "Excellent — comme neuf, zéro défaut" },
  { value: "bon",       label: "Bon — quelques petites marques" },
  { value: "moyen",     label: "Moyen — usure visible, mécanique correcte" },
  { value: "mauvais",   label: "Mauvais — dommages ou problèmes mécaniques" },
] as const;

function fmt(n: number) {
  return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function PriceEstimateWidget({ generationId, yearBegin, yearEnd, locale = "fr" }: Props) {
  const currentYear = new Date().getFullYear();
  const minYear = parseInt(yearBegin ?? String(currentYear - 30)) || currentYear - 30;
  const maxYear = parseInt(yearEnd   ?? String(currentYear))       || currentYear;

  const [year,      setYear]      = useState(String(maxYear));
  const [km,        setKm]        = useState("");
  const [condition, setCondition] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<PriceEstimate | null>(null);
  const [error,     setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!year || !km || !condition) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const { data } = await axios.get<PriceEstimate>("/api/car/price-estimate", {
        params: { generationId, year, km, condition, lang: locale },
      });
      setResult(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("Le prix neuf n'est pas encore renseigné pour cette génération.");
      } else {
        setError("Erreur lors du calcul. Réessayez.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4 text-primary" aria-hidden="true" />
          Estimation du prix
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calcul basé sur la dépréciation, le kilométrage et l&apos;état. Sans IA.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Année */}
            <div className="space-y-1.5">
              <Label htmlFor="pe-year">Année du véhicule</Label>
              <Input
                id="pe-year"
                type="number"
                min={minYear}
                max={maxYear}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder={String(maxYear)}
                required
              />
            </div>

            {/* Kilométrage */}
            <div className="space-y-1.5">
              <Label htmlFor="pe-km">Kilométrage</Label>
              <Input
                id="pe-km"
                type="number"
                min={0}
                max={999_999}
                value={km}
                onChange={(e) => setKm(e.target.value)}
                placeholder="ex. 80 000"
                required
              />
            </div>
          </div>

          {/* État */}
          <div className="space-y-1.5">
            <Label htmlFor="pe-condition">État général</Label>
            <Select value={condition} onValueChange={setCondition} required>
              <SelectTrigger id="pe-condition">
                <SelectValue placeholder="Choisir un état…" />
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

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !year || !km || !condition}
          >
            {loading ? "Calcul en cours…" : "Estimer le prix"}
          </Button>
        </form>

        {/* Erreur */}
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            {/* Fourchette principale */}
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Valeur estimée
              </p>
              <p className="text-3xl font-bold text-foreground">{fmt(result.avg)}</p>
              <p className="text-sm text-muted-foreground">
                Entre{" "}
                <span className="font-medium text-foreground">{fmt(result.min)}</span>
                {" "}et{" "}
                <span className="font-medium text-foreground">{fmt(result.max)}</span>
              </p>
            </div>

            {/* Barre visuelle */}
            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
              {/* Position du prix moyen dans la fourchette globale */}
              {(() => {
                const total = result.max - result.min;
                const avgPct = total > 0 ? ((result.avg - result.min) / total) * 100 : 50;
                return (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-primary to-emerald-400 opacity-80" />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-4 w-1 rounded-full bg-foreground shadow"
                      style={{ left: `calc(${avgPct}% - 2px)` }}
                      aria-hidden="true"
                    />
                  </>
                );
              })()}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{fmt(result.min)}</span>
              <span>{fmt(result.max)}</span>
            </div>

            {/* Métriques */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-md border bg-background p-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Dépréciation</p>
                <p className="text-lg font-semibold text-foreground">−{result.depreciationPct}%</p>
              </div>
              <div className="rounded-md border bg-background p-2.5 text-center">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Âge</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.ageYears} an{result.ageYears > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                Estimation basée sur la dépréciation standard du marché français. Les prix réels
                peuvent varier selon la région, la finition et les options.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
