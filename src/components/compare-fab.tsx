"use client";

import { useCompare } from "@/hooks/use-compare";
import { Link } from "@/i18n/routing";
import { GitCompareArrows } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CompareFab() {
  const { items } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      <Button
        asChild
        size="lg"
        className="rounded-full shadow-lg h-14 px-5 gap-2"
      >
        <Link href="/compare">
          <GitCompareArrows className="h-5 w-5" aria-hidden="true" />
          Comparer
          <Badge
            variant="secondary"
            className="ml-1 bg-primary-foreground text-primary h-6 w-6 p-0 flex items-center justify-center rounded-full"
          >
            {items.length}
          </Badge>
        </Link>
      </Button>
    </div>
  );
}
