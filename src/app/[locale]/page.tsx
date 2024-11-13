import PricingSection from "@/components/sections/price-section";
import HeroSection from "@/components/sections/hero-section";

import CategoriSection from "@/components/sections/categori-section";
import BenefitsSection from "@/components/sections/benefits-section";
import FeaturesSection from "@/components/sections/features-section";

export default function Home() {
  return (
    <div className="flex flex-col w-full ">
      <main className="m-auto  w-full">
        <HeroSection />
        <CategoriSection />
        <FeaturesSection />
        <BenefitsSection />
        <PricingSection />
      </main>
    </div>
  );
}
