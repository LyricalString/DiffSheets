import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle .md requests - redirect to API for markdown content
  if (pathname.endsWith(".md")) {
    // Remove .md extension and redirect to API
    const path = pathname.slice(0, -3);
    const url = new URL(`/api/md?path=${encodeURIComponent(path)}`, request.url);
    return NextResponse.rewrite(url);
  }

  // Handle all other requests with intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files (except .md which we handle)
  // - Internal Next.js paths
  matcher: [
    // Match .md files for AI consumption
    "/(.*)\\.md",
    // Match all pathnames except for API, static files, Next.js internals
    "/((?!api|_next|_vercel|og|.*\\..*).*)",
  ],
};
