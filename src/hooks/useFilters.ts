"use client";

import { useState, useCallback } from "react";
import { setClientFiltersCookie } from "@/lib/client-cookies";

const useFilters = (initialShowFilters: boolean) => {
  const [showFilters, setShowFilters] = useState(initialShowFilters);

  const toggleFilters = useCallback(() => {
    const newState = !showFilters;
    setShowFilters(newState);
    setClientFiltersCookie(newState);
  }, [showFilters]);

  return { showFilters, toggleFilters };
};

export default useFilters;
