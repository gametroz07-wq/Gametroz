import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard } from "@/components/apps/app-card";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import { getAppCategorySummaries, getApps, getAppsByPlatform, getFeaturedApps, getPlatforms } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { extendDescription } from "@/lib/seo/templates";

// ISR: refreshed every 10 minutes.
export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Apps and Software: Official Download Links",
  description: extendDescription(
    "Find software for Windows, macOS, Linux, Android, iOS and the web, organized by platform and category, always linked to the official publisher.",
    ["Gametroz does not host any downloads."],
  ),
  path: "/apps",
});

export default async function AppsPage() {
  const [featured, platforms, categories, allApps] = await Promise.all([
    getFeaturedApps(4),
    getPlatforms(),
    getAppCategorySummaries(),
    getApps(),
  ]);
  const sections = await Promise.all(
    platforms.map(async (platform) => ({ platform, apps: await getAppsByPlatform(platform.slug, 4) })),
  );

  return (
    <Container className="pb-10">
      <Breadcrumbs items={[{ label: "Apps" }]} path="/apps" className="pt-3" />
      <PageHeader
        title="Apps & software"
        description={`${allApps.length} apps by platform and category. Every download button goes to the official publisher.`}
        aside={<SearchInput placeholder="Search apps..." />}
      />

      <ChipNav
        label="Platforms"
        className="pt-3"
        items={platforms.map((platform) => ({ label: platform.name, href: `/apps/${platform.slug}`, iconKey: platform.iconKey }))}
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
          title={`${platform.name} apps`}
          action={{ label: "View all", href: `/apps/${platform.slug}` }}
        >
          <CardGrid variant="cards">
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </CardGrid>
        </PageSection>
      ))}

      <PageSection id="categories" title="Browse by category" description="Compare software of the same kind.">
        <ChipNav
          label="App categories"
          layout="wrap"
          items={categories.map((category) => ({
            label: `${category.name} (${category.itemCount ?? 0})`,
            href: category.href,
            iconKey: category.iconKey,
          }))}
        />
      </PageSection>
    </Container>
  );
}
