// Pure case conversion for the Case Converter. No DOM access so it can be unit-tested.

export type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "alternating"
  | "inverse";

export const CASE_MODES: { id: CaseMode; label: string }[] = [
  { id: "upper", label: "UPPER CASE" },
  { id: "lower", label: "lower case" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" },
  { id: "constant", label: "CONSTANT_CASE" },
  { id: "alternating", label: "aLtErNaTiNg" },
  { id: "inverse", label: "iNVERSE" },
];

/** Articles, short conjunctions and short prepositions that stay lowercase inside a title. */
const SMALL_WORDS = new Set([
  "a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet", "as", "at", "by", "in", "of", "off", "on", "per", "to", "up", "via", "vs",
]);

// Splits identifiers into words: "XMLHttpRequest2" -> XML, Http, Request, 2.
const WORD_PARTS = /\p{Lu}?(?:\p{Ll}|\p{M})+|\p{Lu}+(?!\p{Ll})|[\p{Lo}\p{Lm}]+|\p{Nd}+/gu;
const TITLE_WORDS = /[\p{L}\p{M}\p{Nd}'’]+/gu;

const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);
const wordsOf = (line: string) => (line.match(WORD_PARTS) ?? []).map((word) => word.toLowerCase());

function titleCaseLine(line: string) {
  const matches = [...line.toLowerCase().matchAll(TITLE_WORDS)];
  const last = matches.length - 1;
  let result = "";
  let cursor = 0;
  matches.forEach((match, index) => {
    const word = match[0];
    const keepLower = index !== 0 && index !== last && SMALL_WORDS.has(word);
    result += line.slice(cursor, match.index) + (keepLower ? word : capitalize(word));
    cursor = match.index + word.length;
  });
  return result + line.slice(cursor);
}

function sentenceCase(text: string) {
  return text.toLowerCase().replace(/(^|[.!?…]["')\]]*\s+|\n\s*)(\p{Ll})/gu, (_, lead: string, letter: string) => lead + letter.toUpperCase());
}

function alternating(text: string) {
  let index = 0;
  return Array.from(text, (char) => {
    if (char.toLowerCase() === char.toUpperCase()) return char;
    const next = index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
    index += 1;
    return next;
  }).join("");
}

function inverse(text: string) {
  return Array.from(text, (char) => {
    const upper = char.toUpperCase();
    if (upper === char.toLowerCase()) return char;
    return char === upper ? char.toLowerCase() : upper;
  }).join("");
}

const perLine = (text: string, convert: (line: string) => string) => text.split(/(\r\n|\r|\n)/).map((part, index) => (index % 2 ? part : convert(part))).join("");

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return perLine(text, titleCaseLine);
    case "sentence":
      return sentenceCase(text);
    case "camel":
      return perLine(text, (line) => wordsOf(line).map((word, index) => (index === 0 ? word : capitalize(word))).join(""));
    case "pascal":
      return perLine(text, (line) => wordsOf(line).map(capitalize).join(""));
    case "snake":
      return perLine(text, (line) => wordsOf(line).join("_"));
    case "kebab":
      return perLine(text, (line) => wordsOf(line).join("-"));
    case "constant":
      return perLine(text, (line) => wordsOf(line).join("_").toUpperCase());
    case "alternating":
      return alternating(text);
    case "inverse":
      return inverse(text);
  }
}
