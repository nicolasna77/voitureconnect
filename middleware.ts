import { auth } from "@/lib/auth";
import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./route";

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isLangRoute = nextUrl.pathname.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }
  if (isLoggedIn && isPublicRoute && !isAuthRoute && !isLangRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    return Response.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }
});

export const config = {
  matcher: ["/((?!.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
