/**
 * Ads are opt-in: slots render (and reserve space) only when ADSTERRA_ENABLED is exactly "true".
 * Until then no placeholder is shown to visitors.
 */
export function adsEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.ADSTERRA_ENABLED === "true";
}
