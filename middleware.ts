import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Protect /back-office routes with authentication
  if (req.nextUrl.pathname.startsWith("/back-office")) {
    // Check for auth token in cookies or localStorage (via client-side session)
    const authToken = req.cookies.get("authToken")?.value;

    // If no auth token, redirect to login page
    if (!authToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/back-office/:path*"],
};
