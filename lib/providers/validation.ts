import { editorialIssues } from "./editorial";
import { checkUrl } from "./security";
import { SLUG_PATTERN } from "./text";
import type { NormalizedGame, ValidationContext, ValidationIssue, ValidationResult } from "./types";

export const MIN_DESCRIPTION_LENGTH = 40;
const MIN_SIZE = 200;
const MAX_SIZE = 4096;

type ValidationHosts = {
  embedHosts: readonly string[];
  imageHosts: readonly string[];
};

const error = (code: ValidationIssue["code"], message: string): ValidationIssue => ({ code, message, severity: "error" });
const warning = (code: ValidationIssue["code"], message: string): ValidationIssue => ({
  code,
  message,
  severity: "warning",
});

/**
 * Provider-agnostic rules (docs/04, docs/06 content score).
 * Errors → REJECTED (never stored). Warnings → NEEDS_REVIEW (stored in REVIEW with notes).
 */
export function validateNormalizedGame(
  game: NormalizedGame,
  hosts: ValidationHosts,
  context: ValidationContext = {},
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!game.providerGameId.trim()) issues.push(error("ID_MISSING", "Provider game id is missing."));
  if (!game.name.trim()) issues.push(error("NAME_MISSING", "Name is missing."));
  if (!SLUG_PATTERN.test(game.slug) || game.slug.length < 2) {
    issues.push(error("SLUG_INVALID", `Slug "${game.slug}" is not valid.`));
  } else if (context.isSlugTaken?.(game.slug, game.providerGameId)) {
    issues.push(error("DUPLICATE_SLUG", `Slug "${game.slug}" already belongs to another game (possible duplicate).`));
  }

  const thumbnail = checkUrl(game.thumbnailUrl, hosts.imageHosts);
  if (thumbnail === "missing") issues.push(error("THUMBNAIL_MISSING", "Thumbnail is missing."));
  else if (thumbnail === "host-not-allowed") {
    issues.push(error("THUMBNAIL_HOST_NOT_ALLOWED", "Thumbnail host is not in the allowlist."));
  } else if (thumbnail !== "ok") issues.push(error("THUMBNAIL_INVALID", "Thumbnail must be a valid HTTPS URL."));

  const embed = checkUrl(game.embedUrl, hosts.embedHosts);
  if (embed === "missing") issues.push(error("EMBED_MISSING", "Embed URL is missing."));
  else if (embed === "invalid") issues.push(error("EMBED_INVALID", "Embed URL is not a valid URL."));
  else if (embed === "not-https") issues.push(error("EMBED_NOT_HTTPS", "Embed URL must use HTTPS."));
  else if (embed === "host-not-allowed") {
    issues.push(error("EMBED_HOST_NOT_ALLOWED", "Embed host is not in the provider allowlist."));
  }

  if (game.categoryMatch === "fallback") {
    issues.push(
      warning(
        "CATEGORY_UNMAPPED",
        `Provider category "${game.providerCategory || "(empty)"}" is not mapped; imported as "${game.category}" for review.`,
      ),
    );
  }

  const sizeOk = (value: number | null) => value !== null && value >= MIN_SIZE && value <= MAX_SIZE;
  if (!sizeOk(game.width) || !sizeOk(game.height)) {
    issues.push(warning("SIZE_UNREASONABLE", `Size ${game.width ?? "?"}x${game.height ?? "?"} is outside ${MIN_SIZE}-${MAX_SIZE}px.`));
  }
  if (game.description.length < MIN_DESCRIPTION_LENGTH) {
    issues.push(warning("DESCRIPTION_TOO_SHORT", `Description has fewer than ${MIN_DESCRIPTION_LENGTH} characters.`));
  }
  if (!game.instructions.trim()) issues.push(warning("INSTRUCTIONS_MISSING", "Instructions are missing."));
  issues.push(...editorialIssues(game));

  const status = issues.some((issue) => issue.severity === "error")
    ? "REJECTED"
    : issues.length > 0
      ? "NEEDS_REVIEW"
      : "VALID";
  return { status, issues };
}
