import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { gameImageAlt } from "@/lib/seo/templates";
import type { Game } from "@/types/content";

/** Medium spotlight card for secondary featured slots. */
export function GameFeatureCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  return (
    <article className="group/feature relative isolate flex aspect-[16/9] overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-white/5 lg:aspect-auto lg:h-full has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/70">
      <Image
        src={game.thumbnailUrl}
        alt={gameImageAlt(game.name)}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="-z-10 object-cover transition-transform duration-500 group-hover/feature:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/25 to-transparent" />
      <div className="mt-auto flex w-full items-end justify-between gap-3 p-3.5 text-white">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-white/70 uppercase">{game.category.name}</p>
          <h3 className="truncate text-base font-bold sm:text-lg">
            <Link href={`/game/${game.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {game.name}
            </Link>
          </h3>
        </div>
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform group-hover/feature:scale-110"
        >
          <Play className="ml-0.5 size-4 fill-current" />
        </span>
      </div>
    </article>
  );
}
