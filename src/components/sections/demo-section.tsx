"use client";

import {
  AlertTriangle,
  TrendingUp,
  Gauge,
  Calendar,
  Fuel,
  Settings,
} from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const specs = [
  { icon: Calendar, label: "Année", value: "2014-2021" },
  { icon: Fuel, label: "Carburant", value: "Diesel" },
  { icon: Settings, label: "Boîte", value: "Manuelle 6" },
  { icon: Gauge, label: "Puissance", value: "120 ch" },
  { icon: TrendingUp, label: "Conso.", value: "4.0 L/100" },
  { icon: AlertTriangle, label: "Alertes", value: "3" },
];

const issues = [
  {
    title: "Vanne EGR",
    severity: "Élevée",
    km: "80 000 - 120 000 km",
    description:
      "Encrassement fréquent, peut causer perte de puissance et voyant moteur.",
    severityColor: "border-destructive/20 bg-destructive/5 text-destructive",
  },
  {
    title: "Injecteurs",
    severity: "Moyenne",
    km: "100 000 - 150 000 km",
    description: "Usure prématurée possible, bruit de claquement au ralenti.",
    severityColor: "border-chart-2/20 bg-chart-2/8 text-chart-2",
  },
  {
    title: "Embrayage",
    severity: "Faible",
    km: "120 000 - 180 000 km",
    description: "Usure normale, prévoir remplacement selon utilisation.",
    severityColor: "border-chart-3/20 bg-chart-3/8 text-chart-3",
  },
];

export function DemoSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="demo" className="py-24 lg:py-36">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto max-w-2xl text-center",
            isInView ? "animate-fade-up" : "opacity-0",
          )}
        >
          <h2 className="font-serif text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Exemple concret
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Découvrez le type d{"'"}analyse que vous obtiendrez
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Vehicle Card */}
          <div
            className={cn(
              "rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg lg:p-8",
              isInView ? "animate-slide-right" : "opacity-0",
            )}
            style={{ animationDelay: isInView ? "200ms" : undefined }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Analyse complète
                </p>
                <h3 className="mt-2 text-2xl font-bold text-card-foreground">
                  Peugeot 308 II
                </h3>
                <p className="mt-1 text-muted-foreground">1.6 BlueHDi 120ch</p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-primary/20 bg-primary/5 px-5 py-3">
                <span className="text-3xl font-bold text-primary">7.5</span>
                <span className="text-xs font-medium text-primary/60">
                  /10
                </span>
              </div>
            </div>

            {/* Specs grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-border bg-secondary/30 p-3"
                >
                  <spec.icon
                    className="mb-2 h-4 w-4 text-chart-3"
                    aria-hidden="true"
                  />
                  <p className="text-xs text-muted-foreground">{spec.label}</p>
                  <p className="font-semibold text-card-foreground">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Price estimation */}
            <div className="mt-8 rounded-xl border border-border bg-secondary/30 p-5">
              <p className="text-sm font-medium text-muted-foreground">
                Valeur estimée
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-chart-3">
                  6 500 €
                </span>
                <span className="text-lg text-muted-foreground">—</span>
                <span className="text-3xl font-bold text-chart-3">
                  8 200 €
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Basé sur l{"'"}état moyen et le kilométrage standard
              </p>
            </div>
          </div>

          {/* Known Issues */}
          <div
            className={cn(
              "rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg lg:p-8",
              isInView ? "animate-slide-left" : "opacity-0",
            )}
            style={{ animationDelay: isInView ? "350ms" : undefined }}
          >
            <h3 className="flex items-center gap-3 text-xl font-bold text-card-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5">
                <AlertTriangle
                  className="h-4 w-4 text-destructive"
                  aria-hidden="true"
                />
              </div>
              Problèmes connus
            </h3>
            <p className="mt-2 text-muted-foreground">
              Pannes récurrentes identifiées sur ce modèle
            </p>

            <div className="mt-6 space-y-3">
              {issues.map((issue) => (
                <div
                  key={issue.title}
                  className="rounded-xl border border-border bg-secondary/20 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-card-foreground">
                      {issue.title}
                    </h4>
                    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-medium", issue.severityColor)}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs font-medium text-muted-foreground">
                    Apparition : {issue.km}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
