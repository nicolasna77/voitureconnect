import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Specification } from "./types";
import { sortCategories } from "./category-config";
import { AnimatedSection } from "./animated-section";
import { CategoryCard } from "./category-card";

export function AllSpecifications({
  specsByCategory,
}: {
  specsByCategory: Record<string, Specification[]>;
}) {
  const categories = sortCategories(Object.entries(specsByCategory));

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Aucune spécification disponible pour cette motorisation.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalSpecs = categories.reduce(
    (sum, [, specs]) => sum + specs.length,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-balance">
          Caractéristiques
        </h2>
        <Badge variant="outline" className="tabular-nums text-sm">
          {totalSpecs} specs
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categories.map(([category, specs], index) => (
          <AnimatedSection key={category} delay={index * 60}>
            <CategoryCard category={category} specifications={specs} />
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
