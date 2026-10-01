import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageSection } from "@/components/shared/page-section";
import { TagList } from "@/components/shared/tag-list";
import { ToolCard } from "@/components/tools/tool-card";
import { toolAccent } from "@/components/tools/tool-category-style";
import { ToolWorkspace } from "@/components/tools/tool-workspace";
import { getGuidesFor, getRelatedTools, getToolBySlug, getTools } from "@/lib/catalog";
import { contentIcons } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getTools()).map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tool/[slug]">): Promise<Metadata> {
  const tool = await getToolBySlug((await params).slug);
  if (!tool) return {};
  return pageMetadata({
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    path: `/tool/${tool.slug}`,
  });
}

export default async function ToolPage({ params }: PageProps<"/tool/[slug]">) {
  const tool = await getToolBySlug((await params).slug);
  if (!tool) notFound();

  const [related, guides] = await Promise.all([getRelatedTools(tool, 4), getGuidesFor({ tools: tool.slug })]);
  const Icon = contentIcons[tool.iconKey];
  const accent = toolAccent(tool.category.slug);

  return (
    <Container className="pb-12">
      <Breadcrumbs
        items={[
          { label: "Tools", href: "/tools" },
          { label: tool.category.name, href: `/tools/${tool.category.slug}` },
          { label: tool.name },
        ]}
        className="pt-3"
      />

      {/* The working tool comes first; explanatory content stays below it. */}
      <section aria-labelledby="tool-heading" className="mt-3 overflow-hidden rounded-2xl bg-surface ring-1 ring-white/5">
        <header className="flex items-center gap-3 border-b border-border/60 p-4 sm:px-6">
          <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", accent.icon)}>
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 id="tool-heading" className="text-xl font-extrabold tracking-tight sm:text-2xl">
              {tool.name}
            </h1>
            <p className="type-muted">{tool.shortDescription}</p>
          </div>
        </header>
        <div className="p-4 sm:p-6">
          <ToolWorkspace tool={tool} />
        </div>
      </section>

      <div className="grid gap-6 py-6 lg:grid-cols-2">
        <section aria-labelledby="about-tool-heading" className="space-y-3">
          <h2 id="about-tool-heading" className="type-h3">
            About {tool.name}
          </h2>
          <p className="type-body text-foreground/90">{tool.description}</p>
          <TagList tags={tool.tags} label={`${tool.name} tags`} />
        </section>
        <section aria-labelledby="how-tool-heading" className="space-y-3">
          <h2 id="how-tool-heading" className="type-h3">
            How to use it
          </h2>
          <ol className="space-y-2">
            {tool.howTo.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="type-body pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <AdSlot placement="content-inline" />

      <PageSection id="related-tools" title="Related tools">
        <CardGrid variant="cards">
          {related.map((other) => (
            <ToolCard key={other.slug} tool={other} />
          ))}
        </CardGrid>
      </PageSection>

      {guides.length > 0 && (
        <PageSection id="tool-guides" title="Guides">
          <CardGrid variant="guides">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </CardGrid>
        </PageSection>
      )}
    </Container>
  );
}
