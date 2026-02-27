import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Reveal } from "@/components/reveal";

export function CTASection() {
  return (
    <section className="py-24 lg:py-36 bg-accent/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal animation="animate-scale-in">
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-3/3 to-chart-4/5" aria-hidden="true" />
            <div className="relative px-8 py-20 text-center lg:px-16 lg:py-28">
              <Reveal>
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Gratuit pour commencer</span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h2 className="mx-auto mt-8 max-w-3xl font-serif text-balance text-3xl font-bold text-card-foreground sm:text-4xl lg:text-5xl">
                  Arrêtez de deviner,{" "}
                  <span className="text-primary">commencez à savoir</span>
                </h2>
              </Reveal>

              <Reveal delay={200}>
                <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                  Des milliers d{"'"}acheteurs utilisent déjà DriveMetric pour éviter
                  les mauvaises affaires. Lancez votre première analyse maintenant.
                </p>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="group w-full sm:w-auto">
                    <Link href="/specification">
                      Lancer une analyse gratuite
                      <ArrowRight
                        className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                    <Link href="#features">Voir les fonctionnalités</Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
