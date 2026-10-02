import type { PrismaClient } from "@/lib/generated/prisma/client";
import { providerHosts } from "./hosts";
import { checkUrl } from "./security";
import type { ValidationIssue } from "./types";

export const FIXTURE_ID_PREFIX = "fixture-";

/** Identify a game by slug, or by provider id (providerGameId within a provider, default GameMonetize). */
export type GameRef = { slug: string } | { providerGameId: string; provider?: string };

export type PublishResult = { ok: true; slug: string } | { ok: false; slug: string; reason: string };

type PublishOptions = { ackEditorial?: boolean };

const refLabel = (ref: GameRef) => ("slug" in ref ? ref.slug : `${ref.provider ?? "gamemonetize"}:${ref.providerGameId}`);

const gameSelect = {
  id: true,
  slug: true,
  status: true,
  validationStatus: true,
  validationIssues: true,
  providerGameId: true,
  embedUrl: true,
  thumbnailUrl: true,
  provider: { select: { slug: true } },
} as const;

async function findGame(prisma: PrismaClient, ref: GameRef) {
  if ("slug" in ref) return prisma.game.findUnique({ where: { slug: ref.slug }, select: gameSelect });
  return prisma.game.findFirst({
    where: { providerGameId: ref.providerGameId, provider: { slug: ref.provider ?? "gamemonetize" } },
    select: gameSelect,
  });
}

const editorialMessages = (issues: unknown) =>
  ((issues as ValidationIssue[] | null) ?? [])
    .filter((issue) => issue.code === "EDITORIAL_REVIEW_REQUIRED")
    .map((issue) => issue.message);

/**
 * The only way a game becomes public: an explicit REVIEW → PUBLISHED call. Sync never publishes.
 * Checks run again here because data may have changed since import. Games flagged
 * EDITORIAL_REVIEW_REQUIRED need `ackEditorial` (the human confirms they reviewed the warnings).
 */
export async function publishGame(prisma: PrismaClient, ref: GameRef | string, { ackEditorial = false }: PublishOptions = {}): Promise<PublishResult> {
  const target: GameRef = typeof ref === "string" ? { slug: ref } : ref;
  const game = await findGame(prisma, target);
  const label = game?.slug ?? refLabel(target);

  if (!game) return { ok: false, slug: label, reason: "Game not found." };
  if (game.status !== "REVIEW") return { ok: false, slug: label, reason: `Only REVIEW games can be published (current: ${game.status}).` };
  if (game.validationStatus === "REJECTED") return { ok: false, slug: label, reason: "The last sync rejected this game." };

  const editorial = editorialMessages(game.validationIssues);
  if (editorial.length && !ackEditorial) {
    return { ok: false, slug: label, reason: `Editorial review required (re-run with --ack-editorial after checking): ${editorial.join(" ")}` };
  }

  if (game.provider) {
    if (game.providerGameId?.startsWith(FIXTURE_ID_PREFIX)) {
      return { ok: false, slug: label, reason: "Fixture (mock provider) games can never be published." };
    }
    const hosts = providerHosts[game.provider.slug];
    if (!hosts) return { ok: false, slug: label, reason: `Unknown provider "${game.provider.slug}".` };
    if (checkUrl(game.embedUrl, hosts.embedHosts) !== "ok") return { ok: false, slug: label, reason: "Embed URL is not allowlisted." };
    if (checkUrl(game.thumbnailUrl, hosts.imageHosts) !== "ok") return { ok: false, slug: label, reason: "Thumbnail URL is not allowlisted." };
  }

  await prisma.game.update({ where: { id: game.id }, data: { status: "PUBLISHED", publishedAt: new Date() } });
  return { ok: true, slug: game.slug };
}

/** Publishes an explicit list, one by one. Never "publish all". */
export async function publishGames(prisma: PrismaClient, refs: GameRef[], options: PublishOptions = {}) {
  const results: PublishResult[] = [];
  for (const ref of refs) results.push(await publishGame(prisma, ref, options));
  return results;
}

/** REVIEW or PUBLISHED → ARCHIVED. Archived games disappear from every public query. */
export async function archiveGames(prisma: PrismaClient, refs: GameRef[]) {
  const results: PublishResult[] = [];
  for (const ref of refs) {
    const game = await findGame(prisma, ref);
    if (!game) results.push({ ok: false, slug: refLabel(ref), reason: "Game not found." });
    else if (game.status === "ARCHIVED") results.push({ ok: false, slug: game.slug, reason: "Already archived." });
    else {
      await prisma.game.update({ where: { id: game.id }, data: { status: "ARCHIVED" } });
      results.push({ ok: true, slug: game.slug });
    }
  }
  return results;
}
