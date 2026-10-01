import type { Prisma, PrismaClient } from "@/lib/generated/prisma/client";
import type {
  GameProvider,
  NormalizedGame,
  SyncItemReport,
  SyncResult,
  ValidationIssue,
  ValidationResult,
} from "./types";

/** Hard cap while the provider layer is being validated (Phase 4). Raising it needs explicit approval. */
export const MAX_SYNC_LIMIT = 20;

export function assertSyncLimit(limit: number) {
  if (!Number.isInteger(limit) || limit < 1) throw new Error("Sync limit must be at least 1.");
  if (limit > MAX_SYNC_LIMIT) throw new Error(`Sync limit must be at most ${MAX_SYNC_LIMIT} during this phase.`);
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
  limit?: number;
  dryRun?: boolean;
};

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
  { prisma, limit = MAX_SYNC_LIMIT, dryRun = false }: SyncOptions,
): Promise<SyncResult> {
  assertSyncLimit(limit);

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
        select: { id: true, providerGameId: true },
      }),
      prisma.game.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true, providerId: true, providerGameId: true },
      }),
      prisma.gameCategory.findMany({ select: { id: true, slug: true } }),
    ]);
    const existingById = new Map(existing.map((row) => [row.providerGameId!, row.id]));
    const ownerBySlug = new Map(slugOwners.map((row) => [row.slug, row]));
    const categoryIdBySlug = new Map(categories.map((row) => [row.slug, row.id]));
    const batchSlugs = new Map<string, string>();

    const isSlugTaken = (slug: string, providerGameId: string) => {
      const owner = ownerBySlug.get(slug);
      if (owner && !(owner.providerId === providerRow.id && owner.providerGameId === providerGameId)) return true;
      const batchOwner = batchSlugs.get(slug);
      return batchOwner !== undefined && batchOwner !== providerGameId;
    };

    for (const { game, data } of normalized) {
      let validation = provider.validate(game, { isSlugTaken });
      if (validation.status !== "REJECTED" && !categoryIdBySlug.has(data.category ?? "")) {
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
          await writeGame({ prisma, providerId: providerRow.id, data, validation, existingId, categoryIdBySlug });
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
  existingId,
  categoryIdBySlug,
}: {
  prisma: PrismaClient;
  providerId: string;
  data: NormalizedGame;
  validation: ValidationResult;
  existingId: string | undefined;
  categoryIdBySlug: Map<string, string>;
}) {
  const validationFields = {
    validationStatus: validation.status,
    validationIssues: validation.issues as unknown as Prisma.InputJsonValue,
    lastSyncedAt: new Date(),
  };

  if (existingId) {
    // A rejected refresh only records the problem; the stored game is left untouched.
    await prisma.game.update({
      where: { id: existingId },
      data:
        validation.status === "REJECTED"
          ? validationFields
          : {
              ...validationFields,
              embedUrl: data.embedUrl,
              thumbnailUrl: data.thumbnailUrl,
              width: data.width,
              height: data.height,
              orientation: data.orientation,
            },
    });
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
