import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { ToolField, ToolTextArea } from "./tool-field";

type ToolOutputProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  className?: string;
  /** Extra classes for the text area, e.g. a fixed height. */
  areaClassName?: string;
};

/** Read-only result block with a Copy button. */
export function ToolOutput({ id, label, value, placeholder, className, areaClassName }: ToolOutputProps) {
  return (
    <ToolField id={id} label={label} actions={<CopyButton value={value} />} className={className}>
      <ToolTextArea
        id={id}
        value={value}
        readOnly
        placeholder={placeholder}
        spellCheck={false}
        className={cn("bg-surface-2/40 font-mono text-sm", areaClassName)}
      />
    </ToolField>
  );
}
