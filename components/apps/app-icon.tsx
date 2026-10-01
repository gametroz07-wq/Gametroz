import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AppSummary } from "@/types/content";

export function AppIcon({ app, size = 44, className }: { app: AppSummary; size?: number; className?: string }) {
  if (app.iconUrl) {
    return (
      <Image
        src={app.iconUrl}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={cn("shrink-0 rounded-[22%] object-contain", className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn("flex shrink-0 items-center justify-center rounded-[22%] bg-surface-2 font-bold", className)}
    >
      {app.name.charAt(0)}
    </div>
  );
}
