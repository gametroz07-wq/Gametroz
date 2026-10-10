import { timingSafeEqual } from "node:crypto";
import { defaultLocale } from "./i18n/config";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUGS = 500;
const MIN_SECRET_LENGTH = 16;

/** Constant-time check of `Authorization: Bearer <secret>`. Disabled without a strong secret. */
export function isAuthorizedRevalidation(header: string | null, secret: string | undefined) {
  if (!secret || secret.length < MIN_SECRET_LENGTH || !header?.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice("Bearer ".length));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** `{ slugs: string[] }` with valid slugs only; null for anything else. */
export function parseRevalidateSlugs(body: unknown): string[] | null {
  if (!body || typeof body !== "object") return null;
  const slugs = (body as { slugs?: unknown }).slugs;
  if (!Array.isArray(slugs) || slugs.length > MAX_SLUGS) return null;
  return slugs.every((slug) => typeof slug === "string" && SLUG.test(slug)) ? (slugs as string[]) : null;
}

/**
 * Literal paths to refresh after games are published or archived. Category pages use a pattern.
 * revalidatePath takes the route file path, not the public URL: the proxy serves `/games` from
 * `app/[lang]/games` with lang "en", so the cache entry lives under `/en/games`.
 */
export function gamePathsToRevalidate(slugs: string[]) {
  const root = `/${defaultLocale}`;
  return [root, `${root}/games`, ...slugs.map((slug) => `${root}/game/${slug}`)];
}

/** Pattern for every category page, in any locale (route file path, see gamePathsToRevalidate). */
export const gameCategoryPattern = "/[lang]/games/[category]";
