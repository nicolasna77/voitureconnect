"use client";

import dynamic from "next/dynamic";

const SearchWithFilters = dynamic(
  () =>
    import("@/components/specification/search-with-filters").then(
      (mod) => mod.SearchWithFilters,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-11 w-full animate-pulse rounded-lg bg-secondary/50" />
    ),
  },
);

export function HeroSearch() {
  return <SearchWithFilters />;
}
