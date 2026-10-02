// Provider-agnostic contracts. lib/catalog.ts never imports anything from lib/providers:
// providers only write to the database through the sync service.

export type ValidationStatus = "VALID" | "NEEDS_REVIEW" | "REJECTED";

export type ValidationCode =
  | "ID_MISSING"
  | "NAME_MISSING"
  | "SLUG_INVALID"
  | "THUMBNAIL_MISSING"
  | "THUMBNAIL_INVALID"
  | "THUMBNAIL_HOST_NOT_ALLOWED"
  | "EMBED_MISSING"
  | "EMBED_INVALID"
  | "EMBED_NOT_HTTPS"
  | "EMBED_HOST_NOT_ALLOWED"
  | "CATEGORY_UNMAPPED"
  | "SIZE_UNREASONABLE"
  | "DESCRIPTION_TOO_SHORT"
  | "INSTRUCTIONS_MISSING"
  | "DUPLICATE_IN_FEED"
  | "DUPLICATE_SLUG"
  | "THUMBNAIL_UNREACHABLE"
  | "THUMBNAIL_SMALL"
  | "EDITORIAL_REVIEW_REQUIRED"
  | "WRITE_FAILED";

export type ValidationIssue = {
  code: ValidationCode;
  message: string;
  // "error" rejects the record; "warning" keeps it but flags it for review.
  severity: "error" | "warning";
};

export type ValidationResult = {
  status: ValidationStatus;
  issues: ValidationIssue[];
};

/** A provider game mapped to Gametroz fields. Imported games always start in REVIEW. */
export type NormalizedGame = {
  provider: string;
  providerGameId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  instructions: string;
  embedUrl: string;
  thumbnailUrl: string;
  heroImageUrl: string | null;
  orientation: "LANDSCAPE" | "PORTRAIT";
  width: number | null;
  height: number | null;
  language: string;
  /** Gametroz GameCategory slug. Unknown provider categories fall back to a default for review. */
  category: string;
  /** How confidently the provider category was mapped (see gamemonetize/config.ts). */
  categoryMatch: "exact" | "approximate" | "fallback";
  /** Original provider category label, for review messages. */
  providerCategory: string;
  tags: string[];
  status: "REVIEW";
};

export type ValidationContext = {
  /** Returns true when the slug already belongs to a different game. */
  isSlugTaken?: (slug: string, providerGameId: string) => boolean;
};

export type FetchOptions = {
  limit: number;
};

/** Contract every game provider adapter implements. TRaw is the provider's own game shape. */
export interface GameProvider<TRaw> {
  readonly slug: string;
  readonly name: string;
  readonly baseUrl: string;
  /** Only these hosts may ever be rendered inside an iframe. */
  readonly embedHosts: readonly string[];
  /** Only these hosts may serve thumbnails. */
  readonly imageHosts: readonly string[];
  getGames(options: FetchOptions): Promise<TRaw[]>;
  getGame(id: string): Promise<TRaw | null>;
  getId(game: TRaw): string;
  normalize(game: TRaw): NormalizedGame;
  validate(game: TRaw, context?: ValidationContext): ValidationResult;
}

export type SyncItemOutcome = "create" | "update" | "reject" | "ignore" | "fail";

export type SyncItemReport = {
  providerGameId: string;
  slug: string;
  outcome: SyncItemOutcome;
  validation: ValidationStatus;
  issues: ValidationIssue[];
};

export type SyncResult = {
  provider: string;
  dryRun: boolean;
  limit: number;
  importRecordId: string;
  received: number;
  created: number;
  updated: number;
  ignored: number;
  rejected: number;
  needsReview: number;
  failed: number;
  items: SyncItemReport[];
};
