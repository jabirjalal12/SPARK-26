import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and public paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/" ||
    pathname === "/join" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".js")
  ) {
    return NextResponse.next();
  }

  // Read role cookie if set
  const userRole = request.cookies.get("fest_role")?.value || "organizer";

  // Route-based guards
  if (pathname.startsWith("/organizer") && userRole !== "organizer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/faculty") && userRole !== "faculty" && userRole !== "organizer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/volunteer") && userRole !== "volunteer" && userRole !== "organizer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/judge") && userRole !== "judge" && userRole !== "organizer") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};