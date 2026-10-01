import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { GameActions } from "@/components/games/game-actions";
import { GameCard } from "@/components/games/game-card";
import { GameControls } from "@/components/games/game-controls";
import { GamePlayer } from "@/components/games/game-player";
import { GAME_PLAYER_ID } from "@/components/games/game-player-placeholder";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageSection } from "@/components/shared/page-section";
import { Rail } from "@/components/shared/rail";
import { TagList } from "@/components/shared/tag-list";
import { Badge } from "@/components/ui/badge";
import {
  getGameBySlug,
  getGames,
  getGuidesFor,
  getPlayNextGames,
  getRelatedGames,
  getSameCategoryGames,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGames()).map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PageProps<"/game/[slug]">): Promise<Metadata> {
  const game = await getGameBySlug((await params).slug);
  if (!game) return {};
  return pageMetadata({
    title: `Play ${game.name} Online Free`,
    description: `${game.shortDescription} Play ${game.name} free in your browser on Gametroz.`,
    path: `/game/${game.slug}`,
  });
}

export default async function GamePage({ params }: PageProps<"/game/[slug]">) {
  const game = await getGameBySlug((await params).slug);
  if (!game) notFound();

  const [related, sameCategory, guides] = await Promise.all([
    getRelatedGames(game, 6),
    getSameCategoryGames(game, 6),
    getGuidesFor({ games: game.slug }),
  ]);
  const playNext = await getPlayNextGames(
    game,
    [...related, ...sameCategory].map((other) => other.slug),
    4,
  );

  return (
    <Container className="pb-12">
      <Breadcrumbs
        items={[
          { label: "Games", href: "/games" },
          { label: game.category.name, href: `/games/${game.category.slug}` },
          { label: game.name },
        ]}
        className="pt-4 sm:pt-6"
      />

      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 pb-4">
        <h1 className="type-h2">{game.name}</h1>
        <Badge asChild variant="brand">
          <Link href={`/games/${game.category.slug}`}>{game.category.name}</Link>
        </Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-4">
          <GamePlayer game={game} />
          <GameActions playerId={GAME_PLAYER_ID} gameName={game.name} />
          <AdSlot placement="game-below-player" />
        </div>
        <aside aria-label="Sidebar" className="hidden lg:block">
          <AdSlot placement="sidebar" className="sticky top-24" />
        </aside>
      </div>

      {/* Mobile-first: the next step sits right under the player. */}
      <PageSection id="play-next" title="Play next">
        <Rail label="Play next">
          {(playNext.length ? playNext : related).map((other) => (
            <GameCard key={other.slug} game={other} />
          ))}
        </Rail>
      </PageSection>

      <div className="grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="about-heading" className="space-y-3">
            <h2 id="about-heading" className="type-h3">
              About {game.name}
            </h2>
            <p className="type-body text-foreground/90">{game.description}</p>
          </section>
          <section aria-labelledby="how-heading" className="space-y-3">
            <h2 id="how-heading" className="type-h3">
              How to play
            </h2>
            <p className="type-body text-foreground/90">{game.instructions}</p>
          </section>
          <section aria-labelledby="controls-heading" className="space-y-3">
            <h2 id="controls-heading" className="type-h3">
              Controls
            </h2>
            <GameControls controls={game.controls} />
          </section>
          <section aria-labelledby="tags-heading" className="space-y-3">
            <h2 id="tags-heading" className="type-h3">
              Tags
            </h2>
            <TagList tags={game.tags} label={`${game.name} tags`} />
          </section>
        </div>
        {guides.length > 0 && (
          <aside aria-labelledby="game-guides-heading" className="space-y-3">
            <h2 id="game-guides-heading" className="type-h3">
              Guides
            </h2>
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </aside>
        )}
      </div>

      <PageSection id="similar-games" title="Similar games">
        <CardGrid variant="games">
          {related.map((other) => (
            <GameCard key={other.slug} game={other} />
          ))}
        </CardGrid>
      </PageSection>

      {sameCategory.length > 0 && (
        <PageSection
          id="same-category"
          title={`More ${game.category.name.toLowerCase()} games`}
          action={{ label: "View all", href: `/games/${game.category.slug}` }}
        >
          <CardGrid variant="games">
            {sameCategory.map((other) => (
              <GameCard key={other.slug} game={other} />
            ))}
          </CardGrid>
        </PageSection>
      )}
    </Container>
  );
}
