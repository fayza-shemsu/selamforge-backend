import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth-constants";
import { decodeTokenClaims, isTokenExpired, roleCanAccess } from "@/lib/auth-token";

const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/dashboard/settings", "/dashboard/org-units"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const claims = decodeTokenClaims(token);

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token || isTokenExpired(claims)) {
      return NextResponse.redirect(new URL("/login?expired=1", request.url));
    }
  }

  if (
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    !roleCanAccess(claims?.role, ["admin"])
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
