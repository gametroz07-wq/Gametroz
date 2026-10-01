import { Gamepad2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/content";

export const GAME_PLAYER_ID = "game-player";

/**
 * Reserves the exact player box (no CLS) and previews the game. The provider iframe replaces
 * the inner content in Phase 4; the outer box and its aspect ratio stay the same.
 */
export function GamePlayerPlaceholder({ game }: { game: Pick<Game, "name" | "thumbnailUrl" | "orientation"> }) {
  const portrait = game.orientation === "portrait";

  return (
    <div className="overflow-hidden rounded-2xl bg-black/90 sm:rounded-3xl">
      <div
        id={GAME_PLAYER_ID}
        className={cn(
          "relative mx-auto overflow-hidden bg-black",
          portrait ? "aspect-[9/16] h-[min(72vh,640px)] max-w-full" : "aspect-video w-full",
        )}
      >
        <Image
          src={game.thumbnailUrl}
          alt=""
          fill
          priority
          sizes={portrait ? "360px" : "(min-width: 1024px) 70vw, 100vw"}
          className="scale-110 object-cover opacity-50 blur-2xl"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
          <Image
            src={game.thumbnailUrl}
            alt={`${game.name} artwork`}
            width={200}
            height={150}
            className="w-32 rounded-2xl shadow-2xl ring-1 ring-white/20 sm:w-48"
          />
          <p className="text-lg font-bold sm:text-xl">{game.name}</p>
          <p className="max-w-xs text-sm text-white/75">
            <Gamepad2 className="mr-1.5 inline size-4 align-[-3px]" aria-hidden="true" />
            Game preview — the playable version loads here soon.
          </p>
        </div>
      </div>
    </div>
  );
}
