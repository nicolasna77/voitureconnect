"use client";

import { Wrench, ShieldCheck, AlertTriangle, Euro, ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Wrench,
    title: "Fiche technique complète",
    description:
      "Plus de 200 caractéristiques par véhicule : moteur, dimensions, consommation, équipements. Fini les recherches interminables.",
    stat: "200+",
    statLabel: "données par fiche",
    accent: { bg: "bg-primary/5", border: "border-primary/15", hoverBg: "group-hover:bg-primary/10", hoverBorder: "group-hover:border-primary/25", icon: "text-primary", stat: "text-primary" },
  },
  {
    icon: ShieldCheck,
    title: "Score de fiabilité",
    description:
      "Un score sur 10, calculé à partir de sources automobiles reconnues. Sachez exactement ce que vous achetez.",
    stat: "/10",
    statLabel: "score de fiabilité",
    accent: { bg: "bg-chart-3/8", border: "border-chart-3/15", hoverBg: "group-hover:bg-chart-3/12", hoverBorder: "group-hover:border-chart-3/25", icon: "text-chart-3", stat: "text-chart-3" },
  },
  {
    icon: AlertTriangle,
    title: "Pannes & problèmes connus",
    description:
      "Les pannes récurrentes, leur gravité et le kilométrage d'apparition. Anticipez les frais avant d'acheter.",
    stat: "3",
    statLabel: "niveaux de gravité",
    accent: { bg: "bg-destructive/5", border: "border-destructive/15", hoverBg: "group-hover:bg-destructive/10", hoverBorder: "group-hover:border-destructive/25", icon: "text-destructive", stat: "text-destructive" },
  },
  {
    icon: Euro,
    title: "Estimation du juste prix",
    description:
      "Fourchette de prix min/max basée sur l'état et la fiabilité. Ne payez jamais au-dessus du marché.",
    stat: "Min/Max",
    statLabel: "estimation précise",
    accent: { bg: "bg-chart-2/8", border: "border-chart-2/15", hoverBg: "group-hover:bg-chart-2/12", hoverBorder: "group-hover:border-chart-2/25", icon: "text-chart-2", stat: "text-chart-2" },
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
            <p className="text-sm font-medium uppercase tracking-widest text-accent-foreground">
              Pourquoi DriveMetric
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Tout savoir avant
              <br />de signer
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground leading-relaxed lg:text-right">
            4 analyses complémentaires qui vous évitent les mauvaises surprises
            et les achats regrettés.
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
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300", feature.accent.bg, feature.accent.border, feature.accent.hoverBg, feature.accent.hoverBorder)}>
                  <feature.icon
                    className={cn("h-5 w-5", feature.accent.icon)}
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
                    <span className={cn("text-sm font-semibold", feature.accent.stat)}>
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
