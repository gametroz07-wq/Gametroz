import type { ToolCategoryDefinition, ToolDefinition } from "./definitions";

// Pure planning for `npm run tools:sync`: compares the definitions with what the database holds.
// No database access here, so the diff rules are unit-tested.

export const MAX_ARCHIVES_WITHOUT_CONFIRMATION = 10;

export type CategoryRow = {
  slug: string;
  name: string;
  description: string;
  iconKey: string;
  sortOrder: number;
};

export type ToolRow = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  howTo: string[];
  iconKey: string;
  componentKey: string | null;
  status: string;
  featured: boolean;
  popularity: number;
  sortOrder: number;
  categorySlug: string;
  tags: string[];
};

export type ExistingToolRow = ToolRow & { publishedAt: Date | null };

export type SyncPlan = {
  categories: {
    create: CategoryRow[];
    update: { row: CategoryRow; changed: string[] }[];
    unchanged: string[];
  };
  tools: {
    create: ToolRow[];
    update: { row: ToolRow; changed: string[]; setPublishedAt: boolean }[];
    unchanged: string[];
    /** Published tools that are no longer defined. They are archived, never deleted. */
    archive: { slug: string; name: string }[];
  };
};

const POPULARITY_BASE = 1000;

export function toCategoryRow(category: ToolCategoryDefinition): CategoryRow {
  const { slug, name, description, iconKey, sortOrder } = category;
  return { slug, name, description, iconKey, sortOrder };
}

/** Earlier tools rank as more popular, so category and "popular" lists follow the definition order. */
export function toToolRow(tool: ToolDefinition): ToolRow {
  return {
    slug: tool.slug,
    name: tool.name,
    shortDescription: tool.shortDescription,
    description: tool.description,
    howTo: tool.howTo,
    iconKey: tool.iconKey,
    componentKey: tool.slug,
    status: "PUBLISHED",
    featured: tool.featured,
    popularity: Math.max(0, POPULARITY_BASE - tool.sortOrder),
    sortOrder: tool.sortOrder,
    categorySlug: tool.categorySlug,
    tags: tool.tags,
  };
}

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((value, index) => value === b[index]);
const sameSet = (a: string[], b: string[]) => sameList([...a].sort(), [...b].sort());

const CATEGORY_FIELDS = ["name", "description", "iconKey", "sortOrder"] as const;
const TOOL_FIELDS = [
  "name",
  "shortDescription",
  "description",
  "howTo",
  "iconKey",
  "componentKey",
  "status",
  "featured",
  "popularity",
  "sortOrder",
  "categorySlug",
  "tags",
] as const;

function changedCategoryFields(next: CategoryRow, current: CategoryRow) {
  return CATEGORY_FIELDS.filter((field) => next[field] !== current[field]);
}

function changedToolFields(next: ToolRow, current: ToolRow) {
  return TOOL_FIELDS.filter((field) => {
    if (field === "howTo") return !sameList(next.howTo, current.howTo);
    if (field === "tags") return !sameSet(next.tags, current.tags);
    return next[field] !== current[field];
  });
}

export function buildSyncPlan(input: {
  categories: ToolCategoryDefinition[];
  tools: ToolDefinition[];
  existingCategories: CategoryRow[];
  existingTools: ExistingToolRow[];
}): SyncPlan {
  const categoryRows = new Map(input.existingCategories.map((row) => [row.slug, row]));
  const toolRows = new Map(input.existingTools.map((row) => [row.slug, row]));
  const plan: SyncPlan = {
    categories: { create: [], update: [], unchanged: [] },
    tools: { create: [], update: [], unchanged: [], archive: [] },
  };

  for (const definition of input.categories) {
    const row = toCategoryRow(definition);
    const current = categoryRows.get(row.slug);
    if (!current) {
      plan.categories.create.push(row);
      continue;
    }
    const changed = changedCategoryFields(row, current);
    if (changed.length) plan.categories.update.push({ row, changed });
    else plan.categories.unchanged.push(row.slug);
  }

  for (const definition of input.tools) {
    const row = toToolRow(definition);
    const current = toolRows.get(row.slug);
    if (!current) {
      plan.tools.create.push(row);
      continue;
    }
    const changed: string[] = changedToolFields(row, current);
    const setPublishedAt = current.publishedAt === null;
    if (setPublishedAt) changed.push("publishedAt");
    if (changed.length) plan.tools.update.push({ row, changed, setPublishedAt });
    else plan.tools.unchanged.push(row.slug);
  }

  const defined = new Set(input.tools.map((tool) => tool.slug));
  for (const row of input.existingTools) {
    if (row.status === "PUBLISHED" && !defined.has(row.slug)) plan.tools.archive.push({ slug: row.slug, name: row.name });
  }
  return plan;
}

export function checkArchiveGuard(plan: SyncPlan, confirmed: boolean): { ok: true } | { ok: false; reason: string } {
  const count = plan.tools.archive.length;
  if (count > MAX_ARCHIVES_WITHOUT_CONFIRMATION && !confirmed) {
    return {
      ok: false,
      reason: `This plan would archive ${count} published tools (limit ${MAX_ARCHIVES_WITHOUT_CONFIRMATION}). Review the table and re-run with --confirm-archive if that is intended.`,
    };
  }
  return { ok: true };
}
