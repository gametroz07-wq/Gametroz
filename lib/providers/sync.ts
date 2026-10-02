import type { Prisma, PrismaClient } from "@/lib/generated/prisma/client";
import { type ImageProbe, probeRemoteImage } from "./image-size";
import type {
  GameProvider,
  NormalizedGame,
  SyncItemReport,
  SyncResult,
  ValidationIssue,
  ValidationResult,
} from "./types";

/** Explicit batch sizes. There is no "all": an import can never be unlimited by accident. */
export const SYNC_BATCH_SIZES = [10, 50, 100, 500] as const;
/** Safety limit when PROVIDER_SYNC_MAX is not set. */
export const DEFAULT_SYNC_MAX = 100;
/** Ceiling for PROVIDER_SYNC_MAX itself. */
export const ABSOLUTE_SYNC_MAX = 500;
const LARGE_BATCH = 100;

type LimitOptions = { max?: number; confirmLarge?: boolean };

/**
 * Validates an import size: required, one of SYNC_BATCH_SIZES, within the configurable safety limit
 * (PROVIDER_SYNC_MAX, default 100, never above 500) and explicitly confirmed above 100.
 */
export function resolveSyncLimit(limit: number | undefined, { max, confirmLarge = false }: LimitOptions) {
  if (limit === undefined || !Number.isFinite(limit)) throw new Error("--limit is required (10, 50, 100 or 500).");
  if (!(SYNC_BATCH_SIZES as readonly number[]).includes(limit)) {
    throw new Error(`--limit must be one of ${SYNC_BATCH_SIZES.join(", ")}.`);
  }
  const safety = Math.min(max && max > 0 ? max : DEFAULT_SYNC_MAX, ABSOLUTE_SYNC_MAX);
  if (limit > safety) {
    throw new Error(`--limit ${limit} exceeds the safety limit of ${safety}. Raise PROVIDER_SYNC_MAX (max ${ABSOLUTE_SYNC_MAX}) to allow it.`);
  }
  if (limit > LARGE_BATCH && !confirmLarge) throw new Error(`Batches above ${LARGE_BATCH} require --confirm-large.`);
  return limit;
}

/** Keeps the first occurrence of each provider id; later repeats are reported as duplicates. */
export function dedupeByProviderGameId<T>(items: T[], getId: (item: T) => string) {
  const seen = new Set<string>();
  const unique: T[] = [];
  const duplicates: T[] = [];
  for (const item of items) {
    const id = getId(item);
    if (id && seen.has(id)) duplicates.push(item);
    else {
      if (id) seen.add(id);
      unique.push(item);
    }
  }
  return { unique, duplicates };
}

export type SyncOptions = {
  prisma: PrismaClient;
  limit: number;
  dryRun?: boolean;
  /** PROVIDER_SYNC_MAX safety limit. */
  maxLimit?: number;
  confirmLarge?: boolean;
  /** Fetch each thumbnail header (HTTPS, 200, image, dimensions). Off for fixtures. */
  checkImages?: boolean;
  probeImage?: (url: string) => Promise<ImageProbe>;
};

const MIN_THUMBNAIL_WIDTH = 200;
const IMAGE_PROBE_CONCURRENCY = 8;

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index]);
      }
    }),
  );
  return results;
}

const reject = (validation: ValidationResult, issue: ValidationIssue): ValidationResult => ({
  status: "REJECTED",
  issues: [...validation.issues, issue],
});

const tagsInput = (tags: string[]) => ({
  connectOrCreate: tags.map((slug) => ({ where: { slug }, create: { slug, name: slug } })),
});

/**
 * Fetch → validate → normalize → deduplicate → upsert by (providerId, providerGameId).
 * New games always land in REVIEW; existing games only get provider-owned technical fields
 * refreshed, so editorial edits and publication status are never overwritten.
 */
export async function syncProviderGames<TRaw>(
  provider: GameProvider<TRaw>,
  { prisma, limit, dryRun = false, maxLimit, confirmLarge, checkImages = false, probeImage = probeRemoteImage }: SyncOptions,
): Promise<SyncResult> {
  resolveSyncLimit(limit, { max: maxLimit, confirmLarge });

  const providerRow = await prisma.provider.upsert({
    where: { slug: provider.slug },
    create: { slug: provider.slug, name: provider.name, baseUrl: provider.baseUrl, enabled: false },
    update: { name: provider.name, baseUrl: provider.baseUrl },
  });
  const importRecord = await prisma.importRecord.create({
    data: { providerId: providerRow.id, dryRun, requestedLimit: limit },
  });

  const items: SyncItemReport[] = [];
  try {
    const raw = (await provider.getGames({ limit })).slice(0, limit);
    const { unique, duplicates } = dedupeByProviderGameId(raw, provider.getId);

    for (const game of duplicates) {
      items.push({
        providerGameId: provider.getId(game),
        slug: provider.normalize(game).slug,
        outcome: "ignore",
        validation: "REJECTED",
        issues: [{ code: "DUPLICATE_IN_FEED", message: "The feed repeats this provider id.", severity: "error" }],
      });
    }

    const normalized = unique.map((game) => ({ game, data: provider.normalize(game) }));
    const ids = normalized.map(({ data }) => data.providerGameId).filter(Boolean);
    const slugs = normalized.map(({ data }) => data.slug).filter(Boolean);

    const [existing, slugOwners, categories] = await Promise.all([
      prisma.game.findMany({
        where: { providerId: providerRow.id, providerGameId: { in: ids } },
        select: { id: true, providerGameId: true, status: true },
      }),
      prisma.game.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true, providerId: true, providerGameId: true },
      }),
      prisma.gameCategory.findMany({ select: { id: true, slug: true } }),
    ]);
    const existingById = new Map(existing.map((row) => [row.providerGameId!, { id: row.id, status: row.status }]));
    const ownerBySlug = new Map(slugOwners.map((row) => [row.slug, row]));
    const categoryIdBySlug = new Map(categories.map((row) => [row.slug, row.id]));
    const batchSlugs = new Map<string, string>();
    const probes = checkImages
      ? await mapWithConcurrency(normalized, IMAGE_PROBE_CONCURRENCY, ({ data }) => probeImage(data.thumbnailUrl))
      : [];

    const isSlugTaken = (slug: string, providerGameId: string) => {
      const owner = ownerBySlug.get(slug);
      if (owner && !(owner.providerId === providerRow.id && owner.providerGameId === providerGameId)) return true;
      const batchOwner = batchSlugs.get(slug);
      return batchOwner !== undefined && batchOwner !== providerGameId;
    };

    for (const [index, { game, data }] of normalized.entries()) {
      let validation = provider.validate(game, { isSlugTaken });
      const probe = probes[index];
      if (probe && validation.status !== "REJECTED") {
        if (!probe.ok) {
          validation = reject(validation, {
            code: "THUMBNAIL_UNREACHABLE",
            message: `Thumbnail check failed: ${probe.reason}.`,
            severity: "error",
          });
        } else if (probe.width < MIN_THUMBNAIL_WIDTH) {
          validation = {
            status: "NEEDS_REVIEW",
            issues: [...validation.issues, { code: "THUMBNAIL_SMALL", message: `Thumbnail is ${probe.width}x${probe.height}px.`, severity: "warning" }],
          };
        }
      }
      if (validation.status !== "REJECTED" && !categoryIdBySlug.has(data.category)) {
        validation = reject(validation, {
          code: "CATEGORY_UNMAPPED",
          message: `Category "${data.category}" does not exist in the database.`,
          severity: "error",
        });
      }
      if (validation.status !== "REJECTED") batchSlugs.set(data.slug, data.providerGameId);

      const existingId = existingById.get(data.providerGameId);
      const report: SyncItemReport = {
        providerGameId: data.providerGameId,
        slug: data.slug,
        outcome: validation.status === "REJECTED" ? "reject" : existingId ? "update" : "create",
        validation: validation.status,
        issues: validation.issues,
      };

      if (!dryRun) {
        try {
          await writeGame({ prisma, providerId: providerRow.id, data, validation, existing: existingId, categoryIdBySlug });
        } catch (error) {
          report.outcome = "fail";
          report.issues = [
            ...report.issues,
            { code: "WRITE_FAILED", message: error instanceof Error ? error.message : String(error), severity: "error" },
          ];
        }
      }
      items.push(report);
    }
  } catch (error) {
    await prisma.importRecord.update({
      where: { id: importRecord.id },
      data: { completedAt: new Date(), logs: { error: error instanceof Error ? error.message : String(error) } },
    });
    throw error;
  }

  const count = (outcome: SyncItemReport["outcome"]) => items.filter((item) => item.outcome === outcome).length;
  const result: SyncResult = {
    provider: provider.slug,
    dryRun,
    limit,
    importRecordId: importRecord.id,
    received: items.length,
    created: count("create"),
    updated: count("update"),
    ignored: count("ignore"),
    rejected: count("reject"),
    needsReview: items.filter(
      (item) => (item.outcome === "create" || item.outcome === "update") && item.validation === "NEEDS_REVIEW",
    ).length,
    failed: count("fail"),
    items,
  };

  await prisma.importRecord.update({
    where: { id: importRecord.id },
    data: {
      completedAt: new Date(),
      totalReceived: result.received,
      created: result.created,
      updated: result.updated,
      ignored: result.ignored,
      rejected: result.rejected,
      needsReview: result.needsReview,
      failed: result.failed,
      logs: items as unknown as Prisma.InputJsonValue,
    },
  });
  return result;
}

async function writeGame({
  prisma,
  providerId,
  data,
  validation,
  existing,
  categoryIdBySlug,
}: {
  prisma: PrismaClient;
  providerId: string;
  data: NormalizedGame;
  validation: ValidationResult;
  existing: { id: string; status: string } | undefined;
  categoryIdBySlug: Map<string, string>;
}) {
  const validationFields = {
    validationStatus: validation.status,
    validationIssues: validation.issues as unknown as Prisma.InputJsonValue,
    lastSyncedAt: new Date(),
  };

  if (existing) {
    // A rejected refresh only records the problem; the stored game is left untouched.
    if (validation.status === "REJECTED") {
      await prisma.game.update({ where: { id: existing.id }, data: validationFields });
      return;
    }
    const technical = {
      embedUrl: data.embedUrl,
      thumbnailUrl: data.thumbnailUrl,
      width: data.width,
      height: data.height,
      orientation: data.orientation,
    };
    // Games still in REVIEW were never edited or published, so they take the full provider data
    // (except the slug). Published or archived games only get technical fields refreshed.
    const content =
      existing.status === "REVIEW"
        ? {
            name: data.name,
            shortDescription: data.shortDescription,
            description: data.description,
            instructions: data.instructions,
            heroImageUrl: data.heroImageUrl,
            language: data.language,
            category: { connect: { id: categoryIdBySlug.get(data.category!)! } },
            tags: { set: [], ...tagsInput(data.tags) },
          }
        : {};
    await prisma.game.update({ where: { id: existing.id }, data: { ...validationFields, ...technical, ...content } });
    return;
  }

  if (validation.status === "REJECTED") return;

  await prisma.game.create({
    data: {
      slug: data.slug,
      name: data.name,
      shortDescription: data.shortDescription,
      description: data.description,
      instructions: data.instructions,
      embedUrl: data.embedUrl,
      thumbnailUrl: data.thumbnailUrl,
      heroImageUrl: data.heroImageUrl,
      orientation: data.orientation,
      width: data.width,
      height: data.height,
      language: data.language,
      status: data.status,
      providerGameId: data.providerGameId,
      provider: { connect: { id: providerId } },
      category: { connect: { id: categoryIdBySlug.get(data.category!)! } },
      tags: tagsInput(data.tags),
      ...validationFields,
    },
  });
}
