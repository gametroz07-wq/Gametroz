import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard } from "@/components/apps/app-card";
import { AppIcon } from "@/components/apps/app-icon";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import Link from "next/link";
import { getAppCategories, getAppsByPlatform, getFeaturedApps, getPlatforms } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Free Apps and Software — Official Downloads",
  description: "Discover useful free software for Windows, macOS, Linux, Android and your browser, always linked to the official publisher.",
  path: "/apps",
});

export default async function AppsPage() {
  const [featured, platforms, categories] = await Promise.all([
    getFeaturedApps(4),
    getPlatforms(),
    getAppCategories(),
  ]);
  const sections = await Promise.all(
    platforms.map(async (platform) => ({ platform, apps: await getAppsByPlatform(platform.slug, 4) })),
  );

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Apps" }]} className="pt-6" />
      <PageHeader
        title="Free apps and software"
        description="Useful software from trusted publishers. Every download button takes you to the official site."
      >
        <SearchInput placeholder="Search apps..." className="max-w-xl pt-2" />
      </PageHeader>

      <ChipNav
        label="App categories"
        className="pt-4"
        items={categories.map((category) => ({
          label: category.name,
          href: `/search?q=${encodeURIComponent(category.name)}&type=apps`,
          iconKey: category.iconKey,
        }))}
      />

      <PageSection id="featured" title="Featured apps">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((app) => (
            <li key={app.slug}>
              <Link
                href={`/app/${app.slug}`}
                className="flex h-full flex-col gap-4 rounded-3xl bg-surface p-5 transition-colors hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <AppIcon app={app} size={56} />
                <span>
                  <span className="block text-lg font-semibold">{app.name}</span>
                  <span className="type-muted mt-1 line-clamp-2 block">{app.shortDescription}</span>
                </span>
                <span className="mt-auto text-xs font-medium text-muted-foreground">
                  {app.category.name} · {app.publisher}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>

      <div className="py-4">
        <AdSlot placement="home-feed" />
      </div>

      {sections.map(({ platform, apps }) => (
        <PageSection
          key={platform.slug}
          id={`platform-${platform.slug}`}
          title={platform.slug === "browser" ? "Browser apps" : `${platform.name} apps`}
          action={{ label: "View all", href: `/apps/${platform.slug}` }}
        >
          <CardGrid variant="cards">
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </CardGrid>
        </PageSection>
      ))}
    </Container>
  );
}
