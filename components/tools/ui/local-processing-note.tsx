import { ShieldCheck } from "lucide-react";

/** Shown only for tools whose definition has localOnly: true. */
export function LocalProcessingNote() {
  return (
    <p className="type-muted flex items-center gap-1.5 text-xs">
      <ShieldCheck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
      Processed locally in your browser.
    </p>
  );
}
