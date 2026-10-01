import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { GameCard } from "@/components/games/game-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { getGameCategories, getGameCategory, getGamesByCategory } from "@/lib/catalog";
import { contentIcons } from "@/lib/icons";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGameCategories()).map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/games/[category]">): Promise<Metadata> {
  const category = await getGameCategory((await params).category);
  if (!category) return {};
  return pageMetadata({
    title: `${category.name} Games — Play Free Online`,
    description: category.description,
    path: `/games/${category.slug}`,
  });
}

export default async function GameCategoryPage({ params }: PageProps<"/games/[category]">) {
  const { category: slug } = await params;
  const category = await getGameCategory(slug);
  if (!category) notFound();

  const [games, categories] = await Promise.all([getGamesByCategory(slug), getGameCategories()]);
  const Icon = contentIcons[category.iconKey];

  return (
    <Container className="pb-10">
      <Breadcrumbs items={[{ label: "Games", href: "/games" }, { label: category.name }]} className="pt-3" />
      <PageHeader
        title={`${category.name} games`}
        description={category.description}
        eyebrow={
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Icon className="size-4" aria-hidden="true" />
            {games.length} games
          </span>
        }
      />

      <ChipNav
        label="Game categories"
        className="pt-3"
        items={categories.map((item) => ({
          label: item.name,
          href: `/games/${item.slug}`,
          iconKey: item.iconKey,
          active: item.slug === slug,
        }))}
      />

      <section aria-label={`${category.name} games`} className="py-4">
        <CardGrid variant="games">
          {games.map((game, index) => (
            <GameCard key={game.slug} game={game} priority={index < 5} />
          ))}
        </CardGrid>
      </section>

      <AdSlot placement="home-feed" />
    </Container>
  );
}
