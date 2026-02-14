"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import SpecificationSearch from "@/components/specification/specification-search";

const stats = [
  { value: "15K+", label: "Véhicules analysés" },
  { value: "98%", label: "Précision IA" },
  { value: "50+", label: "Marques couvertes" },
  { value: "4.9/5", label: "Note utilisateurs" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
      {/* Single subtle glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-600px w-800px rounded-full bg-foreground/2 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-2 text-sm font-medium text-muted-foreground">
            <Sparkles
              className="h-4 w-4 text-foreground/50"
              aria-hidden="true"
            />
            <span>Propulsé par l{"'"}Intelligence Artificielle</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-100 mt-8 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-8xl">
            Car<span className="text-primary">Metrix</span>
          </h1>

          <p className="animate-fade-up delay-200 mt-6 text-xl font-medium text-foreground/70 sm:text-2xl lg:text-3xl">
            Analyse intelligente de la fiabilité
            <br className="hidden sm:block" />
            et de la valeur des véhicules
          </p>

          <p className="animate-fade-up delay-300 mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Fiches techniques complètes, fiabilité notée par IA, estimation de
            prix et problèmes connus — basés sur des sources fiables.
          </p>

          {/* Search bar */}
          <div className="animate-fade-up delay-400 mx-auto mt-10 max-w-xl">
            <SpecificationSearch
              placeholder="Rechercher une marque ou un modèle..."
              size="lg"
            />
          </div>

          {/* Quick actions */}
          <div className="animate-fade-up delay-500 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant={"secondary"}
              className="group w-full sm:w-auto"
            >
              <Link href="/specification">
                Voir toutes les fiches
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
              <Link href="#how-it-works">Découvrir comment ça marche</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up delay-600 mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card p-6 text-center">
                <p className="text-3xl font-bold text-foreground lg:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
