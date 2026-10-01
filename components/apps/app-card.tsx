import { ContentCard } from "@/components/shared/content-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AppSummary, PlatformSlug } from "@/types/content";
import { AppIcon } from "./app-icon";

export const platformLabels: Record<PlatformSlug, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
  android: "Android",
  browser: "Browser",
};

export function AppCard({ app }: { app: AppSummary }) {
  return (
    <ContentCard href={`/app/${app.slug}`} title={app.name} layout="inline" media={<AppIcon app={app} />}>
      <p className="type-muted line-clamp-2">{app.shortDescription}</p>
      <p className="mt-1 text-xs font-medium text-foreground/80">
        <span className="sr-only">Platforms: </span>
        {app.platforms.map((platform) => platformLabels[platform]).join(" · ")}
      </p>
    </ContentCard>
  );
}

export function AppCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex gap-4 rounded-2xl bg-surface p-4">
      <Skeleton className="size-11 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
