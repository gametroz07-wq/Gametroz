import { absoluteUrl } from "./structured-data";

export type SitemapEntry = {
  url: string;
  changeFrequency?: "daily" | "weekly" | "monthly";
  priority?: number;
};

type SitemapInput = {
  siteUrl: string;
  indexingEnabled: boolean;
  toolCategorySlugs: string[];
  toolSlugs: string[];
};

/**
 * Pure builder behind app/sitemap.ts. While indexing is disabled (pre-launch, staging) it returns
 * no URLs at all, so a sitemap can never advertise pages that are also blocked by robots rules.
 */
export function buildSitemapEntries({ siteUrl, indexingEnabled, toolCategorySlugs, toolSlugs }: SitemapInput): SitemapEntry[] {
  if (!indexingEnabled) return [];
  const entry = (path: string, changeFrequency: SitemapEntry["changeFrequency"], priority: number) => ({
    url: absoluteUrl(path, siteUrl),
    changeFrequency,
    priority,
  });
  return [
    entry("/", "daily", 1),
    entry("/games", "daily", 0.9),
    entry("/tools", "weekly", 0.9),
    entry("/apps", "weekly", 0.7),
    entry("/guides", "weekly", 0.7),
    ...toolCategorySlugs.map((slug) => entry(`/tools/${slug}`, "weekly", 0.7)),
    ...toolSlugs.map((slug) => entry(`/tool/${slug}`, "monthly", 0.8)),
  ];
}
