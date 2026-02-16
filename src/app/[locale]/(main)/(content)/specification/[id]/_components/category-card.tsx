import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Specification } from "./types";
import { getCategoryConfig } from "./category-config";
import { SpecificationGrid } from "./specification-grid";

export function CategoryCard({
  category,
  specifications,
}: {
  category: string;
  specifications: Specification[];
}) {
  const config = getCategoryConfig(category);

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              config.bgColor,
              config.color,
            )}
            aria-hidden="true"
          >
            {config.icon}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {config.label}
            </CardTitle>
            <Badge
              variant="secondary"
              className="tabular-nums shrink-0 text-xs"
            >
              {specifications.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-0">
        <SpecificationGrid specifications={specifications} />
      </CardContent>
    </Card>
  );
}
