// Security headers for every response. Pure functions so the policy is unit-tested and documented
// in one place (docs/13_DEPLOYMENT.md §4, docs/12_GAME_PROVIDERS.md §5).

export type SecurityHeaderOptions = {
  isDev: boolean;
  embedsEnabled: boolean;
  indexingEnabled: boolean;
  /** Any ad network on (lib/ads/config.ts). */
  adsEnabled: boolean;
  /** Google Analytics 4 on (lib/analytics/config.ts). Optional: off when omitted. */
  analyticsEnabled?: boolean;
  /** Exact https origins of allowlisted game providers (no wildcards). */
  frameOrigins: string[];
};

/**
 * CSP without nonces (Next.js guide) so pages stay static/ISR. 'unsafe-inline' covers the Next.js
 * runtime payload and the theme script. Only frame-src changes with embeds: the game iframe is a
 * cross-origin document, so its own scripts, ads, images and connections are governed by the
 * provider's policy, not ours. Our page loads images through /_next/image (same origin).
 *
 * Ad networks serve scripts, creatives and beacons from rotating domains, so an exact allowlist
 * cannot hold: with ads on, the directives an ad needs accept any https origin (this also governs
 * importScripts in public/sw.js). The rest of the policy stays locked either way.
 *
 * Google Analytics 4 adds only its own origins to script-src, img-src and connect-src (regional
 * collection hosts such as region1.google-analytics.com need the subdomain wildcard). The inline
 * gtag bootstrap is already covered by 'unsafe-inline'. Ads on already accept any https origin.
 */
export function buildContentSecurityPolicy({ isDev, embedsEnabled, adsEnabled, analyticsEnabled = false, frameOrigins }: SecurityHeaderOptions) {
  const ads = adsEnabled ? " https:" : "";
  const ga = analyticsEnabled && !adsEnabled;
  const gaScript = ga ? " https://*.googletagmanager.com" : "";
  const gaImg = ga ? " https://*.google-analytics.com https://*.googletagmanager.com" : "";
  const gaConnect = ga ? " https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com" : "";
  const gameFrames = embedsEnabled && frameOrigins.length ? frameOrigins.join(" ") : "'none'";
  // https: already covers the game origins.
  const frames = adsEnabled ? "https:" : gameFrames;
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${ads}${gaScript}${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' blob: data:${ads}${gaImg}`,
    "font-src 'self'",
    `media-src 'self'${ads}`,
    `connect-src 'self'${ads}${gaConnect}${isDev ? " ws:" : ""}`,
    `frame-src ${frames}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

/** Features the game iframe may use are delegated to the allowlisted origins only. */
export function buildPermissionsPolicy({ embedsEnabled, frameOrigins }: SecurityHeaderOptions) {
  const delegated = embedsEnabled && frameOrigins.length ? `(self ${frameOrigins.map((origin) => `"${origin}"`).join(" ")})` : "(self)";
  return [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "payment=()",
    "usb=()",
    "browsing-topics=()",
    `fullscreen=${delegated}`,
    `autoplay=${delegated}`,
    `gamepad=${delegated}`,
  ].join(", ");
}

export function buildSecurityHeaders(options: SecurityHeaderOptions) {
  return [
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy(options) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Legacy companion of frame-ancestors 'none'.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Permissions-Policy", value: buildPermissionsPolicy(options) },
    // Also covers non-HTML responses (API, images) while the site is not public.
    ...(options.indexingEnabled ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
  ];
}
