import { absoluteUrl } from "./structured-data";

export type SitemapEntry = {
  url: string;
  lastModified?: Date;
  changeFrequency?: "daily" | "weekly" | "monthly";
  priority?: number;
};

/** A published piece of content. `status` is optional and, when present, must be PUBLISHED. */
export type SitemapItem = { slug: string; updatedAt?: Date | string | null; status?: string };

type SitemapInput = {
  siteUrl: string;
  indexingEnabled: boolean;
  toolCategorySlugs: string[];
  toolSlugs: string[];
  games?: SitemapItem[];
  gameCategorySlugs?: string[];
  platformSlugs?: string[];
  apps?: SitemapItem[];
  guideSectionSlugs?: string[];
  guides?: SitemapItem[];
};

// Trust pages that every visitor can reach from the footer. /search is deliberately absent.
const STATIC_PAGES = ["/about", "/editorial-policy", "/contact", "/privacy", "/terms"];

function toDate(value: SitemapItem["updatedAt"]) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Pure builder behind app/sitemap.ts. While indexing is disabled (pre-launch, staging) it returns
 * no URLs at all, so a sitemap can never advertise pages that are also blocked by robots rules.
 *
 * A single sitemap holds up to 50,000 URLs (and 50 MB). The catalog is far below that today; past
 * the limit, switch app/sitemap.ts to `generateSitemaps()` and add a sitemap index.
 */
export function buildSitemapEntries({
  siteUrl,
  indexingEnabled,
  toolCategorySlugs,
  toolSlugs,
  games = [],
  gameCategorySlugs = [],
  platformSlugs = [],
  apps = [],
  guideSectionSlugs = [],
  guides = [],
}: SitemapInput): SitemapEntry[] {
  if (!indexingEnabled) return [];

  const seen = new Set<string>();
  const entries: SitemapEntry[] = [];
  const add = (path: string, changeFrequency: SitemapEntry["changeFrequency"], priority: number, updatedAt?: SitemapItem["updatedAt"]) => {
    const url = absoluteUrl(path, siteUrl);
    if (seen.has(url)) return;
    seen.add(url);
    const lastModified = toDate(updatedAt);
    entries.push({ url, ...(lastModified ? { lastModified } : {}), changeFrequency, priority });
  };
  const published = (items: SitemapItem[]) => items.filter((item) => item.status === undefined || item.status === "PUBLISHED");

  add("/", "daily", 1);
  add("/games", "daily", 0.9);
  add("/tools", "weekly", 0.9);
  add("/apps", "weekly", 0.7);
  add("/guides", "weekly", 0.7);
  for (const slug of gameCategorySlugs) add(`/games/${slug}`, "daily", 0.8);
  for (const game of published(games)) add(`/game/${game.slug}`, "weekly", 0.8, game.updatedAt);
  for (const slug of toolCategorySlugs) add(`/tools/${slug}`, "weekly", 0.7);
  for (const slug of toolSlugs) add(`/tool/${slug}`, "monthly", 0.8);
  for (const slug of platformSlugs) add(`/apps/${slug}`, "weekly", 0.6);
  for (const app of published(apps)) add(`/app/${app.slug}`, "monthly", 0.6, app.updatedAt);
  for (const slug of guideSectionSlugs) add(`/guides/${slug}`, "weekly", 0.6);
  for (const guide of published(guides)) add(`/guide/${guide.slug}`, "monthly", 0.6, guide.updatedAt);
  for (const path of STATIC_PAGES) add(path, "monthly", 0.3);
  return entries;
}
