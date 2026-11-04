import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Paths that don't require authentication
const PUBLIC_PATHS = ["/", "/login", "/register", "/join", "/leaderboard", "/schedule", "/tv"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".css")
  ) {
    return NextResponse.next();
  }

  // Allow public paths (exact match or prefix for nested public routes)
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isPublic) return NextResponse.next();

  // ── Supabase SSR auth check ──────────────────────────────────────────────
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const isConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("your-project") &&
    !supabaseUrl.includes("placeholder") &&
    !supabaseAnonKey.includes("your-anon-key") &&
    !supabaseAnonKey.includes("placeholder")
  );

  // If Supabase credentials are placeholder or offline, allow local session navigation
  if (!isConfigured) {
    return response;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // getUser() safely verifies JWT
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (err) {
    console.warn("Middleware auth verification notice:", err);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all routes EXCEPT static files already handled by Next.js
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
