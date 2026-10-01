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
  | "book";

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

export type ToolComponentKey =
  | "word-counter"
  | "json-formatter"
  | "image-converter"
  | "percentage-calculator";

export type Tool = ToolSummary & {
  description: string;
  howTo: string[];
  tags: string[];
  featured: boolean;
  popularity: number;
  // Which UI renders the tool. Tools without one show a "coming soon" workspace.
  componentKey?: ToolComponentKey;
};

/* ---------- Apps ---------- */

export type PlatformSlug = "windows" | "mac" | "linux" | "android" | "browser";

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
  features: string[];
  requirements: string[];
  alternatives: string[];
  tags: string[];
  featured: boolean;
  // null until the record is manually verified (Phase 8).
  lastVerifiedAt: string | null;
};

/* ---------- Guides ---------- */

export type GuideSection = "games" | "tools" | "apps";

export type GuideBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type GuideSummary = {
  slug: string;
  title: string;
  excerpt: string;
  section: GuideSection;
  publishedAt: string;
  readingMinutes: number;
};

export type Guide = GuideSummary & {
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
