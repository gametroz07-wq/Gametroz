import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/not-found-content";
import { RootDocument } from "@/components/layout/root-document";
import { defaultLocale } from "@/lib/i18n/config";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = { title: `${siteConfig.name} — ${siteConfig.tagline}` };

// Global fallback for URLs that skip the proxy and the locale segment (for example /api/unknown or
// /foo.js). The root layout lives under app/[lang], so this one renders its own document.
export default function GlobalNotFound() {
  return (
    <RootDocument lang={defaultLocale}>
      <NotFoundContent />
    </RootDocument>
  );
}
