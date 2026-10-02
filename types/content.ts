// Content view models. Database entities (Phase 3) map into these shapes.

export type IconKey =
  | "gamepad"
  | "car"
  | "puzzle"
  | "swords"
  | "trophy"
  | "sparkles"
  | "map"
  | "joystick"
  | "crown"
  | "type"
  | "braces"
  | "image"
  | "calculator"
  | "search"
  | "file"
  | "arrows"
  | "play"
  | "archive"
  | "palette"
  | "code"
  | "shield"
  | "wrench"
  | "message"
  | "globe"
  | "monitor"
  | "laptop"
  | "terminal"
  | "smartphone"
  | "book"
  | "percent"
  | "wand"
  | "cloud";

export type CategoryRef = {
  name: string;
  slug: string;
};

export type Category = CategoryRef & {
  description: string;
  iconKey: IconKey;
};

/* ---------- Games ---------- */

export type GameSummary = {
  slug: string;
  name: string;
  category: CategoryRef;
  thumbnailUrl: string;
};

export type GameControl = {
  input: string;
  action: string;
};

export type Game = GameSummary & {
  shortDescription: string;
  description: string;
  instructions: string;
  controls: GameControl[];
  tags: string[];
  orientation: "landscape" | "portrait";
  featured: boolean;
  trending: boolean;
  popularity: number;
  publishedAt: string;
  /** Provider embed; only rendered by GameEmbed when allowlisted and GAME_EMBEDS_ENABLED=true. */
  embedUrl: string | null;
  providerSlug: string | null;
};

/* ---------- Tools ---------- */

export type ToolSummary = {
  slug: string;
  name: string;
  shortDescription: string;
  category: CategoryRef;
  iconKey: IconKey;
};

export type Tool = ToolSummary & {
  description: string;
  howTo: string[];
  tags: string[];
  featured: boolean;
  popularity: number;
  // Which UI renders the tool: the tool slug, resolved by components/tools/registry.tsx.
  componentKey?: string;
};

/* ---------- Apps ---------- */

export type PlatformSlug = "windows" | "mac" | "linux" | "android" | "ios" | "web";

export type AppSummary = {
  slug: string;
  name: string;
  shortDescription: string;
  iconUrl?: string;
  platforms: PlatformSlug[];
};

export type App = AppSummary & {
  description: string;
  category: CategoryRef;
  publisher: string;
  version: string;
  license: string;
  officialWebsite: string;
  /** Verified official download page; the primary button prefers it over the website. */
  officialDownloadUrl: string | null;
  features: string[];
  requirements: string[];
  alternatives: string[];
  tags: string[];
  featured: boolean;
  // Date the official links were last checked; null when never verified.
  lastVerifiedAt: string | null;
};

/* ---------- Guides ---------- */

export type GuideSection = "games" | "tools" | "apps";

export type GuideItemRef = { kind: "game" | "tool" | "app"; slug: string };

/**
 * Structured guide content, validated by lib/guides/blocks.ts. Text fields (except headings) may hold
 * internal links written as `[label](/game/slug)`; guides never contain raw HTML.
 */
export type GuideBlock =
  /** Short direct answer shown in a box at the top (one to three sentences). */
  | { type: "answer"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  /** Numbered how-to steps. */
  | { type: "steps"; items: string[] }
  | { type: "table"; caption: string; header: string[]; rows: string[][] }
  /** Cards for referenced games, tools or apps; unpublished references render nothing. */
  | { type: "items"; title?: string; refs: GuideItemRef[] }
  | { type: "note"; title?: string; text: string };

export type GuideSummary = {
  slug: string;
  title: string;
  excerpt: string;
  section: GuideSection;
  publishedAt: string;
  readingMinutes: number;
};

export type Guide = GuideSummary & {
  /** ISO date of the last editorial update, shown on the page. */
  updatedAt: string;
  featured: boolean;
  tags: string[];
  body: GuideBlock[];
  related: {
    games?: string[];
    tools?: string[];
    apps?: string[];
  };
};

/* ---------- Shared ---------- */

export type CategorySummary = {
  name: string;
  href: string;
  iconKey: IconKey;
  itemCount?: number;
  itemLabel?: string;
};
