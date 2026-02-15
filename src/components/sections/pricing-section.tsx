"use client";

import { useRouter } from "next/navigation";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { PricingCards } from "@/components/pricing-cards";

export function PricingSection() {
  const { ref, isInView } = useInView();
  const router = useRouter();

  const handlePurchase = async (packageId: string) => {
    router.push(`/credits?package=${packageId}`);
  };

  return (
    <section id="pricing" className="py-24 lg:py-36">
      <div
        ref={ref}
        className={cn(
          "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          isInView ? "animate-fade-up" : "opacity-0"
        )}
      >
        <PricingCards onPurchase={handlePurchase} />
      </div>
    </section>
  );
}
