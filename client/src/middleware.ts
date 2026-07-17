import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin pages except login (student portal is public lookup — no student JWT yet)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
