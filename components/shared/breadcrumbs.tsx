import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbTrail } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  /** Canonical path of the current page. When set, the same trail is emitted as BreadcrumbList JSON-LD. */
  path?: string;
};

export function Breadcrumbs({ items, className, path }: BreadcrumbsProps) {
  const trail = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      {path && <JsonLd data={breadcrumbTrail(items, path)} />}
      <nav aria-label="Breadcrumb" className={cn("text-sm text-muted-foreground", className)}>
        <ol className="flex flex-wrap items-center gap-1">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="rounded-sm transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined} className="truncate text-foreground">
                    {item.label}
                  </span>
                )}
                {!isLast && <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
