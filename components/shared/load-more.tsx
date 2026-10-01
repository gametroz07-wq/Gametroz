"use client";

import { Children, useState } from "react";
import { Button } from "@/components/ui/button";

type LoadMoreProps = {
  initial: number;
  step: number;
  className?: string;
  itemLabel?: string;
  children: React.ReactNode;
};

/** Reveals pre-rendered items in steps. Real pagination arrives with the database (Phase 3+). */
export function LoadMore({ initial, step, className, itemLabel = "items", children }: LoadMoreProps) {
  const items = Children.toArray(children);
  const [visible, setVisible] = useState(initial);
  const shown = Math.min(visible, items.length);

  return (
    <div>
      <div className={className}>{items.slice(0, shown)}</div>
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="type-muted" aria-live="polite">
          Showing {shown} of {items.length} {itemLabel}
        </p>
        {shown < items.length && (
          <Button type="button" variant="outline" size="lg" onClick={() => setVisible(shown + step)}>
            Load more
          </Button>
        )}
      </div>
    </div>
  );
}
