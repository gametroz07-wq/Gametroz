import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { GameSummary } from "@/types/content";

// Matches gridVariants.games: 2 cols mobile, 3 tablet, 4 desktop, 5 xl, 6 wide.
export const GAME_CARD_SIZES =
  "(min-width: 1440px) 16vw, (min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

type GameCardProps = {
  game: GameSummary;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Image-first game tile: the artwork is the card; title and category sit on a dark bottom fade.
 * The link wraps the whole tile so a click anywhere on it opens the game.
 */
export function GameCard({ game, priority = false, sizes = GAME_CARD_SIZES, className }: GameCardProps) {
  return (
    <article
      className={cn(
        "group/card relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-white/5 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/70",
        className,
      )}
    >
      <Link href={`/game/${game.slug}`} className="block size-full outline-none">
        <Image
          src={game.thumbnailUrl}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover/card:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex size-11 -translate-1/2 scale-90 items-center justify-center rounded-full bg-white/95 text-black opacity-0 shadow-lg transition duration-200 group-hover/card:scale-100 group-hover/card:opacity-100"
        >
          <Play className="ml-0.5 size-5 fill-current" />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
          <h3 className="line-clamp-2 text-[13px] leading-tight font-semibold drop-shadow sm:text-sm">{game.name}</h3>
          <p className="mt-0.5 text-[11px] font-medium text-white/70 sm:text-xs">{game.category.name}</p>
        </div>
      </Link>
    </article>
  );
}

export function GameCardSkeleton() {
  return <Skeleton aria-hidden="true" className="aspect-[4/3] rounded-xl" />;
}
