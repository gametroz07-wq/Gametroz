import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toolDefinitions } from "../definitions";
import { implementedToolSlugs } from "../implemented";

describe("implemented tool components", () => {
  it("has a registered component for every defined tool", () => {
    const implemented = new Set<string>(implementedToolSlugs);
    const missing = toolDefinitions.filter((tool) => !implemented.has(tool.slug)).map((tool) => tool.slug);
    assert.deepEqual(
      missing,
      [],
      "every definition needs an entry in lib/tools/implemented.ts and components/tools/registry.tsx",
    );
  });

  it("does not register components for tools that are not defined", () => {
    const defined = new Set(toolDefinitions.map((tool) => tool.slug));
    assert.deepEqual(
      implementedToolSlugs.filter((slug) => !defined.has(slug)),
      [],
    );
  });
});
