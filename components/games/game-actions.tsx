"use client";

import { Heart, Maximize, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GameActionsProps = {
  playerId: string;
  gameName: string;
};

/** Real buttons only: each one does something now (no fake controls), persistence comes later. */
export function GameActions({ playerId, gameName }: GameActionsProps) {
  const [favorite, setFavorite] = useState(false);
  const [status, setStatus] = useState("");

  async function enterFullscreen() {
    const player = document.getElementById(playerId);
    try {
      await player?.requestFullscreen();
    } catch {
      setStatus("Fullscreen is not available in this browser.");
    }
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: gameName, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("Link copied to clipboard.");
    } catch {
      // The user closed the share sheet; nothing to report.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="secondary" size="lg" onClick={enterFullscreen}>
        <Maximize aria-hidden="true" />
        Fullscreen
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        aria-pressed={favorite}
        onClick={() => {
          setFavorite(!favorite);
          setStatus(favorite ? "Removed from favorites." : "Added to favorites.");
        }}
      >
        <Heart aria-hidden="true" className={cn(favorite && "fill-rose-500 text-rose-500")} />
        {favorite ? "Favorited" : "Favorite"}
      </Button>
      <Button type="button" variant="secondary" size="lg" onClick={share}>
        <Share2 aria-hidden="true" />
        Share
      </Button>
      <p role="status" className="type-muted min-h-5 w-full sm:w-auto">
        {status}
      </p>
    </div>
  );
}
