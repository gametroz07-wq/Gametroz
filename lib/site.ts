export const siteConfig = {
  name: "Gametroz",
  tagline: "Play · Tools · Apps",
  description:
    "Free HTML5 games, online tools, useful apps and guides. Play, create and discover in your browser.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gametroz.online",
  // Indexing stays off until launch; only production should set this to "true".
  indexingEnabled: process.env.NEXT_PUBLIC_INDEXING_ENABLED === "true",
  locale: "en_US",
  // Temporary public inbox; change here once the definitive address exists.
  contactEmail: "contact@gametroz.online",
} as const;

// `detail` is the singular detail route (/game/[slug]) that should also mark the item active.
export const mainNav = [
  { label: "Games", href: "/games", detail: "/game" },
  { label: "Tools", href: "/tools", detail: "/tool" },
  { label: "Apps", href: "/apps", detail: "/app" },
  { label: "Guides", href: "/guides", detail: "/guide" },
] as const;

export const legalNav = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
] as const;

// Quick searches shown in the search dialog and the empty search page.
export const trendingSearches = ["Racing", "Puzzle", "PDF", "Images", "Windows", "JSON"];
