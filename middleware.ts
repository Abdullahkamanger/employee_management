import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// We use the edge-compatible version of auth for the middleware
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const user = session?.user;

  console.log(`MIDDLEWARE: ${nextUrl.pathname} | LOGGED_IN: ${isLoggedIn} | STATUS: ${(user as any)?.status}`);

  // 1. Define routes
  const isSignInPage = nextUrl.pathname === "/signin";
  const isSignUpPage = nextUrl.pathname === "/signup";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isOnboardingRoute = nextUrl.pathname === "/onboarding";
  const isApprovalPage = nextUrl.pathname === "/approval-pending";

  const isPending = (user as any)?.status === "Pending";

  // 2. Redirect logged-in users away from Auth Pages
  if ((isSignInPage || isSignUpPage) && isLoggedIn) {
    if (isPending) {
        return NextResponse.redirect(new URL("/approval-pending", nextUrl));
    }
    const role = (user?.role || "").toLowerCase();
    return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/dashboard", nextUrl));
  }

  // 3. Approval Pending Logic
  if (isLoggedIn && isPending && !isApprovalPage) {
     // Allow logout if needed, but for now redirect all to pending
     return NextResponse.redirect(new URL("/approval-pending", nextUrl));
  }

  if (isLoggedIn && !isPending && isApprovalPage) {
     const role = (user?.role || "").toLowerCase();
     return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/dashboard", nextUrl));
  }

  // 4. Protection for Dashboard/Admin/Onboarding
  if (isAdminRoute || isDashboardRoute || isOnboardingRoute) {
    // SPECIAL CASE: Allow onboarding with token even if not logged in
    if (isOnboardingRoute && nextUrl.searchParams.has("token")) {
        return NextResponse.next();
    }

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/signin", nextUrl));
    }

    // Admin role check
    if (isAdminRoute) {
        const role = (user?.role || "").toLowerCase();
        if (role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
    }

    // Force onboarding if password is not set (and not pending)
    if (!isPending && !(user as any)?.hasPassword && !isOnboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    // Redirect away from onboarding if already set
    if (isOnboardingRoute && (user as any)?.hasPassword && !nextUrl.searchParams.has("token")) {
        const role = (user?.role || "").toLowerCase();
        return NextResponse.redirect(new URL(role === "admin" ? "/admin" : "/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/admin/:path*", 
    "/onboarding", 
    "/dashboard/:path*", 
    "/dashboard", 
    "/approval-pending",
    "/signin",
    "/signup"
  ],
};