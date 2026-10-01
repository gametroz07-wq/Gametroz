import type { GameControl } from "@/types/content";

export function GameControls({ controls }: { controls: GameControl[] }) {
  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {controls.map((control) => (
        <div key={control.input} className="flex items-center justify-between gap-4 rounded-xl bg-surface px-4 py-3">
          <dt className="text-sm font-medium">{control.action}</dt>
          <dd>
            <kbd className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs text-muted-foreground">
              {control.input}
            </kbd>
          </dd>
        </div>
      ))}
    </dl>
  );
}
