"use client";

import { Shield, CheckCircle2, Database, Lock } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const trustPoints = [
  {
    icon: Shield,
    title: "AI Gateway",
    text: "IA orchestrée via AI Gateway",
  },
  {
    icon: Database,
    title: "Sources vérifiées",
    text: "Sources automobiles contrôlées et vérifiées",
  },
  {
    icon: CheckCircle2,
    title: "Pas de forums",
    text: "Pas de forums douteux, uniquement des sources fiables",
  },
  {
    icon: Lock,
    title: "Données réelles",
    text: "Pas de données inventées, tout est vérifiable",
  },
];

export function TrustSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 lg:py-36">
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
                Des analyses fiables,
                <br className="hidden sm:block" />
                pas des avis au hasard
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Les résultats sont basés uniquement sur des sources automobiles
                reconnues. Notre IA analyse des milliers de données pour vous
                fournir des informations précises et vérifiables.
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
