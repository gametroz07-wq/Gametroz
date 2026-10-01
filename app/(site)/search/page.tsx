import type { Metadata } from "next";
import { AppCard } from "@/components/apps/app-card";
import { GameCard } from "@/components/games/game-card";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { CardGrid } from "@/components/shared/card-grid";
import { CategoryCard } from "@/components/shared/category-card";
import { ChipNav } from "@/components/shared/chip-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { PageSection } from "@/components/shared/page-section";
import { ToolCard } from "@/components/tools/tool-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getGameCategorySummaries, searchCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { trendingSearches } from "@/lib/site";

const resultTypes = ["all", "games", "tools", "apps", "guides"] as const;
type ResultType = (typeof resultTypes)[number];

function firstParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 100) ?? "";
}

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const query = firstParam((await searchParams).q);
  // Internal search results are never indexed (docs/06).
  return pageMetadata({
    title: query ? `Search results for “${query}”` : "Search",
    description: "Search free games, online tools, apps and guides on Gametroz.",
    path: "/search",
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const query = firstParam(params.q);
  const requestedType = firstParam(params.type) as ResultType;
  const defaultTab = resultTypes.includes(requestedType) ? requestedType : "all";

  const [results, categories] = await Promise.all([searchCatalog(query), getGameCategorySummaries()]);
  const total = results.games.length + results.tools.length + results.apps.length + results.guides.length;

  const panels = {
    games: results.games.length ? (
      <CardGrid variant="games">
        {results.games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </CardGrid>
    ) : null,
    tools: results.tools.length ? (
      <CardGrid variant="cards">
        {results.tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </CardGrid>
    ) : null,
    apps: results.apps.length ? (
      <CardGrid variant="cards">
        {results.apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </CardGrid>
    ) : null,
    guides: results.guides.length ? (
      <CardGrid variant="guides">
        {results.guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </CardGrid>
    ) : null,
  };
  const labels = { games: "Games", tools: "Tools", apps: "Apps", guides: "Guides" } as const;
  const sections = (Object.keys(panels) as (keyof typeof panels)[]).filter((key) => panels[key]);

  return (
    <Container className="pb-12">
      <header className="space-y-4 pt-8 pb-4">
        <h1 className="type-h2">{query ? <>Results for “{query}”</> : "Search Gametroz"}</h1>
        {/* key resets the uncontrolled input when the query changes via client navigation. */}
        <SearchInput key={query} size="lg" showSubmit defaultValue={query} autoFocus={!query} className="max-w-2xl" />
      </header>

      {!query && (
        <>
          <PageSection id="trending-searches" title="Trending searches">
            <ChipNav
              label="Trending searches"
              layout="wrap"
              items={trendingSearches.map((term) => ({ label: term, href: `/search?q=${encodeURIComponent(term)}` }))}
            />
          </PageSection>
          <PageSection id="browse-categories" title="Browse game categories">
            <CardGrid variant="categories">
              {categories.map((category) => (
                <CategoryCard key={category.href} category={category} />
              ))}
            </CardGrid>
          </PageSection>
        </>
      )}

      {query && total === 0 && (
        <EmptyState
          className="mt-4"
          title={`No results for “${query}”`}
          description="Check the spelling or try a broader term like “racing”, “images” or “windows”."
        />
      )}

      {query && total > 0 && (
        <Tabs defaultValue={defaultTab} className="pt-2">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <TabsList aria-label="Result type" className="h-10">
              <TabsTrigger value="all" className="px-3">
                All <span className="text-muted-foreground">{total}</span>
              </TabsTrigger>
              {(Object.keys(labels) as (keyof typeof labels)[]).map((key) => (
                <TabsTrigger key={key} value={key} className="px-3">
                  {labels[key]} <span className="text-muted-foreground">{results[key].length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="all" className="pt-2">
            {sections.map((key) => (
              <section key={key} aria-labelledby={`all-${key}`} className="py-5">
                <h2 id={`all-${key}`} className="type-h3 mb-4">
                  {labels[key]}
                </h2>
                {panels[key]}
              </section>
            ))}
          </TabsContent>

          {(Object.keys(labels) as (keyof typeof labels)[]).map((key) => (
            <TabsContent key={key} value={key} className="pt-6">
              {panels[key] ?? (
                <EmptyState title={`No ${labels[key].toLowerCase()} match “${query}”`} description="Try the All tab or another search." />
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </Container>
  );
}
