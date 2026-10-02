import "server-only";
import {
  appInclude,
  gameInclude,
  guideInclude,
  PUBLISHED,
  toApp,
  toCategory,
  toGame,
  toGuide,
  toolInclude,
  toTool,
} from "@/lib/db/mappers";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { guideSections } from "@/lib/guide-sections";
import type { App, Category, CategorySummary, Game, Guide, GuideSection, PlatformSlug, Tool } from "@/types/content";

/**
 * Data access for every page, backed by PostgreSQL through Prisma.
 * Public reads only ever return PUBLISHED content. Signatures are unchanged from the
 * Phase 2 mock layer, so pages do not know where the data comes from.
 * There is no fallback to mock data: a database error surfaces as a real error.
 */

const byPopularity = [{ popularity: "desc" }, { slug: "asc" }] as const;
const byNewest = [{ publishedAt: "desc" }, { slug: "asc" }] as const;
const bySortOrder = [{ sortOrder: "asc" }, { slug: "asc" }] as const;

type FindArgs<Where> = {
  where?: Where;
  orderBy?: readonly Record<string, "asc" | "desc">[];
  take?: number;
};

function toCategorySummary(
  row: { name: string; slug: string; iconKey: string },
  count: number,
  basePath: string,
  itemLabel: string,
): CategorySummary {
  return {
    name: row.name,
    href: `${basePath}/${row.slug}`,
    iconKey: row.iconKey as CategorySummary["iconKey"],
    itemCount: count,
    itemLabel,
  };
}

/** Ranks candidates by a score, then popularity; tops up with the most popular remaining items. */
async function rankWithFallback<T extends { slug: string; popularity: number }>(
  candidates: T[],
  score: (item: T) => number,
  limit: number,
  fetchFallback: (exclude: string[], take: number) => Promise<T[]>,
) {
  const ranked = candidates
    .map((item) => ({ item, score: score(item) }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.item.popularity - a.item.popularity || a.item.slug.localeCompare(b.item.slug),
    )
    .map(({ item }) => item)
    .slice(0, limit);
  if (ranked.length >= limit) return ranked;
  return [...ranked, ...(await fetchFallback(ranked.map((item) => item.slug), limit - ranked.length))];
}

/* ---------- Games ---------- */

async function findGames({ where, orderBy = bySortOrder, take }: FindArgs<Prisma.GameWhereInput>): Promise<Game[]> {
  const rows = await prisma.game.findMany({
    where: { ...PUBLISHED, ...where },
    orderBy: [...orderBy],
    take,
    include: gameInclude,
  });
  return rows.map(toGame);
}

export async function getGames() {
  return findGames({});
}

export async function getGameBySlug(slug: string) {
  const row = await prisma.game.findFirst({ where: { ...PUBLISHED, slug }, include: gameInclude });
  return row ? toGame(row) : null;
}

/** Trending first, topped up with popular games so grids never end on a ragged row. */
export async function getTrendingGames(limit = 12) {
  const trending = await findGames({ where: { trending: true }, orderBy: byPopularity, take: limit });
  if (trending.length >= limit) return trending;
  const fill = await findGames({ where: { trending: false }, orderBy: byPopularity, take: limit - trending.length });
  return [...trending, ...fill];
}

export async function getFeaturedGames(limit = 3) {
  return findGames({ where: { featured: true }, orderBy: byPopularity, take: limit });
}

export async function getNewGames(limit = 10) {
  return findGames({ orderBy: byNewest, take: limit });
}

export async function getPopularGames(limit?: number) {
  return findGames({ orderBy: byPopularity, take: limit });
}

export async function getGameCategories(): Promise<Category[]> {
  const rows = await prisma.gameCategory.findMany({
    where: { games: { some: PUBLISHED } },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toCategory);
}

export async function getGameCategory(slug: string) {
  const row = await prisma.gameCategory.findFirst({ where: { slug, games: { some: PUBLISHED } } });
  return row ? toCategory(row) : null;
}

export async function getGameCategorySummaries() {
  const rows = await prisma.gameCategory.findMany({
    where: { games: { some: PUBLISHED } },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { games: { where: PUBLISHED } } } },
  });
  return rows.map((row) => toCategorySummary(row, row._count.games, "/games", "games"));
}

export async function getGamesByCategory(slug: string) {
  return findGames({ where: { category: { slug } }, orderBy: byPopularity });
}

/** Similar games across categories, ranked by shared tags. */
export async function getRelatedGames(game: Game, limit = 6) {
  const otherCategory: Prisma.GameWhereInput = {
    slug: { not: game.slug },
    category: { slug: { not: game.category.slug } },
  };
  const candidates = await findGames({ where: { ...otherCategory, tags: { some: { slug: { in: game.tags } } } } });
  return rankWithFallback(
    candidates,
    (other) => other.tags.filter((tag) => game.tags.includes(tag)).length,
    limit,
    (exclude, take) =>
      findGames({ where: { ...otherCategory, AND: [{ slug: { notIn: exclude } }] }, orderBy: byPopularity, take }),
  );
}

export async function getSameCategoryGames(game: Game, limit = 6) {
  return findGames({
    where: { slug: { not: game.slug }, category: { slug: game.category.slug } },
    orderBy: byPopularity,
    take: limit,
  });
}

/** Trending games the player has not just seen, for the "Play next" rail. */
export async function getPlayNextGames(game: Game, exclude: string[], limit = 4) {
  return findGames({
    where: { trending: true, slug: { notIn: [game.slug, ...exclude] } },
    orderBy: byPopularity,
    take: limit,
  });
}

/* ---------- Tools ---------- */

async function findTools({ where, orderBy = bySortOrder, take }: FindArgs<Prisma.ToolWhereInput>): Promise<Tool[]> {
  const rows = await prisma.tool.findMany({
    where: { ...PUBLISHED, ...where },
    orderBy: [...orderBy],
    take,
    include: toolInclude,
  });
  return rows.map(toTool);
}

export async function getTools() {
  return findTools({});
}

export async function getToolBySlug(slug: string) {
  const row = await prisma.tool.findFirst({ where: { ...PUBLISHED, slug }, include: toolInclude });
  return row ? toTool(row) : null;
}

export async function getPopularTools(limit = 8) {
  return findTools({ orderBy: byPopularity, take: limit });
}

export async function getFeaturedTools(limit = 4) {
  return findTools({ where: { featured: true }, orderBy: byPopularity, take: limit });
}

export async function getToolCategories(): Promise<Category[]> {
  const rows = await prisma.toolCategory.findMany({
    where: { tools: { some: PUBLISHED } },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toCategory);
}

export async function getToolCategory(slug: string) {
  const row = await prisma.toolCategory.findFirst({ where: { slug, tools: { some: PUBLISHED } } });
  return row ? toCategory(row) : null;
}

export async function getToolCategorySummaries() {
  const rows = await prisma.toolCategory.findMany({
    where: { tools: { some: PUBLISHED } },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { tools: { where: PUBLISHED } } } },
  });
  return rows.map((row) => toCategorySummary(row, row._count.tools, "/tools", "tools"));
}

export async function getToolsByCategory(slug: string) {
  return findTools({ where: { category: { slug } }, orderBy: byPopularity });
}

export async function getRelatedTools(tool: Tool, limit = 4) {
  const candidates = await findTools({
    where: {
      slug: { not: tool.slug },
      OR: [{ category: { slug: tool.category.slug } }, { tags: { some: { slug: { in: tool.tags } } } }],
    },
  });
  return rankWithFallback(
    candidates,
    (other) =>
      (other.category.slug === tool.category.slug ? 2 : 0) + other.tags.filter((tag) => tool.tags.includes(tag)).length,
    limit,
    (exclude, take) => findTools({ where: { slug: { notIn: [tool.slug, ...exclude] } }, orderBy: byPopularity, take }),
  );
}

/* ---------- Apps ---------- */

async function findApps({ where, orderBy = bySortOrder, take }: FindArgs<Prisma.AppWhereInput>): Promise<App[]> {
  const rows = await prisma.app.findMany({
    where: { ...PUBLISHED, ...where },
    orderBy: [...orderBy],
    take,
    include: appInclude,
  });
  return rows.map(toApp);
}

export async function getApps() {
  return findApps({});
}

export async function getAppBySlug(slug: string) {
  const row = await prisma.app.findFirst({ where: { ...PUBLISHED, slug }, include: appInclude });
  return row ? toApp(row) : null;
}

export async function getFeaturedApps(limit = 4) {
  return findApps({ where: { featured: true }, take: limit });
}

const platformsWithApps: Prisma.PlatformWhereInput = { apps: { some: { app: PUBLISHED } } };

export async function getPlatforms() {
  const rows = await prisma.platform.findMany({ where: platformsWithApps, orderBy: { sortOrder: "asc" } });
  return rows.map((row) => ({ ...toCategory(row), slug: row.slug as PlatformSlug }));
}

export async function getPlatform(slug: string) {
  const row = await prisma.platform.findFirst({ where: { slug, ...platformsWithApps } });
  return row ? { ...toCategory(row), slug: row.slug as PlatformSlug } : null;
}

export async function getPlatformSummaries() {
  const rows = await prisma.platform.findMany({
    where: platformsWithApps,
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { apps: { where: { app: PUBLISHED } } } } },
  });
  return rows.map((row) => toCategorySummary(row, row._count.apps, "/apps", "apps"));
}

export async function getAppsByPlatform(slug: PlatformSlug, limit?: number) {
  return findApps({ where: { platforms: { some: { platform: { slug } } } }, take: limit });
}

export async function getAppCategories(): Promise<Category[]> {
  const rows = await prisma.appCategory.findMany({
    where: { apps: { some: PUBLISHED } },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map(toCategory);
}

/** Editorial alternatives first (in their saved order), then other apps from the same category. */
export async function getAlternatives(app: App, limit = 4) {
  const explicitRows = await findApps({ where: { slug: { in: app.alternatives } } });
  const explicit = app.alternatives
    .map((slug) => explicitRows.find((row) => row.slug === slug))
    .filter((row): row is App => Boolean(row));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const sameCategory = await findApps({
    where: {
      category: { slug: app.category.slug },
      slug: { notIn: [app.slug, ...explicit.map((row) => row.slug)] },
    },
    take: limit - explicit.length,
  });
  return [...explicit, ...sameCategory];
}

/* ---------- Guides ---------- */

async function findGuides({ where, orderBy = byNewest, take }: FindArgs<Prisma.GuideWhereInput>): Promise<Guide[]> {
  const rows = await prisma.guide.findMany({
    where: { ...PUBLISHED, ...where },
    orderBy: [...orderBy],
    take,
    include: guideInclude,
  });
  return rows.map(toGuide);
}

const toSectionEnum = (section: GuideSection) => section.toUpperCase() as "GAMES" | "TOOLS" | "APPS";

export async function getGuides() {
  return findGuides({});
}

export async function getGuideBySlug(slug: string) {
  const row = await prisma.guide.findFirst({ where: { ...PUBLISHED, slug }, include: guideInclude });
  return row ? toGuide(row) : null;
}

export async function getFeaturedGuides(limit = 3) {
  return findGuides({ where: { featured: true }, take: limit });
}

export async function getGuideSections() {
  const used = await prisma.guide.groupBy({ by: ["section"], where: PUBLISHED });
  const sections = new Set(used.map((row) => row.section.toLowerCase()));
  return guideSections.filter((section) => sections.has(section.slug));
}

export async function getGuideSection(slug: string) {
  return (await getGuideSections()).find((section) => section.slug === slug) ?? null;
}

export async function getGuidesBySection(section: GuideSection, limit?: number) {
  return findGuides({ where: { section: toSectionEnum(section) }, take: limit });
}

/** Guides that reference a given game, tool or app. */
export async function getGuidesFor(target: { games?: string; tools?: string; apps?: string }, limit = 3) {
  const conditions: Prisma.GuideWhereInput[] = [];
  if (target.games) conditions.push({ games: { some: { slug: target.games } } });
  if (target.tools) conditions.push({ tools: { some: { slug: target.tools } } });
  if (target.apps) conditions.push({ apps: { some: { slug: target.apps } } });
  if (conditions.length === 0) return [];
  return findGuides({ where: { OR: conditions }, orderBy: bySortOrder, take: limit });
}

/** Guides from the same section first, then the newest from other sections. */
export async function getMoreGuides(guide: Guide, limit = 3) {
  const section = toSectionEnum(guide.section);
  const sameSection = await findGuides({ where: { section, slug: { not: guide.slug } }, take: limit });
  if (sameSection.length >= limit) return sameSection;
  const others = await findGuides({ where: { section: { not: section } }, take: limit - sameSection.length });
  return [...sameSection, ...others];
}

export async function getGuideRelatedContent(guide: Guide) {
  const [games, tools, apps] = await Promise.all([
    guide.related.games?.length ? findGames({ where: { slug: { in: guide.related.games } } }) : [],
    guide.related.tools?.length ? findTools({ where: { slug: { in: guide.related.tools } } }) : [],
    guide.related.apps?.length ? findApps({ where: { slug: { in: guide.related.apps } } }) : [],
  ]);
  return { games, tools, apps };
}

/* ---------- Search ---------- */

/** Case-insensitive "contains" search in PostgreSQL. A dedicated engine can replace it later (Phase 6). */
export async function searchCatalog(rawQuery: string) {
  const query = rawQuery.trim();
  if (!query) return { games: [], tools: [], apps: [], guides: [] };

  const contains = { contains: query, mode: "insensitive" } as const;
  const tagMatch = { tags: { some: { slug: contains } } };

  const [games, tools, apps, guides] = await Promise.all([
    findGames({ where: { OR: [{ name: contains }, { slug: contains }, { category: { name: contains } }, tagMatch] } }),
    findTools({
      where: {
        OR: [
          { name: contains },
          { slug: contains },
          { shortDescription: contains },
          { description: contains },
          { category: { name: contains } },
          tagMatch,
        ],
      },
    }),
    findApps({
      where: {
        OR: [
          { name: contains },
          { slug: contains },
          { publisher: contains },
          { category: { name: contains } },
          { platforms: { some: { platform: { OR: [{ slug: contains }, { name: contains }] } } } },
          tagMatch,
        ],
      },
    }),
    findGuides({
      where: { OR: [{ title: contains }, { slug: contains }, { excerpt: contains }, tagMatch] },
      orderBy: bySortOrder,
    }),
  ]);
  return { games, tools, apps, guides };
}
