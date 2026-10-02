/**
 * Slugs of the tools that have a working component. components/tools/registry.tsx must provide a
 * component for each of these (enforced by its type), and a test requires every tool in
 * lib/tools/definitions.ts to be listed here, so a tool cannot be defined without a UI.
 */
export const implementedToolSlugs = ["word-counter", "json-formatter", "percentage-calculator"] as const;

export type ImplementedToolSlug = (typeof implementedToolSlugs)[number];
