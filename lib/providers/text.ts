// Helpers that turn untrusted provider text into plain, predictable values.

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

/** Strips tags and decodes common entities. The result is rendered as text, never as HTML. */
export function toPlainText(value: string | null | undefined) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (entity) => ENTITIES[entity] ?? entity)
    .replace(/<[^>]*>/g, " ")
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
