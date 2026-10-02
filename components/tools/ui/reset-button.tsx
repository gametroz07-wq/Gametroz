import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ResetButtonProps = {
  onReset: () => void;
  label?: string;
  disabled?: boolean;
};

export function ResetButton({ onReset, label = "Reset", disabled }: ResetButtonProps) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>
      <RotateCcw aria-hidden="true" />
      {label}
    </Button>
  );
}
