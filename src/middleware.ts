import { NextRequest, NextResponse } from "next/server";
import proxy from "@/proxy";

// In-memory rate limit store: ip → { count, resetAt }
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for public blog API routes
  if (pathname.startsWith("/api/blog")) {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60", "Content-Type": "text/plain" },
      });
    }
  }

  return proxy(request);
}

export const config = {
  matcher: [
    "/api/blog/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)"],
};
