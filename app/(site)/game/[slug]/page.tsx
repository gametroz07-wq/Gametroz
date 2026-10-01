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
  getRelatedGames,
  getSameCategoryGames,
  getTrendingGames,
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

function InfoBlock({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-2 rounded-2xl bg-surface p-4 ring-1 ring-white/5 sm:p-5">
      <h2 id={id} className="text-base font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function GamePage({ params }: PageProps<"/game/[slug]">) {
  const game = await getGameBySlug((await params).slug);
  if (!game) notFound();

  const [related, sameCategory, guides, trending] = await Promise.all([
    getRelatedGames(game, 6),
    getSameCategoryGames(game, 6),
    getGuidesFor({ games: game.slug }),
    getTrendingGames(12),
  ]);
  // "Play next": trending games not already shown as related, so the rail is always full.
  const shown = new Set([game.slug, ...related.map((other) => other.slug)]);
  const playNext = trending.filter((other) => !shown.has(other.slug)).slice(0, 6);

  return (
    <Container className="pb-10">
      <Breadcrumbs
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-3">
          <GamePlayer game={game} />
          <GameActions playerId={GAME_PLAYER_ID} gameName={game.name} />
        </div>
        <aside aria-label="Sidebar" className="hidden lg:block">
          <AdSlot placement="sidebar" className="sticky top-20" />
        </aside>
      </div>

      <PageSection id="play-next" title="Play next">
        <Rail label="Play next">
          {playNext.map((other) => (
            <GameCard key={other.slug} game={other} />
          ))}
        </Rail>
      </PageSection>

      <PageSection id="similar-games" title="Related games">
        <CardGrid variant="games">
          {related.map((other) => (
            <GameCard key={other.slug} game={other} />
          ))}
        </CardGrid>
      </PageSection>

      <AdSlot placement="game-below-player" className="my-2" />

      <div className="grid gap-3 py-4 lg:grid-cols-2">
        <InfoBlock id="about-heading" title={`About ${game.name}`}>
          <p className="type-body text-foreground/85">{game.description}</p>
        </InfoBlock>
        <InfoBlock id="how-heading" title="How to play">
          <p className="type-body text-foreground/85">{game.instructions}</p>
        </InfoBlock>
        <InfoBlock id="controls-heading" title="Controls">
          <GameControls controls={game.controls} />
        </InfoBlock>
        <InfoBlock id="tags-heading" title="Tags">
          <TagList tags={game.tags} label={`${game.name} tags`} />
        </InfoBlock>
      </div>

      {sameCategory.length > 0 && (
        <PageSection
          id="same-category"
          title={`More ${game.category.name.toLowerCase()} games`}
          action={{ label: "View all", href: `/games/${game.category.slug}` }}
        >
          <Rail label={`More ${game.category.name} games`}>
            {sameCategory.map((other) => (
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
