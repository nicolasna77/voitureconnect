import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatItem {
  value: string;
  label: string;
  colorClass: string;
}

// ── Static data (values never change — keep as constants, labels are i18n) ────

const STAT_VALUES = [
  { key: "vehicles" as const, value: "15K+", colorClass: "text-chart-4" },
  { key: "reliability" as const, value: "98%", colorClass: "text-chart-3" },
  { key: "brands" as const, value: "50+", colorClass: "text-chart-2" },
  { key: "rating" as const, value: "4.9/5", colorClass: "text-primary" },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function HeroBadge({ label }: { label: string }) {
  return (
    <div
      className="animate-fade-up motion-reduce:animate-none inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-muted-foreground"
      aria-hidden="false"
    >
      <Zap className="h-4 w-4 text-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function HeroHeadline({ brand, accent }: { brand: string; accent: string }) {
  return (
    <h1 className="animate-fade-up motion-reduce:animate-none delay-100 mt-8 font-serif text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-8xl">
      {brand}
      <span className="text-primary">{accent}</span>
    </h1>
  );
}

function HeroStats({ stats }: { stats: StatItem[] }) {
  return (
    <dl className="animate-fade-up motion-reduce:animate-none delay-500 mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card p-6 text-center">
          <dt className="sr-only">{stat.label}</dt>
          <dd className={`text-3xl font-bold lg:text-4xl ${stat.colorClass}`}>
            {stat.value}
          </dd>
          <p className="mt-1 text-sm text-muted-foreground" aria-hidden="true">
            {stat.label}
          </p>
        </div>
      ))}
    </dl>
  );
}

// ── Main RSC ─────────────────────────────────────────────────────────────────

export async function HeroSection() {
  const t = await getTranslations("HomePage.hero");

  const stats: StatItem[] = STAT_VALUES.map((s) => ({
    value: s.value,
    label: t(`stats.${s.key}`),
    colorClass: s.colorClass,
  }));

  return (
    <section
      role="banner"
      className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40"
      aria-label={t("sectionLabel")}
    >
      {/* Decorative background — pure CSS, no inline style */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Subtle primary glow — above-fold visual anchor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute -bottom-20 -left-32 h-80 w-80 rounded-full bg-chart-2/5 blur-[100px]" />
        <div className="absolute -bottom-20 -right-32 h-80 w-80 rounded-full bg-chart-4/5 blur-[100px]" />
        {/* Radial vignette to keep text readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,var(--background)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <HeroBadge label={t("badge")} />

          {/* Headline — brand name split for accent colour */}
          <HeroHeadline brand="Drive" accent="Metric" />

          {/* Value proposition — two lines, scannable */}
          <p className="animate-fade-up motion-reduce:animate-none delay-200 mt-6 text-xl font-medium text-foreground/70 sm:text-2xl lg:text-3xl">
            {t("tagline")}
          </p>

          {/* Supporting description */}
          <p className="animate-fade-up motion-reduce:animate-none delay-300 mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
            {t("description")}
          </p>

          {/* CTAs */}
          <div className="animate-fade-up motion-reduce:animate-none delay-400 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group w-full sm:w-auto"
            >
              <Link href="/specification">
                {t("ctaPrimary")}
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
              <Link href="#how-it-works">{t("ctaSecondary")}</Link>
            </Button>
          </div>

          {/* Social proof stats */}
          <HeroStats stats={stats} />
        </div>
      </div>
    </section>
  );
}
