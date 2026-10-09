import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { preconnect } from "react-dom";
import { AdSlot } from "@/components/ads/ad-slot";
import { GameActions } from "@/components/games/game-actions";
import { GameCard } from "@/components/games/game-card";
import { GameControls } from "@/components/games/game-controls";
import { GamePlayer } from "@/components/games/game-player";
import { GAME_PLAYER_ID } from "@/components/games/game-player-placeholder";
import { GameQuickFacts } from "@/components/games/game-quick-facts";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageSection } from "@/components/shared/page-section";
import { Rail } from "@/components/shared/rail";
import { TagList } from "@/components/shared/tag-list";
import { Badge } from "@/components/ui/badge";
import { adsEnabled } from "@/lib/ads/config";
import {
  getGameBySlug,
  getGuidesFor,
  getPopularGames,
  getSameCategoryGames,
  getSimilarGames,
  getTrendingGames,
} from "@/lib/catalog";
import { deriveControls, instructionLines } from "@/lib/games/controls";
import { resolveEmbedUrl } from "@/lib/providers/embed";
import { pageMetadata } from "@/lib/seo/metadata";
import { videoGame } from "@/lib/seo/structured-data";
import { gameMetaDescription, gameSummary, gameTitle } from "@/lib/seo/templates";

// ISR: games published after the build render on first request (dynamicParams defaults to true);
// pages refresh hourly and immediately through POST /api/revalidate when a game is published.
export const revalidate = 3600;

// With hundreds of published games, prerendering every page at build time would hit the database
// for each one. Only the most popular are built ahead; the rest render on first request and are then cached.
const PRERENDERED_GAMES = 60;

export async function generateStaticParams() {
  return (await getPopularGames(PRERENDERED_GAMES)).map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/game/[slug]">): Promise<Metadata> {
  const game = await getGameBySlug((await params).slug);
  if (!game) return {};
  return pageMetadata({
    title: gameTitle(game.name),
    description: gameMetaDescription({
      name: game.name,
      category: game.category.name,
      description: game.description || game.shortDescription,
    }),
    path: `/game/${game.slug}`,
    image: { url: game.thumbnailUrl, width: 512, height: 384, alt: `${game.name} artwork` },
  });
}

function InfoBlock({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="min-w-0 space-y-2 rounded-2xl bg-surface p-4 break-words ring-1 ring-white/5 sm:p-5">
      <h2 id={id} className="text-base font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function GamePage({ params }: PageProps<"/[lang]/game/[slug]">) {
  const game = await getGameBySlug((await params).slug);
  if (!game) notFound();

  const [similar, sameCategory, guides, trending] = await Promise.all([
    getSimilarGames(game, 6),
    getSameCategoryGames(game, 12),
    getGuidesFor({ games: game.slug }),
    getTrendingGames(12),
  ]);
  // Each game appears in at most one list on the page: similar first, then the category rail, then "Play next".
  const shown = new Set([game.slug, ...similar.map((other) => other.slug)]);
  const moreInCategory = sameCategory.filter((other) => !shown.has(other.slug)).slice(0, 6);
  for (const other of moreInCategory) shown.add(other.slug);
  const playNext = trending.filter((other) => !shown.has(other.slug)).slice(0, 6);

  // Warm up the provider connection only when the iframe is actually rendered.
  const embedUrl = resolveEmbedUrl(game);
  if (embedUrl) preconnect(new URL(embedUrl).origin);

  const path = `/game/${game.slug}`;
  const controls = deriveControls(game.instructions);
  const steps = instructionLines(game.instructions);
  const showHowTo = steps.length > 0 || controls.length > 0 || game.controls.length > 0;
  const withSidebar = adsEnabled();

  return (
    <Container className="pb-10">
      <JsonLd
        data={videoGame({
          name: game.name,
          description: game.shortDescription || gameSummary(game.name, game.category.name),
          path,
          image: game.thumbnailUrl,
          categoryName: game.category.name,
        })}
      />
      <Breadcrumbs
        path={path}
        items={[
          { label: "Games", href: "/games" },
          { label: game.category.name, href: `/games/${game.category.slug}` },
          { label: game.name },
        ]}
        className="pt-3"
      />

      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 pb-3">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{game.name}</h1>
        <Badge asChild variant="brand">
          <Link href={`/games/${game.category.slug}`}>{game.category.name}</Link>
        </Badge>
      </header>

      {/* No empty sidebar column while ad slots render nothing: the content takes the full width. */}
      <div className={withSidebar ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px]" : undefined}>
        <div className="min-w-0 space-y-3">
          {/* Without a sidebar the player would span the whole container (1232px), which feels oversized on
              desktop: from lg up it is capped at 90% of the content width and centered. Mobile/tablet unchanged. */}
          <div className={withSidebar ? "space-y-3" : "space-y-3 lg:mx-auto lg:max-w-[90%]"}>
            <GamePlayer game={game} />
            <GameActions playerId={GAME_PLAYER_ID} gameName={game.name} />
          </div>
          <GameQuickFacts category={game.category} orientation={game.orientation} controls={controls} />
        </div>
        {withSidebar && (
          <aside aria-label="Sidebar" className="hidden lg:block">
            <AdSlot placement="sidebar" className="sticky top-20" />
          </aside>
        )}
      </div>

      <div className="grid gap-3 py-4 lg:grid-cols-2">
        <InfoBlock id="about-heading" title={`About ${game.name}`}>
          <p className="type-body text-foreground/85">{gameSummary(game.name, game.category.name)}</p>
          {game.description && <p className="type-body text-foreground/85">{game.description}</p>}
        </InfoBlock>
        {showHowTo && (
          <InfoBlock id="how-heading" title="How to play">
            {steps.length === 1 && <p className="type-body text-foreground/85">{steps[0]}</p>}
            {steps.length > 1 && (
              <ul className="type-body list-disc space-y-1 pl-5 text-foreground/85">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            )}
            {controls.length > 0 && (
              <p className="type-body text-foreground/85">
                <span className="font-medium">Controls:</span> {controls.join(", ")}.
              </p>
            )}
            {game.controls.length > 0 && <GameControls controls={game.controls} />}
          </InfoBlock>
        )}
        {game.tags.length > 0 && (
          <InfoBlock id="tags-heading" title="Tags">
            <TagList tags={game.tags} label={`${game.name} tags`} />
          </InfoBlock>
        )}
      </div>

      <AdSlot placement="game-below-player" className="my-2" />

      {similar.length > 0 && (
        <PageSection id="similar-games" title="Similar games">
          <CardGrid variant="games">
            {similar.map((other) => (
              <GameCard key={other.slug} game={other} />
            ))}
          </CardGrid>
        </PageSection>
      )}

      {moreInCategory.length > 0 && (
        <PageSection
          id="same-category"
          title={`More ${game.category.name.toLowerCase()} games`}
          action={{ label: "View all", href: `/games/${game.category.slug}` }}
        >
          <Rail label={`More ${game.category.name} games`}>
            {moreInCategory.map((other) => (
              <GameCard key={other.slug} game={other} />
            ))}
          </Rail>
        </PageSection>
      )}

      {playNext.length > 0 && (
        <PageSection id="play-next" title="Play next">
          <Rail label="Play next">
            {playNext.map((other) => (
              <GameCard key={other.slug} game={other} />
            ))}
          </Rail>
        </PageSection>
      )}

      {guides.length > 0 && (
        <PageSection id="game-guides" title="Guides">
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
