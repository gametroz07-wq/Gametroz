import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { isOpenSourceLicense } from "@/lib/app-license";
import { cn } from "@/lib/utils";
import type { App } from "@/types/content";
import { AppIcon } from "./app-icon";
import { OpenSourceBadge, PlatformBadges } from "./platform-badges";

export { platformLabels } from "./platform-badges";

type AppCardProps = {
  app: App;
  variant?: "default" | "featured";
};

/** Software-marketplace card: big icon, name, publisher, category, platforms and a short pitch. */
export function AppCard({ app, variant = "default" }: AppCardProps) {
  const featured = variant === "featured";
  return (
    <article
      className={cn(
        "group/app relative flex flex-col gap-3 rounded-2xl bg-surface p-4 ring-1 ring-white/5 transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-surface-2 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/60",
        featured && "sm:p-5",
      )}
    >
      <div className="flex items-center gap-3">
        <AppIcon app={app} size={featured ? 60 : 52} className="shadow-md shadow-black/30" />
        <div className="min-w-0">
          <h3 className={cn("truncate font-semibold", featured ? "text-lg" : "text-[15px]")}>
            <Link href={`/app/${app.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
              {app.name}
            </Link>
          </h3>
          <p className="type-muted truncate text-[13px]">{app.publisher}</p>
          <p className="truncate text-xs font-medium text-foreground/70">{app.category.name}</p>
        </div>
      </div>
      <p className="type-muted line-clamp-2 text-[13px]">{app.shortDescription}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1">
        {isOpenSourceLicense(app.license) && <OpenSourceBadge />}
        <PlatformBadges platforms={app.platforms} />
      </div>
    </article>
  );
}

export function AppCardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-3 rounded-2xl bg-surface p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-13 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
