import type { MetadataRoute } from "next";
import { buildRobots } from "@/lib/seo/robots";
import { siteConfig } from "@/lib/site";

// Rules live in lib/seo/robots.ts (unit-tested). Cloudflare prepends its content-signals preamble
// to the response in production, so the served file starts with those directives.
export default function robots(): MetadataRoute.Robots {
  return buildRobots({ siteUrl: siteConfig.url, indexingEnabled: siteConfig.indexingEnabled });
}
