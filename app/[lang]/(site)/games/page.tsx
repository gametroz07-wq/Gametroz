import { AdSlot } from "@/components/ads/ad-slot";
import { GameCard } from "@/components/games/game-card";
import { GameFeatureCard } from "@/components/games/game-feature-card";
import { GameHero } from "@/components/games/game-hero";
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
  getGamesByCategory,
  getNewGames,
  getPopularGames,
  getTrendingGames,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { extendDescription } from "@/lib/seo/templates";

// ISR: refreshed every 10 minutes and on demand via POST /api/revalidate.
export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Free Online Games — Play Instantly",
  description: extendDescription(
    "Play free HTML5 games in your browser: racing, puzzle, action, sports and more. No downloads, no sign-up.",
    ["Browse trending, new and most played titles."],
  ),
  path: "/games",
});

const categoryBlocks = ["racing", "action", "puzzle", "sports"] as const;

export default async function GamesPage() {
  const [categories, featured, trending, newGames, popular, ...blocks] = await Promise.all([
    getGameCategories(),
    getFeaturedGames(3),
    getTrendingGames(12),
    getNewGames(10),
    getPopularGames(),
    ...categoryBlocks.map((slug) => getGamesByCategory(slug)),
  ]);
  const [hero, ...sideFeatured] = featured;

  return (
    <Container className="pb-10">
      <Breadcrumbs items={[{ label: "Games" }]} path="/games" className="pt-3" />
      <PageHeader
        title="Games"
        description={`${popular.length} free games you can play instantly. No downloads, no sign-up.`}
        aside={<SearchInput placeholder="Search games..." />}
      />

      <ChipNav
        label="Game categories"
        className="pt-3"
        items={categories.map((category) => ({
          label: category.name,
          href: `/games/${category.slug}`,
          iconKey: category.iconKey,
        }))}
      />

      <section aria-labelledby="featured-heading" className="pt-3 pb-4">
        <h2 id="featured-heading" className="sr-only">
          Featured games
        </h2>
        <div className="grid gap-3 lg:h-[380px] lg:grid-cols-[2fr_1fr]">
          {hero && <GameHero game={hero} />}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-2">
            {sideFeatured.map((game) => (
              <GameFeatureCard key={game.slug} game={game} />
            ))}
          </div>
        </div>
      </section>

      <PageSection id="trending" title="Trending">
        <CardGrid variant="games">
          {trending.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </CardGrid>
      </PageSection>

      <PageSection id="new" title="New">
        <Rail label="New games">
          {newGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </Rail>
      </PageSection>

      <div className="py-2">
        <AdSlot placement="home-feed" />
      </div>

      {/* Category showcases in pairs: two 2x2 blocks per row on desktop. */}
      <div className="grid gap-x-6 lg:grid-cols-2">
        {categoryBlocks.map((slug, index) => {
          const games = blocks[index];
          const category = categories.find((item) => item.slug === slug);
          if (!category || games.length === 0) return null;
          return (
            <PageSection key={slug} id={`category-${slug}`} title={category.name} action={{ label: "View all", href: `/games/${slug}` }}>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
                {games.slice(0, 4).map((game) => (
                  <GameCard key={game.slug} game={game} sizes="(min-width: 640px) 25vw, 50vw" />
                ))}
              </div>
            </PageSection>
          );
        })}
      </div>

      <PageSection id="all-games" title="All games" description="Most played first">
        <LoadMore initial={15} step={15} itemLabel="games" className={gridVariants.games}>
          {popular.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </LoadMore>
      </PageSection>
    </Container>
  );
}
