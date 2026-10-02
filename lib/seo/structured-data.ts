import { siteConfig } from "@/lib/site";
import type { PlatformSlug } from "@/types/content";

// schema.org JSON-LD builders. Pure functions, unit-tested. Ratings and reviews are deliberately
// never produced: the site has no real ones, and fake rich results break search engine guidelines.

const SCHEMA_CONTEXT = "https://schema.org" as const;

export function absoluteUrl(path: string, base: string = siteConfig.url) {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export type BreadcrumbEntry = { name: string; path: string };

export function breadcrumbList(items: BreadcrumbEntry[]) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList" as const,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webApplication(tool: { name: string; description: string; path: string }) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebApplication" as const,
    name: tool.name,
    description: tool.description,
    url: absoluteUrl(tool.path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer" as const, price: "0", priceCurrency: "USD" },
  };
}

/** Returns null when there is nothing to describe: FAQPage markup must match visible content. */
export function faqPage(faq: { question: string; answer: string }[]) {
  if (faq.length === 0) return null;
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage" as const,
    mainEntity: faq.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: { "@type": "Answer" as const, text: item.answer },
    })),
  };
}

export type TrailItem = { label: string; href?: string };

/**
 * BreadcrumbList for a visible breadcrumb trail (components/shared/breadcrumbs.tsx): Home is
 * prepended exactly like the UI does, and the last item points at the current page.
 */
export function breadcrumbTrail(items: TrailItem[], currentPath: string) {
  const trail = [{ name: "Home", path: "/" }, ...items.map((item) => ({ name: item.label, path: item.href ?? "" }))];
  return breadcrumbList(trail.map((entry, index) => ({ ...entry, path: index === trail.length - 1 ? currentPath : entry.path })));
}

/** Home page WebSite markup with a sitelinks search box that targets the working /search?q= page. */
export function webSite() {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite" as const,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction" as const,
      target: { "@type": "EntryPoint" as const, urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Facts only: name, URL, logo and the contact address shown on the Contact page. No social profiles. */
export function organization() {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization" as const,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.svg"),
    email: siteConfig.contactEmail,
  };
}

const OPERATING_SYSTEMS: Record<PlatformSlug, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
  web: "Web browser",
};

// First match wins. Schema.org application categories are a closed list.
const APPLICATION_CATEGORIES: [RegExp, string][] = [
  [/browser/i, "BrowserApplication"],
  [/design|graphic|image|photo|illustrat|3d/i, "DesignApplication"],
  [/media|audio|video|music|stream/i, "MultimediaApplication"],
  [/office|productiv|business/i, "BusinessApplication"],
  [/secur|privacy|password/i, "SecurityApplication"],
  [/develop|code|programming/i, "DeveloperApplication"],
  [/communicat|messag/i, "CommunicationApplication"],
  [/educat|learn/i, "EducationalApplication"],
  [/gam(e|ing)/i, "GameApplication"],
];

export function applicationCategory(categoryName: string) {
  return APPLICATION_CATEGORIES.find(([pattern]) => pattern.test(categoryName))?.[1] ?? "UtilitiesApplication";
}

type SoftwareApplicationInput = {
  name: string;
  description: string;
  path: string;
  platforms: PlatformSlug[];
  categoryName: string;
  /** Only when the page states the app is free. */
  free?: boolean;
  /** Only when the official link is visible on the page. */
  downloadUrl?: string;
};

/** Visible facts only: no ratings, reviews or invented prices. */
export function softwareApplication({ name, description, path, platforms, categoryName, free, downloadUrl }: SoftwareApplicationInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "SoftwareApplication" as const,
    name,
    description,
    url: absoluteUrl(path),
    operatingSystem: platforms.map((platform) => OPERATING_SYSTEMS[platform]).join(", "),
    applicationCategory: applicationCategory(categoryName),
    ...(free ? { offers: { "@type": "Offer" as const, price: "0", priceCurrency: "USD" } } : {}),
    ...(downloadUrl ? { downloadUrl } : {}),
  };
}

type ArticleInput = {
  headline: string;
  description: string;
  path: string;
  /** ISO date, only when the page shows it. */
  datePublished?: string;
  dateModified?: string;
};

/** Gametroz is the publisher; there is no author field because pages show no bylines. */
export function article({ headline, description, path, datePublished, dateModified }: ArticleInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Article" as const,
    headline,
    description,
    mainEntityOfPage: absoluteUrl(path),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    publisher: { "@type": "Organization" as const, name: siteConfig.name, url: absoluteUrl("/") },
  };
}

type VideoGameInput = { name: string; description: string; path: string; image: string; categoryName: string };

/** Free browser game. No ratings, reviews or authors: the site has none. */
export function videoGame({ name, description, path, image, categoryName }: VideoGameInput) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "VideoGame" as const,
    name,
    description,
    url: absoluteUrl(path),
    image,
    genre: categoryName,
    gamePlatform: "Web browser",
    applicationCategory: "Game",
    operatingSystem: "Any",
    isAccessibleForFree: true,
  };
}

/** JSON for an inline <script type="application/ld+json">: "<" and line separators are escaped. */
const LINE_SEPARATORS = new RegExp(`[${String.fromCharCode(0x2028)}${String.fromCharCode(0x2029)}]`, "g");

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(LINE_SEPARATORS, (char) => `\\u${char.charCodeAt(0).toString(16)}`);
}
