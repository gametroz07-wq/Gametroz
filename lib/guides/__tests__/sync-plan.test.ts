import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { GuideBlock } from "@/types/content";
import type { GuideDefinition } from "../definitions";
import {
  MAX_ARCHIVES_WITHOUT_CONFIRMATION,
  buildSyncPlan,
  checkArchiveGuard,
  findMissingReferences,
  toGuideRow,
  type ExistingGuideRow,
} from "../sync-plan";

function body(extra: GuideBlock[] = []): GuideBlock[] {
  return [
    { type: "answer", text: "The short answer." },
    { type: "p", text: "Play [Pond](/game/pondhero) with the [JSON](/tool/json-formatter) and [VLC](/app/vlc-media-player)." },
    ...extra,
  ];
}

function definition(slug: string, overrides: Partial<GuideDefinition> = {}): GuideDefinition {
  return {
    slug,
    title: `Title ${slug}`,
    section: "games",
    excerpt: `Excerpt ${slug}`,
    metaTitle: `Title ${slug} | Gametroz`,
    publishedAt: "2026-10-02",
    updatedAt: "2026-10-02",
    body: body(),
    featured: false,
    sortOrder: 0,
    tags: ["b", "a"],
    ...overrides,
  };
}

const existing = (def: GuideDefinition, overrides: Partial<ExistingGuideRow> = {}): ExistingGuideRow => ({ ...toGuideRow(def), ...overrides });

describe("toGuideRow", () => {
  it("derives reading minutes from the body and relations from every reference", () => {
    const row = toGuideRow(
      definition("g", {
        body: body([{ type: "items", refs: [{ kind: "game", slug: "other-game" }, { kind: "app", slug: "vlc-media-player" }] }]),
      }),
    );
    assert.equal(row.readingMinutes, 1);
    assert.deepEqual(row.games, ["pondhero", "other-game"]);
    assert.deepEqual(row.tools, ["json-formatter"]);
    assert.deepEqual(row.apps, ["vlc-media-player"]);
    assert.equal(row.section, "GAMES");
    assert.equal(row.status, "PUBLISHED");
    assert.equal(row.publishedAt, "2026-10-02T00:00:00.000Z");
    assert.equal(row.updatedAt, "2026-10-02T00:00:00.000Z");
  });
});

describe("buildSyncPlan", () => {
  it("creates guides that do not exist", () => {
    const plan = buildSyncPlan({ definitions: [definition("a")], existing: [] });
    assert.deepEqual(plan.create.map((row) => row.slug), ["a"]);
    assert.equal(plan.update.length + plan.unchanged.length + plan.archive.length, 0);
  });

  it("reports unchanged guides, ignoring tag order and JSON key order", () => {
    const def = definition("a");
    const row = existing(def, {
      tags: ["a", "b"],
      body: [
        { text: "The short answer.", type: "answer" },
        { text: "Play [Pond](/game/pondhero) with the [JSON](/tool/json-formatter) and [VLC](/app/vlc-media-player).", type: "p" },
      ] as GuideBlock[],
    });
    const plan = buildSyncPlan({ definitions: [def], existing: [row] });
    assert.deepEqual(plan.unchanged, ["a"]);
    assert.equal(plan.update.length, 0);
  });

  it("lists the changed fields", () => {
    const def = definition("a", { title: "New title", updatedAt: "2026-10-03", body: body([{ type: "p", text: "More." }]), sortOrder: 4 });
    const row = existing(definition("a"));
    const [change] = buildSyncPlan({ definitions: [def], existing: [row] }).update;
    assert.deepEqual([...change.changed].sort(), ["body", "sortOrder", "title", "updatedAt"]);
  });

  it("detects relation changes", () => {
    const def = definition("a", { body: body([{ type: "items", refs: [{ kind: "game", slug: "new-one" }] }]) });
    const [change] = buildSyncPlan({ definitions: [def], existing: [existing(definition("a"))] }).update;
    assert.ok(change.changed.includes("games"));
    assert.ok(change.changed.includes("body"));
  });

  it("re-publishes an archived guide that is defined again", () => {
    const def = definition("a");
    const [change] = buildSyncPlan({ definitions: [def], existing: [existing(def, { status: "ARCHIVED" })] }).update;
    assert.deepEqual(change.changed, ["status"]);
  });

  it("archives published guides that are no longer defined, never archived ones", () => {
    const keep = definition("keep");
    const plan = buildSyncPlan({
      definitions: [keep],
      existing: [
        existing(keep),
        existing(definition("old"), { title: "Old guide" }),
        existing(definition("gone"), { status: "ARCHIVED" }),
      ],
    });
    assert.deepEqual(plan.archive, [{ slug: "old", title: "Old guide" }]);
  });
});

describe("checkArchiveGuard", () => {
  const plan = (count: number) => ({
    create: [],
    update: [],
    unchanged: [],
    archive: Array.from({ length: count }, (_, i) => ({ slug: `g${i}`, title: `G${i}` })),
  });

  it("allows up to the limit and demands confirmation beyond it", () => {
    assert.deepEqual(checkArchiveGuard(plan(MAX_ARCHIVES_WITHOUT_CONFIRMATION), false), { ok: true });
    const blocked = checkArchiveGuard(plan(MAX_ARCHIVES_WITHOUT_CONFIRMATION + 1), false);
    assert.equal(blocked.ok, false);
    assert.deepEqual(checkArchiveGuard(plan(MAX_ARCHIVES_WITHOUT_CONFIRMATION + 1), true), { ok: true });
  });
});

describe("findMissingReferences", () => {
  const universe = {
    games: new Map([
      ["pondhero", "PUBLISHED"],
      ["draft-game", "DRAFT"],
    ]),
    tools: new Set(["json-formatter"]),
    apps: new Set(["vlc-media-player"]),
    pages: new Set(["/games/racing"]),
  };

  it("finds nothing when every reference resolves", () => {
    const defs = [definition("a", { body: body([{ type: "p", text: "See [racing](/games/racing) and [b](/guide/b)." }]) }), definition("b")];
    assert.deepEqual(findMissingReferences(defs, universe), []);
  });

  it("reports missing and unpublished games, undefined tools and apps, unknown pages and guides", () => {
    const defs = [
      definition("a", {
        body: body([
          { type: "items", refs: [{ kind: "game", slug: "nope" }, { kind: "game", slug: "draft-game" }, { kind: "tool", slug: "nope-tool" }, { kind: "app", slug: "nope-app" }] },
          { type: "p", text: "[x](/guide/missing-guide) [y](/games/unknown-category)" },
        ]),
      }),
    ];
    const problems = findMissingReferences(defs, universe).map((problem) => `${problem.guide}:${problem.kind}:${problem.slug}:${problem.reason}`);
    assert.deepEqual(problems.sort(), [
      "a:app:nope-app:not defined",
      "a:game:draft-game:not published (DRAFT)",
      "a:game:nope:not found",
      "a:guide:missing-guide:not defined",
      "a:page:/games/unknown-category:not found",
      "a:tool:nope-tool:not defined",
    ]);
  });
});
