import Link from "next/link";
import { cn } from "@/lib/utils";

type ContentCardProps = {
  href: string;
  title: string;
  media?: React.ReactNode;
  layout?: "stacked" | "inline";
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
  children?: React.ReactNode;
};

/**
 * Base card for every content type. The title link is stretched over the whole card,
 * so the card is one click target while keeping a single, readable link for screen readers.
 * Stacked cards (games) are borderless so the artwork carries the design.
 */
export function ContentCard({
  href,
  title,
  media,
  layout = "stacked",
  headingLevel: Heading = "h3",
  className,
  children,
}: ContentCardProps) {
  return (
    <article
      className={cn(
        "group/card relative flex rounded-2xl has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/60",
        layout === "stacked"
          ? "flex-col gap-2"
          : "items-start gap-4 bg-surface p-4 transition-colors hover:bg-surface-2",
        className,
      )}
    >
      {media}
      <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", layout === "stacked" && "px-1")}>
        <Heading className="line-clamp-2 text-sm leading-snug font-semibold sm:text-[15px]">
          <Link href={href} className="outline-none after:absolute after:inset-0 after:content-['']">
            {title}
          </Link>
        </Heading>
        {children}
      </div>
    </article>
  );
}
