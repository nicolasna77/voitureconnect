"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

const FEATURED = [
  {
    name: "Renault Clio V",
    excerpt:
      "Fiabilité éprouvée, coûts d'entretien maîtrisés, idéale en usage quotidien.",
    reliability: 87,
    marketValue: "12 800",
  },
  {
    name: "Volkswagen Golf VIII",
    excerpt:
      "Polyvalente et bien équipée, excellent rapport qualité / revente.",
    reliability: 81,
    marketValue: "22 500",
  },
  {
    name: "Peugeot 208 II",
    excerpt:
      "Design moderne, disponible en électrique, forte demande sur le marché.",
    reliability: 84,
    marketValue: "15 900",
  },
];

const FALLBACK_AVATARS = [11, 12, 13, 14];

interface HeroUser {
  name: string;
  picture: string;
}

export function HeroSection({ users = [] }: { users?: HeroUser[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + FEATURED.length) % FEATURED.length);
  const next = () => setIdx((i) => (i + 1) % FEATURED.length);
  const vehicle = FEATURED[idx];

  return (
    <section className="relative w-full overflow-hidden bg-secondary">
      {/* ── Background ─────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--secondary)_78%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-primary/8 blur-[130px]" />
        <div className="absolute -bottom-20 -left-32 h-80 w-80 rounded-full bg-chart-2/5 blur-[100px]" />
        <div className="absolute -bottom-20 -right-32 h-80 w-80 rounded-full bg-chart-4/5 blur-[100px]" />
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12 pt-20 pb-10 lg:pt-28 lg:pb-12 grid lg:grid-cols-2 gap-12 items-center">

        {/* ── LEFT ─────────────────────────────────────────────────────────── */}
        <div className="space-y-8">

          {/* Badge */}
          <div className="animate-fade-up motion-reduce:animate-none inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Analyse automobile nouvelle génération</span>
          </div>

          {/* Heading — single <h1>, second line as <p> styled identically */}
          <div
            className="animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: "80ms" }}
          >
            <h1 className="text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-foreground text-balance">
              Achetez en confiance,
            </h1>
            <p className="text-5xl lg:text-6xl font-light italic mt-2 text-foreground/60 text-balance" aria-hidden="true">
              analysez d&apos;abord.
            </p>
          </div>

          {/* CTA */}
          <div
            className="animate-fade-up motion-reduce:animate-none"
            style={{ animationDelay: "160ms" }}
          >
            <Link
              href="/specification"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3 rounded-full transition-colors font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Analyser un véhicule gratuitement
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="animate-fade-up motion-reduce:animate-none flex items-center gap-5 pt-2"
            style={{ animationDelay: "240ms" }}
          >
            <div className="flex -space-x-3" aria-hidden="true">
              {users.length > 0
                ? users.slice(0, 4).map((u) => (
                    <Image
                      key={u.picture}
                      src={u.picture}
                      alt={u.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-secondary object-cover"
                    />
                  ))
                : FALLBACK_AVATARS.map((n) => (
                    <Image
                      key={n}
                      src={`https://i.pravatar.cc/40?img=${n}`}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full border-2 border-secondary object-cover"
                    />
                  ))}
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground tabular-nums">
                15k<span className="text-primary">+</span>
              </p>
              <p className="text-sm text-muted-foreground">Utilisateurs satisfaits</p>
            </div>
          </div>

          {/* Description */}
          <p
            className="animate-fade-up motion-reduce:animate-none text-muted-foreground max-w-md text-base leading-relaxed"
            style={{ animationDelay: "300ms" }}
          >
            Fiches techniques, score de fiabilité, problèmes connus et
            estimation de la valeur marché — tout ce qu&apos;il faut pour choisir
            le bon véhicule, en quelques secondes.
          </p>
        </div>

        {/* ── RIGHT ────────────────────────────────────────────────────────── */}
        <div
          className="animate-fade-up motion-reduce:animate-none relative min-h-[480px] lg:min-h-[560px]"
          style={{ animationDelay: "120ms" }}
        >
          {/* Circle */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div className="w-[400px] h-[400px] lg:w-[480px] lg:h-[480px] bg-card rounded-full shadow-2xl border border-border/40" />
          </div>

          {/* Car image — full available width, card overlaps naturally on top-right */}
          <div className="relative z-10 flex items-end justify-center h-full pb-4">
            <Image
              src="/hero/renault-clio-removebg-preview.png"
              alt="Véhicule analysé"
              width={820}
              height={520}
              className="w-full max-w-[520px] lg:max-w-[640px] h-auto object-contain drop-shadow-2xl"
              priority
            />
          </div>

          {/* Floating analysis card */}
          <div
            className="hidden sm:block absolute top-6 right-0 bg-card border border-border shadow-2xl rounded-2xl p-5 w-64 space-y-4 z-20"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Stats row */}
            <div className="flex justify-between gap-3">
              <div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {vehicle.reliability}
                    <span className="text-primary text-sm font-semibold">/100</span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Score fiabilité</p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {vehicle.marketValue}
                    <span className="text-primary text-sm font-semibold">€</span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Valeur marché</p>
              </div>
            </div>

            {/* Vehicle info */}
            <div>
              <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
                {vehicle.name}
              </h3>
              <p className="text-muted-foreground text-xs mt-1 leading-snug line-clamp-2">
                {vehicle.excerpt}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Véhicule précédent"
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Véhicule suivant"
                >
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
              <Link
                href="/specification"
                className="w-11 h-11 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`Analyser ${vehicle.name}`}
              >
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
