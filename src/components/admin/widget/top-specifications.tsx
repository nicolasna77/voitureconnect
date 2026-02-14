"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SpecAccessEntry } from "@/types/admin";

interface TopSpecificationsProps {
  className?: string;
  specifications: SpecAccessEntry[];
  loading?: boolean;
}

export function TopSpecifications({
  className,
  specifications,
  loading = false,
}: TopSpecificationsProps) {
  if (loading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Top Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-[180px] animate-pulse bg-muted rounded" />
                  <div className="h-3 w-[120px] animate-pulse bg-muted rounded" />
                </div>
                <div className="h-4 w-[60px] animate-pulse bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Top Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {specifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun accès aux spécifications
              </p>
            ) : (
              specifications.map((spec, index) => (
                <div
                  key={`${spec.specificationId}-${spec.specificationType}`}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      #{index + 1} Spec {spec.specificationId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {spec.specificationType} &middot; {spec.accessCount} accès
                    </p>
                  </div>
                  <div className="text-sm font-medium tabular-nums">
                    {spec.totalCreditsSpent} crédits
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
