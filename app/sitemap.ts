import type { MetadataRoute } from "next";
import { getSitemapContent } from "@/lib/catalog";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { siteConfig } from "@/lib/site";

// Refreshed hourly so newly published content appears without a redeploy.
export const revalidate = 3600;

/**
 * Returns no URLs while NEXT_PUBLIC_INDEXING_ENABLED is not "true": pages are noindex pre-launch, so
 * the sitemap must not advertise them. The database is not even queried in that case.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteConfig.indexingEnabled) return [];
  const content = await getSitemapContent();
  return buildSitemapEntries({
    siteUrl: siteConfig.url,
    indexingEnabled: siteConfig.indexingEnabled,
    games: content.games,
    gameCategorySlugs: content.gameCategories.map((category) => category.slug),
    toolCategorySlugs: content.toolCategories.map((category) => category.slug),
    toolSlugs: content.tools.map((tool) => tool.slug),
    platformSlugs: content.platforms.map((platform) => platform.slug),
    appCategorySlugs: content.appCategories.map((category) => category.slug),
    apps: content.apps,
    guideSectionSlugs: content.guideSections.map((section) => section.slug),
    guides: content.guides,
  });
}
