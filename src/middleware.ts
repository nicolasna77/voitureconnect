import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

// Edge-compatible: no Node.js APIs (no better-auth/crypto)
const intlMiddleware = createMiddleware(routing);

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

export default function middleware(request: NextRequest) {
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
    return NextResponse.next();
  }

  // Internationalization routing — auth protection is handled by
  // (protected)/layout.tsx and (protected)/admin/layout.tsx server components
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/api/blog/:path*",
    // Match all paths except Next.js internals and static assets
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
