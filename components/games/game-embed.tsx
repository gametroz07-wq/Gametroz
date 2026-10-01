import { cn } from "@/lib/utils";
import type { Game } from "@/types/content";
import { GAME_PLAYER_ID } from "./game-player-placeholder";

/**
 * Sandboxed provider iframe. Never rendered from an unchecked URL and never uses
 * dangerouslySetInnerHTML. Permissions are the minimum HTML5 games need:
 * scripts + same-origin (the game's own origin, not Gametroz's), pointer lock, fullscreen, gamepad.
 * No popups, top navigation, forms or downloads.
 */
export function GameEmbed({ src, title, orientation }: { src: string; title: string; orientation: Game["orientation"] }) {
  const portrait = orientation === "portrait";
  return (
    <div className="overflow-hidden rounded-2xl bg-black sm:rounded-3xl">
      <div
        id={GAME_PLAYER_ID}
        className={cn(
          "relative mx-auto bg-black",
          portrait ? "aspect-[9/16] h-[min(72vh,640px)] max-w-full" : "aspect-video w-full",
        )}
      >
        <iframe
          src={src}
          title={`Play ${title}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          allow="fullscreen; gamepad; autoplay"
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </div>
  );
}
