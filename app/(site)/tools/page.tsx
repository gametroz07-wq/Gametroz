import { AdSlot } from "@/components/ads/ad-slot";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import { ToolCard } from "@/components/tools/tool-card";
import { getFeaturedTools, getToolCategories, getToolsByCategory } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Free Online Tools — Images, PDF, Text and More",
  description: "Free online tools that run in your browser: convert images, count words, format JSON, calculate percentages and more.",
  path: "/tools",
});

export default async function ToolsPage() {
  const [categories, featured] = await Promise.all([getToolCategories(), getFeaturedTools(4)]);
  const groups = await Promise.all(
    categories.map(async (category) => ({ category, tools: await getToolsByCategory(category.slug) })),
  );

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Tools" }]} className="pt-6" />
      <PageHeader
        title="Free online tools"
        description="Quick tools that run in your browser. Nothing to install, and your files stay on your device."
      >
        <SearchInput placeholder="Search tools..." className="max-w-xl pt-2" />
      </PageHeader>

      <ChipNav
        label="Tool categories"
        className="pt-4"
        items={categories.map((category) => ({
          label: category.name,
          href: `/tools/${category.slug}`,
          iconKey: category.iconKey,
        }))}
      />

      <PageSection id="popular" title="Popular tools">
        <CardGrid variant="cards">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </CardGrid>
      </PageSection>

      <div className="py-4">
        <AdSlot placement="home-feed" />
      </div>

      {groups.map(({ category, tools }) => (
        <PageSection
          key={category.slug}
          id={`category-${category.slug}`}
          title={category.name}
          action={{ label: "View all", href: `/tools/${category.slug}` }}
        >
          <CardGrid variant="cards">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </CardGrid>
        </PageSection>
      ))}
    </Container>
  );
}
