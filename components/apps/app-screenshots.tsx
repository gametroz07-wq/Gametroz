import { ImageIcon } from "lucide-react";
import { Rail } from "@/components/shared/rail";

/** Screenshot slots with a fixed 16:9 box; real images arrive with verified app data (Phase 8). */
export function AppScreenshots({ appName, count = 3 }: { appName: string; count?: number }) {
  return (
    <Rail label={`${appName} screenshots`} itemClassName="w-[80%] sm:w-[48%] lg:w-[32%] wide:w-[32%]">
      {Array.from({ length: count }, (_, index) => (
        <figure
          key={index}
          className="flex aspect-video flex-col items-center justify-center gap-2 rounded-2xl bg-linear-to-br from-surface-2 to-surface text-muted-foreground"
        >
          <ImageIcon className="size-7" aria-hidden="true" />
          <figcaption className="text-xs">
            {appName} screenshot {index + 1}
          </figcaption>
        </figure>
      ))}
    </Rail>
  );
}
