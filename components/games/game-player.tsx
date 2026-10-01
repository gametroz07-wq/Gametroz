import type { Game } from "@/types/content";
import { resolveEmbedUrl } from "@/lib/providers/embed";
import { GameEmbed } from "./game-embed";
import { GamePlayerPlaceholder } from "./game-player-placeholder";

/** Placeholder by default; the real iframe only when GAME_EMBEDS_ENABLED=true and the URL is allowlisted. */
export function GamePlayer({ game }: { game: Game }) {
  const embedUrl = resolveEmbedUrl(game);
  return embedUrl ? (
    <GameEmbed src={embedUrl} title={game.name} orientation={game.orientation} />
  ) : (
    <GamePlayerPlaceholder game={game} />
  );
}
