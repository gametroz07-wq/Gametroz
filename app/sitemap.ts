import type { MetadataRoute } from "next";
import { getToolCategories, getTools } from "@/lib/catalog";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { siteConfig } from "@/lib/site";

// Refreshed hourly so newly published tools appear without a redeploy.
export const revalidate = 3600;

/**
 * Returns no URLs while NEXT_PUBLIC_INDEXING_ENABLED is not "true": pages are noindex pre-launch, so
 * the sitemap must not advertise them. The database is not even queried in that case.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteConfig.indexingEnabled) return [];
  const [categories, tools] = await Promise.all([getToolCategories(), getTools()]);
  return buildSitemapEntries({
    siteUrl: siteConfig.url,
    indexingEnabled: siteConfig.indexingEnabled,
    toolCategorySlugs: categories.map((category) => category.slug),
    toolSlugs: tools.map((tool) => tool.slug),
  });
}
