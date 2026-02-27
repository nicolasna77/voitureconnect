import { Wrench, ShieldCheck, AlertTriangle, Euro, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

const features = [
  {
    icon: Wrench,
    title: "Fiche technique complète",
    description: "Plus de 200 caractéristiques par véhicule : moteur, dimensions, consommation, équipements. Fini les recherches interminables.",
    stat: "200+",
    statLabel: "données par fiche",
    accent: { bg: "bg-primary/5", border: "border-primary/15", hoverBg: "group-hover:bg-primary/10", hoverBorder: "group-hover:border-primary/25", icon: "text-primary", stat: "text-primary" },
  },
  {
    icon: ShieldCheck,
    title: "Score de fiabilité",
    description: "Un score sur 10, calculé à partir de sources automobiles reconnues. Sachez exactement ce que vous achetez.",
    stat: "/10",
    statLabel: "score de fiabilité",
    accent: { bg: "bg-chart-3/8", border: "border-chart-3/15", hoverBg: "group-hover:bg-chart-3/12", hoverBorder: "group-hover:border-chart-3/25", icon: "text-chart-3", stat: "text-chart-3" },
  },
  {
    icon: AlertTriangle,
    title: "Pannes & problèmes connus",
    description: "Les pannes récurrentes, leur gravité et le kilométrage d'apparition. Anticipez les frais avant d'acheter.",
    stat: "3",
    statLabel: "niveaux de gravité",
    accent: { bg: "bg-destructive/5", border: "border-destructive/15", hoverBg: "group-hover:bg-destructive/10", hoverBorder: "group-hover:border-destructive/25", icon: "text-destructive", stat: "text-destructive" },
  },
  {
    icon: Euro,
    title: "Estimation du juste prix",
    description: "Fourchette de prix min/max basée sur l'état et la fiabilité. Ne payez jamais au-dessus du marché.",
    stat: "Min/Max",
    statLabel: "estimation précise",
    accent: { bg: "bg-chart-2/8", border: "border-chart-2/15", hoverBg: "group-hover:bg-chart-2/12", hoverBorder: "group-hover:border-chart-2/25", icon: "text-chart-2", stat: "text-chart-2" },
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-36 bg-accent overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-widest text-accent-foreground">
                Pourquoi DriveMetric
              </p>
              <h2 className="mt-3 font-serif text-balance text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                Tout savoir avant
                <br />de signer
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground leading-relaxed lg:text-right">
              4 analyses complémentaires qui vous évitent les mauvaises surprises
              et les achats regrettés.
            </p>
          </div>
        </Reveal>

        <Reveal animation="animate-fade-in" delay={200}>
          <div className="mt-10 h-px bg-border" />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={200 + i * 100}>
              <div className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/15 hover:shadow-lg sm:p-8">
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${feature.accent.bg} ${feature.accent.border} ${feature.accent.hoverBg} ${feature.accent.hoverBorder}`}>
                    <feature.icon className={`h-5 w-5 ${feature.accent.icon}`} aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/0 transition-all duration-300 group-hover:text-muted-foreground group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5">
                      <span className={`text-sm font-semibold ${feature.accent.stat}`}>{feature.stat}</span>
                      <span className="text-xs text-muted-foreground">{feature.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
