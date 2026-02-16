"use client";

import { Car, Heart, Search, BarChart3 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const audiences = [
  {
    icon: Car,
    title: "Acheteurs d'occasion",
    description:
      "Vous cherchez une voiture d'occasion ? Évitez les pièges et achetez au juste prix.",
    color: { bg: "bg-primary/5", border: "border-primary/15", hoverBg: "group-hover:bg-primary/10", hoverBorder: "group-hover:border-primary/25", icon: "text-primary" },
  },
  {
    icon: Heart,
    title: "Passionnés d'auto",
    description:
      "Comparez les motorisations, explorez les fiches techniques et trouvez la perle rare.",
    color: { bg: "bg-destructive/5", border: "border-destructive/15", hoverBg: "group-hover:bg-destructive/10", hoverBorder: "group-hover:border-destructive/25", icon: "text-destructive" },
  },
  {
    icon: Search,
    title: "Acheteurs prudents",
    description:
      "Vous voulez être sûr de votre choix ? DriveMetric vous donne les faits, pas des opinions.",
    color: { bg: "bg-chart-3/8", border: "border-chart-3/15", hoverBg: "group-hover:bg-chart-3/12", hoverBorder: "group-hover:border-chart-3/25", icon: "text-chart-3" },
  },
  {
    icon: BarChart3,
    title: "Professionnels",
    description:
      "Garagistes, mandataires : des données fiables pour conseiller vos clients.",
    badge: "Bientôt",
    color: { bg: "bg-chart-2/8", border: "border-chart-2/15", hoverBg: "group-hover:bg-chart-2/12", hoverBorder: "group-hover:border-chart-2/25", icon: "text-chart-2" },
  },
];

export function AudienceSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/4 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-chart-2/4 blur-[120px]" aria-hidden="true" />
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "mx-auto max-w-2xl text-center",
            isInView ? "animate-fade-up" : "opacity-0",
          )}
        >
          <h2 className="font-serif text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            À qui s{"'"}adresse DriveMetric ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Que vous soyez novice ou expert, DriveMetric vous fait gagner du temps et de l{"'"}argent
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

              <div className={cn("mb-4 flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300", audience.color.bg, audience.color.border, audience.color.hoverBg, audience.color.hoverBorder)}>
                <audience.icon
                  className={cn("h-5 w-5 transition-colors duration-300", audience.color.icon)}
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
