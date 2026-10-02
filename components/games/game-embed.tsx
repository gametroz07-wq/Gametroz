import { GAME_IFRAME_ALLOW, GAME_IFRAME_SANDBOX } from "@/lib/providers/embed";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/content";
import { GAME_PLAYER_ID } from "./game-player-placeholder";

/**
 * Sandboxed provider iframe. Only rendered from a URL that passed resolveEmbedUrl (flag + host
 * allowlist); never uses dangerouslySetInnerHTML. The wrapper keeps the aspect ratio (no CLS) and is
 * the element GameActions sends to fullscreen. Sandbox and permissions: lib/providers/embed.ts.
 */
export function GameEmbed({ src, title, orientation }: { src: string; title: string; orientation: Game["orientation"] }) {
  const portrait = orientation === "portrait";
  return (
    <div className="overflow-hidden rounded-2xl bg-black ring-1 ring-white/5">
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
          // The player is the main content above the fold, so it loads immediately.
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox={GAME_IFRAME_SANDBOX}
          allow={GAME_IFRAME_ALLOW}
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </div>
  );
}
