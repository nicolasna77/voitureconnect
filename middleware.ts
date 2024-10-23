import { auth } from "@/lib/auth";

export default auth((req) => {
  const isProtectedRoute = ["/login", "/pro"].some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!req.auth && isProtectedRoute) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
