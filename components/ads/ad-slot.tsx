import { AdsterraFrame } from "@/components/ads/adsterra-frame";
import { type AdPlacement, buildAdsterraSrcDoc, placementUnits } from "@/lib/ads/adsterra";
import { adsEnabled } from "@/lib/ads/config";
import { cn } from "@/lib/utils";

export type { AdPlacement };

// Fixed dimensions per placement reserve the space up front, so filling a slot later causes no CLS.
// They mirror the unit sizes in lib/ads/adsterra.ts.
const placementStyles: Record<AdPlacement, string> = {
  "home-feed": "h-[50px] w-full max-w-[320px] md:h-[90px] md:max-w-[728px]",
  "game-below-player": "h-[50px] w-full max-w-[320px] md:h-[90px] md:max-w-[728px]",
  "content-inline": "h-[250px] w-full max-w-[300px]",
  sidebar: "hidden h-[300px] w-[160px] lg:flex",
};

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
};

/**
 * Reserved box for one Adsterra banner. While ads are disabled nothing is rendered, so visitors
 * never see empty "Advertisement" boxes and no external script is loaded. `preview` forces a
 * labelled placeholder (no ad request) for the design system page.
 */
export function AdSlot({ placement, className, preview = false }: AdSlotProps & { preview?: boolean }) {
  if (!preview && !adsEnabled()) return null;
  return (
    <aside
      aria-label="Advertisement"
      data-ad-placement={placement}
      className={cn(
        "mx-auto flex items-center justify-center overflow-hidden",
        preview && "rounded-xl border border-dashed bg-surface/50",
        placementStyles[placement],
        className,
      )}
    >
      {preview ? (
        <span className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          Advertisement
        </span>
      ) : (
        <AdsterraFrame
          candidates={placementUnits[placement].map(({ media, unit }) => ({
            media,
            width: unit.width,
            height: unit.height,
            srcDoc: buildAdsterraSrcDoc(unit),
          }))}
        />
      )}
    </aside>
  );
}
