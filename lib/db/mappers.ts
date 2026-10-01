import "server-only";
import type { Prisma } from "@/lib/generated/prisma/client";
import type {
  App,
  Category,
  Game,
  GameControl,
  Guide,
  GuideBlock,
  GuideSection,
  IconKey,
  PlatformSlug,
  Tool,
  ToolComponentKey,
} from "@/types/content";

/**
 * Maps database rows to the view models in types/content.ts, so pages never see Prisma types.
 * Only PUBLISHED records are ever loaded through these includes.
 */

export const PUBLISHED = { status: "PUBLISHED" } as const;

const tagSelect = { select: { slug: true }, orderBy: { slug: "asc" } } as const;

export const gameInclude = {
  category: { select: { name: true, slug: true } },
  provider: { select: { slug: true } },
  tags: tagSelect,
} satisfies Prisma.GameInclude;

export const toolInclude = {
  category: { select: { name: true, slug: true } },
  tags: tagSelect,
} satisfies Prisma.ToolInclude;

export const appInclude = {
  category: { select: { name: true, slug: true } },
  tags: tagSelect,
  platforms: { select: { platform: { select: { slug: true } } }, orderBy: { platform: { sortOrder: "asc" } } },
  alternatives: {
    where: { alternative: PUBLISHED },
    select: { alternative: { select: { slug: true } } },
    orderBy: { position: "asc" },
  },
} satisfies Prisma.AppInclude;

const relatedSlugs = { where: PUBLISHED, select: { slug: true }, orderBy: { sortOrder: "asc" } } as const;

export const guideInclude = {
  tags: tagSelect,
  games: relatedSlugs,
  tools: relatedSlugs,
  apps: relatedSlugs,
} satisfies Prisma.GuideInclude;

type GameRow = Prisma.GameGetPayload<{ include: typeof gameInclude }>;
type ToolRow = Prisma.ToolGetPayload<{ include: typeof toolInclude }>;
type AppRow = Prisma.AppGetPayload<{ include: typeof appInclude }>;
type GuideRow = Prisma.GuideGetPayload<{ include: typeof guideInclude }>;
type CategoryRow = { name: string; slug: string; description: string; iconKey: string };

const toolComponentKeys: readonly ToolComponentKey[] = [
  "word-counter",
  "json-formatter",
  "image-converter",
  "percentage-calculator",
];

const isoDate = (date: Date | null) => (date ? date.toISOString().slice(0, 10) : "");

export function toCategory(row: CategoryRow): Category {
  return { name: row.name, slug: row.slug, description: row.description, iconKey: row.iconKey as IconKey };
}

export function toGame(row: GameRow): Game {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    thumbnailUrl: row.thumbnailUrl,
    shortDescription: row.shortDescription,
    description: row.description,
    instructions: row.instructions,
    controls: row.controls as GameControl[],
    tags: row.tags.map((tag) => tag.slug),
    orientation: row.orientation === "PORTRAIT" ? "portrait" : "landscape",
    featured: row.featured,
    trending: row.trending,
    popularity: row.popularity,
    publishedAt: isoDate(row.publishedAt),
    embedUrl: row.embedUrl,
    providerSlug: row.provider?.slug ?? null,
  };
}

export function toTool(row: ToolRow): Tool {
  const componentKey = toolComponentKeys.find((key) => key === row.componentKey);
  return {
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    category: row.category,
    iconKey: row.iconKey as IconKey,
    description: row.description,
    howTo: row.howTo,
    tags: row.tags.map((tag) => tag.slug),
    featured: row.featured,
    popularity: row.popularity,
    componentKey,
  };
}

export function toApp(row: AppRow): App {
  return {
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    iconUrl: row.iconUrl ?? undefined,
    platforms: row.platforms.map(({ platform }) => platform.slug as PlatformSlug),
    description: row.description,
    category: row.category,
    publisher: row.publisher,
    version: row.version ?? "",
    license: row.license ?? "",
    officialWebsite: row.officialWebsite,
    features: row.features,
    requirements: row.requirements,
    alternatives: row.alternatives.map(({ alternative }) => alternative.slug),
    tags: row.tags.map((tag) => tag.slug),
    featured: row.featured,
    lastVerifiedAt: row.lastVerifiedAt ? row.lastVerifiedAt.toISOString() : null,
  };
}

export function toGuide(row: GuideRow): Guide {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    section: row.section.toLowerCase() as GuideSection,
    publishedAt: isoDate(row.publishedAt),
    readingMinutes: row.readingMinutes,
    featured: row.featured,
    tags: row.tags.map((tag) => tag.slug),
    body: row.body as GuideBlock[],
    related: {
      games: row.games.map((game) => game.slug),
      tools: row.tools.map((tool) => tool.slug),
      apps: row.apps.map((app) => app.slug),
    },
  };
}
