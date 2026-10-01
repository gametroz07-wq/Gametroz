import { Search } from "lucide-react";
import Form from "next/form";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  size?: "default" | "lg";
  placeholder?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  showSubmit?: boolean;
  className?: string;
  onSubmit?: () => void;
};

// GET form to /search with client-side navigation (next/form). Results are mock until Phase 6.
export function SearchInput({
  size = "default",
  placeholder = "Search games, tools and apps...",
  defaultValue,
  autoFocus,
  showSubmit = false,
  className,
  onSubmit,
}: SearchInputProps) {
  const inputId = useId();
  const large = size === "lg";

  return (
    <Form
      role="search"
      action="/search"
      onSubmit={onSubmit}
      className={cn("flex w-full items-center gap-2", className)}
    >
      <div className="relative flex-1">
        <label htmlFor={inputId} className="sr-only">
          Search Gametroz
        </label>
        <Search
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground",
            large ? "size-5" : "size-4",
          )}
        />
        <input
          id={inputId}
          type="search"
          name="q"
          autoComplete="off"
          enterKeyHint="search"
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          className={cn(
            "w-full min-w-0 rounded-xl border border-input bg-surface text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            large ? "h-12 pr-4 pl-11 text-base" : "h-10 pr-3 pl-9 text-base sm:text-sm",
          )}
        />
      </div>
      {showSubmit && (
        <Button type="submit" variant="brand" className={large ? "h-12 px-5" : "h-10 px-4"}>
          Search
        </Button>
      )}
    </Form>
  );
}
