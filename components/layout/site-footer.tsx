import Link from "next/link";
import { legalNav, mainNav, siteConfig } from "@/lib/site";
import { Container } from "./container";
import { Logo } from "./logo";

const footerGroups = [
  { title: "Explore", links: mainNav },
  { title: "Gametroz", links: legalNav },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-3">
          <Logo id="logo-footer" size="footer" />
          <p className="type-small font-medium">{siteConfig.tagline}</p>
          <p className="type-muted max-w-xs">
            Free games, online tools and useful apps, right in your browser.
          </p>
        </div>
        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="type-small mb-3 font-semibold">{group.title}</h2>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="type-muted rounded-sm transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="border-t py-6">
        <p className="type-muted">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
