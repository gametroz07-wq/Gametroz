import type { Tool } from "@/types/content";
import { getToolWorkspace } from "./registry";

/** Resolves a tool's componentKey (its slug) to its UI through the registry. */
export function ToolWorkspace({ tool }: { tool: Pick<Tool, "name" | "componentKey"> }) {
  const workspace = getToolWorkspace(tool.componentKey);
  // Defensive only: sync guarantees a component for every published tool.
  if (!workspace) {
    return (
      <p role="status" className="type-muted rounded-xl border border-dashed border-input px-4 py-8 text-center">
        This tool is not available yet.
      </p>
    );
  }
  return workspace;
}
