import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appCategoryDefinitions, appDefinitions, platformDefinitions } from "@/lib/apps/definitions";
import { toolCategoryDefinitions, toolDefinitions } from "@/lib/tools/definitions";
import type { GuideBlock } from "@/types/content";
import { countWords, extractPageLinks, extractReferences, parseInlineLinks, validateBlocks } from "../blocks";
import { guideDefinitions } from "../definitions";
import { gameNames } from "../content/game-links";

const gamesGuides = guideDefinitions.filter((guide) => guide.section === "games");
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

// Listing pages a guide may link to. Game categories live in the database; these are the seeded slugs.
const gameCategorySlugs = ["action", "adventure", "arcade", "casual", "puzzle", "racing", "sports", "strategy"];
const validPages = new Set([
  ...gameCategorySlugs.map((slug) => `/games/${slug}`),
  ...toolCategoryDefinitions.map((category) => `/tools/${category.slug}`),
  ...platformDefinitions.map((platform) => `/apps/${platform.slug}`),
  ...appCategoryDefinitions.map((category) => `/apps/category/${category.slug}`),
  "/guides/games",
  "/guides/tools",
  "/guides/apps",
]);

function textsOf(blocks: GuideBlock[]): string[] {
  return blocks.flatMap((block) => {
    switch (block.type) {
      case "ul":
      case "ol":
      case "steps":
        return block.items;
      case "table":
        return [block.caption, ...block.header, ...block.rows.flat()];
      case "items":
        return block.title ? [block.title] : [];
      case "note":
        return [block.title ?? "", block.text];
      default:
        return [block.text];
    }
  });
}

describe("guide definitions", () => {
  it("defines 29 guides: 10 games, 10 tools and 9 software guides", () => {
    assert.equal(guideDefinitions.length, 29);
    assert.equal(gamesGuides.length, 10);
    assert.equal(guideDefinitions.filter((guide) => guide.section === "tools").length, 10);
    assert.equal(guideDefinitions.filter((guide) => guide.section === "apps").length, 9);
    assert.ok(!guideDefinitions.some((guide) => guide.slug === "how-to-install-vlc"));
  });

  it("has unique slugs, titles, sort orders and excerpts", () => {
    for (const field of ["slug", "title", "sortOrder", "excerpt"] as const) {
      const values = guideDefinitions.map((guide) => guide[field]);
      assert.equal(new Set(values).size, values.length, `duplicate ${field}`);
    }
  });

  it("keeps meta fields within limits", () => {
    for (const guide of guideDefinitions) {
      assert.ok(guide.excerpt.length >= 120 && guide.excerpt.length <= 158, `${guide.slug} excerpt is ${guide.excerpt.length} characters`);
      assert.ok(guide.metaTitle.endsWith(" | Gametroz"), `${guide.slug} metaTitle must end with " | Gametroz"`);
      assert.ok(guide.metaTitle.length <= 60, `${guide.slug} metaTitle is ${guide.metaTitle.length} characters`);
      assert.ok(isoDate.test(guide.publishedAt) && isoDate.test(guide.updatedAt), `${guide.slug} dates must be ISO`);
      assert.ok(guide.updatedAt >= guide.publishedAt, `${guide.slug} updatedAt precedes publishedAt`);
    }
  });

  it("dates every new or rewritten games guide 2026-10-02", () => {
    for (const guide of gamesGuides) {
      assert.equal(guide.publishedAt, "2026-10-02", guide.slug);
      assert.equal(guide.updatedAt, "2026-10-02", guide.slug);
    }
  });

  it("has valid bodies", () => {
    for (const guide of guideDefinitions) {
      assert.deepEqual(validateBlocks(guide.body), [], guide.slug);
    }
  });

  it("only links to defined tools, apps, guides, games categories and listing pages", () => {
    const tools = new Set(toolDefinitions.map((tool) => tool.slug));
    const apps = new Set(appDefinitions.map((app) => app.slug));
    const guides = new Set(guideDefinitions.map((guide) => guide.slug));
    for (const guide of guideDefinitions) {
      const references = extractReferences(guide.body);
      for (const slug of references.tools) assert.ok(tools.has(slug), `${guide.slug}: unknown tool ${slug}`);
      for (const slug of references.apps) assert.ok(apps.has(slug), `${guide.slug}: unknown app ${slug}`);
      for (const slug of references.guides) assert.ok(guides.has(slug), `${guide.slug}: unknown guide ${slug}`);
      for (const page of extractPageLinks(guide.body)) assert.ok(validPages.has(page), `${guide.slug}: unknown page ${page}`);
    }
  });

  it("keeps the section of every ported guide consistent with its references", () => {
    for (const guide of guideDefinitions.filter((entry) => entry.section !== "games")) {
      const references = extractReferences(guide.body);
      assert.ok(guide.section === "tools" ? references.tools.length > 0 : references.apps.length > 0, guide.slug);
    }
  });
});

describe("games guides", () => {
  it("open with a short answer and have at least three sections", () => {
    for (const guide of gamesGuides) {
      assert.equal(guide.body[0].type, "answer", guide.slug);
      assert.ok(guide.body.filter((block) => block.type === "h2").length >= 3, `${guide.slug} needs 3+ h2 sections`);
    }
  });

  it("are 600 to 1100 words long", () => {
    for (const guide of gamesGuides) {
      const words = countWords(guide.body);
      assert.ok(words >= 600 && words <= 1100, `${guide.slug} has ${words} words`);
    }
  });

  it("reference at least six games, and every linked game also appears as a card", () => {
    for (const guide of gamesGuides) {
      const linked = new Set<string>();
      for (const text of textsOf(guide.body)) {
        for (const segment of parseInlineLinks(text).segments) {
          if (segment.type === "link" && segment.href.startsWith("/game/")) linked.add(segment.href.slice("/game/".length));
        }
      }
      const carded = new Set(guide.body.flatMap((block) => (block.type === "items" ? block.refs.filter((ref) => ref.kind === "game").map((ref) => ref.slug) : [])));
      assert.ok(carded.size >= 6, `${guide.slug} shows ${carded.size} game cards`);
      for (const slug of linked) assert.ok(carded.has(slug), `${guide.slug}: ${slug} is linked but has no card`);
      for (const slug of carded) assert.ok(linked.has(slug), `${guide.slug}: ${slug} has a card but is never linked`);
    }
  });

  it("only mention games from the known name list, with matching link labels", () => {
    for (const guide of gamesGuides) {
      for (const text of textsOf(guide.body)) {
        for (const segment of parseInlineLinks(text).segments) {
          if (segment.type !== "link" || !segment.href.startsWith("/game/")) continue;
          const slug = segment.href.slice("/game/".length) as keyof typeof gameNames;
          assert.equal(segment.label, gameNames[slug], `${guide.slug}: label for ${slug}`);
        }
      }
    }
  });

  it("avoid third-party brands", () => {
    const brands = /minecraft|roblox|squid|among ?us|poppy|skibidi|gta|mario|brainrot|obby|sonic|pokemon|fortnite|subway surfers|angry birds/i;
    for (const [slug, name] of Object.entries(gameNames)) {
      assert.ok(!brands.test(`${slug} ${name}`), `${slug} looks like a third-party brand`);
    }
  });

  it("make no invented experience, rating or audience claims", () => {
    const banned = /we tested|we played|we tried|hours of play|our team|our testers|our favorite|we love|\brated\b|\bstars?\b|millions|thousands of players|best-selling|since \d{4}/i;
    for (const guide of gamesGuides) {
      for (const text of textsOf(guide.body)) assert.ok(!banned.test(text), `${guide.slug}: "${text.slice(0, 80)}"`);
    }
  });

  it("state how best-of lists were picked", () => {
    const lists = gamesGuides.filter((guide) => guide.slug.startsWith("best-"));
    assert.equal(lists.length, 7);
    for (const guide of lists) {
      const text = textsOf(guide.body).join(" ");
      assert.match(text, /popularity rankings/i, guide.slug);
      assert.match(text, /not a test result/i, guide.slug);
    }
  });

  it("keeps the slugs the site already used and drops the replaced puzzle guide", () => {
    const slugs = new Set(guideDefinitions.map((guide) => guide.slug));
    assert.ok(slugs.has("best-racing-games-online"));
    assert.ok(slugs.has("how-to-play-games-in-fullscreen"));
    assert.ok(!slugs.has("puzzle-games-for-beginners"));
    assert.ok(slugs.has("best-puzzle-games-online"));
  });
});

describe("tools and software guides", () => {
  const other = guideDefinitions.filter((guide) => guide.section !== "games");

  it("open with a short answer, have 3+ sections and are 600 to 1100 words", () => {
    for (const guide of other) {
      assert.equal(guide.body[0].type, "answer", guide.slug);
      assert.ok(guide.body.filter((block) => block.type === "h2").length >= 3, `${guide.slug} needs 3+ h2 sections`);
      const words = countWords(guide.body);
      assert.ok(words >= 600 && words <= 1100, `${guide.slug} has ${words} words`);
    }
  });

  it("show their recommended tools or apps as cards and link at least three catalog items", () => {
    for (const guide of other) {
      const references = extractReferences(guide.body);
      assert.ok(guide.body.some((block) => block.type === "items"), `${guide.slug} has no items block`);
      assert.ok(references.tools.length + references.apps.length >= 3, `${guide.slug} links too few catalog items`);
    }
  });

  it("make no invented experience, rating or audience claims", () => {
    const banned = /we tested|we played|we tried|hours of use|our team|our testers|our favorite|we love|rated|stars?|millions|best-selling|since \d{4}/i;
    for (const guide of other) {
      for (const text of textsOf(guide.body)) assert.ok(!banned.test(text), `${guide.slug}: "${text.slice(0, 80)}"`);
    }
  });

  it("state how software roundups were picked", () => {
    for (const guide of other.filter((entry) => entry.section === "apps" && entry.slug.startsWith("best-"))) {
      assert.match(textsOf(guide.body).join(" "), /not a (?:ranking|test result)/i, guide.slug);
    }
  });
});
