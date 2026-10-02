"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { PageSection } from "@/components/shared/page-section";
import { contentIcons } from "@/lib/icons";
import { filterTools, groupToolsByCategory } from "@/lib/tools/filter";
import { cn } from "@/lib/utils";
import type { IconKey, ToolSummary } from "@/types/content";
import { ToolCard } from "./tool-card";
import { toolAccent } from "./tool-category-style";
import { ToolCategoryTile } from "./tool-category-tile";

export type ExplorerTool = ToolSummary & { tags: string[]; featured: boolean };
export type ExplorerCategory = { slug: string; name: string; iconKey: IconKey };

type ToolsExplorerProps = {
  tools: ExplorerTool[];
  categories: ExplorerCategory[];
};

/** Instant client-side filter plus the browse sections. Nothing is sent to the server while typing. */
export function ToolsExplorer({ tools, categories }: ToolsExplorerProps) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const matches = useMemo(() => filterTools(tools, query), [tools, query]);
  const groups = useMemo(() => groupToolsByCategory(categories, tools), [categories, tools]);
  const featured = useMemo(() => tools.filter((tool) => tool.featured).slice(0, 4), [tools]);

  return (
    <div>
      <div role="search" className="relative pt-3">
        <label htmlFor={inputId} className="sr-only">
          Filter tools
        </label>
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 mt-1.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          placeholder="Filter tools by name, task or category..."
          className="h-11 w-full rounded-xl border border-input bg-surface pr-3 pl-9 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:max-w-xl sm:text-sm"
        />
      </div>

      {trimmed ? (
        <section aria-label="Filter results" className="py-5">
          <p role="status" className="type-muted mb-3 text-sm">
            {matches.length === 0
              ? `No tools match "${trimmed}".`
              : `${matches.length} ${matches.length === 1 ? "tool matches" : "tools match"} "${trimmed}".`}
          </p>
          {matches.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {matches.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          ) : (
            <EmptyState title="No tools found" description="Try a shorter word, or browse the categories below." />
          )}
        </section>
      ) : null}

      <nav aria-label="Tool categories" className="grid grid-cols-2 gap-2 pt-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <ToolCategoryTile
            key={category.slug}
            slug={category.slug}
            name={category.name}
            iconKey={category.iconKey}
            count={tools.filter((tool) => tool.category.slug === category.slug).length}
          />
        ))}
      </nav>

      {!trimmed && featured.length > 0 && (
        <PageSection id="popular" title="Popular tools" className="pt-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} variant="featured" />
            ))}
          </div>
        </PageSection>
      )}

      {!trimmed && (
        <section aria-labelledby="all-tools-heading" className="py-4 sm:py-5">
          <h2 id="all-tools-heading" className="mb-3 text-lg font-bold tracking-tight sm:text-xl">
            All tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ category, tools: categoryTools }) => {
              const Icon = contentIcons[category.iconKey];
              const accent = toolAccent(category.slug);
              return (
                <section
                  key={category.slug}
                  aria-labelledby={`category-${category.slug}`}
                  className="rounded-2xl bg-surface/60 p-3 ring-1 ring-white/5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2 px-1">
                    <h3 id={`category-${category.slug}`} className="flex items-center gap-2 text-sm font-bold">
                      <span className={cn("flex size-7 items-center justify-center rounded-lg", accent.icon)}>
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      {category.name}
                      <span className="type-muted text-xs font-medium">{categoryTools.length}</span>
                    </h3>
                    <Link
                      href={`/tools/${category.slug}`}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      View all<span className="sr-only"> {category.name} tools</span>
                    </Link>
                  </div>
                  <div className="grid gap-1.5">
                    {categoryTools.map((tool) => (
                      <ToolCard key={tool.slug} tool={tool} variant="compact" />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
