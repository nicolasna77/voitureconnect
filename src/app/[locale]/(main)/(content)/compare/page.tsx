"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCompare } from "@/hooks/use-compare";
import { CompareContent } from "@/components/compare-content";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const { add, items } = useCompare();

  // Load vehicles from URL params on first visit (shareable links)
  useEffect(() => {
    const idsParam = searchParams.get("ids");
    const namesParam = searchParams.get("names");
    if (!idsParam) return;

    const ids = idsParam.split(",").map(Number).filter(Boolean);
    const names = namesParam ? namesParam.split("|") : [];

    ids.forEach((id, i) => {
      const nameParts = names[i]?.split(":") || [];
      add({
        generationId: id,
        makeName: nameParts[0] || "",
        modelName: nameParts[1] || "",
        generationName: nameParts[2] || `Génération ${id}`,
      });
    });
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <CompareContent className="py-6" showShareButton />;
}
