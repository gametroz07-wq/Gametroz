/**
 * Slugs of the tools that have a working component. components/tools/registry.tsx must provide a
 * component for each of these (enforced by its type), and a test requires every tool in
 * lib/tools/definitions.ts to be listed here, so a tool cannot be defined without a UI.
 */
export const implementedToolSlugs = [
  "word-counter",
  "character-counter",
  "case-converter",
  "remove-duplicate-lines",
  "remove-extra-spaces",
  "text-sorter",
  "slug-generator",
  "json-formatter",
  "base64-encoder-decoder",
  "url-encoder-decoder",
  "timestamp-converter",
  "hash-generator",
  "uuid-generator",
  "password-generator",
  "random-number-generator",
  "qr-code-generator",
  "percentage-calculator",
] as const;

export type ImplementedToolSlug = (typeof implementedToolSlugs)[number];
