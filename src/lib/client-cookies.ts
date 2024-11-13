"use client";

export function setClientOrientationCookie(orientation: "grid" | "list") {
  document.cookie = `search-orientation=${orientation}; path=/; max-age=31536000`;
}

export function setClientFiltersCookie(showFilters: boolean) {
  document.cookie = `search-filters=${showFilters}; path=/; max-age=31536000`;
}
