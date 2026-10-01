import { cn } from "@/lib/utils";
import type { PlatformSlug } from "@/types/content";

export const platformLabels: Record<PlatformSlug, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
  android: "Android",
  browser: "Browser",
};

export function PlatformBadges({ platforms, className }: { platforms: PlatformSlug[]; className?: string }) {
  return (
    <ul aria-label="Platforms" className={cn("flex flex-wrap gap-1", className)}>
      {platforms.map((platform) => (
        <li
          key={platform}
          className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-white/5"
        >
          {platformLabels[platform]}
        </li>
      ))}
    </ul>
  );
}

export function OpenSourceBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300",
        className,
      )}
    >
      Open source
    </span>
  );
}
