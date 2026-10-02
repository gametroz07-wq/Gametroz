// Pure URL slug generation. No DOM access so it can be unit-tested.

export type SlugSeparator = "-" | "_";

export type SlugOptions = {
  separator: SlugSeparator;
  /** Maximum slug length, or null for no limit. */
  maxLength: number | null;
  removeStopWords: boolean;
};

/** Small English list; words that rarely help a URL. */
export const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "has", "in", "into", "is", "it", "its", "of", "on", "or", "that", "the", "to", "was", "were", "will", "with",
]);

// Letters NFKD does not decompose into a base letter plus a mark.
const TRANSLITERATIONS: Record<string, string> = {
  "ß": "ss", "æ": "ae", "œ": "oe", "ø": "o", "đ": "d", "ð": "d", "þ": "th", "ł": "l", "ħ": "h", "ı": "i", "&": " and ",
};

function toAsciiWords(text: string): string[] {
  const folded = text
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .toLowerCase()
    .replace(/[ßæœøđðþłħı&]/g, (char) => TRANSLITERATIONS[char])
    .replace(/['’`]/g, "");
  return folded.split(/[^a-z0-9]+/).filter(Boolean);
}

/** Joins as many whole words as fit; cuts inside the first word only if it alone is too long. */
function limitLength(words: string[], separator: string, maxLength: number): string {
  let result = "";
  for (const word of words) {
    const next = result ? result + separator + word : word;
    if (next.length > maxLength) break;
    result = next;
  }
  return result || words[0].slice(0, Math.max(0, maxLength));
}

export function slugify(text: string, options: SlugOptions): string {
  let words = toAsciiWords(text);
  if (options.removeStopWords) {
    const meaningful = words.filter((word) => !STOP_WORDS.has(word));
    if (meaningful.length > 0) words = meaningful;
  }
  if (words.length === 0) return "";
  return options.maxLength === null ? words.join(options.separator) : limitLength(words, options.separator, options.maxLength);
}
