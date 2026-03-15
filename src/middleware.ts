import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const COOKIE_NAME = "portal_verified";

// Rotas que exigem o cookie de acesso antes do OAuth
const PROTECTED_PATHS = ["/api/auth/signin"];

function signCode(code: string): string {
  return createHmac("sha256", process.env.AUTH_SECRET!)
    .update(code.trim().toUpperCase())
    .digest("hex");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME)?.value;

  if (!cookie) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const isValidFormat = /^[a-f0-9]{64}$/.test(cookie);
  if (!isValidFormat) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/signin/:path*"],
};