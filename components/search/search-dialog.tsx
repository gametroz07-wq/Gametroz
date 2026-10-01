"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trendingSearches } from "@/lib/site";
import { SearchInput } from "./search-input";

type SearchDialogProps = {
  variant?: "bar" | "icon";
  // Only one instance per page should own the Ctrl/Cmd+K shortcut.
  enableShortcut?: boolean;
};

export function SearchDialog({ variant = "bar", enableShortcut = false }: SearchDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enableShortcut) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableShortcut]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "bar" ? (
          <button
            type="button"
            className="flex h-9 w-56 items-center gap-2 rounded-xl border border-input bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-ring/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none lg:w-72"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="rounded border bg-muted px-1.5 font-mono text-[11px]">Ctrl K</kbd>
          </button>
        ) : (
          <Button type="button" variant="ghost" size="icon" aria-label="Search">
            <Search aria-hidden="true" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="top-4 translate-y-0 gap-5 sm:top-[15%] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Search Gametroz</DialogTitle>
          <DialogDescription>Find games, tools, apps and guides.</DialogDescription>
        </DialogHeader>
        <SearchInput autoFocus onSubmit={() => setOpen(false)} />
        <section aria-labelledby="trending-searches">
          <h3 id="trending-searches" className="type-muted mb-2 font-medium">
            Trending
          </h3>
          <ul className="flex flex-wrap gap-2">
            {trendingSearches.map((term) => (
              <li key={term}>
                <Link
                  href={`/search?q=${encodeURIComponent(term)}`}
                  onClick={() => setOpen(false)}
                  className="inline-flex rounded-full border px-3 py-1 text-sm hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {term}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  );
}
