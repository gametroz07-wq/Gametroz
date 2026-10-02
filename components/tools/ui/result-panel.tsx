import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

type ResultBannerProps = {
  value: string;
  caption?: string;
  /** Text placed on the clipboard by the Copy button; omit to hide it. */
  copyValue?: string;
};

/** The highlighted answer of a calculator or converter, announced politely to screen readers. */
export function ResultBanner({ value, caption, copyValue }: ResultBannerProps) {
  return (
    <div aria-live="polite" className="flex min-h-16 items-center justify-between gap-3 rounded-xl bg-brand-strong px-4 py-3 text-white">
      <div className="min-w-0">
        <p className="text-xl font-bold tabular-nums break-words sm:text-2xl">{value}</p>
        {caption && <p className="text-xs text-white/85">{caption}</p>}
      </div>
      {copyValue && <CopyButton value={copyValue} className="shrink-0 border-white/30 bg-white/10 text-white hover:bg-white/20" />}
    </div>
  );
}

export type ResultRow = { label: string; value: string; strong?: boolean };

/** Label and value pairs, for the breakdown under a result. */
export function ResultRows({ rows, label }: { rows: ResultRow[]; label: string }) {
  return (
    <dl aria-label={label} className="divide-y divide-white/5 rounded-xl bg-surface-2/40 ring-1 ring-white/5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4 px-4 py-2.5 text-sm">
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className={cn("text-right tabular-nums", row.strong ? "font-bold" : "font-medium")}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A titled card used when one tool holds several independent calculations. */
export function ToolPanel({ title, actions, children }: { title: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section aria-label={title} className="space-y-3 rounded-2xl bg-surface-2/50 p-4 ring-1 ring-white/5">
      <div className="flex min-h-8 items-center justify-between gap-2">
        <h3 className="text-sm font-bold">{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}

/** Short explanatory text under a result. */
export function ToolNote({ children }: { children: React.ReactNode }) {
  return <p className="type-muted text-sm">{children}</p>;
}

export const nativeControlClass =
  "h-11 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
