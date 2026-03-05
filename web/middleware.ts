import { type NextRequest, NextResponse } from "next/server"

// Define protected and public routes
const protectedRoutes = ["/profile", "/match", "/results", "/dashboard"]
const publicRoutes = [
  "/auth",
  "/",
  "/philosophy",
  "/synergy",
  "/mission",
  "/contact",
]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // For UI development, we let the client-side AuthContext handle authentication
  // The middleware only handles basic route protection

  // Redirect to signin if accessing protected route
  if (isProtectedRoute) {
    // Let the client-side AuthContext handle the redirect
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}
