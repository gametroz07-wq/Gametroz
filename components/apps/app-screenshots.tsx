import { ImageIcon } from "lucide-react";
import { Rail } from "@/components/shared/rail";

/** Screenshot slots with a fixed 16:9 box; real images arrive with verified app data (Phase 8). */
export function AppScreenshots({ appName, count = 3 }: { appName: string; count?: number }) {
  return (
    <Rail label={`${appName} screenshots`} itemClassName="w-[78%] sm:w-[46%] lg:w-[32%] wide:w-[32%]">
      {Array.from({ length: count }, (_, index) => (
        <figure
          key={index}
          className="relative flex aspect-video flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-br from-surface-2 via-surface to-surface-2 text-muted-foreground ring-1 ring-white/5"
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-6 items-center gap-1.5 bg-black/20 px-3">
            <span className="size-2 rounded-full bg-rose-400/70" />
            <span className="size-2 rounded-full bg-amber-400/70" />
            <span className="size-2 rounded-full bg-emerald-400/70" />
          </div>
          <ImageIcon className="size-6" aria-hidden="true" />
          <figcaption className="text-xs">
            {appName} screenshot {index + 1}
          </figcaption>
        </figure>
      ))}
    </Rail>
  );
}
