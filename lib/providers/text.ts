// Helpers that turn untrusted provider text into plain, predictable values.

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  bull: "•",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
};

function decodeEntitiesOnce(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    if (code.startsWith("#")) {
      const hex = code[1].toLowerCase() === "x";
      const point = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) && point > 0 && point < 0x110000 ? String.fromCodePoint(point) : entity;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
  });
}

/**
 * Strips tags and decodes entities (two passes: the live feed double-encodes, e.g. "&amp;mdash;").
 * Also repairs bare "mdash"/"ndash" words that the provider's own sanitizer leaves behind.
 * The result is rendered as text, never as HTML.
 */
export function toPlainText(value: string | null | undefined) {
  if (!value) return "";
  const decoded = decodeEntitiesOnce(decodeEntitiesOnce(value.replace(/<[^>]*>/g, " ")));
  return decoded
    .replace(/<[^>]*>/g, " ")
    .replace(/\bmdash\b/g, "—")
    .replace(/\bndash\b/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: string | null | undefined) {
  return toPlainText(value)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Parses a positive integer dimension; returns null for anything else. */
export function parseDimension(value: string | number | null | undefined) {
  const number = typeof value === "number" ? value : Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isInteger(number) && number > 0 ? number : null;
}

/** "Cars, Racing,  Arcade " → ["cars", "racing", "arcade"], unique, at most 10. */
export function splitTags(value: string | null | undefined) {
  const tags = (value ?? "")
    .split(",")
    .map((tag) => slugify(tag))
    .filter(Boolean);
  return [...new Set(tags)].slice(0, 10);
}

/** First sentence, or a word-safe cut, of at most `max` characters. */
export function toShortDescription(description: string, max = 160) {
  if (!description) return "";
  const firstSentence = description.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? description;
  if (firstSentence.length <= max) return firstSentence;
  const cut = firstSentence.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : cut.length)}…`;
}
