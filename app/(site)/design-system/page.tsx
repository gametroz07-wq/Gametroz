import type { Metadata } from "next";
import type { ToolSummary } from "@/types/content";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { GametrozLogo } from "@/components/brand/gametroz-logo";
import { AppCard, AppCardSkeleton } from "@/components/apps/app-card";
import { GameCard, GameCardSkeleton } from "@/components/games/game-card";
import { Container } from "@/components/layout/container";
import { SearchInput } from "@/components/search/search-input";
import { gridVariants } from "@/components/shared/card-grid";
import { CategoryCard } from "@/components/shared/category-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeader } from "@/components/shared/section-header";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ToolCard, ToolCardSkeleton } from "@/components/tools/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApps, getGameCategorySummaries, getGames, getTools } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "background", className: "bg-background" },
  { name: "surface (card)", className: "bg-surface" },
  { name: "surface-2", className: "bg-surface-2" },
  { name: "foreground", className: "bg-foreground" },
  { name: "muted-foreground", className: "bg-muted-foreground" },
  { name: "primary", className: "bg-primary" },
  { name: "border", className: "bg-border" },
  { name: "brand gradient", className: "bg-brand" },
  { name: "brand strong (CTA)", className: "bg-brand-strong" },
];

const gridClasses = gridVariants;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t py-10 first:border-t-0">
      <SectionHeader id={id} title={title} />
      {children}
    </section>
  );
}

function ThemePreview({ theme, tool }: { theme: "dark" | "light"; tool: ToolSummary }) {
  return (
    <div className={`${theme} rounded-2xl border bg-background p-5 text-foreground`}>
      <p className="type-small mb-4 font-semibold capitalize">{theme}</p>
      <div className="space-y-4">
        <ToolCard tool={tool} />
        <div className="flex flex-wrap gap-2">
          <Button variant="brand">Play now</Button>
          <Button variant="outline">Details</Button>
          <Badge variant="brand">New</Badge>
        </div>
        <p className="type-muted">Muted text on {theme} background.</p>
      </div>
    </div>
  );
}

// Development-only preview. Production builds render a 404 and the page is never indexed.
export default async function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const [games, tools, apps, categories] = await Promise.all([getGames(), getTools(), getApps(), getGameCategorySummaries()]);
  const mockGames = games.slice(0, 6);
  const mockTools = tools.slice(0, 4);
  const mockApps = apps.slice(0, 4);
  const mockCategories = categories.slice(0, 6);

  return (
    <Container className="py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="outline">Development only</Badge>
          <h1 className="type-h1">Design system</h1>
          <p className="type-muted">Gametroz UI tokens and components with mock data.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="type-muted">Theme</span>
          <ThemeToggle />
        </div>
      </header>

      <Section id="ds-brand" title="Brand">
        <div id="ds-brand-logo" className="flex items-center justify-center rounded-2xl bg-[#05070d] px-6 py-14">
          <GametrozLogo id="logo-ds" halo className="w-full max-w-3xl" />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {["w-36", "w-52", "w-72"].map((width) => (
            <div key={width} className="flex items-center justify-center rounded-xl bg-[#05070d] p-6">
              <GametrozLogo id={`logo-ds-${width}`} className={width} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="ds-colors" title="Colors">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {colorTokens.map((token) => (
            <li key={token.name} className="overflow-hidden rounded-xl border">
              <div className={`h-16 ${token.className}`} />
              <p className="px-3 py-2 font-mono text-xs">{token.name}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="ds-typography" title="Typography">
        <div className="space-y-4">
          <p className="type-h1">H1 — Play. Create. Discover.</p>
          <p className="type-h2">H2 — Trending games</p>
          <p className="type-h3">H3 — Popular tools</p>
          <p className="type-body max-w-2xl">
            Body — Free games, online tools and useful apps. Everything runs in your browser,
            with no installs and no sign-up.
          </p>
          <p className="type-small">Small — Updated 2 days ago</p>
          <p className="type-muted">Muted — Secondary information and hints.</p>
        </div>
      </Section>

      <Section id="ds-buttons" title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="brand">Brand CTA</Button>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
          <Button size="lg">Large</Button>
          <Button size="sm">Small</Button>
        </div>
      </Section>

      <Section id="ds-badges" title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge variant="brand">New</Badge>
          <Badge>Primary</Badge>
          <Badge variant="secondary">Racing</Badge>
          <Badge variant="outline">Windows</Badge>
        </div>
      </Section>

      <Section id="ds-cards" title="Cards">
        <div className="space-y-8">
          <div>
            <h3 className="type-small mb-3 font-semibold">GameCard</h3>
            <div className={gridClasses.games}>
              {mockGames.map((game) => (
                <GameCard key={game.slug} game={game} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="type-small mb-3 font-semibold">ToolCard</h3>
            <div className={gridClasses.cards}>
              {mockTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="type-small mb-3 font-semibold">AppCard</h3>
            <div className={gridClasses.cards}>
              {mockApps.map((app) => (
                <AppCard key={app.slug} app={app} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="type-small mb-3 font-semibold">CategoryCard</h3>
            <div className={gridClasses.categories}>
              {mockCategories.map((category) => (
                <CategoryCard key={category.href} category={category} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="type-small mb-3 font-semibold">SectionHeader</h3>
            <SectionHeader
              title="Trending games"
              description="What people are playing right now."
              action={{ label: "View all", href: "/games" }}
            />
          </div>
        </div>
      </Section>

      <Section id="ds-tabs" title="Tabs">
        <Tabs defaultValue="all">
          <TabsList aria-label="Result type">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="type-muted pt-3">All results (mock).</TabsContent>
          <TabsContent value="games" className="type-muted pt-3">Game results (mock).</TabsContent>
          <TabsContent value="tools" className="type-muted pt-3">Tool results (mock).</TabsContent>
          <TabsContent value="apps" className="type-muted pt-3">App results (mock).</TabsContent>
          <TabsContent value="guides" className="pt-3">
            <EmptyState title="No guides yet" description="Guides arrive in a later phase." />
          </TabsContent>
        </Tabs>
      </Section>

      <Section id="ds-skeletons" title="Skeletons">
        <div className="space-y-3" aria-busy="true" aria-label="Loading example">
          <div className={gridClasses.games}>
            {Array.from({ length: 4 }, (_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </div>
          <div className={gridClasses.cards}>
            <ToolCardSkeleton />
            <AppCardSkeleton />
          </div>
        </div>
      </Section>

      <Section id="ds-search" title="Search">
        <div className="max-w-2xl space-y-4">
          <SearchInput size="lg" showSubmit />
          <SearchInput />
          <p className="type-muted">
            The header search opens a dialog (Ctrl/Cmd + K on desktop). Results arrive in Phase 6.
          </p>
        </div>
      </Section>

      <Section id="ds-empty" title="Empty state">
        <EmptyState
          title="No results found"
          description="Try another search or browse the categories."
          action={<Button variant="outline">Browse games</Button>}
        />
      </Section>

      <Section id="ds-ads" title="AdSlot">
        <div className="space-y-6">
          {(["home-feed", "game-below-player", "content-inline"] as const).map((placement) => (
            <div key={placement} className="space-y-2">
              <p className="font-mono text-xs text-muted-foreground">{placement}</p>
              <AdSlot placement={placement} preview />
            </div>
          ))}
          <div className="space-y-2">
            <p className="font-mono text-xs text-muted-foreground">sidebar (lg and up)</p>
            <AdSlot placement="sidebar" className="mx-0" preview />
          </div>
        </div>
      </Section>

      <Section id="ds-themes" title="Dark / light mode">
        <div className="grid gap-4 md:grid-cols-2">
          <ThemePreview theme="dark" tool={mockTools[0]} />
          <ThemePreview theme="light" tool={mockTools[0]} />
        </div>
      </Section>
    </Container>
  );
}
