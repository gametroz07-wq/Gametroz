import { cn } from "@/lib/utils";

const controlClass =
  "w-full rounded-xl border border-input bg-background text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

type ToolFieldProps = {
  /** Id of the control inside; the message ids derive from it. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Right-aligned slot next to the label (copy, reset...). */
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

/** Label, control and message in one place, so every tool shows errors the same way. */
export function ToolField({ id, label, hint, error, actions, className, children }: ToolFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex min-h-8 items-center justify-between gap-2">
        <label htmlFor={id} className="type-small font-medium">
          {label}
        </label>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>
      {children}
      {error ? (
        <p id={`${id}-message`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-message`} className="type-muted text-xs">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

type ControlProps<T> = Omit<T, "id" | "aria-invalid"> & { id: string; invalid?: boolean; hasMessage?: boolean };

export function ToolTextArea({
  invalid,
  hasMessage,
  className,
  ...props
}: ControlProps<React.ComponentProps<"textarea">>) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      aria-describedby={invalid || hasMessage ? `${props.id}-message` : undefined}
      className={cn(controlClass, "min-h-40 resize-y p-4 text-base leading-relaxed sm:text-[15px]", className)}
      {...props}
    />
  );
}

export function ToolInput({ invalid, hasMessage, className, ...props }: ControlProps<React.ComponentProps<"input">>) {
  return (
    <input
      aria-invalid={invalid || undefined}
      aria-describedby={invalid || hasMessage ? `${props.id}-message` : undefined}
      className={cn(controlClass, "h-11 px-3.5 text-base tabular-nums", className)}
      {...props}
    />
  );
}
