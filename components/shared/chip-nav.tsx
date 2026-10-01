import Link from "next/link";
import { contentIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { IconKey } from "@/types/content";

export type ChipItem = {
  label: string;
  href: string;
  iconKey?: IconKey;
  active?: boolean;
};

type ChipNavProps = {
  label: string;
  items: ChipItem[];
  // "scroll" keeps one row on mobile; "wrap" shows every chip.
  layout?: "scroll" | "wrap";
  className?: string;
};

export function ChipNav({ label, items, layout = "scroll", className }: ChipNavProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul
        className={cn(
          "flex gap-2",
          layout === "scroll"
            ? "-mx-4 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0"
            : "flex-wrap",
        )}
      >
        {items.map((item) => {
          const Icon = item.iconKey ? contentIcons[item.iconKey] : null;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full bg-surface px-3.5 text-sm font-medium ring-1 ring-white/5 transition-colors hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  item.active && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {Icon && <Icon className="size-4" aria-hidden="true" />}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
