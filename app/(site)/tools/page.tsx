import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import { ToolCard } from "@/components/tools/tool-card";
import { toolAccent } from "@/components/tools/tool-category-style";
import { ToolCategoryTile } from "@/components/tools/tool-category-tile";
import { getFeaturedTools, getToolCategories, getToolCategorySummaries, getTools, getToolsByCategory } from "@/lib/catalog";
import { contentIcons } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Free Online Tools — Images, PDF, Text and More",
  description: "Free online tools that run in your browser: convert images, count words, format JSON, calculate percentages and more.",
  path: "/tools",
});

export default async function ToolsPage() {
  const [categories, summaries, featured, allTools] = await Promise.all([
    getToolCategories(),
    getToolCategorySummaries(),
    getFeaturedTools(4),
    getTools(),
  ]);
  const groups = await Promise.all(
    categories.map(async (category) => ({ category, tools: await getToolsByCategory(category.slug) })),
  );

  return (
    <Container className="pb-10">
      <Breadcrumbs items={[{ label: "Tools" }]} className="pt-3" />
      <PageHeader
        title="Online tools"
        description={`${allTools.length} free tools that run in your browser. Nothing to install, and your files stay on your device.`}
        aside={<SearchInput placeholder="Search tools..." />}
      />

      <nav aria-label="Tool categories" className="grid grid-cols-2 gap-2 pt-3 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((category) => (
          <ToolCategoryTile
            key={category.slug}
            slug={category.slug}
            name={category.name}
            iconKey={category.iconKey}
            count={summaries.find((summary) => summary.href === `/tools/${category.slug}`)?.itemCount ?? 0}
          />
        ))}
      </nav>

      <PageSection id="popular" title="Popular tools" className="pt-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="featured" />
          ))}
        </div>
      </PageSection>

      <div className="py-2">
        <AdSlot placement="home-feed" />
      </div>

      <section aria-labelledby="by-category-heading" className="py-4 sm:py-5">
        <h2 id="by-category-heading" className="mb-3 text-lg font-bold tracking-tight sm:text-xl">
          Browse by category
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ category, tools }) => {
            const Icon = contentIcons[category.iconKey];
            const accent = toolAccent(category.slug);
            return (
              <section
                key={category.slug}
                aria-labelledby={`category-${category.slug}`}
                className="rounded-2xl bg-surface/60 p-3 ring-1 ring-white/5"
              >
                <div className="mb-2 flex items-center justify-between gap-2 px-1">
                  <h3 id={`category-${category.slug}`} className="flex items-center gap-2 text-sm font-bold">
                    <span className={cn("flex size-7 items-center justify-center rounded-lg", accent.icon)}>
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    {category.name}
                    <span className="type-muted text-xs font-medium">{tools.length}</span>
                  </h3>
                  <Link href={`/tools/${category.slug}`} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
                    View all<span className="sr-only"> {category.name} tools</span>
                  </Link>
                </div>
                <div className="grid gap-1.5">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} variant="compact" />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </Container>
  );
}
