"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export function CTASection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 lg:py-36">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-primary/15 bg-card",
            isInView ? "animate-scale-in" : "opacity-0",
          )}
        >
          {/* Subtle gradient background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent" aria-hidden="true" />
          <div className="relative px-8 py-20 text-center lg:px-16 lg:py-28">
            <div
              className={cn(
                "mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-muted-foreground",
                isInView ? "animate-fade-up" : "opacity-0",
              )}
            >
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Prêt à commencer ?</span>
            </div>

            <h2
              className={cn(
                "mx-auto mt-8 max-w-3xl font-serif text-balance text-3xl font-bold text-card-foreground sm:text-4xl lg:text-5xl",
                isInView ? "animate-fade-up delay-100" : "opacity-0",
              )}
            >
              Découvrez la fiabilité de votre futur véhicule
            </h2>

            <p
              className={cn(
                "mx-auto mt-6 max-w-xl text-lg text-muted-foreground",
                isInView ? "animate-fade-up delay-200" : "opacity-0",
              )}
            >
              Rejoignez des milliers d{"'"}utilisateurs qui font confiance à
              DriveMetric pour leurs achats automobiles.
            </p>

            <div
              className={cn(
                "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row",
                isInView ? "animate-fade-up delay-300" : "opacity-0",
              )}
            >
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link href="/specification">
                  Analyser un véhicule maintenant
                  <ArrowRight
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="#features">En savoir plus</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
