import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { gaMeasurementId, gtagBootstrapScript, gtagSrc } from "@/lib/analytics/config";
import { monetagEnabled, monetagInPagePush } from "@/lib/ads/config";
import type { Locale } from "@/lib/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Brand wordmark only (components/brand/gametroz-logo.tsx).
const logoFont = Orbitron({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "900",
});

/**
 * The document shell: <html>, fonts, theme and the site-wide scripts. Rendered by the locale
 * layout (app/[lang]/layout.tsx) and by the global fallback (app/not-found.tsx), which Next
 * renders outside any layout for URLs that never reach the locale segment.
 */
export function RootDocument({ lang, children }: { lang: Locale; children: ReactNode }) {
  const gaId = gaMeasurementId();
  return (
    // "dark" is the server default; next-themes swaps it to the stored preference before paint,
    // which is why the class attribute may differ from the server markup.
    <html
      lang={lang}
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} ${logoFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        {gaId && (
          <>
            <Script id="ga4-src" src={gtagSrc(gaId)} strategy="afterInteractive" />
            <Script id="ga4-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: gtagBootstrapScript(gaId) }} />
          </>
        )}
        {monetagEnabled() && (
          <Script id="monetag-in-page-push" src={monetagInPagePush.src} data-zone={monetagInPagePush.zone} strategy="lazyOnload" />
        )}
      </body>
    </html>
  );
}
