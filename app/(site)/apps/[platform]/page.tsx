import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/apps/app-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { CategoryCard } from "@/components/shared/category-card";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import { getAppsByPlatform, getPlatform, getPlatforms, getPlatformSummaries } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPlatforms()).map((platform) => ({ platform: platform.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apps/[platform]">): Promise<Metadata> {
  const platform = await getPlatform((await params).platform);
  if (!platform) return {};
  return pageMetadata({
    title: `Free ${platform.name} Apps — Official Downloads`,
    description: platform.description,
    path: `/apps/${platform.slug}`,
  });
}

export default async function PlatformPage({ params }: PageProps<"/apps/[platform]">) {
  const platform = await getPlatform((await params).platform);
  if (!platform) notFound();

  const [apps, summaries] = await Promise.all([getAppsByPlatform(platform.slug), getPlatformSummaries()]);
  const title = platform.slug === "browser" ? "Browser apps" : `${platform.name} apps`;

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Apps", href: "/apps" }, { label: platform.name }]} className="pt-6" />
      <PageHeader title={title} description={platform.description} />

      <section aria-label={title} className="py-6">
        <CardGrid variant="cards">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </CardGrid>
      </section>

      <PageSection id="other-platforms" title="Other platforms">
        <CardGrid variant="categories">
          {summaries
            .filter((summary) => summary.href !== `/apps/${platform.slug}`)
            .map((summary) => (
              <CategoryCard key={summary.href} category={summary} />
            ))}
        </CardGrid>
      </PageSection>
    </Container>
  );
}
