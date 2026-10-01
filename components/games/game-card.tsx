import Image from "next/image";
import { ContentCard } from "@/components/shared/content-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GameSummary } from "@/types/content";

// Matches gridVariants.games: 2 cols mobile, 3 tablet, 4 desktop, 6 wide.
const GAME_CARD_SIZES =
  "(min-width: 1440px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

type GameCardProps = {
  game: GameSummary;
  priority?: boolean;
};

export function GameCard({ game, priority = false }: GameCardProps) {
  return (
    <ContentCard
      href={`/game/${game.slug}`}
      title={game.name}
      media={
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-foreground/5 transition-shadow duration-200 group-hover/card:ring-2 group-hover/card:ring-primary/70">
          <Image
            src={game.thumbnailUrl}
            alt=""
            fill
            sizes={GAME_CARD_SIZES}
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
        </div>
      }
    >
      <p className="type-muted text-xs sm:text-[13px]">{game.category.name}</p>
    </ContentCard>
  );
}

export function GameCardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-2">
      <Skeleton className="aspect-[4/3] rounded-2xl" />
      <div className="space-y-1.5 px-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
