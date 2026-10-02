import { siteConfig } from "@/lib/site";

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

/** JSON for an inline <script type="application/ld+json">: "<" and line separators are escaped. */
const LINE_SEPARATORS = new RegExp(`[${String.fromCharCode(0x2028)}${String.fromCharCode(0x2029)}]`, "g");

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(LINE_SEPARATORS, (char) => `\\u${char.charCodeAt(0).toString(16)}`);
}
