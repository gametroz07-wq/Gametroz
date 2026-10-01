import Link from "next/link";
import { contentIcons } from "@/lib/icons";
import type { CategorySummary } from "@/types/content";

export function CategoryCard({ category }: { category: CategorySummary }) {
  const Icon = contentIcons[category.iconKey];

  return (
    <Link
      href={category.href}
      className="group/category flex items-center gap-3 rounded-2xl bg-surface p-3 transition-colors hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 transition-colors group-hover/category:bg-primary/15">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{category.name}</span>
        {category.itemCount !== undefined && (
          <span className="type-muted block text-xs">
            {category.itemCount} {category.itemLabel ?? "items"}
          </span>
        )}
      </span>
    </Link>
  );
}
