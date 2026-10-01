import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard } from "@/components/apps/app-card";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import { getAppCategories, getApps, getAppsByPlatform, getFeaturedApps, getPlatforms } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Free Apps and Software — Official Downloads",
  description: "Discover useful free software for Windows, macOS, Linux, Android and your browser, always linked to the official publisher.",
  path: "/apps",
});

export default async function AppsPage() {
  const [featured, platforms, categories, allApps] = await Promise.all([
    getFeaturedApps(4),
    getPlatforms(),
    getAppCategories(),
    getApps(),
  ]);
  const sections = await Promise.all(
    platforms.map(async (platform) => ({ platform, apps: await getAppsByPlatform(platform.slug, 4) })),
  );

  return (
    <Container className="pb-10">
      <Breadcrumbs items={[{ label: "Apps" }]} className="pt-3" />
      <PageHeader
        title="Apps & software"
        description={`${allApps.length} trusted apps. Every download button goes to the official publisher.`}
        aside={<SearchInput placeholder="Search apps..." />}
      />

      <ChipNav
        label="Platforms and categories"
        className="pt-3"
        items={[
          ...platforms.map((platform) => ({ label: platform.name, href: `/apps/${platform.slug}`, iconKey: platform.iconKey })),
          ...categories.map((category) => ({
            label: category.name,
            href: `/search?q=${encodeURIComponent(category.name)}&type=apps`,
            iconKey: category.iconKey,
          })),
        ]}
      />

      <PageSection id="featured" title="Featured apps" className="pt-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((app) => (
            <AppCard key={app.slug} app={app} variant="featured" />
          ))}
        </div>
      </PageSection>

      <div className="py-2">
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
