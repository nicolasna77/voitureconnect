"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "drivemetric-compare";
const MAX_ITEMS = 3;

export interface CompareItem {
  generationId: number;
  makeName: string;
  modelName: string;
  generationName: string;
}

let listeners: (() => void)[] = [];
let cachedSnapshot: CompareItem[] = [];
let cachedRaw: string | null = null;

function emitChange() {
  // Invalidate cache so next getSnapshot reads fresh data
  cachedRaw = null;
  for (const listener of listeners) {
    listener();
  }
}

function getSnapshot(): CompareItem[] {
  if (typeof window === "undefined") return EMPTY_ARRAY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    cachedSnapshot = raw ? JSON.parse(raw) : EMPTY_ARRAY;
    return cachedSnapshot;
  } catch {
    return EMPTY_ARRAY;
  }
}

const EMPTY_ARRAY: CompareItem[] = [];

function getServerSnapshot(): CompareItem[] {
  return EMPTY_ARRAY;
}

function subscribe(listener: () => void) {
  listeners.push(listener);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) emitChange();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners = listeners.filter((l) => l !== listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function setItems(items: CompareItem[]) {
  const json = JSON.stringify(items);
  localStorage.setItem(STORAGE_KEY, json);
  // Update cache immediately so getSnapshot returns the new value
  cachedRaw = json;
  cachedSnapshot = items;
  for (const listener of listeners) {
    listener();
  }
}

export function useCompare() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((item: CompareItem) => {
    const current = getSnapshot();
    if (current.length >= MAX_ITEMS) return;
    if (current.some((i) => i.generationId === item.generationId)) return;
    setItems([...current, item]);
  }, []);

  const remove = useCallback((generationId: number) => {
    const current = getSnapshot();
    setItems(current.filter((i) => i.generationId !== generationId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const isInCompare = useCallback(
    (generationId: number) => {
      return items.some((i) => i.generationId === generationId);
    },
    [items]
  );

  return { items, add, remove, clear, isInCompare, isFull: items.length >= MAX_ITEMS };
}
