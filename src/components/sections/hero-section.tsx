import { cache, Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Star,
  TrendingUp,
  Car,
  Gauge,
  Fuel,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

interface HeroUser {
  name: string;
  picture: string;
}

// ── Data fetching (per-request deduplication via React.cache) ─────────────────

const DEFAULT_PICTURE =
  "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

const getHeroUsers = cache(() =>
  prisma.user.findMany({
    where: { picture: { not: DEFAULT_PICTURE } },
    select: { name: true, picture: true },
    orderBy: { id: "desc" },
    take: 4,
  }),
);

// ── Static config ─────────────────────────────────────────────────────────────

const STATS = [
  { value: "15K+", key: "vehicles",    Icon: Car,         color: "text-chart-4" },
  { value: "50+",  key: "brands",      Icon: TrendingUp,  color: "text-chart-2" },
  { value: "98%",  key: "reliability", Icon: ShieldCheck, color: "text-chart-3" },
  { value: "4.9★", key: "rating",      Icon: Star,        color: "text-primary"  },
] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function HeroBadge({ label }: { label: string }) {
  return (
    <div className="animate-fade-up motion-reduce:animate-none inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary/80">
      <Zap className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function SocialProof({ users, label }: { users: HeroUser[]; label: string }) {
  if (!users.length) return null;
  const shown = users.slice(0, 4);
  return (
    <div
      className="animate-fade-up motion-reduce:animate-none flex items-center gap-3"
      aria-label={label}
    >
      <div className="flex -space-x-2.5" aria-hidden="true">
        {shown.map((u, i) => (
          <div
            key={`${u.name}-${i}`}
            className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-background"
          >
            <Image
              src={u.picture}
              alt={u.name}
              fill
              sizes="32px"
              className="object-cover"
              priority
            />
          </div>
        ))}
        {shown.length === 4 && (
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-semibold text-primary-foreground">
            +
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

async function SocialProofSection({ label }: { label: string }) {
  const users = await getHeroUsers();
  return <SocialProof users={users} label={label} />;
}

/** Mockup product card — illustrative UI preview, not real data */
function ProductMockup() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 select-none" aria-hidden="true">

      {/* Glow behind card */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-primary/10 blur-3xl" />

      {/* ── Main card ── */}
      <div className="relative rounded-2xl border border-border bg-card/95 shadow-2xl shadow-primary/10 backdrop-blur-sm overflow-hidden">

        {/* Card header bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Gauge className="h-3 w-3" />
            drivemetric.fr/specification/42
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Vehicle identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
              P
            </div>
            <div>
              <p className="font-semibold text-foreground leading-tight">Peugeot 308 II GTi</p>
              <p className="text-xs text-muted-foreground">2013 — 2021 · Compacte</p>
            </div>
            <div className="ml-auto shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Fiable
            </div>
          </div>

          {/* Reliability score */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Score de fiabilité</span>
              <span className="tabular-nums text-foreground">84 / 100</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
                style={{ width: "84%" }}
              />
            </div>
          </div>

          {/* Price range */}
          <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3.5 py-2.5">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Valeur marché</p>
              <p className="font-semibold text-foreground tabular-nums">8 500€ — 18 000€</p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>

          {/* Spec chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { Icon: Settings2, label: "1.6 THP" },
              { Icon: Gauge,     label: "208 ch" },
              { Icon: Fuel,      label: "Essence" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground"
              >
                <Icon className="h-3 w-3 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating top-right card — AI badge ── */}
      <div className="absolute -right-4 -top-4 flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-lg shadow-black/10">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Zap className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Analyse IA</p>
          <p className="text-xs font-semibold text-foreground">Complète</p>
        </div>
      </div>

      {/* ── Floating bottom-left card — problems count ── */}
      <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-lg shadow-black/10">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
          <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground">Problèmes connus</p>
          <p className="text-xs font-semibold text-foreground">3 identifiés</p>
        </div>
      </div>
    </div>
  );
}

// ── Main RSC ─────────────────────────────────────────────────────────────────

export async function HeroSection() {
  const t = await getTranslations("HomePage.hero");

  return (
    <section
      aria-label={t("sectionLabel")}
      className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32"
    >
      {/* ── Decorative background ── */}
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
        {/* Primary glow — anchored top-left on desktop */}
        <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
        {/* Secondary glow — bottom-right */}
        <div className="absolute -bottom-32 -right-20 h-96 w-[600px] rounded-full bg-chart-2/6 blur-[110px]" />
        {/* Subtle radial vignette — sharpens centre */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_20%_0%,transparent_50%,var(--background)_100%)]" />
        {/* Fine dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16 xl:gap-20">

          {/* ── Left column — text ── */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

            {/* Badge */}
            <HeroBadge label={t("badge")} />

            {/* Headline */}
            <h1 className="animate-fade-up motion-reduce:animate-none mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              {t("tagline").split("\n")[0]}
              <span className="mt-1 block bg-gradient-to-r from-primary via-primary/80 to-chart-2 bg-clip-text text-transparent">
                {t("tagline").split("\n")[1] ?? ""}
              </span>
            </h1>

            {/* Description */}
            <p className="animate-fade-up motion-reduce:animate-none mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("description")}
            </p>

            {/* CTAs */}
            <div className="animate-fade-up motion-reduce:animate-none mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <Button asChild size="lg" className="group w-full sm:w-auto">
                <Link href="/specification">
                  {t("ctaPrimary")}
                  <ArrowRight
                    className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="#how-it-works">{t("ctaSecondary")}</Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="animate-fade-up motion-reduce:animate-none mt-8 flex justify-center lg:justify-start">
              <Suspense>
                <SocialProofSection label={t("socialProof")} />
              </Suspense>
            </div>

            {/* Stats strip */}
            <dl className="animate-fade-up motion-reduce:animate-none mt-10 grid w-full grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {STATS.map(({ value, key, Icon, color }) => (
                <div key={key} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
                  </div>
                  <div>
                    <dd className={`text-lg font-bold tabular-nums leading-none ${color}`}>
                      {value}
                    </dd>
                    <dt className="mt-0.5 text-[11px] text-muted-foreground">
                      {t(`stats.${key}`)}
                    </dt>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Right column — product mockup ── */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:pl-8">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
