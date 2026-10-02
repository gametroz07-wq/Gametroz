import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppCard } from "@/components/apps/app-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { getAppCategories, getAppCategory, getAppsByCategory, getPlatforms } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { appCategoryDescription, appCategoryIntro, appCategoryTitle } from "@/lib/seo/templates";

// ISR: listings refresh every 10 minutes; a category added later renders on first request.
export const revalidate = 600;

export async function generateStaticParams() {
  return (await getAppCategories()).map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/apps/category/[slug]">): Promise<Metadata> {
  const category = await getAppCategory((await params).slug);
  if (!category) return {};
  return pageMetadata({
    title: appCategoryTitle(category.name),
    description: appCategoryDescription(category.description),
    path: `/apps/category/${category.slug}`,
  });
}

export default async function AppCategoryPage({ params }: PageProps<"/apps/category/[slug]">) {
  const { slug } = await params;
  const category = await getAppCategory(slug);
  if (!category) notFound();

  const [apps, categories, platforms] = await Promise.all([getAppsByCategory(slug), getAppCategories(), getPlatforms()]);
  const path = `/apps/category/${category.slug}`;

  return (
    <Container className="pb-10">
      <Breadcrumbs
        items={[{ label: "Apps", href: "/apps" }, { label: category.name }]}
        path={path}
        className="pt-3"
      />
      <PageHeader title={`${category.name} apps & software`} description={category.description}>
        <p className="type-muted max-w-2xl pt-1 sm:text-[15px]">
          {appCategoryIntro({ name: category.name, count: apps.length, examples: apps.slice(0, 3).map((app) => app.name) })}
        </p>
      </PageHeader>

      <ChipNav
        label="App categories"
        className="pt-3"
        items={categories.map((item) => ({
          label: item.name,
          href: `/apps/category/${item.slug}`,
          iconKey: item.iconKey,
          active: item.slug === category.slug,
        }))}
      />

      <section aria-label={`${category.name} apps`} className="py-5">
        <CardGrid variant="cards">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </CardGrid>
      </section>

      <ChipNav
        label="Browse apps by platform"
        layout="wrap"
        items={platforms.map((platform) => ({ label: `${platform.name} apps`, href: `/apps/${platform.slug}`, iconKey: platform.iconKey }))}
      />
    </Container>
  );
}
