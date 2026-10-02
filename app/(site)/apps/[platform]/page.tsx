import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/apps/app-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { getAppsByPlatform, getPlatform, getPlatforms } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { extendDescription, platformIntro } from "@/lib/seo/templates";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPlatforms()).map((platform) => ({ platform: platform.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apps/[platform]">): Promise<Metadata> {
  const platform = await getPlatform((await params).platform);
  if (!platform) return {};
  return pageMetadata({
    title: `Free ${platform.name} Apps — Official Downloads`,
    description: extendDescription(platform.description, [
      "Every listing links to the official publisher.",
      "Gametroz does not host any downloads.",
    ]),
    path: `/apps/${platform.slug}`,
  });
}

export default async function PlatformPage({ params }: PageProps<"/apps/[platform]">) {
  const platform = await getPlatform((await params).platform);
  if (!platform) notFound();

  const [apps, platforms] = await Promise.all([getAppsByPlatform(platform.slug), getPlatforms()]);
  const title = platform.slug === "browser" ? "Browser apps" : `${platform.name} apps`;

  return (
    <Container className="pb-10">
      <Breadcrumbs items={[{ label: "Apps", href: "/apps" }, { label: platform.name }]} path={`/apps/${platform.slug}`} className="pt-3" />
      <PageHeader title={title} description={platform.description}>
        <p className="type-muted max-w-2xl pt-1 sm:text-[15px]">
          {platformIntro({
            name: platform.name,
            slug: platform.slug,
            count: apps.length,
            examples: apps.slice(0, 3).map((app) => app.name),
          })}
        </p>
      </PageHeader>

      <ChipNav
        label="Platforms"
        className="pt-3"
        items={platforms.map((item) => ({
          label: item.name,
          href: `/apps/${item.slug}`,
          iconKey: item.iconKey,
          active: item.slug === platform.slug,
        }))}
      />

      <section aria-label={title} className="py-5">
        <CardGrid variant="cards">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </CardGrid>
      </section>
    </Container>
  );
}
