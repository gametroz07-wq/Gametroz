import type { NextConfig } from "next";
import { providerHosts } from "./lib/providers/hosts";

const isDev = process.env.NODE_ENV === "development";
const embedsEnabled = process.env.GAME_EMBEDS_ENABLED === "true";
const indexingEnabled = process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true";

// Game iframes are only allowed when embeds are enabled, and only from allowlisted provider hosts.
const frameSources = embedsEnabled
  ? Object.values(providerHosts).flatMap((hosts) => hosts.embedHosts.map((host) => `https://${host}`))
  : [];

// CSP without nonces (Next.js guide): keeps every page static. 'unsafe-inline' covers the
// Next.js runtime payload and the theme script; 'unsafe-eval' is development-only.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  `frame-src ${frameSources.length ? frameSources.join(" ") : "'none'"}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Legacy companion of frame-ancestors 'none'.
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), fullscreen=(self)",
  },
  // Also covers non-HTML responses (API, images) while the site is not public.
  ...(indexingEnabled ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Each build worker opens its own database pool; 4 workers × 2 connections stays well under
    // a session-mode pooler limit (Supabase: 15). See resolvePoolMax in lib/db/database-url.ts.
    cpus: 4,
  },
  images: {
    // Must mirror the provider image allowlist (lib/providers/*/config.ts).
    remotePatterns: [{ protocol: "https", hostname: "img.gamemonetize.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Canonical host is the apex. Cloudflare redirects www first; this is the origin-side fallback.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.gametroz.online" }],
        destination: "https://gametroz.online/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
