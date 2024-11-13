"use client";

import { FilterIcon } from "lucide-react";
import { Button } from "../ui/button";
import { setClientFiltersCookie } from "@/lib/client-cookies";
import { useCallback, useState } from "react";

interface FilterToggleProps {
  defaultShowFilters: boolean;
  toggleFilters: () => void;
}

const FilterToggle = ({
  defaultShowFilters,
  toggleFilters,
}: FilterToggleProps) => {
  const [showFilters, setShowFilters] = useState(defaultShowFilters);

  const handleToggle = useCallback(() => {
    const newState = !showFilters;
    setShowFilters(newState);
    toggleFilters();
    setClientFiltersCookie(newState);
  }, [showFilters, toggleFilters]);

  return (
    <Button
      variant="outline"
      size="sm"
      aria-pressed={showFilters}
      onClick={handleToggle}
    >
      <FilterIcon className="h-4 w-4" />
      <span>Filtres</span>
    </Button>
  );
};
export default FilterToggle;
