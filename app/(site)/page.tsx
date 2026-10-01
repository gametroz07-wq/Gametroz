import { Car, Flame, Puzzle, Sparkles, Trophy } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard } from "@/components/apps/app-card";
import { GameCard } from "@/components/games/game-card";
import { GameFeatureCard } from "@/components/games/game-feature-card";
import { GameHero } from "@/components/games/game-hero";
import { GameRankCard } from "@/components/games/game-rank-card";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageSection } from "@/components/shared/page-section";
import { Rail } from "@/components/shared/rail";
import { ToolCard } from "@/components/tools/tool-card";
import {
  getFeaturedApps,
  getFeaturedGames,
  getGameCategories,
  getGamesByCategory,
  getGuides,
  getNewGames,
  getPopularGames,
  getPopularTools,
  getTrendingGames,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${siteConfig.name} — Free Games, Online Tools and Apps`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

const sectionIcon = (Icon: typeof Flame, tint: string) => (
  <span className={`flex size-8 items-center justify-center rounded-lg ${tint}`}>
    <Icon className="size-[18px]" aria-hidden="true" />
  </span>
);

// Home weights games first (~70%), then tools (~20%) and apps (~10%).
export default async function HomePage() {
  const [featured, trending, popular, racing, puzzle, newGames, categories, tools, apps, guides] = await Promise.all([
    getFeaturedGames(3),
    getTrendingGames(12),
    getPopularGames(10),
    getGamesByCategory("racing"),
    getGamesByCategory("puzzle"),
    getNewGames(10),
    getGameCategories(),
    getPopularTools(8),
    getFeaturedApps(4),
    getGuides(),
  ]);
  const [hero, ...sideFeatured] = featured;

  return (
    <Container className="pt-3 pb-10">
      <h1 className="sr-only">{siteConfig.name} — free games, online tools and apps</h1>

      <ChipNav
        label="Game categories"
        items={[
          { label: "All games", href: "/games", iconKey: "gamepad" },
          ...categories.map((category) => ({
            label: category.name,
            href: `/games/${category.slug}`,
            iconKey: category.iconKey,
          })),
        ]}
      />

      <section aria-labelledby="trending-now" className="pt-3 pb-4 sm:pb-5">
        <h2 id="trending-now" className="sr-only">
          Trending now
        </h2>
        <div className="grid gap-3 lg:h-[420px] lg:grid-cols-[2fr_1fr]">
          {hero && <GameHero game={hero} label="Trending now" />}
          <div className="hidden gap-3 lg:grid lg:grid-rows-2">
            {sideFeatured.map((game) => (
              <GameFeatureCard key={game.slug} game={game} priority />
            ))}
          </div>
        </div>
      </section>

      <PageSection
        id="trending-games"
        title="Trending games"
        icon={sectionIcon(Flame, "bg-orange-500/15 text-orange-500 dark:text-orange-300")}
        action={{ label: "All games", href: "/games" }}
      >
        <CardGrid variant="games">
          {trending.map((game, index) => (
            <GameCard key={game.slug} game={game} priority={index < 6} />
          ))}
        </CardGrid>
      </PageSection>

      <PageSection
        id="popular-games"
        title="Popular games"
        description="Most played this week"
        icon={sectionIcon(Trophy, "bg-amber-500/15 text-amber-600 dark:text-amber-300")}
      >
        <Rail label="Popular games" itemClassName="w-[46%] sm:w-[30%] lg:w-[19%] wide:w-[16%]">
          {popular.map((game, index) => (
            <GameRankCard key={game.slug} game={game} rank={index + 1} />
          ))}
        </Rail>
      </PageSection>

      {/* Two compact category showcases side by side on desktop, stacked on mobile. */}
      <div className="grid gap-x-6 lg:grid-cols-2">
        <PageSection
          id="racing-games"
          title="Racing games"
          icon={sectionIcon(Car, "bg-sky-500/15 text-sky-600 dark:text-sky-300")}
          action={{ label: "View all", href: "/games/racing" }}
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
            {racing.slice(0, 4).map((game) => (
              <GameCard key={game.slug} game={game} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 25vw, 50vw" />
            ))}
          </div>
        </PageSection>
        <PageSection
          id="puzzle-games"
          title="Puzzle games"
          icon={sectionIcon(Puzzle, "bg-violet-500/15 text-violet-600 dark:text-violet-300")}
          action={{ label: "View all", href: "/games/puzzle" }}
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
            {puzzle.slice(0, 4).map((game) => (
              <GameCard key={game.slug} game={game} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 25vw, 50vw" />
            ))}
          </div>
        </PageSection>
      </div>

      <div className="py-2">
        <AdSlot placement="home-feed" />
      </div>

      <PageSection
        id="new-games"
        title="New games"
        icon={sectionIcon(Sparkles, "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300")}
      >
        <Rail label="New games">
          {newGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </Rail>
      </PageSection>

      <PageSection id="useful-tools" title="Useful tools" description="Quick fixes, right in your browser" action={{ label: "All tools", href: "/tools" }}>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} variant="compact" />
          ))}
        </div>
      </PageSection>

      <PageSection id="popular-apps" title="Popular apps" description="Official downloads only" action={{ label: "All apps", href: "/apps" }}>
        <CardGrid variant="cards">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </CardGrid>
      </PageSection>

      <PageSection id="guides" title="Guides" action={{ label: "All guides", href: "/guides" }}>
        <CardGrid variant="guides">
          {guides.slice(0, 3).map((guide, index) => (
            <GuideCard key={guide.slug} guide={guide} featured={index === 0} />
          ))}
        </CardGrid>
      </PageSection>
    </Container>
  );
}
