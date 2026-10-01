import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/types/content";

/** Large spotlight card for "Play now" and featured rows. */
export function GameFeatureCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  return (
    <article className="group/feature relative isolate overflow-hidden rounded-3xl bg-surface-2 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/60">
      <div className="relative aspect-[16/10]">
        <Image
          src={game.thumbnailUrl}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 768px) 33vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover/feature:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-white/75 uppercase">{game.category.name}</p>
          <h3 className="mt-1 truncate text-lg font-bold">
            <Link href={`/game/${game.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {game.name}
            </Link>
          </h3>
          <p className="line-clamp-1 text-sm text-white/80">{game.shortDescription}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform group-hover/feature:scale-110"
        >
          <Play className="size-5 fill-current" />
        </span>
      </div>
    </article>
  );
}
