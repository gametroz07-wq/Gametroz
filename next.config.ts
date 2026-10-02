import type { NextConfig } from "next";
import { embedFrameOrigins } from "./lib/providers/embed";
import { buildSecurityHeaders } from "./lib/security/headers";

// Policy lives in lib/security/headers.ts (unit-tested). Env flags are read when the server starts.
const securityHeaders = buildSecurityHeaders({
  isDev: process.env.NODE_ENV === "development",
  embedsEnabled: process.env.GAME_EMBEDS_ENABLED === "true",
  indexingEnabled: process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true",
  frameOrigins: embedFrameOrigins(),
});

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
