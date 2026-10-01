import Link from "next/link";
import { contentIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { IconKey } from "@/types/content";
import { toolAccent } from "./tool-category-style";

type ToolCategoryTileProps = {
  slug: string;
  name: string;
  iconKey: IconKey;
  count: number;
  active?: boolean;
};

export function ToolCategoryTile({ slug, name, iconKey, count, active }: ToolCategoryTileProps) {
  const Icon = contentIcons[iconKey];
  const accent = toolAccent(slug);
  return (
    <Link
      href={`/tools/${slug}`}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-xl bg-surface p-2.5 ring-1 ring-white/5 transition-colors hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
        active && "bg-surface-2 ring-primary/50",
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", accent.icon)}>
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{name}</span>
        <span className="type-muted block text-[11px]">{count} tools</span>
      </span>
    </Link>
  );
}
