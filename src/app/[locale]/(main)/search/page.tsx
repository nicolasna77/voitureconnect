import { getOrientationFromCookie } from "@/lib/cookies";
import SearchClient from "./search-client";

export default async function SearchPage() {
  const initialOrientation = await getOrientationFromCookie();

  return <SearchClient initialOrientation={initialOrientation} />;
}
