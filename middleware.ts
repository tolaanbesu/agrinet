import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Better Auth cookie names
    const sessionToken =
        request.cookies.get("better-auth.session_token") ||
        request.cookies.get("__Secure-better-auth.session_token");

    const isLoggedIn = !!sessionToken;

    // If user is logged in and trying to access auth pages (sign-in, sign-up), redirect to dashboard
    if (isLoggedIn && (pathname === "/sign-in" || pathname === "/sign-up")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Protect dashboard routes
    if (pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
        // Detailed role-based access will be handled by individual pages or layouts
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};