import Image from "next/image";
import Link from "next/link";
import { gameImageAlt } from "@/lib/seo/templates";
import type { GameSummary } from "@/types/content";

/**
 * Ranked tile for "Popular" rails: a large outlined position number beside the artwork.
 * The link wraps the number and the artwork so a click anywhere on the tile opens the game.
 */
export function GameRankCard({ game, rank }: { game: GameSummary; rank: number }) {
  return (
    <article className="group/rank relative has-[a:focus-visible]:rounded-xl has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/70">
      <Link href={`/game/${game.slug}`} className="flex items-end outline-none">
        <span className="sr-only">#{rank} </span>
        <span
          aria-hidden="true"
          className="-mr-1 shrink-0 text-[56px] leading-[0.8] font-black text-transparent [-webkit-text-stroke:2px_var(--muted-foreground)] sm:text-[72px]"
        >
          {rank}
        </span>
        <div className="relative aspect-[3/4] min-w-0 flex-1 overflow-hidden rounded-xl bg-surface-2 ring-1 ring-white/5">
          <Image
            src={game.thumbnailUrl}
            alt={gameImageAlt(game.name)}
            fill
            sizes="(min-width: 1024px) 14vw, 30vw"
            className="object-cover transition-transform duration-300 group-hover/rank:scale-[1.05]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-2 text-white">
            <h3 className="line-clamp-2 text-[13px] leading-tight font-semibold">{game.name}</h3>
            <p className="text-[11px] text-white/70">{game.category.name}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
