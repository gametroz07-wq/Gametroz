import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  // Internal search and similar pages are never indexed, even after launch.
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

/**
 * Per-page metadata with a canonical URL. Open Graph and Twitter are rebuilt in full
 * because Next.js replaces (does not deep-merge) those objects from the root layout.
 */
export function pageMetadata({ title, description, path, noIndex, absoluteTitle }: PageMetadataInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: fullTitle,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    // Pre-launch the root layout already blocks indexing; only re-state it when needed.
    ...(!siteConfig.indexingEnabled
      ? { robots: { index: false, follow: false } }
      : noIndex
        ? { robots: { index: false, follow: true } }
        : {}),
  };
}
