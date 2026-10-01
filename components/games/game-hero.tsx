import { Play, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/types/content";

/** Featured game spotlight: the largest image on the page, with one clear Play call to action. */
export function GameHero({ game, label = "Featured" }: { game: Game; label?: string }) {
  return (
    <article className="group/hero relative isolate flex min-h-64 overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-white/5 sm:min-h-80 lg:h-full has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/70">
      <Image
        src={game.thumbnailUrl}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="-z-10 object-cover transition-transform duration-500 group-hover/hero:scale-[1.03]"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/35 to-black/5 sm:bg-linear-to-r sm:from-black/85 sm:via-black/45 sm:to-transparent" />
      <div className="mt-auto flex w-full flex-col items-start gap-2 p-4 text-white sm:max-w-md sm:p-6">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase backdrop-blur">
          <Sparkles className="size-3.5" aria-hidden="true" />
          {label} · {game.category.name}
        </span>
        <h3 className="text-2xl leading-tight font-extrabold tracking-tight sm:text-4xl">{game.name}</h3>
        <p className="line-clamp-2 text-sm text-white/80 sm:text-[15px]">{game.shortDescription}</p>
        <Link
          href={`/game/${game.slug}`}
          className="mt-1 inline-flex h-10 items-center gap-2 rounded-full bg-brand-strong px-5 text-sm font-bold text-white shadow-lg shadow-black/30 transition-opacity outline-none after:absolute after:inset-0 after:content-[''] hover:opacity-90"
        >
          <Play className="size-4 fill-current" aria-hidden="true" />
          Play now
        </Link>
      </div>
    </article>
  );
}
