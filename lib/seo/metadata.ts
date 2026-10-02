import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  // Internal search and similar pages are never indexed, even after launch.
  noIndex?: boolean;
  absoluteTitle?: boolean;
  /** Social preview image (absolute URL or a path resolved against metadataBase). */
  image?: { url: string; width?: number; height?: number; alt: string };
};

/** Branded 1200x630 card (app/og/default/route.tsx) for pages that have no artwork of their own. */
export const defaultOgImage = {
  url: "/og/default",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name}: free games, online tools and apps`,
};

/**
 * Per-page metadata with a canonical URL. Open Graph and Twitter are rebuilt in full
 * because Next.js replaces (does not deep-merge) those objects from the root layout.
 */
export function pageMetadata({ title, description, path, noIndex, absoluteTitle, image = defaultOgImage }: PageMetadataInput): Metadata {
  // A title that already names the site must not get "| Gametroz" appended a second time.
  const standalone = absoluteTitle || title.toLowerCase().includes(siteConfig.name.toLowerCase());
  const fullTitle = standalone ? title : `${title} | ${siteConfig.name}`;
  return {
    title: standalone ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: fullTitle,
      description,
      url: path,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image.url] },
    // Pre-launch the root layout already blocks indexing; only re-state it when needed.
    ...(!siteConfig.indexingEnabled
      ? { robots: { index: false, follow: false } }
      : noIndex
        ? { robots: { index: false, follow: true } }
        : {}),
  };
}
