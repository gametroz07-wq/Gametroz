import { ContentCard } from "@/components/shared/content-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { contentIcons } from "@/lib/icons";
import type { ToolSummary } from "@/types/content";

export function ToolCard({ tool }: { tool: ToolSummary }) {
  const Icon = contentIcons[tool.iconKey];

  return (
    <ContentCard
      href={`/tool/${tool.slug}`}
      title={tool.name}
      layout="inline"
      media={
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-violet-300">
          <Icon className="size-5" aria-hidden="true" />
        </div>
      }
    >
      <p className="type-muted line-clamp-2">{tool.shortDescription}</p>
      <Badge variant="secondary" className="mt-1">
        {tool.category.name}
      </Badge>
    </ContentCard>
  );
}

export function ToolCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex gap-4 rounded-2xl bg-surface p-4">
      <Skeleton className="size-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
    </div>
  );
}
