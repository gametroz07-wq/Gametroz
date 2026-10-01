import type { PrismaClient } from "@/lib/generated/prisma/client";
import { providerHosts } from "./hosts";
import { checkUrl } from "./security";

export const FIXTURE_ID_PREFIX = "fixture-";

export type PublishResult = { ok: true; slug: string } | { ok: false; slug: string; reason: string };

/**
 * The only way a provider game becomes public: an explicit REVIEW → PUBLISHED call.
 * Sync never publishes. Checks run again here because data may have changed since import.
 */
export async function publishGame(prisma: PrismaClient, slug: string): Promise<PublishResult> {
  const game = await prisma.game.findUnique({
    where: { slug },
    select: {
      id: true,
      status: true,
      validationStatus: true,
      providerGameId: true,
      embedUrl: true,
      thumbnailUrl: true,
      provider: { select: { slug: true } },
    },
  });

  if (!game) return { ok: false, slug, reason: "Game not found." };
  if (game.status !== "REVIEW") return { ok: false, slug, reason: `Only REVIEW games can be published (current: ${game.status}).` };
  if (game.validationStatus === "REJECTED") return { ok: false, slug, reason: "The last sync rejected this game." };

  if (game.provider) {
    if (game.providerGameId?.startsWith(FIXTURE_ID_PREFIX)) {
      return { ok: false, slug, reason: "Fixture (mock provider) games can never be published." };
    }
    const hosts = providerHosts[game.provider.slug];
    if (!hosts) return { ok: false, slug, reason: `Unknown provider "${game.provider.slug}".` };
    if (checkUrl(game.embedUrl, hosts.embedHosts) !== "ok") return { ok: false, slug, reason: "Embed URL is not allowlisted." };
    if (checkUrl(game.thumbnailUrl, hosts.imageHosts) !== "ok") return { ok: false, slug, reason: "Thumbnail URL is not allowlisted." };
  }

  await prisma.game.update({ where: { id: game.id }, data: { status: "PUBLISHED", publishedAt: new Date() } });
  return { ok: true, slug };
}
