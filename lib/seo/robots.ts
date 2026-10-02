import { absoluteUrl } from "./structured-data";

export type RobotsConfig = {
  rules: { userAgent: string; allow: string; disallow?: string[] };
  sitemap?: string;
};

/**
 * Pure builder behind app/robots.ts. Cloudflare prepends its own content-signals preamble to
 * /robots.txt in production; these rules follow it.
 *
 * While indexing is off the rules stay permissive ("Allow: /") on purpose: noindex is enforced by
 * the meta robots tag and the X-Robots-Tag header, and a Disallow would stop crawlers from ever
 * seeing it. No Sitemap line is advertised then (the sitemap is empty anyway).
 */
export function buildRobots({ siteUrl, indexingEnabled }: { siteUrl: string; indexingEnabled: boolean }): RobotsConfig {
  if (!indexingEnabled) return { rules: { userAgent: "*", allow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/search"] },
    sitemap: absoluteUrl("/sitemap.xml", siteUrl),
  };
}
