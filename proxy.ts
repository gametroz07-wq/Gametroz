import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, spanishEnabled } from "@/lib/i18n/config";
import { resolveLocalePath } from "@/lib/i18n/paths";

// Thin adapter: the routing policy lives in lib/i18n/paths.ts (unit-tested).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const decision = resolveLocalePath(pathname, { spanishEnabled: spanishEnabled() });
  const url = request.nextUrl.clone();

  switch (decision.action) {
    case "next":
      return NextResponse.next();
    case "rewrite":
      url.pathname = decision.pathname;
      return NextResponse.rewrite(url);
    case "redirect":
      url.pathname = decision.pathname;
      return NextResponse.redirect(url, 308);
    case "notFound":
      // `/es` while Spanish is off: serve it as an unknown English path, which renders the regular
      // 404 page (`/en/es/...` matches no route) instead of a redirect or an English 200.
      url.pathname = `/${defaultLocale}${pathname}`;
      return NextResponse.rewrite(url);
  }
}

// Only localized pages go through the proxy. Skipped: API routes, Next internals, the OG image
// route, and anything whose last segment has a file extension: the metadata files (sitemap.xml,
// robots.txt, llms.txt), the Monetag service worker (sw.js) and the rest of public/. The extension
// test is written as [.] because path-to-regexp strips the backslash from an escaped dot.
export const config = {
  matcher: ["/((?!api(?:/|$)|_next/|og(?:/|$)|.*[.][^/]*$).*)"],
};
