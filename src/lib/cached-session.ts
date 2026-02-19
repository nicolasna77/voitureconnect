import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Cached session getter — deduplicates auth.api.getSession() calls
 * within the same request scope (React.cache per-request memoization).
 */
export const getCachedSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
