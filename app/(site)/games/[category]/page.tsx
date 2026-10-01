import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { GameCard } from "@/components/games/game-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { CategoryCard } from "@/components/shared/category-card";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import {
  getGameCategories,
  getGameCategory,
  getGameCategorySummaries,
  getGamesByCategory,
} from "@/lib/catalog";
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

  const [games, summaries] = await Promise.all([getGamesByCategory(slug), getGameCategorySummaries()]);
  const otherCategories = summaries.filter((summary) => summary.href !== `/games/${slug}`);

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Games", href: "/games" }, { label: category.name }]} className="pt-6" />
      <PageHeader title={`${category.name} games`} description={category.description} />

      <section aria-label={`${category.name} games`} className="py-6">
        <p className="type-muted mb-4">{games.length} games</p>
        <CardGrid variant="games">
          {games.map((game, index) => (
            <GameCard key={game.slug} game={game} priority={index < 4} />
          ))}
        </CardGrid>
      </section>

      <div className="py-4">
        <AdSlot placement="home-feed" />
      </div>

      <PageSection id="related-categories" title="More categories">
        <CardGrid variant="categories">
          {otherCategories.map((summary) => (
            <CategoryCard key={summary.href} category={summary} />
          ))}
        </CardGrid>
      </PageSection>
    </Container>
  );
}
