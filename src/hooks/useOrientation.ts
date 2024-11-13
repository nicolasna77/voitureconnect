"use client";

import { useState, useCallback } from "react";
import { setClientOrientationCookie } from "@/lib/client-cookies";

export type Orientation = "grid" | "list";

const useOrientation = (initialOrientation: Orientation) => {
  const [orientation, setOrientation] =
    useState<Orientation>(initialOrientation);

  const updateOrientation = useCallback((newOrientation: Orientation) => {
    setOrientation(newOrientation);
    setClientOrientationCookie(newOrientation);
  }, []);

  return { orientation, updateOrientation };
};

export default useOrientation;
