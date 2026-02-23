import dynamic from "next/dynamic";
import prisma from "@/prisma";
import { HeroSection } from "@/components/sections/hero-section";

const DEFAULT_PICTURE =
  "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

async function getHeroUsers() {
  return prisma.user.findMany({
    where: { picture: { not: DEFAULT_PICTURE } },
    select: { name: true, picture: true },
    orderBy: { id: "desc" },
    take: 4,
  });
}

// Lazy load below-the-fold sections (vercel-react-best-practices: bundle-dynamic-imports)
const FeaturesSection = dynamic(
  () =>
    import("@/components/sections/features-section").then(
      (mod) => mod.FeaturesSection,
    ),
  { ssr: true },
);

const TrustSection = dynamic(
  () =>
    import("@/components/sections/trust-section").then(
      (mod) => mod.TrustSection,
    ),
  { ssr: true },
);

const DemoSection = dynamic(
  () =>
    import("@/components/sections/demo-section").then(
      (mod) => mod.DemoSection,
    ),
  { ssr: true },
);

const AudienceSection = dynamic(
  () =>
    import("@/components/sections/audience-section").then(
      (mod) => mod.AudienceSection,
    ),
  { ssr: true },
);

const HowItWorksSection = dynamic(
  () =>
    import("@/components/sections/how-it-works-section").then(
      (mod) => mod.HowItWorksSection,
    ),
  { ssr: true },
);

const PricingSection = dynamic(
  () =>
    import("@/components/sections/pricing-section").then(
      (mod) => mod.PricingSection,
    ),
  { ssr: true },
);

const CTASection = dynamic(
  () =>
    import("@/components/sections/cta-section").then((mod) => mod.CTASection),
  { ssr: true },
);

export default async function Home() {
  const heroUsers = await getHeroUsers();

  return (
    <div className="flex flex-col w-full">
      <main className="w-full">
        <HeroSection users={heroUsers} />
        <FeaturesSection />
        <TrustSection />
        <DemoSection />
        <AudienceSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
    </div>
  );
}
