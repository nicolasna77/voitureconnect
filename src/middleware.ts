import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import NextAuth from "next-auth";
import authConfig from "../auth.config";
import { NextResponse } from "next/server";

// Créer le middleware d'internationalisation
const intlMiddleware = createMiddleware(routing);

// Créer une instance auth spécifique pour le middleware
const { auth: middlewareAuth } = NextAuth(authConfig);

// Routes protégées qui nécessitent une authentification
const protectedPages = ["/profile", "/pro"];

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const session = await middlewareAuth();
  const isLoggedIn = !!session;
  const path = nextUrl.pathname;

  // Gérer les routes d'authentification
  if (path.startsWith("/api/auth") || path.startsWith("/_next")) {
    return intlMiddleware(req);
  }

  // Vérifier l'authentification pour les pages protégées
  const isProtectedPage = protectedPages.some(
    (page) => path.endsWith(page) || path.includes(`${page}/`)
  );

  if (isProtectedPage && !isLoggedIn) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Appliquer le middleware d'internationalisation
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|data|_next/image|favicon.ico).*)"],
};
