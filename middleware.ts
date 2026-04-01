import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "yours_admin_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookie = req.cookies.get(COOKIE_NAME);
    if (!cookie || cookie.value !== "true") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};

