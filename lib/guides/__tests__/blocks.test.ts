import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { GuideBlock } from "@/types/content";
import {
  countWords,
  extractPageLinks,
  extractReferences,
  isAllowedInternalPath,
  parseInlineLinks,
  plainText,
  readingMinutes,
  validateBlocks,
} from "../blocks";

const valid: GuideBlock[] = [
  { type: "answer", text: "Short answer. It has two sentences." },
  { type: "h2", text: "Section" },
  { type: "p", text: "Text with a [link](/game/pondhero) inside." },
  { type: "h3", text: "Sub section" },
  { type: "ul", items: ["One", "Two [tool](/tool/json-formatter)"] },
  { type: "ol", items: ["First", "Second"] },
  { type: "steps", items: ["Do this", "Then that"] },
  { type: "table", caption: "Comparison", header: ["Game", "Type"], rows: [["[A](/game/a)", "2D"]] },
  { type: "items", title: "Picks", refs: [{ kind: "game", slug: "pondhero" }, { kind: "tool", slug: "json-formatter" }] },
  { type: "note", title: "Tip", text: "A note." },
];

describe("isAllowedInternalPath", () => {
  it("accepts internal catalog paths", () => {
    for (const path of ["/game/pondhero", "/games/racing", "/tool/json-formatter", "/tools/text", "/app/vlc-media-player", "/apps/windows", "/apps/category/browsers", "/guide/best-racing-games-online", "/guides/games"]) {
      assert.equal(isAllowedInternalPath(path), true, path);
    }
  });

  it("rejects everything else", () => {
    for (const path of [
      "https://example.com/game/x",
      "//evil.com/game/x",
      "/about",
      "/search?q=x",
      "/game/",
      "/game",
      "/game/x?ref=1",
      "/game/x#top",
      "/game/X",
      "/game/../admin",
      "game/x",
      "javascript:alert(1)",
      "/game/x y",
      "/game/x/",
    ]) {
      assert.equal(isAllowedInternalPath(path), false, path);
    }
  });
});

describe("parseInlineLinks", () => {
  it("returns plain text as one segment", () => {
    assert.deepEqual(parseInlineLinks("No links here."), { segments: [{ type: "text", text: "No links here." }], errors: [] });
  });

  it("splits text and links", () => {
    const { segments, errors } = parseInlineLinks("Try [Pond](/game/pondhero) or [JSON](/tool/json-formatter) today.");
    assert.deepEqual(errors, []);
    assert.deepEqual(segments, [
      { type: "text", text: "Try " },
      { type: "link", label: "Pond", href: "/game/pondhero" },
      { type: "text", text: " or " },
      { type: "link", label: "JSON", href: "/tool/json-formatter" },
      { type: "text", text: " today." },
    ]);
  });

  it("reports disallowed link targets", () => {
    const { errors } = parseInlineLinks("Go [out](https://example.com) or [about](/about).");
    assert.equal(errors.length, 2);
    assert.match(errors[0], /https:\/\/example\.com/);
  });

  it("leaves brackets that are not links alone", () => {
    const { segments, errors } = parseInlineLinks("Press [Esc] to exit (really).");
    assert.deepEqual(errors, []);
    assert.deepEqual(segments, [{ type: "text", text: "Press [Esc] to exit (really)." }]);
  });
});

describe("plainText", () => {
  it("keeps link labels and drops the targets", () => {
    assert.equal(plainText("Try [Pond](/game/pondhero) now"), "Try Pond now");
  });
});

describe("validateBlocks", () => {
  it("accepts a well-formed body", () => {
    assert.deepEqual(validateBlocks(valid), []);
  });

  it("rejects non-arrays and empty bodies", () => {
    assert.ok(validateBlocks(null).length > 0);
    assert.ok(validateBlocks([]).length > 0);
  });

  it("rejects unknown block types and raw HTML-looking types", () => {
    assert.ok(validateBlocks([{ type: "html", text: "<b>x</b>" }]).some((error) => /unknown block type/i.test(error)));
  });

  it("requires the answer block first, once, with 1-3 sentences", () => {
    assert.ok(validateBlocks([{ type: "p", text: "x." }, { type: "answer", text: "Late." }]).some((e) => /answer/i.test(e)));
    assert.ok(validateBlocks([{ type: "answer", text: "A." }, { type: "answer", text: "B." }]).some((e) => /answer/i.test(e)));
    assert.ok(validateBlocks([{ type: "answer", text: "One. Two. Three. Four." }]).some((e) => /sentence/i.test(e)));
    assert.deepEqual(validateBlocks([{ type: "answer", text: "One. Two. Three." }]), []);
  });

  it("requires non-empty text and no links in headings", () => {
    assert.ok(validateBlocks([{ type: "answer", text: "A." }, { type: "h2", text: " " }]).length > 0);
    assert.ok(validateBlocks([{ type: "answer", text: "A." }, { type: "h2", text: "See [x](/game/x)" }]).length > 0);
  });

  it("requires an h3 to follow an h2", () => {
    assert.ok(validateBlocks([{ type: "answer", text: "A." }, { type: "h3", text: "Orphan" }]).some((e) => /h3/i.test(e)));
  });

  it("validates list, steps and table shapes", () => {
    const base: GuideBlock = { type: "answer", text: "A." };
    assert.ok(validateBlocks([base, { type: "ul", items: [] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "steps", items: ["ok", ""] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "table", caption: "c", header: ["a", "b"], rows: [["only one"]] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "table", caption: "", header: ["a"], rows: [["x"]] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "table", caption: "c", header: ["a"], rows: [] }]).length > 0);
  });

  it("validates links wherever text is allowed", () => {
    const base: GuideBlock = { type: "answer", text: "A." };
    assert.ok(validateBlocks([base, { type: "p", text: "[x](https://example.com)" }]).length > 0);
    assert.ok(validateBlocks([base, { type: "ul", items: ["[x](/about)"] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "steps", items: ["[x](/about)"] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "table", caption: "c", header: ["a"], rows: [["[x](/about)"]] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "note", text: "[x](/about)" }]).length > 0);
    assert.ok(validateBlocks([{ type: "answer", text: "[x](/about)." }]).length > 0);
  });

  it("validates item refs", () => {
    const base: GuideBlock = { type: "answer", text: "A." };
    assert.ok(validateBlocks([base, { type: "items", refs: [] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "items", refs: [{ kind: "guide", slug: "x" }] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "items", refs: [{ kind: "game", slug: "Bad Slug" }] }]).length > 0);
    assert.ok(validateBlocks([base, { type: "items", refs: [{ kind: "game", slug: "a" }, { kind: "game", slug: "a" }] }]).length > 0);
  });

  it("names the block index in each error", () => {
    const errors = validateBlocks([{ type: "answer", text: "A." }, { type: "p", text: "" }]);
    assert.match(errors[0], /block 2/i);
  });
});

describe("extractReferences", () => {
  it("collects game, tool and app references from links and item cards, deduped, in order", () => {
    const blocks: GuideBlock[] = [
      { type: "answer", text: "See [a](/game/a) and [t](/tool/t1)." },
      { type: "p", text: "[b](/game/b), [a again](/game/a), [app](/app/vlc), [cat](/games/racing), [guide](/guide/g)." },
      { type: "table", caption: "c", header: ["x"], rows: [["[c](/game/c)"]] },
      { type: "items", refs: [{ kind: "game", slug: "d" }, { kind: "app", slug: "vlc" }, { kind: "tool", slug: "t2" }] },
      { type: "ul", items: ["[e](/game/e)"] },
      { type: "steps", items: ["[f](/tool/t1)"] },
      { type: "note", text: "[g](/game/g)" },
    ];
    assert.deepEqual(extractReferences(blocks), {
      games: ["a", "b", "c", "d", "e", "g"],
      tools: ["t1", "t2"],
      apps: ["vlc"],
      guides: ["g"],
    });
  });
});

describe("extractPageLinks", () => {
  it("collects listing-page links (categories, platforms, sections), deduped, and ignores entity links", () => {
    const blocks: GuideBlock[] = [
      { type: "answer", text: "See [racing](/games/racing) and [g](/game/x)." },
      { type: "p", text: "[again](/games/racing) [apps](/apps/category/browsers) [tools](/tools/text) [section](/guides/games)" },
    ];
    assert.deepEqual(extractPageLinks(blocks), ["/games/racing", "/apps/category/browsers", "/tools/text", "/guides/games"]);
  });
});

describe("countWords and readingMinutes", () => {
  it("counts visible words, link labels included and targets excluded", () => {
    const blocks: GuideBlock[] = [
      { type: "answer", text: "One two three." },
      { type: "h2", text: "Four five" },
      { type: "p", text: "Six [seven eight](/game/x) nine" },
      { type: "ul", items: ["ten", "eleven twelve"] },
      { type: "table", caption: "thirteen", header: ["fourteen"], rows: [["fifteen"]] },
      { type: "items", title: "sixteen seventeen", refs: [{ kind: "game", slug: "x" }] },
    ];
    assert.equal(countWords(blocks), 17);
  });

  it("derives reading minutes at about 230 words per minute, minimum one", () => {
    assert.equal(readingMinutes(0), 1);
    assert.equal(readingMinutes(100), 1);
    assert.equal(readingMinutes(230), 1);
    assert.equal(readingMinutes(345), 2);
    assert.equal(readingMinutes(920), 4);
    assert.equal(readingMinutes(1100), 5);
  });
});
