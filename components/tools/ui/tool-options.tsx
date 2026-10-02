"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type ToggleOptionProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
};

/** Compact labelled checkbox for tool options. */
export function ToggleOption({ label, checked, onChange, hint, disabled }: ToggleOptionProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      title={hint}
      className="flex min-h-9 cursor-pointer items-center has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 gap-2 rounded-lg border border-input bg-background px-3 text-sm has-[:checked]:border-brand-strong/50 has-[:checked]:bg-surface-2 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-brand-strong"
      />
      {label}
    </label>
  );
}

type ToolSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
};

/** Labelled native select, styled like the other tool controls. */
export function ToolSelect({ label, value, onChange, options, className }: ToolSelectProps) {
  const id = useId();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={id} className="type-small">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 min-w-0 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Short result line (counts, removed items). Announced politely to screen readers. */
export function ToolSummary({ children }: { children?: React.ReactNode }) {
  return (
    <p role="status" aria-live="polite" className="type-muted min-h-5 text-sm">
      {children}
    </p>
  );
}

type ToolSegmentedProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
};

/** Small mode switcher (Encode / Decode...). A labelled group of toggle buttons. */
export function ToolSegmented<T extends string>({ label, value, onChange, options }: ToolSegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl border border-input bg-background p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 rounded-lg px-3.5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active ? "bg-surface-2 text-foreground shadow-sm ring-1 ring-brand-strong/50" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
