/**
 * Seeds the database from prisma/seed-data (the former Phase 2 mocks).
 * Idempotent: every record is upserted by slug and its relations are replaced,
 * so running it twice never duplicates data. Records removed from seed-data
 * are not deleted automatically.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { resolveRuntimeDatabaseUrl } from "../lib/db/database-url";
import { type Prisma, PrismaClient } from "../lib/generated/prisma/client";
import { appCategories, apps, platforms } from "./seed-data/apps";
import { gameCategories, games } from "./seed-data/games";
import { guides } from "./seed-data/guides";
import { toolCategories, tools } from "./seed-data/tools";

const connectionString = resolveRuntimeDatabaseUrl();

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// Stable date for records whose seed data has none, so re-runs do not change them.
const SEED_PUBLISHED_AT = new Date("2026-09-01T00:00:00Z");
const PUBLISHED = "PUBLISHED" as const;

const tagRefs = (tags: string[]) => tags.map((slug) => ({ slug }));
const bySlug = (slugs: string[] = []) => slugs.map((slug) => ({ slug }));

async function seedTags() {
  const all = new Set([
    ...games.flatMap((game) => game.tags),
    ...tools.flatMap((tool) => tool.tags),
    ...apps.flatMap((app) => app.tags),
    ...guides.flatMap((guide) => guide.tags),
  ]);
  for (const slug of all) {
    await prisma.tag.upsert({ where: { slug }, create: { slug, name: slug }, update: { name: slug } });
  }
  return all.size;
}

async function seedGames() {
  for (const [index, category] of gameCategories.entries()) {
    const data = { name: category.name, description: category.description, iconKey: category.iconKey, sortOrder: index };
    await prisma.gameCategory.upsert({ where: { slug: category.slug }, create: { slug: category.slug, ...data }, update: data });
  }

  for (const [index, game] of games.entries()) {
    const data = {
      name: game.name,
      shortDescription: game.shortDescription,
      description: game.description,
      instructions: game.instructions,
      controls: game.controls as Prisma.InputJsonValue,
      thumbnailUrl: game.thumbnailUrl,
      orientation: game.orientation === "portrait" ? ("PORTRAIT" as const) : ("LANDSCAPE" as const),
      status: PUBLISHED,
      featured: game.featured,
      trending: game.trending,
      popularity: game.popularity,
      sortOrder: index,
      publishedAt: new Date(`${game.publishedAt}T00:00:00Z`),
      category: { connect: { slug: game.category.slug } },
    };
    await prisma.game.upsert({
      where: { slug: game.slug },
      create: { slug: game.slug, ...data, tags: { connect: tagRefs(game.tags) } },
      update: { ...data, tags: { set: tagRefs(game.tags) } },
    });
  }
}

async function seedTools() {
  for (const [index, category] of toolCategories.entries()) {
    const data = { name: category.name, description: category.description, iconKey: category.iconKey, sortOrder: index };
    await prisma.toolCategory.upsert({ where: { slug: category.slug }, create: { slug: category.slug, ...data }, update: data });
  }

  for (const [index, tool] of tools.entries()) {
    const data = {
      name: tool.name,
      shortDescription: tool.shortDescription,
      description: tool.description,
      howTo: tool.howTo,
      iconKey: tool.iconKey,
      componentKey: tool.componentKey ?? null,
      status: PUBLISHED,
      featured: tool.featured,
      popularity: tool.popularity,
      sortOrder: index,
      publishedAt: SEED_PUBLISHED_AT,
      category: { connect: { slug: tool.category.slug } },
    };
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      create: { slug: tool.slug, ...data, tags: { connect: tagRefs(tool.tags) } },
      update: { ...data, tags: { set: tagRefs(tool.tags) } },
    });
  }
}

async function seedApps() {
  // The "browser" platform became "web": rename it in place so its app joins survive.
  const [legacy, renamed] = await Promise.all([
    prisma.platform.findUnique({ where: { slug: "browser" } }),
    prisma.platform.findUnique({ where: { slug: "web" } }),
  ]);
  if (legacy && !renamed) await prisma.platform.update({ where: { id: legacy.id }, data: { slug: "web" } });

  for (const [index, platform] of platforms.entries()) {
    const data = { name: platform.name, description: platform.description, iconKey: platform.iconKey, sortOrder: index };
    await prisma.platform.upsert({ where: { slug: platform.slug }, create: { slug: platform.slug, ...data }, update: data });
  }
  for (const [index, category] of appCategories.entries()) {
    const data = { name: category.name, description: category.description, iconKey: category.iconKey, sortOrder: index };
    await prisma.appCategory.upsert({ where: { slug: category.slug }, create: { slug: category.slug, ...data }, update: data });
  }

  const platformIds = new Map(
    (await prisma.platform.findMany({ select: { id: true, slug: true } })).map((platform) => [platform.slug, platform.id]),
  );

  for (const [index, app] of apps.entries()) {
    const data = {
      name: app.name,
      publisher: app.publisher,
      shortDescription: app.shortDescription,
      description: app.description,
      version: null,
      license: app.license || null,
      officialWebsite: app.officialWebsite,
      officialDownloadUrl: app.officialDownloadUrl,
      iconUrl: null,
      features: app.features,
      requirements: app.requirements,
      status: PUBLISHED,
      featured: app.featured,
      sortOrder: index,
      lastVerifiedAt: app.lastVerifiedAt ? new Date(app.lastVerifiedAt) : null,
      publishedAt: SEED_PUBLISHED_AT,
      category: { connect: { slug: app.category.slug } },
    };
    const saved = await prisma.app.upsert({
      where: { slug: app.slug },
      create: { slug: app.slug, ...data, tags: { connect: tagRefs(app.tags) } },
      update: { ...data, tags: { set: tagRefs(app.tags) } },
    });
    await prisma.appPlatform.deleteMany({ where: { appId: saved.id } });
    await prisma.appPlatform.createMany({
      data: app.platforms.map((slug) => {
        const platformId = platformIds.get(slug);
        if (!platformId) throw new Error(`Unknown platform "${slug}" for app "${app.slug}"`);
        return { appId: saved.id, platformId };
      }),
    });
  }

  // Alternatives need every app to exist first.
  const appIds = new Map((await prisma.app.findMany({ select: { id: true, slug: true } })).map((app) => [app.slug, app.id]));
  for (const app of apps) {
    const appId = appIds.get(app.slug)!;
    await prisma.appAlternative.deleteMany({ where: { appId } });
    await prisma.appAlternative.createMany({
      data: app.alternatives.map((slug, position) => ({ appId, alternativeId: appIds.get(slug)!, position })),
    });
  }
}

async function seedGuides() {
  // Guides reference games that only exist once the real catalog is published, so a fresh seed (mock games)
  // connects only the games, tools and apps that exist. `npm run guides:sync` verifies every reference instead.
  const existing = async (rows: Promise<{ slug: string }[]>, slugs: string[]) => {
    const found = new Set((await rows).map((row) => row.slug));
    return bySlug(slugs.filter((slug) => found.has(slug)));
  };
  for (const guide of guides) {
    const data = {
      title: guide.title,
      excerpt: guide.excerpt,
      section: guide.section as "GAMES" | "TOOLS" | "APPS",
      body: guide.body as unknown as Prisma.InputJsonValue,
      readingMinutes: guide.readingMinutes,
      status: PUBLISHED,
      featured: guide.featured,
      sortOrder: guide.sortOrder,
      publishedAt: new Date(guide.publishedAt),
      updatedAt: new Date(guide.updatedAt),
    };
    const relations = {
      games: await existing(prisma.game.findMany({ where: { slug: { in: guide.games } }, select: { slug: true } }), guide.games),
      tools: await existing(prisma.tool.findMany({ where: { slug: { in: guide.tools } }, select: { slug: true } }), guide.tools),
      apps: await existing(prisma.app.findMany({ where: { slug: { in: guide.apps } }, select: { slug: true } }), guide.apps),
      tags: tagRefs(guide.tags),
    };
    await prisma.guide.upsert({
      where: { slug: guide.slug },
      create: {
        slug: guide.slug,
        ...data,
        games: { connect: relations.games },
        tools: { connect: relations.tools },
        apps: { connect: relations.apps },
        tags: { connect: relations.tags },
      },
      update: {
        ...data,
        games: { set: relations.games },
        tools: { set: relations.tools },
        apps: { set: relations.apps },
        tags: { set: relations.tags },
      },
    });
  }
}

async function main() {
  const tagCount = await seedTags();
  await seedGames();
  await seedTools();
  await seedApps();
  await seedGuides();

  const counts = {
    tags: tagCount,
    gameCategories: await prisma.gameCategory.count(),
    games: await prisma.game.count(),
    toolCategories: await prisma.toolCategory.count(),
    tools: await prisma.tool.count(),
    platforms: await prisma.platform.count(),
    appCategories: await prisma.appCategory.count(),
    apps: await prisma.app.count(),
    appPlatforms: await prisma.appPlatform.count(),
    appAlternatives: await prisma.appAlternative.count(),
    guides: await prisma.guide.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
