import type { App, Category, PlatformSlug } from "@/types/content";
import { appCategoryDefinitions, appDefinitions, LINKS_VERIFIED_AT, platformDefinitions } from "../../lib/apps/definitions";

// Seed source data, derived from lib/apps/definitions.ts (the single source of truth) so the seed and
// `npm run apps:sync` can never diverge. Only prisma/seed.ts imports this file.

export const platforms: (Category & { slug: PlatformSlug })[] = [...platformDefinitions]
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map(({ slug, name, description, iconKey }) => ({ slug, name, description, iconKey }));

export const appCategories: Category[] = [...appCategoryDefinitions]
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map(({ slug, name, description, iconKey }) => ({ slug, name, description, iconKey }));

const categoryBySlug = new Map(appCategories.map((category) => [category.slug, category]));

export const apps: App[] = [...appDefinitions]
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((definition) => {
    const category = categoryBySlug.get(definition.categorySlug);
    if (!category) throw new Error(`Unknown app category: ${definition.categorySlug}`);
    return {
      slug: definition.slug,
      name: definition.name,
      shortDescription: definition.shortDescription,
      platforms: definition.platforms,
      description: definition.description,
      category: { name: category.name, slug: category.slug },
      publisher: definition.developer,
      version: "",
      license: definition.license ?? "",
      officialWebsite: definition.officialWebsite,
      officialDownloadUrl: definition.officialDownloadUrl,
      features: definition.features,
      requirements: definition.requirements,
      alternatives: definition.alternatives,
      tags: definition.tags,
      featured: definition.featured,
      lastVerifiedAt: `${LINKS_VERIFIED_AT}T00:00:00.000Z`,
    };
  });
