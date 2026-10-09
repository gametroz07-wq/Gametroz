type Env = Record<string, string | undefined>;

/**
 * Google Analytics 4 is opt-in: it loads only when NEXT_PUBLIC_GA_ID is a well-formed measurement
 * ID ("G-" plus uppercase letters/digits, surrounding whitespace ignored). Unset, empty or
 * malformed means analytics is off: no script, no CSP change. Read at build time.
 */
export function gaMeasurementId(env: Env = process.env): string | null {
  const id = env.NEXT_PUBLIC_GA_ID?.trim();
  return id && /^G-[A-Z0-9]+$/.test(id) ? id : null;
}

export function gtagSrc(id: string): string {
  return `https://www.googletagmanager.com/gtag/js?id=${id}`;
}

/**
 * Inline bootstrap run next to gtag.js. The default config sends the first page_view; later
 * App Router navigations are reported by GA4 enhanced measurement (history changes), so no
 * manual page_view is sent here and nothing is counted twice.
 */
export function gtagBootstrapScript(id: string): string {
  return [
    "window.dataLayer = window.dataLayer || [];",
    "function gtag(){dataLayer.push(arguments);}",
    'gtag("js", new Date());',
    `gtag("config", ${JSON.stringify(id)});`,
  ].join("\n");
}
