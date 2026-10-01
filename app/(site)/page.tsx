import { AppWindow, Gamepad2, Wrench } from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard } from "@/components/apps/app-card";
import { GameCard } from "@/components/games/game-card";
import { GameFeatureCard } from "@/components/games/game-feature-card";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { CardGrid } from "@/components/shared/card-grid";
import { CategoryCard } from "@/components/shared/category-card";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageSection } from "@/components/shared/page-section";
import { Rail } from "@/components/shared/rail";
import { ToolCard } from "@/components/tools/tool-card";
import {
  getFeaturedApps,
  getFeaturedGames,
  getGameCategorySummaries,
  getGames,
  getGuides,
  getNewGames,
  getPopularTools,
  getTools,
  getTrendingGames,
  getApps,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig, trendingSearches } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${siteConfig.name} — Free Games, Online Tools and Apps`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [trending, featured, newGames, popularTools, allTools, apps, categories, guides, games, allApps] =
    await Promise.all([
      getTrendingGames(12),
      getFeaturedGames(3),
      getNewGames(10),
      getPopularTools(8),
      getTools(),
      getFeaturedApps(4),
      getGameCategorySummaries(),
      getGuides(),
      getGames(),
      getApps(),
    ]);

  const quickLinks = [
    { label: "Games", href: "/games", icon: Gamepad2, meta: `${games.length} free games` },
    { label: "Tools", href: "/tools", icon: Wrench, meta: `${allTools.length} online tools` },
    { label: "Apps", href: "/apps", icon: AppWindow, meta: `${allApps.length} trusted apps` },
  ];
  // Compare by slug: rows from the database are distinct objects per query.
  const popularSlugs = new Set(popularTools.map((tool) => tool.slug));
  const usefulTools = allTools.filter((tool) => !popularSlugs.has(tool.slug));

  return (
    <>
      {/* Hero: compact, search-first. */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 max-w-3xl rounded-full bg-brand opacity-20 blur-3xl"
        />
        <Container className="relative flex flex-col items-center py-10 text-center sm:py-14">
          <p className="text-sm font-semibold tracking-[0.2em]">
            <span className="text-brand">GAMETROZ</span>
            <span className="text-muted-foreground"> · {siteConfig.tagline}</span>
          </p>
          <h1 id="hero-heading" className="type-h1 mt-3 max-w-3xl">
            Play. Create. Discover.
          </h1>
          <p className="type-body mt-3 max-w-xl text-muted-foreground">
            Play free games, use useful online tools and discover great apps.
          </p>
          <SearchInput size="lg" showSubmit className="mt-6 max-w-xl" />
          <p className="type-muted mt-3">
            Trending:{" "}
            {trendingSearches.slice(0, 4).map((term, index) => (
              <span key={term}>
                {index > 0 && " · "}
                <Link href={`/search?q=${encodeURIComponent(term)}`} className="hover:text-foreground hover:underline">
                  {term}
                </Link>
              </span>
            ))}
          </p>
          <ul className="mt-8 grid w-full max-w-2xl grid-cols-3 gap-2 sm:gap-3">
            {quickLinks.map(({ label, href, icon: Icon, meta }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex flex-col items-center gap-1 rounded-2xl bg-surface px-2 py-4 transition-colors hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:flex-row sm:gap-3 sm:px-4 sm:text-left"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary dark:text-violet-300">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold">{label}</span>
                    <span className="type-muted hidden text-xs sm:block">{meta}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container>
        <PageSection id="trending-games" title="Trending games" action={{ label: "All games", href: "/games" }}>
          <CardGrid variant="games">
            {trending.map((game, index) => (
              <GameCard key={game.slug} game={game} priority={index < 4} />
            ))}
          </CardGrid>
        </PageSection>

        <PageSection id="play-now" title="Play now" description="Hand-picked games to start with.">
          <CardGrid variant="feature">
            {featured.map((game) => (
              <GameFeatureCard key={game.slug} game={game} />
            ))}
          </CardGrid>
        </PageSection>

        <PageSection id="popular-tools" title="Popular tools" action={{ label: "All tools", href: "/tools" }}>
          <CardGrid variant="cards">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </CardGrid>
        </PageSection>

        <div className="py-4">
          <AdSlot placement="home-feed" />
        </div>

        <PageSection id="recommended-apps" title="Recommended apps" action={{ label: "All apps", href: "/apps" }}>
          <CardGrid variant="cards">
            {apps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </CardGrid>
        </PageSection>

        <PageSection id="new-games" title="New games">
          <Rail label="New games">
            {newGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </Rail>
        </PageSection>

        <PageSection id="game-categories" title="Game categories">
          <CardGrid variant="categories">
            {categories.map((category) => (
              <CategoryCard key={category.href} category={category} />
            ))}
          </CardGrid>
        </PageSection>

        <PageSection id="useful-tools" title="Useful tools" description="Quick fixes, right in your browser.">
          <ChipNav
            label="Useful tools"
            layout="wrap"
            items={usefulTools.map((tool) => ({ label: tool.name, href: `/tool/${tool.slug}`, iconKey: tool.iconKey }))}
          />
        </PageSection>

        <PageSection id="guides" title="Guides" action={{ label: "All guides", href: "/guides" }} className="pb-12">
          <CardGrid variant="guides">
            {guides.slice(0, 3).map((guide, index) => (
              <GuideCard key={guide.slug} guide={guide} featured={index === 0} />
            ))}
          </CardGrid>
        </PageSection>
      </Container>
    </>
  );
}
