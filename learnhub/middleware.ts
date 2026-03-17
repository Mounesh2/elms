import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
const { auth } = NextAuth(authConfig);
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // 1. Logged-in navigation redirects
  if (session?.user) {
    if (pathname === "/" || pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // 2. Protected routes logic
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isStudentRoute = pathname.startsWith("/home") || 
                         pathname.startsWith("/my-courses") || 
                         pathname.startsWith("/settings") || 
                         pathname.startsWith("/notifications");
  const isInstructorRoute = pathname.startsWith("/instructor");
  const isAdminRoute = pathname.startsWith("/admin");

  if (!session?.user && (isStudentRoute || isInstructorRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session?.user && isAuthRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 3. Specific role protection
  if (isInstructorRoute && session?.user?.role !== "instructor" && session?.user?.role !== "admin") {
     return NextResponse.redirect(new URL("/home", request.url));
  }

  if (isAdminRoute && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  const response = NextResponse.next();

  // Security Headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
