import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { CategoryCard } from "@/components/shared/category-card";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import { ToolCard } from "@/components/tools/tool-card";
import {
  getToolCategories,
  getToolCategory,
  getToolCategorySummaries,
  getToolsByCategory,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getToolCategories()).map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[category]">): Promise<Metadata> {
  const category = await getToolCategory((await params).category);
  if (!category) return {};
  return pageMetadata({
    title: `Free ${category.name} Tools Online`,
    description: category.description,
    path: `/tools/${category.slug}`,
  });
}

export default async function ToolCategoryPage({ params }: PageProps<"/tools/[category]">) {
  const { category: slug } = await params;
  const category = await getToolCategory(slug);
  if (!category) notFound();

  const [tools, summaries] = await Promise.all([getToolsByCategory(slug), getToolCategorySummaries()]);

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: category.name }]} className="pt-6" />
      <PageHeader title={`${category.name} tools`} description={category.description} />

      <section aria-label={`${category.name} tools`} className="py-6">
        <CardGrid variant="cards">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </CardGrid>
      </section>

      <PageSection id="related-categories" title="More tool categories">
        <CardGrid variant="categories">
          {summaries
            .filter((summary) => summary.href !== `/tools/${slug}`)
            .map((summary) => (
              <CategoryCard key={summary.href} category={summary} />
            ))}
        </CardGrid>
      </PageSection>
    </Container>
  );
}
