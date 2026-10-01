import { cn } from "@/lib/utils";

export type AdPlacement = "home-feed" | "game-below-player" | "sidebar" | "content-inline";

// Fixed dimensions per placement reserve the space up front, so filling a slot later causes no CLS.
const placementStyles: Record<AdPlacement, string> = {
  "home-feed": "h-[100px] w-full max-w-[728px] md:h-[90px]",
  "game-below-player": "h-[100px] w-full max-w-[728px] md:h-[90px]",
  "content-inline": "h-[280px] w-full max-w-[336px]",
  sidebar: "hidden h-[600px] w-[300px] lg:flex",
};

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
};

/**
 * Placeholder only. No ad network or external script is loaded until the monetization
 * phase; the provider will render inside this reserved box.
 */
export function AdSlot({ placement, className }: AdSlotProps) {
  return (
    <aside
      aria-label="Advertisement"
      data-ad-placement={placement}
      className={cn(
        "mx-auto flex items-center justify-center rounded-xl border border-dashed bg-surface/50",
        placementStyles[placement],
        className,
      )}
    >
      <span className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
        Advertisement
      </span>
    </aside>
  );
}
