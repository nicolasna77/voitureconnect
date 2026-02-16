"use client";

import { Shield, CheckCircle2, Database, Lock } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const trustPoints = [
  {
    icon: Shield,
    title: "Système intelligent",
    text: "Analyse automatisée de milliers de points de données par véhicule",
  },
  {
    icon: Database,
    title: "Sources vérifiées",
    text: "Uniquement des bases de données automobiles reconnues et contrôlées",
  },
  {
    icon: CheckCircle2,
    title: "Zéro forum douteux",
    text: "Aucun avis non vérifié, que des informations factuelles et traçables",
  },
  {
    icon: Lock,
    title: "Données réelles",
    text: "Chaque information est vérifiable et sourcée, rien n'est inventé",
  },
];

export function TrustSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="relative py-24 lg:py-36 bg-accent/50 overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/4 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-chart-3/4 blur-[120px]" aria-hidden="true" />
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "rounded-3xl border border-border bg-card transition-all duration-700",
            isInView ? "animate-scale-in" : "opacity-0",
          )}
        >
          <div className="p-8 lg:p-16">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Confiance & Transparence</span>
              </div>

              <h2 className="font-serif text-balance text-3xl font-bold text-card-foreground sm:text-4xl">
                Des faits, pas des opinions
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Chaque analyse repose sur des sources automobiles reconnues.
                Notre système intelligent croise des milliers de données
                pour vous donner des résultats précis, vérifiables et objectifs.
              </p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2">
                {trustPoints.map((point, i) => (
                  <div
                    key={point.title}
                    className={cn(
                      "group flex items-start gap-4 rounded-xl border border-border bg-background/50 p-5 text-left transition-all duration-300 hover:bg-background/80",
                      isInView ? "animate-fade-up" : "opacity-0",
                    )}
                    style={{
                      animationDelay: isInView
                        ? `${300 + i * 100}ms`
                        : undefined,
                    }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/5">
                      <point.icon
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-card-foreground">
                        {point.title}
                      </span>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {point.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
