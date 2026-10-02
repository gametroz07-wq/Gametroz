import { providerHosts } from "./hosts";
import { isAllowedEmbedUrl } from "./security";

/**
 * Sandbox for provider game iframes, verified against a real GameMonetize game (2026-10-01):
 * - allow-scripts + allow-same-origin: the game runs on its own origin (html5.gamemonetize.co),
 *   never Gametroz's, and needs storage for saves and its ad SDK.
 * - allow-pointer-lock: games that capture the mouse.
 * - allow-popups + allow-popups-to-escape-sandbox: ad clicks open the advertiser in a new tab
 *   (this is how the publisher earns). Popups still require a user gesture in browsers.
 * Deliberately absent: allow-top-navigation* (the game can never navigate Gametroz away),
 * allow-forms, allow-downloads, allow-modals.
 */
export const GAME_IFRAME_SANDBOX =
  "allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-popups-to-escape-sandbox";

/** Feature delegation; Permissions-Policy limits the same features to the allowlisted origins. */
export const GAME_IFRAME_ALLOW = "fullscreen; autoplay; gamepad";

/** Exact https origins of every allowlisted embed host (used by CSP frame-src and Permissions-Policy). */
export function embedFrameOrigins() {
  return [...new Set(Object.values(providerHosts).flatMap((hosts) => hosts.embedHosts.map((host) => `https://${host}`)))];
}

/** Off by default. Read at build/start time, so changing it requires a restart or rebuild. */
export function gameEmbedsEnabled() {
  return process.env.GAME_EMBEDS_ENABLED === "true";
}

/** The single gate before an iframe: embeds enabled AND the URL passes the provider allowlist. */
export function resolveEmbedUrl(game: { embedUrl: string | null; providerSlug: string | null }) {
  if (!gameEmbedsEnabled() || !game.embedUrl || !game.providerSlug) return null;
  const hosts = providerHosts[game.providerSlug];
  return hosts && isAllowedEmbedUrl(game.embedUrl, hosts.embedHosts) ? game.embedUrl : null;
}
