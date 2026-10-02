import type { Category, Tool } from "@/types/content";
import { toolCategoryDefinitions, toolDefinitions } from "../../lib/tools/definitions";
import { toToolRow } from "../../lib/tools/sync-plan";

// Seed source data, derived from lib/tools/definitions.ts (the single source of truth) so the seed and
// `npm run tools:sync` can never diverge. Only prisma/seed.ts imports this file.

const categories = [...toolCategoryDefinitions].sort((a, b) => a.sortOrder - b.sortOrder);

export const toolCategories: Category[] = categories.map(({ slug, name, description, iconKey }) => ({
  slug,
  name,
  description,
  iconKey,
}));

const categoryBySlug = new Map(toolCategories.map((category) => [category.slug, category]));

export const tools: Tool[] = [...toolDefinitions]
  .sort((a, b) => a.sortOrder - b.sortOrder)
  .map((definition) => {
    const category = categoryBySlug.get(definition.categorySlug);
    if (!category) throw new Error(`Unknown tool category: ${definition.categorySlug}`);
    const row = toToolRow(definition);
    return {
      slug: definition.slug,
      name: definition.name,
      shortDescription: definition.shortDescription,
      category: { name: category.name, slug: category.slug },
      iconKey: definition.iconKey,
      description: definition.description,
      howTo: definition.howTo,
      tags: definition.tags,
      featured: definition.featured,
      popularity: row.popularity,
      componentKey: row.componentKey ?? undefined,
    };
  });
