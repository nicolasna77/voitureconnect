"use client";

import { Car, Heart, Search, BarChart3 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const audiences = [
  {
    icon: Car,
    title: "Acheteurs de véhicules d'occasion",
    description:
      "Évitez les mauvaises surprises et faites un achat en toute confiance.",
  },
  {
    icon: Heart,
    title: "Passionnés d'auto",
    description:
      "Explorez les détails techniques et la fiabilité de vos modèles favoris.",
  },
  {
    icon: Search,
    title: "Curieux avertis",
    description:
      "Comprenez avant d'acheter et prenez des décisions éclairées.",
  },
  {
    icon: BarChart3,
    title: "Professionnels",
    description:
      "Accédez à des données fiables pour conseiller vos clients.",
    badge: "Bientôt",
  },
];

export function AudienceSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 lg:py-36">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto max-w-2xl text-center",
            isInView ? "animate-fade-up" : "opacity-0",
          )}
        >
          <h2 className="font-serif text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            À qui s{"'"}adresse CarMetrix ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une solution pour tous ceux qui veulent acheter malin
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, i) => (
            <div
              key={audience.title}
              className={cn(
                "group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/15 hover:shadow-lg",
                isInView ? "animate-fade-up" : "opacity-0",
              )}
              style={{
                animationDelay: isInView ? `${150 + i * 100}ms` : undefined,
              }}
            >
              {audience.badge && (
                <span className="absolute top-4 right-4 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {audience.badge}
                </span>
              )}

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/50 transition-colors duration-300 group-hover:bg-secondary">
                <audience.icon
                  className="h-5 w-5 text-foreground/70"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {audience.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
