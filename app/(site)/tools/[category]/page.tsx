import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageHeader } from "@/components/shared/page-header";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolCategoryTile } from "@/components/tools/tool-category-tile";
import { getToolCategories, getToolCategory, getToolCategorySummaries, getToolsByCategory } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { extendDescription } from "@/lib/seo/templates";
import { breadcrumbList } from "@/lib/seo/structured-data";

// ISR: categories refresh every 10 minutes; a category added later renders on first request.
export const revalidate = 600;

export async function generateStaticParams() {
  return (await getToolCategories()).map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[category]">): Promise<Metadata> {
  const category = await getToolCategory((await params).category);
  if (!category) return {};
  return pageMetadata({
    title: `Free ${category.name} Tools Online`,
    description: extendDescription(category.description, [
      "Free to use in your browser, with no sign-up.",
      "Your data stays on your device.",
    ]),
    path: `/tools/${category.slug}`,
  });
}

export default async function ToolCategoryPage({ params }: PageProps<"/tools/[category]">) {
  const { category: slug } = await params;
  const category = await getToolCategory(slug);
  if (!category) notFound();

  const [tools, categories, summaries] = await Promise.all([
    getToolsByCategory(slug),
    getToolCategories(),
    getToolCategorySummaries(),
  ]);

  return (
    <Container className="pb-10">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: category.name, path: `/tools/${category.slug}` },
        ])}
      />
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: category.name }]} className="pt-3" />
      <PageHeader title={`${category.name} tools`} description={category.description} />

      <nav aria-label="Tool categories" className="grid grid-cols-2 gap-2 pt-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((item) => (
          <ToolCategoryTile
            key={item.slug}
            slug={item.slug}
            name={item.name}
            iconKey={item.iconKey}
            count={summaries.find((summary) => summary.href === `/tools/${item.slug}`)?.itemCount ?? 0}
            active={item.slug === slug}
          />
        ))}
      </nav>

      <section aria-label={`${category.name} tools`} className="py-5">
        <CardGrid variant="cards">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </CardGrid>
      </section>
    </Container>
  );
}
