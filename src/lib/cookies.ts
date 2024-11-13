"use server";

import { cookies } from "next/headers";

const ORIENTATION_COOKIE = "search-orientation";
const FILTERS_COOKIE = "search-filters";

export async function getCookieNames() {
  return {
    orientation: ORIENTATION_COOKIE,
    filters: FILTERS_COOKIE,
  };
}

export async function getOrientationFromCookie() {
  const cookieStore = cookies();
  return (
    (cookieStore.get(ORIENTATION_COOKIE)?.value as "grid" | "list") || "grid"
  );
}

export async function getFiltersFromCookie() {
  const cookieStore = cookies();
  return cookieStore.get(FILTERS_COOKIE)?.value === "true";
}
