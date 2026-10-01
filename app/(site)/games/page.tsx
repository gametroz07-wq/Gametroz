import { AdSlot } from "@/components/ads/ad-slot";
import { GameCard } from "@/components/games/game-card";
import { GameFeatureCard } from "@/components/games/game-feature-card";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid, gridVariants } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { LoadMore } from "@/components/shared/load-more";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import { Rail } from "@/components/shared/rail";
import {
  getFeaturedGames,
  getGameCategories,
  getNewGames,
  getPopularGames,
  getTrendingGames,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Free Online Games — Play Instantly",
  description: "Play free HTML5 games in your browser: racing, puzzle, action, sports and more. No downloads, no sign-up.",
  path: "/games",
});

export default async function GamesPage() {
  const [categories, featured, trending, newGames, popular] = await Promise.all([
    getGameCategories(),
    getFeaturedGames(3),
    getTrendingGames(6),
    getNewGames(10),
    getPopularGames(),
  ]);

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Games" }]} className="pt-6" />
      <PageHeader
        title="Free online games"
        description="Play instantly in your browser. No downloads, no sign-up."
      >
        <SearchInput placeholder="Search games..." className="max-w-xl pt-2" />
      </PageHeader>

      <ChipNav
        label="Game categories"
        className="pt-4"
        items={categories.map((category) => ({
          label: category.name,
          href: `/games/${category.slug}`,
          iconKey: category.iconKey,
        }))}
      />

      <PageSection id="featured" title="Featured">
        <CardGrid variant="feature">
          {featured.map((game, index) => (
            <GameFeatureCard key={game.slug} game={game} priority={index === 0} />
          ))}
        </CardGrid>
      </PageSection>

      <PageSection id="trending" title="Trending">
        <CardGrid variant="games">
          {trending.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </CardGrid>
      </PageSection>

      <div className="py-4">
        <AdSlot placement="home-feed" />
      </div>

      <PageSection id="new" title="New">
        <Rail label="New games">
          {newGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </Rail>
      </PageSection>

      <PageSection id="popular" title="Popular" description="All games, most played first.">
        <LoadMore initial={12} step={12} itemLabel="games" className={gridVariants.games}>
          {popular.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </LoadMore>
      </PageSection>
    </Container>
  );
}
