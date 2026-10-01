import { Hammer } from "lucide-react";
import type { Tool } from "@/types/content";
import { ImageConverterWorkspace } from "./workspaces/image-converter";
import { JsonFormatterWorkspace } from "./workspaces/json-formatter";
import { PercentageCalculatorWorkspace } from "./workspaces/percentage-calculator";
import { WordCounterWorkspace } from "./workspaces/word-counter";

/** Resolves a tool's componentKey to its UI (the Phase 7 tools engine keeps this contract). */
export function ToolWorkspace({ tool }: { tool: Tool }) {
  switch (tool.componentKey) {
    case "word-counter":
      return <WordCounterWorkspace />;
    case "json-formatter":
      return <JsonFormatterWorkspace />;
    case "image-converter":
      return <ImageConverterWorkspace toolName={tool.name} />;
    case "percentage-calculator":
      return <PercentageCalculatorWorkspace />;
    default:
      return (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-input px-6 py-10 text-center">
          <Hammer className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="font-semibold">{tool.name} is being built</p>
          <p className="type-muted max-w-sm">
            This tool will run right here in your browser. Try one of the related tools below in the
            meantime.
          </p>
        </div>
      );
  }
}
