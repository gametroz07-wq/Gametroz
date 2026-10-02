import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard } from "@/components/apps/app-card";
import { GameCard } from "@/components/games/game-card";
import { GuideBody } from "@/components/guides/guide-body";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageSection } from "@/components/shared/page-section";
import { ToolCard } from "@/components/tools/tool-card";
import {
  getGuideBySlug,
  getGuideRelatedContent,
  getGuides,
  getGuideSection,
  getMoreGuides,
} from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";
import { article } from "@/lib/seo/structured-data";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGuides()).map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[slug]">): Promise<Metadata> {
  const guide = await getGuideBySlug((await params).slug);
  if (!guide) return {};
  return pageMetadata({ title: guide.title, description: guide.excerpt, path: `/guide/${guide.slug}` });
}

export default async function GuidePage({ params }: PageProps<"/guide/[slug]">) {
  const guide = await getGuideBySlug((await params).slug);
  if (!guide) notFound();

  const [section, related, more] = await Promise.all([
    getGuideSection(guide.section),
    getGuideRelatedContent(guide),
    getMoreGuides(guide, 3),
  ]);

  return (
    <Container className="pb-12">
      {/* Only fields the page shows: the title, summary and publication date. No author or modified date. */}
      <JsonLd
        data={article({
          headline: guide.title,
          description: guide.excerpt,
          path: `/guide/${guide.slug}`,
          datePublished: guide.publishedAt,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/guides" },
          ...(section ? [{ label: section.name, href: `/guides/${section.slug}` }] : []),
          { label: guide.title },
        ]}
        path={`/guide/${guide.slug}`}
        className="pt-4 sm:pt-6"
      />

      <article className="mx-auto max-w-3xl pt-6">
        <header className="space-y-4 border-b border-border/60 pb-6">
          <h1 className="type-h1">{guide.title}</h1>
          <p className="type-body text-lg text-muted-foreground">{guide.excerpt}</p>
          <p className="type-muted">
            <time dateTime={guide.publishedAt}>{formatDate(guide.publishedAt)}</time> · {guide.readingMinutes} min
            read
          </p>
        </header>
        <GuideBody blocks={guide.body} insertAfter={3} insert={<AdSlot placement="content-inline" />} />
      </article>

      {related.tools.length > 0 && (
        <PageSection id="guide-tools" title="Tools in this guide">
          <CardGrid variant="cards">
            {related.tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </CardGrid>
        </PageSection>
      )}
      {related.apps.length > 0 && (
        <PageSection id="guide-apps" title="Apps in this guide">
          <CardGrid variant="cards">
            {related.apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </CardGrid>
        </PageSection>
      )}
      {related.games.length > 0 && (
        <PageSection id="guide-games" title="Games in this guide">
          <CardGrid variant="games">
            {related.games.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </CardGrid>
        </PageSection>
      )}

      <PageSection id="more-guides" title="More guides">
        <CardGrid variant="guides">
          {more.map((other) => (
            <GuideCard key={other.slug} guide={other} />
          ))}
        </CardGrid>
      </PageSection>
    </Container>
  );
}
