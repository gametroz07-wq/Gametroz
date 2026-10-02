// Pure character statistics for the Character Counter. No DOM access so it can be unit-tested.

export type CharacterStats = {
  /** User-perceived characters (grapheme clusters), so an emoji or "e" + accent counts once. */
  characters: number;
  charactersNoSpaces: number;
  letters: number;
  digits: number;
  whitespace: number;
  lines: number;
  /** Size of the text encoded as UTF-8. */
  bytes: number;
};

export type CharacterLimit = { id: string; label: string; limit: number };

export const CHARACTER_LIMITS: CharacterLimit[] = [
  { id: "sms", label: "SMS (160)", limit: 160 },
  { id: "x-post", label: "X / Twitter post (280)", limit: 280 },
  { id: "meta-description", label: "Meta description (160)", limit: 160 },
  { id: "meta-title", label: "Meta title (60)", limit: 60 },
  { id: "instagram-caption", label: "Instagram caption (2,200)", limit: 2200 },
];

type SegmenterLike = { segment(input: string): Iterable<{ segment: string }> };

const defaultSegmenter: SegmenterLike | null =
  typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;

/**
 * Splits text into user-perceived characters with Intl.Segmenter. Where it is unavailable (very old
 * browsers) it falls back to Unicode code points: emoji still count once, but a letter followed by a
 * combining accent, or an emoji sequence joined by ZWJ, counts as several.
 */
export function splitGraphemes(text: string, segmenter: SegmenterLike | null = defaultSegmenter): string[] {
  if (!segmenter) return Array.from(text);
  return Array.from(segmenter.segment(text), (part) => part.segment);
}

const WHITESPACE_ONLY = /^\s+$/u;
const LETTER = /\p{L}/u;
const DIGIT = /\p{Nd}/u;

export function countCharacters(text: string): CharacterStats {
  const graphemes = splitGraphemes(text);
  let whitespace = 0;
  let letters = 0;
  let digits = 0;
  for (const grapheme of graphemes) {
    if (WHITESPACE_ONLY.test(grapheme)) whitespace += 1;
    else if (LETTER.test(grapheme)) letters += 1;
    else if (DIGIT.test(grapheme)) digits += 1;
  }
  return {
    characters: graphemes.length,
    charactersNoSpaces: graphemes.length - whitespace,
    letters,
    digits,
    whitespace,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    bytes: new TextEncoder().encode(text).length,
  };
}

export type LimitStatus = { limit: number; remaining: number; over: number; exceeded: boolean };

export function limitStatus(count: number, limit: number): LimitStatus {
  return { limit, remaining: Math.max(0, limit - count), over: Math.max(0, count - limit), exceeded: count > limit };
}
