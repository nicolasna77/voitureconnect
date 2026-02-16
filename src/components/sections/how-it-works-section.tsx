"use client";

import { Search, Cpu, FileCheck } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Choisissez un véhicule",
    description:
      "Recherchez par marque, modèle ou utilisez notre barre de recherche intelligente.",
    color: { bg: "bg-chart-2/8", border: "border-chart-2/15", hover: "group-hover:bg-chart-2/12", icon: "text-chart-2", badge: "bg-chart-2" },
  },
  {
    icon: Cpu,
    step: "02",
    title: "Notre système analyse",
    description:
      "DriveMetric croise des milliers de données issues de sources automobiles vérifiées.",
    color: { bg: "bg-chart-3/8", border: "border-chart-3/15", hover: "group-hover:bg-chart-3/12", icon: "text-chart-3", badge: "bg-chart-3" },
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Décidez en confiance",
    description:
      "Fiabilité, pannes connues et juste prix : tout est là pour éviter les mauvais choix.",
    color: { bg: "bg-chart-4/8", border: "border-chart-4/15", hover: "group-hover:bg-chart-4/12", icon: "text-chart-4", badge: "bg-chart-4" },
  },
];

export function HowItWorksSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="how-it-works" className="py-24 lg:py-36 bg-accent/50">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto max-w-2xl text-center",
            isInView ? "animate-fade-up" : "opacity-0",
          )}
        >
          <h2 className="font-serif text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            3 étapes, quelques secondes, zéro prise de tête
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connector line */}
          <div
            className="pointer-events-none absolute top-24 right-[16.67%] left-[16.67%] hidden h-px bg-gradient-to-r from-chart-2/30 via-chart-3/30 to-chart-4/30 lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className={cn(
                  "relative",
                  isInView ? "animate-fade-up" : "opacity-0",
                )}
                style={{
                  animationDelay: isInView
                    ? `${200 + index * 150}ms`
                    : undefined,
                }}
              >
                <div className="group rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:border-foreground/15 hover:shadow-lg">
                  <div className="relative mx-auto mb-6 w-fit">
                    <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl border transition-colors duration-300", item.color.bg, item.color.border, item.color.hover)}>
                      <item.icon
                        className={cn("h-7 w-7", item.color.icon)}
                        aria-hidden="true"
                      />
                    </div>
                    <span className={cn("absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-primary-foreground", item.color.badge)}>
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Callout */}
        <div
          className={cn(
            "mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-card p-6 text-center",
            isInView ? "animate-fade-up" : "opacity-0",
          )}
          style={{ animationDelay: isInView ? "700ms" : undefined }}
        >
          <p className="text-lg font-medium text-card-foreground">
            Résultat : vous savez exactement ce que vous achetez
          </p>
          <p className="mt-2 text-muted-foreground">
            Plus de doutes, plus de mauvaises surprises. Achetez sereinement.
          </p>
        </div>
      </div>
    </section>
  );
}
