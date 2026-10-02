import { Gamepad2 } from "lucide-react";
import Image from "next/image";
import { gameImageAlt } from "@/lib/seo/templates";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/content";

export const GAME_PLAYER_ID = "game-player";

/**
 * Reserves the exact player box (no CLS) and shows the game artwork full-size. The provider
 * iframe replaces it when embeds are enabled; the outer box and aspect ratio stay the same.
 */
export function GamePlayerPlaceholder({ game }: { game: Pick<Game, "name" | "thumbnailUrl" | "orientation"> }) {
  const portrait = game.orientation === "portrait";

  return (
    <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/5">
      <div
        id={GAME_PLAYER_ID}
        className={cn(
          "relative mx-auto overflow-hidden bg-black",
          portrait ? "aspect-[9/16] h-[min(70vh,620px)] max-w-full" : "aspect-video w-full",
        )}
      >
        {portrait && (
          <Image src={game.thumbnailUrl} alt="" fill sizes="360px" className="scale-125 object-cover opacity-40 blur-2xl" />
        )}
        <Image
          src={game.thumbnailUrl}
          alt={gameImageAlt(game.name)}
          fill
          priority
          sizes={portrait ? "360px" : "(min-width: 1024px) 70vw, 100vw"}
          className={portrait ? "object-contain" : "object-cover"}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-4 text-white sm:p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Gamepad2 className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold sm:text-lg">{game.name}</p>
            <p className="text-xs text-white/75 sm:text-sm">Preview — the playable version loads here soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
