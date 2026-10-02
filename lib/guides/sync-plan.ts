import type { GuideBlock } from "@/types/content";
import { countWords, extractPageLinks, extractReferences, readingMinutes } from "./blocks";
import type { GuideDefinition } from "./definitions";

// Pure planning for `npm run guides:sync`: compares the definitions with what the database holds.
// No database access here, so the diff rules are unit-tested.

export const MAX_ARCHIVES_WITHOUT_CONFIRMATION = 10;

export type GuideRow = {
  slug: string;
  title: string;
  excerpt: string;
  /** GuideSection enum value. */
  section: string;
  body: GuideBlock[];
  readingMinutes: number;
  status: string;
  featured: boolean;
  sortOrder: number;
  /** ISO timestamps. */
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  /** Related slugs derived from every reference in the body (links and item cards). */
  games: string[];
  tools: string[];
  apps: string[];
};

export type ExistingGuideRow = GuideRow;

export type SyncPlan = {
  create: GuideRow[];
  update: { row: GuideRow; changed: string[] }[];
  unchanged: string[];
  /** Published guides that are no longer defined. They are archived, never deleted. */
  archive: { slug: string; title: string }[];
};

const isoMidnight = (date: string) => `${date}T00:00:00.000Z`;

/** Reading time comes from the word count; relations come from the body, so pages link back automatically. */
export function toGuideRow(guide: GuideDefinition): GuideRow {
  const references = extractReferences(guide.body);
  return {
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    section: guide.section.toUpperCase(),
    body: guide.body,
    readingMinutes: readingMinutes(countWords(guide.body)),
    status: "PUBLISHED",
    featured: guide.featured,
    sortOrder: guide.sortOrder,
    publishedAt: isoMidnight(guide.publishedAt),
    updatedAt: isoMidnight(guide.updatedAt),
    tags: guide.tags,
    games: references.games,
    tools: references.tools,
    apps: references.apps,
  };
}

/** JSON with sorted object keys: PostgreSQL jsonb does not preserve key order. */
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

const sameSet = (a: string[], b: string[]) => a.length === b.length && [...a].sort().join("\0") === [...b].sort().join("\0");

const FIELDS = [
  "title",
  "excerpt",
  "section",
  "body",
  "readingMinutes",
  "status",
  "featured",
  "sortOrder",
  "publishedAt",
  "updatedAt",
  "tags",
  "games",
  "tools",
  "apps",
] as const;

function changedFields(next: GuideRow, current: GuideRow) {
  return FIELDS.filter((field) => {
    if (field === "body") return canonicalJson(next.body) !== canonicalJson(current.body);
    if (field === "tags" || field === "games" || field === "tools" || field === "apps") return !sameSet(next[field], current[field]);
    return next[field] !== current[field];
  });
}

export function buildSyncPlan(input: { definitions: GuideDefinition[]; existing: ExistingGuideRow[] }): SyncPlan {
  const rows = new Map(input.existing.map((row) => [row.slug, row]));
  const plan: SyncPlan = { create: [], update: [], unchanged: [], archive: [] };
  for (const definition of input.definitions) {
    const row = toGuideRow(definition);
    const current = rows.get(row.slug);
    if (!current) {
      plan.create.push(row);
      continue;
    }
    const changed: string[] = changedFields(row, current);
    if (changed.length) plan.update.push({ row, changed });
    else plan.unchanged.push(row.slug);
  }
  const defined = new Set(input.definitions.map((definition) => definition.slug));
  for (const row of input.existing) {
    if (row.status === "PUBLISHED" && !defined.has(row.slug)) plan.archive.push({ slug: row.slug, title: row.title });
  }
  return plan;
}

export function checkArchiveGuard(plan: SyncPlan, confirmed: boolean): { ok: true } | { ok: false; reason: string } {
  const count = plan.archive.length;
  if (count > MAX_ARCHIVES_WITHOUT_CONFIRMATION && !confirmed) {
    return {
      ok: false,
      reason: `This plan would archive ${count} published guides (limit ${MAX_ARCHIVES_WITHOUT_CONFIRMATION}). Review the table and re-run with --confirm-archive if that is intended.`,
    };
  }
  return { ok: true };
}

export type ReferenceUniverse = {
  /** Game slug -> status, for the target database. */
  games: Map<string, string>;
  /** Defined tool slugs. */
  tools: Set<string>;
  /** Defined app slugs. */
  apps: Set<string>;
  /** Valid listing paths: /games/<category>, /tools/<category>, /apps/<platform>, /apps/category/<slug>, /guides/<section>. */
  pages: Set<string>;
};

export type MissingReference = {
  guide: string;
  kind: "game" | "tool" | "app" | "guide" | "page";
  slug: string;
  reason: string;
};

/** Everything a guide points to must exist: games PUBLISHED, tools and apps defined, guides defined, listing pages real. */
export function findMissingReferences(definitions: GuideDefinition[], universe: ReferenceUniverse): MissingReference[] {
  const guides = new Set(definitions.map((definition) => definition.slug));
  const problems: MissingReference[] = [];
  for (const definition of definitions) {
    const references = extractReferences(definition.body);
    const add = (kind: MissingReference["kind"], slug: string, reason: string) => problems.push({ guide: definition.slug, kind, slug, reason });
    for (const slug of references.games) {
      const status = universe.games.get(slug);
      if (status === undefined) add("game", slug, "not found");
      else if (status !== "PUBLISHED") add("game", slug, `not published (${status})`);
    }
    for (const slug of references.tools) if (!universe.tools.has(slug)) add("tool", slug, "not defined");
    for (const slug of references.apps) if (!universe.apps.has(slug)) add("app", slug, "not defined");
    for (const slug of references.guides) if (!guides.has(slug)) add("guide", slug, "not defined");
    for (const path of extractPageLinks(definition.body)) if (!universe.pages.has(path)) add("page", path, "not found");
  }
  return problems;
}
