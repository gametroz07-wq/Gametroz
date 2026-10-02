import { buildLlmsTxt } from "@/lib/seo/llms";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/** Informational site guide for language-model crawlers; content lives in lib/seo/llms.ts. */
export function GET() {
  const body = buildLlmsTxt({
    siteUrl: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    contactEmail: siteConfig.contactEmail,
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
