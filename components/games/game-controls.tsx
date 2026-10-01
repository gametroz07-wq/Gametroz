import type { GameControl } from "@/types/content";

export function GameControls({ controls }: { controls: GameControl[] }) {
  return (
    <dl className="grid gap-1.5">
      {controls.map((control) => (
        <div key={control.input} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg bg-surface-2 px-3 py-2">
          <dt className="text-sm font-medium">{control.action}</dt>
          <dd>
            <kbd className="rounded-md bg-background px-2 py-1 font-mono text-[11px] whitespace-nowrap text-muted-foreground ring-1 ring-white/10">
              {control.input}
            </kbd>
          </dd>
        </div>
      ))}
    </dl>
  );
}
