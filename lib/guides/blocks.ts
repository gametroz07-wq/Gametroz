import type { GuideBlock, GuideItemRef } from "@/types/content";

// Pure helpers for guide bodies: link parsing, validation, reference extraction and reading time.
// Used by the renderer, the definitions tests and `npm run guides:sync`.

export const WORDS_PER_MINUTE = 230;

const ALLOWED_PATH = /^\/(?:game|games|tool|tools|app|apps|guide|guides)\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const LINK = /\[([^\][]+)\]\(([^)\s]*)\)/g;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ITEM_KINDS = new Set<GuideItemRef["kind"]>(["game", "tool", "app"]);

/** Internal catalog paths only: /game/, /games/, /tool/, /tools/, /app/, /apps/, /guide/, /guides/ followed by lowercase slugs. */
export function isAllowedInternalPath(path: string) {
  return ALLOWED_PATH.test(path);
}

export type InlineSegment = { type: "text"; text: string } | { type: "link"; label: string; href: string };

/**
 * Splits text into plain and link segments. Link syntax is `[label](/path)`; a link whose target is not an
 * allowed internal path is reported as an error and kept as plain text so it can never render as a link.
 */
export function parseInlineLinks(text: string): { segments: InlineSegment[]; errors: string[] } {
  const segments: InlineSegment[] = [];
  const errors: string[] = [];
  let cursor = 0;
  const push = (value: string) => {
    if (!value) return;
    const last = segments[segments.length - 1];
    if (last?.type === "text") last.text += value;
    else segments.push({ type: "text", text: value });
  };
  for (const match of text.matchAll(LINK)) {
    const [raw, label, href] = match;
    push(text.slice(cursor, match.index));
    if (isAllowedInternalPath(href)) {
      segments.push({ type: "link", label, href });
    } else {
      errors.push(`link target "${href}" is not an allowed internal path`);
      push(raw);
    }
    cursor = match.index + raw.length;
  }
  push(text.slice(cursor));
  return { segments, errors };
}

/** Visible text: link labels stay, link targets go. */
export function plainText(text: string) {
  return text.replace(LINK, "$1");
}

function sentenceCount(text: string) {
  return plainText(text)
    .split(/[.!?]+(?:\s+|$)/)
    .filter((part) => part.trim().length > 0).length;
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

/** Returns human-readable errors; an empty array means the body is valid. */
export function validateBlocks(input: unknown): string[] {
  if (!Array.isArray(input)) return ["body must be an array of blocks"];
  if (input.length === 0) return ["body must not be empty"];

  const errors: string[] = [];
  let seenH2 = false;

  input.forEach((raw, index) => {
    const label = `block ${index + 1}`;
    const fail = (message: string) => errors.push(`${label}: ${message}`);
    const checkLinks = (text: string) => {
      for (const error of parseInlineLinks(text).errors) fail(error);
    };
    const checkText = (value: unknown, field: string) => {
      if (!isText(value)) {
        fail(`${field} must be non-empty text`);
        return false;
      }
      checkLinks(value);
      return true;
    };
    const checkList = (value: unknown, field: string) => {
      if (!Array.isArray(value) || value.length === 0) return fail(`${field} must be a non-empty array`);
      value.forEach((item, position) => checkText(item, `${field}[${position}]`));
    };

    if (!isRecord(raw) || typeof raw.type !== "string") return fail("must be an object with a type");

    switch (raw.type) {
      case "answer": {
        if (index !== 0) fail("the answer block must be first");
        if (checkText(raw.text, "text") && (sentenceCount(raw.text as string) < 1 || sentenceCount(raw.text as string) > 3)) {
          fail("the answer must be 1 to 3 sentences");
        }
        break;
      }
      case "h2":
      case "h3": {
        if (checkText(raw.text, "text") && /\]\(/.test(raw.text as string)) fail("headings cannot contain links");
        if (raw.type === "h2") seenH2 = true;
        else if (!seenH2) fail("an h3 must come after an h2");
        break;
      }
      case "p":
        checkText(raw.text, "text");
        break;
      case "ul":
      case "ol":
      case "steps":
        checkList(raw.items, "items");
        break;
      case "table": {
        if (!isText(raw.caption)) fail("caption must be non-empty text");
        const header = raw.header;
        if (!Array.isArray(header) || header.length === 0 || !header.every(isText)) {
          fail("header must be a non-empty array of text");
          break;
        }
        const rows = raw.rows;
        if (!Array.isArray(rows) || rows.length === 0) {
          fail("rows must be a non-empty array");
          break;
        }
        rows.forEach((row, rowIndex) => {
          if (!Array.isArray(row) || row.length !== header.length) {
            fail(`row ${rowIndex + 1} must have ${header.length} cells`);
            return;
          }
          row.forEach((cell, cellIndex) => checkText(cell, `row ${rowIndex + 1} cell ${cellIndex + 1}`));
        });
        break;
      }
      case "items": {
        if (raw.title !== undefined && !isText(raw.title)) fail("title must be non-empty text when present");
        const refs = raw.refs;
        if (!Array.isArray(refs) || refs.length === 0) {
          fail("refs must be a non-empty array");
          break;
        }
        const seen = new Set<string>();
        refs.forEach((ref, position) => {
          if (!isRecord(ref) || !ITEM_KINDS.has(ref.kind as GuideItemRef["kind"]) || typeof ref.slug !== "string" || !SLUG.test(ref.slug)) {
            fail(`refs[${position}] must be { kind: game|tool|app, slug: lowercase-slug }`);
            return;
          }
          const key = `${ref.kind}:${ref.slug}`;
          if (seen.has(key)) fail(`refs[${position}] repeats ${key}`);
          seen.add(key);
        });
        break;
      }
      case "note": {
        if (raw.title !== undefined && !isText(raw.title)) fail("title must be non-empty text when present");
        checkText(raw.text, "text");
        break;
      }
      default:
        fail(`unknown block type "${raw.type}"`);
    }
  });

  if (input.filter((block) => isRecord(block) && block.type === "answer").length > 1) errors.push("only one answer block is allowed");
  return errors;
}

/** Every string that can hold inline links, in reading order. */
function linkTexts(block: GuideBlock): string[] {
  switch (block.type) {
    case "answer":
    case "p":
    case "note":
      return [block.text];
    case "ul":
    case "ol":
    case "steps":
      return block.items;
    case "table":
      return block.rows.flat();
    default:
      return [];
  }
}

export type GuideReferences = { games: string[]; tools: string[]; apps: string[]; guides: string[] };

/** Games, tools, apps and guides a body points to (links and item cards), deduped in first-appearance order. */
export function extractReferences(blocks: GuideBlock[]): GuideReferences {
  const found = { games: new Set<string>(), tools: new Set<string>(), apps: new Set<string>(), guides: new Set<string>() };
  const bucket = { game: found.games, tool: found.tools, app: found.apps, guide: found.guides } as const;
  for (const block of blocks) {
    for (const text of linkTexts(block)) {
      for (const segment of parseInlineLinks(text).segments) {
        if (segment.type !== "link") continue;
        const [, kind, slug, ...rest] = segment.href.split("/");
        if (rest.length === 0 && kind in bucket) bucket[kind as keyof typeof bucket].add(slug);
      }
    }
    if (block.type === "items") {
      for (const ref of block.refs) bucket[ref.kind].add(ref.slug);
    }
  }
  return { games: [...found.games], tools: [...found.tools], apps: [...found.apps], guides: [...found.guides] };
}

/** Listing-page links (/games/racing, /tools/text, /apps/windows, /guides/games), deduped in first-appearance order. */
export function extractPageLinks(blocks: GuideBlock[]): string[] {
  const pages = new Set<string>();
  for (const block of blocks) {
    for (const text of linkTexts(block)) {
      for (const segment of parseInlineLinks(text).segments) {
        if (segment.type !== "link") continue;
        const kind = segment.href.split("/")[1];
        if (kind === "games" || kind === "tools" || kind === "apps" || kind === "guides") pages.add(segment.href);
      }
    }
  }
  return [...pages];
}

/** Visible words: link labels count, link targets do not. */
export function countWords(blocks: GuideBlock[]) {
  const texts: string[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case "table":
        texts.push(block.caption, ...block.header, ...block.rows.flat());
        break;
      case "items":
        if (block.title) texts.push(block.title);
        break;
      case "note":
        if (block.title) texts.push(block.title);
        texts.push(block.text);
        break;
      case "h2":
      case "h3":
        texts.push(block.text);
        break;
      default:
        texts.push(...linkTexts(block));
    }
  }
  return texts.reduce((total, text) => total + plainText(text).split(/\s+/).filter(Boolean).length, 0);
}

export function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
