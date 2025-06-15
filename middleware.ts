import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow access to login page and static assets
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next()
  }

  // For demo purposes, we'll allow all authenticated routes
  // In a real app, you would check the Firebase auth token here
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
