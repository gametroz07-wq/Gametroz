import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageSection } from "@/components/shared/page-section";
import { ToolCard } from "@/components/tools/tool-card";
import { toolAccent } from "@/components/tools/tool-category-style";
import { ToolContent } from "@/components/tools/tool-content";
import { ToolWorkspace } from "@/components/tools/tool-workspace";
import { LocalProcessingNote } from "@/components/tools/ui/local-processing-note";
import { getGuidesFor, getRelatedTools, getToolBySlug, getTools } from "@/lib/catalog";
import { contentIcons } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbList, faqPage, webApplication } from "@/lib/seo/structured-data";
import { getToolDefinition } from "@/lib/tools/definitions";
import { cn } from "@/lib/utils";

// ISR: tool pages are prerendered at build, refresh hourly, and tools added later render on first
// request (dynamicParams defaults to true), so publishing a tool never needs a rebuild.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getTools()).map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/tool/[slug]">): Promise<Metadata> {
  const tool = await getToolBySlug((await params).slug);
  if (!tool) return {};
  const definition = getToolDefinition(tool.slug);
  return pageMetadata({
    title: definition?.metaTitle ?? `${tool.name} — Free Online Tool`,
    description: definition?.metaDescription ?? tool.description,
    path: `/tool/${tool.slug}`,
  });
}

export default async function ToolPage({ params }: PageProps<"/[lang]/tool/[slug]">) {
  const tool = await getToolBySlug((await params).slug);
  if (!tool) notFound();

  const [related, guides] = await Promise.all([getRelatedTools(tool, 4), getGuidesFor({ tools: tool.slug })]);
  const Icon = contentIcons[tool.iconKey];
  const accent = toolAccent(tool.category.slug);
  const definition = getToolDefinition(tool.slug);
  const path = `/tool/${tool.slug}`;
  const content = definition ?? { intro: [tool.description], howTo: tool.howTo, examples: [], faq: [] };

  return (
    <Container className="pb-12">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.category.name, path: `/tools/${tool.category.slug}` },
          { name: tool.name, path },
        ])}
      />
      <JsonLd data={webApplication({ name: tool.name, description: tool.description, path })} />
      <JsonLd data={faqPage(content.faq)} />
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
        <div className="space-y-3 p-4 sm:p-6">
          <ToolWorkspace tool={tool} />
          {definition?.localOnly && <LocalProcessingNote />}
        </div>
      </section>

      <ToolContent name={tool.name} definition={content} />

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
