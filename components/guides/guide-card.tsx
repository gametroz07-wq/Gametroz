import Link from "next/link";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GuideSummary } from "@/types/content";

const sectionLabels: Record<GuideSummary["section"], string> = {
  games: "Games guide",
  tools: "Tools guide",
  apps: "Apps guide",
};

export function GuideCard({ guide, featured = false }: { guide: GuideSummary; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group/guide relative flex flex-col gap-2 rounded-2xl bg-surface p-5 transition-colors hover:bg-surface-2 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/60",
        featured && "overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-brand",
      )}
    >
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {sectionLabels[guide.section]}
      </p>
      <h3 className={cn("line-clamp-2 font-semibold", featured ? "text-lg" : "text-base")}>
        <Link href={`/guide/${guide.slug}`} className="outline-none after:absolute after:inset-0 after:content-['']">
          {guide.title}
        </Link>
      </h3>
      <p className="type-muted line-clamp-2">{guide.excerpt}</p>
      <p className="mt-auto pt-2 text-xs text-muted-foreground">
        <time dateTime={guide.publishedAt}>{formatDate(guide.publishedAt)}</time> · {guide.readingMinutes} min
        read
      </p>
    </article>
  );
}
