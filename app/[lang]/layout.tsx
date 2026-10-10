import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { RootDocument } from "@/components/layout/root-document";
import { enabledLocales, isEnabledLocale, isIndexableLocale } from "@/lib/i18n/config";
import { defaultOgImage } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import "../globals.css";

const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [defaultOgImage.url],
  },
};

// Only locales in enabledLocales() are built. Any other value of the segment is rejected by the
// guards below (and by the proxy first). dynamicParams stays at its default: it is route-wide, so
// turning it off here would also stop game, tool and app pages from rendering on demand.
export function generateStaticParams() {
  return enabledLocales().map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isEnabledLocale(lang)) notFound();
  // Spanish pages still carry English copy, so they stay out of search results (see isIndexableLocale).
  const indexable = siteConfig.indexingEnabled && isIndexableLocale(lang);
  return {
    ...baseMetadata,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#080B12",
  colorScheme: "dark light",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isEnabledLocale(lang)) notFound();
  return <RootDocument lang={lang}>{children}</RootDocument>;
}
