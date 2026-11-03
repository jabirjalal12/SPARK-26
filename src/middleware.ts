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
    pathname === "/leaderboard" ||
    pathname === "/schedule" ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".js")
  ) {
    return NextResponse.next();
  }

  // Obsolete judge route -> redirect to organizer scoring
  if (pathname.startsWith("/judge")) {
    return NextResponse.redirect(new URL("/organizer/scoring", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
