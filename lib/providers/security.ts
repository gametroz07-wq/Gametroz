export type UrlCheck = "ok" | "missing" | "invalid" | "not-https" | "host-not-allowed";

/**
 * Strict URL check against a host allowlist: HTTPS only, exact host match,
 * no credentials in the URL. Used for embeds and thumbnails.
 */
export function checkUrl(value: string | null | undefined, allowedHosts: readonly string[]): UrlCheck {
  if (!value || !value.trim()) return "missing";
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return "invalid";
  }
  if (url.protocol !== "https:") return "not-https";
  if (url.username || url.password) return "host-not-allowed";
  return allowedHosts.includes(url.hostname.toLowerCase()) ? "ok" : "host-not-allowed";
}

/** The only gate an embed URL passes before it can reach an iframe. */
export function isAllowedEmbedUrl(value: string | null | undefined, allowedHosts: readonly string[]) {
  return checkUrl(value, allowedHosts) === "ok";
}
