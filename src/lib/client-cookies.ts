"use client";

export function setClientOrientationCookie(orientation: "grid" | "list") {
  document.cookie = `search-orientation=${orientation}; path=/; max-age=31536000`;
}

export function getClientOrientationCookie(): "grid" | "list" {
  const cookies = document.cookie.split(";");
  const orientationCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("search-orientation=")
  );
  return (
    (orientationCookie?.split("=")[1]?.trim() as "grid" | "list") || "grid"
  );
}

export function setClientFiltersCookie(showFilters: boolean) {
  document.cookie = `search-filters=${showFilters}; path=/; max-age=31536000`;
}

export function getClientFiltersCookie(): boolean {
  const cookies = document.cookie.split(";");
  const filtersCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("search-filters=")
  );
  return filtersCookie?.split("=")[1]?.trim() === "true";
}
