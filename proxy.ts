import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const PUBLIC_PATHS = ["/play", "/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (isPublic) return NextResponse.next();

  const token = request.cookies.get("guitstrum_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/play", request.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.redirect(new URL("/play", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|audio-processor.js).*)",
  ],
};
