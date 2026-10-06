type Env = Record<string, string | undefined>;

/**
 * Ads are opt-in: slots render (and reserve space) only when ADSTERRA_ENABLED is exactly "true".
 * Until then no placeholder is shown to visitors. Units and placements: lib/ads/adsterra.ts.
 */
export function adsEnabled(env: Env = process.env): boolean {
  return env.ADSTERRA_ENABLED === "true";
}

/** Monetag In-Page Push tag. Loaded site-wide only when MONETAG_ENABLED is exactly "true". */
export const monetagInPagePush = { src: "https://nap5k.com/tag.min.js", zone: "11963124" } as const;

export function monetagEnabled(env: Env = process.env): boolean {
  return env.MONETAG_ENABLED === "true";
}

/** Any ad network on: the CSP must accept the rotating third-party origins ad networks serve from. */
export function thirdPartyAdsEnabled(env: Env = process.env): boolean {
  return adsEnabled(env) || monetagEnabled(env);
}
