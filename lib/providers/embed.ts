import { providerHosts } from "./hosts";
import { isAllowedEmbedUrl } from "./security";

/** Off by default. Read at build time for static pages, so changing it requires a rebuild. */
export function gameEmbedsEnabled() {
  return process.env.GAME_EMBEDS_ENABLED === "true";
}

/** The single gate before an iframe: embeds enabled AND the URL passes the provider allowlist. */
export function resolveEmbedUrl(game: { embedUrl: string | null; providerSlug: string | null }) {
  if (!gameEmbedsEnabled() || !game.embedUrl || !game.providerSlug) return null;
  const hosts = providerHosts[game.providerSlug];
  return hosts && isAllowedEmbedUrl(game.embedUrl, hosts.embedHosts) ? game.embedUrl : null;
}
