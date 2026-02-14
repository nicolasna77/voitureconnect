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
  },
  {
    icon: Cpu,
    step: "02",
    title: "CarMetrix analyse",
    description:
      "Notre IA analyse les données et croise des milliers de sources automobiles.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Obtenez vos résultats",
    description:
      "Fiabilité, problèmes connus et estimation de prix en quelques secondes.",
  },
];

export function HowItWorksSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="how-it-works" className="py-24 lg:py-36">
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
            Simple, rapide et efficace
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connector line */}
          <div
            className="pointer-events-none absolute top-24 right-[16.67%] left-[16.67%] hidden h-px bg-border lg:block"
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
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary/50 transition-colors duration-300 group-hover:bg-secondary">
                      <item.icon
                        className="h-7 w-7 text-foreground/70"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
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
            Décision plus éclairée, moins de mauvaises surprises
          </p>
          <p className="mt-2 text-muted-foreground">
            CarMetrix vous donne toutes les informations nécessaires pour
            acheter sereinement.
          </p>
        </div>
      </div>
    </section>
  );
}
