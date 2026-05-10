import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// We use the edge-compatible version of auth for the middleware
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const user = session?.user;

  // 1. Define strictly what pages we are looking at
  const isSignInPage = nextUrl.pathname === "/signin";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isOnboardingRoute = nextUrl.pathname === "/onboarding";

  // LOG FOR DEBUGGING (Optional, remove in production)
  // console.log(`PATH: ${nextUrl.pathname} | ROLE: ${user?.role} | PW: ${user?.hasPassword}`);

  // 2. Redirect logged-in users away from Sign In
  if (isSignInPage && isLoggedIn) {
    const role = (user?.role || "").toLowerCase();
    return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/", nextUrl));
  }

  // 3. Admin Route Protection
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }

    const role = (user?.role || "").toLowerCase();
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    // Force onboarding if password is not set
    if (!user?.hasPassword) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }
  }

  // 4. Onboarding Protection
  if (isOnboardingRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/signin", nextUrl));
    
    if (user?.hasPassword) {
      const role = (user?.role || "").toLowerCase();
      return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/onboarding", "/dashboard/:path*"],
};