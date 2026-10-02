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
import { getGuideDefinition } from "@/lib/guides/definitions";
import { pageMetadata } from "@/lib/seo/metadata";
import { article } from "@/lib/seo/structured-data";

// Guides change when `npm run guides:sync` runs: pages rebuild on demand and refresh hourly.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getGuides()).map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guide/[slug]">): Promise<Metadata> {
  const guide = await getGuideBySlug((await params).slug);
  if (!guide) return {};
  // The page title (including the site name) lives in the definition; the description is the excerpt.
  const title = getGuideDefinition(guide.slug)?.metaTitle ?? guide.title;
  return pageMetadata({ title, description: guide.excerpt, path: `/guide/${guide.slug}` });
}

export default async function GuidePage({ params }: PageProps<"/guide/[slug]">) {
  const guide = await getGuideBySlug((await params).slug);
  if (!guide) notFound();

  const [section, related, more] = await Promise.all([
    getGuideSection(guide.section),
    getGuideRelatedContent(guide),
    getMoreGuides(guide, 3),
  ]);

  // Cards inside the body come from the published related content; the closing sections only list what
  // the body mentions without showing a card for it.
  const items = {
    games: new Map(related.games.map((game) => [game.slug, game])),
    tools: new Map(related.tools.map((tool) => [tool.slug, tool])),
    apps: new Map(related.apps.map((app) => [app.slug, app])),
  };
  const shown = { game: new Set<string>(), tool: new Set<string>(), app: new Set<string>() };
  for (const block of guide.body) {
    if (block.type !== "items") continue;
    for (const ref of block.refs) shown[ref.kind].add(ref.slug);
  }
  const moreGames = related.games.filter((game) => !shown.game.has(game.slug));
  const moreTools = related.tools.filter((tool) => !shown.tool.has(tool.slug));
  const moreApps = related.apps.filter((app) => !shown.app.has(app.slug));
  const hasAnswer = guide.body[0]?.type === "answer";

  return (
    <Container className="pb-12">
      {/* Only fields the page shows: title, summary, publication and update dates. Gametroz is the publisher; no byline. */}
      <JsonLd
        data={article({
          headline: guide.title,
          description: guide.excerpt,
          path: `/guide/${guide.slug}`,
          datePublished: guide.publishedAt,
          dateModified: guide.updatedAt,
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
          {/* The short-answer box already opens the body, so the excerpt only leads guides without one. */}
          {!hasAnswer && <p className="type-body text-lg text-muted-foreground">{guide.excerpt}</p>}
          <p className="type-muted">
            Updated <time dateTime={guide.updatedAt}>{formatDate(guide.updatedAt)}</time> · {guide.readingMinutes} min
            read
          </p>
        </header>
        <GuideBody blocks={guide.body} items={items} insertAfter={4} insert={<AdSlot placement="content-inline" />} />
      </article>

      {moreGames.length > 0 && (
        <PageSection id="guide-games" title="Games in this guide">
          <CardGrid variant="games">
            {moreGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </CardGrid>
        </PageSection>
      )}
      {moreTools.length > 0 && (
        <PageSection id="guide-tools" title="Tools in this guide">
          <CardGrid variant="cards">
            {moreTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </CardGrid>
        </PageSection>
      )}
      {moreApps.length > 0 && (
        <PageSection id="guide-apps" title="Apps in this guide">
          <CardGrid variant="cards">
            {moreApps.map((app) => (
              <AppCard key={app.slug} app={app} />
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
