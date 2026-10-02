import { timingSafeEqual } from "node:crypto";

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

/** Literal paths to refresh after games are published or archived. Category pages use a pattern. */
export function gamePathsToRevalidate(slugs: string[]) {
  return ["/", "/games", ...slugs.map((slug) => `/game/${slug}`)];
}
