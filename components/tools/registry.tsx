import type { ReactElement } from "react";
import type { ImplementedToolSlug } from "@/lib/tools/implemented";
import { JsonFormatterWorkspace } from "./workspaces/json-formatter";
import { PercentageCalculatorWorkspace } from "./workspaces/percentage-calculator";
import { WordCounterWorkspace } from "./workspaces/word-counter";

/**
 * Maps a tool's componentKey (its slug) to the element that renders it. The type forces an entry
 * for every slug in lib/tools/implemented.ts, and a unit test forces that list to cover every tool
 * in lib/tools/definitions.ts, so a tool cannot ship without its UI.
 */
export const toolWorkspaces: Record<ImplementedToolSlug, ReactElement> = {
  "word-counter": <WordCounterWorkspace />,
  "json-formatter": <JsonFormatterWorkspace />,
  "percentage-calculator": <PercentageCalculatorWorkspace />,
};

export function getToolWorkspace(key: string | undefined): ReactElement | undefined {
  return key && Object.hasOwn(toolWorkspaces, key) ? toolWorkspaces[key as ImplementedToolSlug] : undefined;
}
