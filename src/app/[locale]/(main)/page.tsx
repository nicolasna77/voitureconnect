import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { TrustSection } from "@/components/sections/trust-section";
import { DemoSection } from "@/components/sections/demo-section";
import { AudienceSection } from "@/components/sections/audience-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { CTASection } from "@/components/sections/cta-section";

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
