"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import SpecificationSearch from "@/components/specification/specification-search";

const stats = [
  { value: "15K+", label: "Véhicules analysés", color: "text-chart-4" },
  { value: "98%", label: "Précision IA", color: "text-chart-3" },
  { value: "50+", label: "Marques couvertes", color: "text-chart-2" },
  { value: "4.9/5", label: "Note utilisateurs", color: "text-primary" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Radial fade so the grid fades out toward edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_70%)]" />
        {/* Subtle primary glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-150 w-200 rounded-full bg-primary/4 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Propulsé par l{"'"}Intelligence Artificielle</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-100 mt-8 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-8xl">
            Drive<span className="text-primary">Metric</span>
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
                <p className={`text-3xl font-bold lg:text-4xl ${stat.color}`}>
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
