import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

// Rendered once at build time and cached: no request data is used.
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

/**
 * Default 1200x630 social card for pages without artwork of their own (see defaultOgImage in
 * lib/seo/metadata.ts). Brand colors only: no external assets, so it cannot be blocked by the CSP
 * and has nothing to fetch at render time.
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #080b12 0%, #1b0b3a 55%, #0b1a5c 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 150,
            fontWeight: 900,
            letterSpacing: 8,
            color: "#67f3ff",
            textShadow: "0 0 40px #d946ef, 6px 6px 0 #a21caf",
          }}
        >
          {siteConfig.name.toUpperCase()}
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 44, color: "#f0feff" }}>
          Free games, online tools and apps
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 30, color: "#e879f9" }}>
          {new URL(siteConfig.url).hostname}
        </div>
      </div>
    ),
    size,
  );
}
