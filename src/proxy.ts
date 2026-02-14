import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";

// Create the intl middleware
const intlMiddleware = createMiddleware(routing);

// Hoisted regex for locale extraction (vercel-react-best-practices: js-hoist-regexp)
const LOCALE_REGEX = /^\/(en|fr)/;

// Use Set for O(1) lookups (vercel-react-best-practices: js-set-map-lookups)
const protectedRoutes = new Set(["/admin", "/user", "/pro", "/profile"]);
const adminRoutes = new Set(["/admin"]);
const authRoutes = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

// Check if path matches any route patterns
function matchesRoute(path: string, routes: Set<string>): boolean {
  // Remove locale prefix (e.g., /en, /fr)
  const pathWithoutLocale = path.replace(LOCALE_REGEX, "") || "/";

  // Check exact match first (O(1))
  if (routes.has(pathWithoutLocale)) {
    return true;
  }

  // Check prefix matches
  for (const route of routes) {
    if (pathWithoutLocale.startsWith(route + "/")) {
      return true;
    }
  }

  return false;
}

// Extract locale from path
function getLocale(pathname: string): string {
  const match = pathname.match(LOCALE_REGEX);
  return match?.[1] || "fr";
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early exit for API routes and Next.js internals (vercel-react-best-practices: js-early-exit)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.includes(".")
  ) {
    return intlMiddleware(request);
  }

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role;
  const isAdmin = userRole === "admin" || userRole === "ADMIN";

  // Check if trying to access protected route without auth
  if (matchesRoute(pathname, protectedRoutes) && !isAuthenticated) {
    const locale = getLocale(pathname);
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if trying to access admin route without admin role
  if (matchesRoute(pathname, adminRoutes) && !isAdmin) {
    const locale = getLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Redirect authenticated users away from auth routes
  if (matchesRoute(pathname, authRoutes) && isAuthenticated) {
    const locale = getLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
