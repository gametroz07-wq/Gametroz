import Link from "next/link";

export function TagList({ tags, label = "Tags" }: { tags: string[]; label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="inline-flex rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
