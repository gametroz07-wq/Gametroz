import { LINKS_VERIFIED_AT, type AppCategoryDefinition, type AppDefinition, type PlatformDefinition } from "./definitions";

// Pure planning for `npm run apps:sync`: compares the definitions with what the database holds.
// No database access here, so the diff rules are unit-tested.

export const MAX_ARCHIVES_WITHOUT_CONFIRMATION = 10;

/** Platform slugs that were renamed: new slug -> the slug it used to have. The row is renamed in place. */
export const LEGACY_PLATFORM_SLUGS: Record<string, string> = { web: "browser" };

export type CatalogRow = {
  slug: string;
  name: string;
  description: string;
  iconKey: string;
  sortOrder: number;
};
export type PlatformRow = CatalogRow;
export type CategoryRow = CatalogRow;
export type ExistingPlatformRow = PlatformRow;

export type AppRow = {
  slug: string;
  name: string;
  publisher: string;
  shortDescription: string;
  description: string;
  version: string | null;
  license: string | null;
  officialWebsite: string;
  officialDownloadUrl: string | null;
  iconUrl: string | null;
  features: string[];
  requirements: string[];
  status: string;
  featured: boolean;
  sortOrder: number;
  /** ISO timestamp. */
  lastVerifiedAt: string | null;
  categorySlug: string;
  tags: string[];
  /** Platform slugs (order does not matter). */
  platforms: string[];
  /** Alternative app slugs, in display order. */
  alternatives: string[];
};

export type ExistingAppRow = AppRow & { publishedAt: Date | null };

export type SyncPlan = {
  platforms: {
    create: PlatformRow[];
    /** The legacy row keeps its id (and its app joins); only slug and catalog fields change. */
    rename: { from: string; row: PlatformRow; changed: string[] }[];
    update: { row: PlatformRow; changed: string[] }[];
    unchanged: string[];
  };
  /** Categories are never archived: pages only list categories that have published apps. */
  categories: {
    create: CategoryRow[];
    update: { row: CategoryRow; changed: string[] }[];
    unchanged: string[];
  };
  apps: {
    create: AppRow[];
    update: { row: AppRow; changed: string[]; setPublishedAt: boolean }[];
    unchanged: string[];
    /** Published apps that are no longer defined. They are archived, never deleted. */
    archive: { slug: string; name: string }[];
  };
};

export function toPlatformRow(platform: PlatformDefinition): PlatformRow {
  const { slug, name, description, iconKey, sortOrder } = platform;
  return { slug, name, description, iconKey, sortOrder };
}

export function toCategoryRow(category: AppCategoryDefinition): CategoryRow {
  const { slug, name, description, iconKey, sortOrder } = category;
  return { slug, name, description, iconKey, sortOrder };
}

/** Facts the definitions do not state stay null: no version, no icon file (letter tiles are drawn in the UI). */
export function toAppRow(app: AppDefinition): AppRow {
  return {
    slug: app.slug,
    name: app.name,
    publisher: app.developer,
    shortDescription: app.shortDescription,
    description: app.description,
    version: null,
    license: app.license ?? null,
    officialWebsite: app.officialWebsite,
    officialDownloadUrl: app.officialDownloadUrl,
    iconUrl: null,
    features: app.features,
    requirements: app.requirements,
    status: "PUBLISHED",
    featured: app.featured,
    sortOrder: app.sortOrder,
    lastVerifiedAt: `${LINKS_VERIFIED_AT}T00:00:00.000Z`,
    categorySlug: app.categorySlug,
    tags: app.tags,
    platforms: app.platforms,
    alternatives: app.alternatives,
  };
}

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((value, index) => value === b[index]);
const sameSet = (a: string[], b: string[]) => sameList([...a].sort(), [...b].sort());

const CATALOG_FIELDS = ["name", "description", "iconKey", "sortOrder"] as const;
const APP_FIELDS = [
  "name",
  "publisher",
  "shortDescription",
  "description",
  "version",
  "license",
  "officialWebsite",
  "officialDownloadUrl",
  "iconUrl",
  "features",
  "requirements",
  "status",
  "featured",
  "sortOrder",
  "lastVerifiedAt",
  "categorySlug",
  "tags",
  "platforms",
  "alternatives",
] as const;

const changedCatalogFields = (next: CatalogRow, current: CatalogRow) => CATALOG_FIELDS.filter((field) => next[field] !== current[field]);

function changedAppFields(next: AppRow, current: AppRow) {
  return APP_FIELDS.filter((field) => {
    if (field === "features" || field === "requirements" || field === "alternatives") return !sameList(next[field], current[field]);
    if (field === "tags" || field === "platforms") return !sameSet(next[field], current[field]);
    return next[field] !== current[field];
  });
}

function planCatalog(definitions: CatalogRow[], existing: CatalogRow[]) {
  const rows = new Map(existing.map((row) => [row.slug, row]));
  const create: CatalogRow[] = [];
  const update: { row: CatalogRow; changed: string[] }[] = [];
  const unchanged: string[] = [];
  for (const row of definitions) {
    const current = rows.get(row.slug);
    if (!current) {
      create.push(row);
      continue;
    }
    const changed = changedCatalogFields(row, current);
    if (changed.length) update.push({ row, changed });
    else unchanged.push(row.slug);
  }
  return { create, update, unchanged };
}

export function buildSyncPlan(input: {
  platforms: PlatformDefinition[];
  categories: AppCategoryDefinition[];
  apps: AppDefinition[];
  existingPlatforms: ExistingPlatformRow[];
  existingCategories: CategoryRow[];
  existingApps: ExistingAppRow[];
}): SyncPlan {
  const platformRows = new Map(input.existingPlatforms.map((row) => [row.slug, row]));
  const platforms: SyncPlan["platforms"] = { create: [], rename: [], update: [], unchanged: [] };
  for (const definition of input.platforms) {
    const row = toPlatformRow(definition);
    const current = platformRows.get(row.slug);
    const legacy = LEGACY_PLATFORM_SLUGS[row.slug];
    if (!current && legacy && platformRows.has(legacy)) {
      const changed = ["slug", ...changedCatalogFields(row, platformRows.get(legacy)!)];
      platforms.rename.push({ from: legacy, row, changed });
    } else if (!current) {
      platforms.create.push(row);
    } else {
      const changed = changedCatalogFields(row, current);
      if (changed.length) platforms.update.push({ row, changed });
      else platforms.unchanged.push(row.slug);
    }
  }

  const categories = planCatalog(input.categories.map(toCategoryRow), input.existingCategories);

  const appRows = new Map(input.existingApps.map((row) => [row.slug, row]));
  const apps: SyncPlan["apps"] = { create: [], update: [], unchanged: [], archive: [] };
  for (const definition of input.apps) {
    const row = toAppRow(definition);
    const current = appRows.get(row.slug);
    if (!current) {
      apps.create.push(row);
      continue;
    }
    const changed: string[] = changedAppFields(row, current);
    const setPublishedAt = current.publishedAt === null;
    if (setPublishedAt) changed.push("publishedAt");
    if (changed.length) apps.update.push({ row, changed, setPublishedAt });
    else apps.unchanged.push(row.slug);
  }

  const defined = new Set(input.apps.map((app) => app.slug));
  for (const row of input.existingApps) {
    if (row.status === "PUBLISHED" && !defined.has(row.slug)) apps.archive.push({ slug: row.slug, name: row.name });
  }
  return { platforms, categories, apps };
}

export function checkArchiveGuard(plan: SyncPlan, confirmed: boolean): { ok: true } | { ok: false; reason: string } {
  const count = plan.apps.archive.length;
  if (count > MAX_ARCHIVES_WITHOUT_CONFIRMATION && !confirmed) {
    return {
      ok: false,
      reason: `This plan would archive ${count} published apps (limit ${MAX_ARCHIVES_WITHOUT_CONFIRMATION}). Review the table and re-run with --confirm-archive if that is intended.`,
    };
  }
  return { ok: true };
}
