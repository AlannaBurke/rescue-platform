import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy — injects the current pathname as a request header so
 * the root layout (a Server Component) can detect admin routes and suppress
 * the public-facing Header and Footer.
 *
 * In Next.js 16, this file must be named proxy.ts and export a function
 * named `proxy` (or a default export). The `middleware` export name is
 * deprecated.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  // Expose the pathname to Server Components via a custom header
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  // Run on all routes except static assets and Next.js internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)).*)",
  ],
};
