"use client";

import { Wrench, Bot, AlertTriangle, Euro, ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Wrench,
    title: "Fiche technique complète",
    description:
      "Toutes les données essentielles, claires et structurées pour chaque véhicule.",
    stat: "200+",
    statLabel: "données par fiche",
  },
  {
    icon: Bot,
    title: "Fiabilité notée par IA",
    description:
      "Une note sur 10, expliquée et basée sur des sources de confiance.",
    stat: "/10",
    statLabel: "score de fiabilité",
  },
  {
    icon: AlertTriangle,
    title: "Problèmes connus",
    description:
      "Pannes récurrentes, gravité et kilométrage d'apparition détaillés.",
    stat: "3",
    statLabel: "niveaux de gravité",
  },
  {
    icon: Euro,
    title: "Valeur du marché",
    description:
      "Fourchette de prix min / max selon l'état et la fiabilité du véhicule.",
    stat: "Min/Max",
    statLabel: "estimation précise",
  },
];

export function FeaturesSection() {
  const { ref, isInView } = useInView();

  return (
    <section
      id="features"
      className="relative py-24 lg:py-36 bg-accent overflow-hidden"
    >
      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div
          className={cn(
            "flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
            isInView ? "animate-fade-up" : "opacity-0",
          )}
        >
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Fonctionnalités
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Tout savoir avant
              <br />d{"'"}acheter
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground leading-relaxed lg:text-right">
            Quatre analyses complémentaires pour une vision complète de chaque
            véhicule.
          </p>
        </div>

        {/* Separator */}
        <div
          className={cn(
            "mt-10 h-px bg-border",
            isInView ? "animate-fade-in delay-200" : "opacity-0",
          )}
        />

        {/* Feature cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                "group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/15 hover:shadow-lg sm:p-8",
                isInView ? "animate-fade-up" : "opacity-0",
              )}
              style={{
                animationDelay: isInView ? `${200 + i * 100}ms` : undefined,
              }}
            >
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/50 transition-colors duration-300 group-hover:border-foreground/10 group-hover:bg-secondary">
                  <feature.icon
                    className="h-5 w-5 text-foreground/70"
                    aria-hidden="true"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {feature.title}
                    </h3>
                    <ArrowRight
                      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/0 transition-all duration-300 group-hover:text-muted-foreground group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stat pill */}
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5">
                    <span className="text-sm font-semibold text-foreground">
                      {feature.stat}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {feature.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
