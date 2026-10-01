import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { contentIcons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { ToolSummary } from "@/types/content";
import { toolAccent } from "./tool-category-style";

type ToolCardProps = {
  tool: ToolSummary;
  /** "featured" is taller, with a category-tinted glow. */
  variant?: "default" | "featured" | "compact";
};

export function ToolCard({ tool, variant = "default" }: ToolCardProps) {
  const Icon = contentIcons[tool.iconKey];
  const accent = toolAccent(tool.category.slug);

  if (variant === "compact") {
    return (
      <Link
        href={`/tool/${tool.slug}`}
        className="group/tool flex items-center gap-3 rounded-xl bg-surface p-2.5 ring-1 ring-white/5 transition-colors hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", accent.icon)}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{tool.name}</span>
          <span className={cn("block text-[11px] font-medium", accent.text)}>{tool.category.name}</span>
        </span>
      </Link>
    );
  }

  const featured = variant === "featured";
  return (
    <article
      className={cn(
        "group/tool relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-surface p-4 ring-1 ring-white/5 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-surface-2 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/60",
        featured && "min-h-40 bg-linear-to-br to-transparent to-60% sm:p-5",
        featured && accent.glow,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl transition-transform group-hover/tool:scale-105",
          featured ? "size-12" : "size-10",
          accent.icon,
        )}
      >
        <Icon className={featured ? "size-6" : "size-5"} aria-hidden="true" />
      </span>
      <div className="min-w-0 space-y-1">
        <h3 className={cn("font-semibold", featured ? "text-base sm:text-lg" : "text-[15px]")}>
          <Link href={`/tool/${tool.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
            {tool.name}
          </Link>
        </h3>
        <p className="type-muted line-clamp-2 text-[13px]">{tool.shortDescription}</p>
      </div>
      <p className={cn("mt-auto text-xs font-semibold", accent.text)}>{tool.category.name}</p>
    </article>
  );
}

export function ToolCardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-3 rounded-2xl bg-surface p-4">
      <Skeleton className="size-10 rounded-xl" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
