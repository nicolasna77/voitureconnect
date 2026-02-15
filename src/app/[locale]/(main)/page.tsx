import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero-section";

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

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <main className="w-full">
        <HeroSection />
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
