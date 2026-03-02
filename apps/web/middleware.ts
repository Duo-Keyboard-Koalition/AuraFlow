import { type NextRequest, NextResponse } from "next/server"

// Define protected and public routes
const protectedRoutes = ["/profile", "/match", "/results", "/dashboard"]
const publicRoutes = [
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
  "/",
  "/philosophy",
  "/synergy",
  "/mission",
  "/contact",
]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path) || path.startsWith("/auth")

  // For AWS Cognito, we'll let the client-side handle authentication
  // The middleware will only handle basic route protection
  // AWS Cognito handles session management automatically

  // Redirect to signin if accessing protected route
  if (isProtectedRoute) {
    // Let the client-side AuthContext handle the redirect
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (path.startsWith("/auth")) {
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
