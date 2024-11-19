import { getOrientationFromCookie, getFiltersFromCookie } from "@/lib/cookies";
import SearchClient from "./search-client";

export default async function SearchPage() {
  const initialOrientation = await getOrientationFromCookie();
  const initialShowFilters = await getFiltersFromCookie();

  return (
    <SearchClient
      initialOrientation={initialOrientation}
      initialShowFilters={initialShowFilters}
    />
  );
}
