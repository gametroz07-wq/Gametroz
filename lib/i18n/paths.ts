import { defaultLocale, isLocale, type Locale } from "./config";

/** What the proxy does with a request pathname. */
export type LocalePathDecision =
  | { action: "next" }
  | { action: "rewrite"; pathname: string }
  | { action: "redirect"; pathname: string }
  | { action: "notFound" };

function firstSegment(pathname: string): string {
  return pathname.split("/", 2)[1] ?? "";
}

/** Drops a leading locale segment (`/es/games` -> `/games`); anything else is returned unchanged. */
export function stripLocale(pathname: string): string {
  const segment = firstSegment(pathname);
  if (!isLocale(segment)) return pathname;
  return pathname.slice(segment.length + 1) || "/";
}

/** Public URL path for a locale. The default locale stays unprefixed. */
export function withLocale(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Locale of a public pathname (what the browser shows); unprefixed means the default locale. */
export function localeFromPathname(pathname: string): Locale {
  const segment = firstSegment(pathname);
  return isLocale(segment) ? segment : defaultLocale;
}

/**
 * Routing policy for a localized page request:
 * - `/en...` redirects to the unprefixed URL, so English has exactly one public URL.
 * - `/es...` passes through when Spanish is enabled and is a 404 otherwise.
 * - everything else (including unknown first segments such as `/fr`) is an unprefixed English
 *   URL, rewritten to the `en` segment without changing the address; unknown paths still 404 there.
 */
export function resolveLocalePath(pathname: string, options: { spanishEnabled: boolean }): LocalePathDecision {
  const segment = firstSegment(pathname);
  if (segment === defaultLocale) return { action: "redirect", pathname: stripLocale(pathname) };
  if (isLocale(segment)) return options.spanishEnabled ? { action: "next" } : { action: "notFound" };
  return { action: "rewrite", pathname: `/${defaultLocale}${pathname === "/" ? "" : pathname}` };
}
