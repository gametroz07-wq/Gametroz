// Pure line sorting for the Text Sorter. No DOM access so it can be unit-tested.
import { joinLines, splitLines } from "./lines";

export type SortMode = "az" | "za" | "natural" | "length" | "shuffle" | "reverse";

export const SORT_MODES: { id: SortMode; label: string }[] = [
  { id: "az", label: "A to Z" },
  { id: "za", label: "Z to A" },
  { id: "natural", label: "Natural (numbers by value)" },
  { id: "length", label: "By length (short first)" },
  { id: "shuffle", label: "Random shuffle" },
  { id: "reverse", label: "Reverse order" },
];

export type SortOptions = {
  mode: SortMode;
  caseInsensitive: boolean;
  removeEmpty: boolean;
  dedupe: boolean;
};

export type SortResult = { output: string; total: number; removed: number };

/** Returns an integer in [0, max) from the Web Crypto generator, without modulo bias. */
export function secureRandomInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);
  return buffer[0] % max;
}

/** Fisher-Yates shuffle; `randomInt(n)` must return an integer in [0, n). */
function shuffle(items: string[], randomInt: (max: number) => number) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = randomInt(index + 1);
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export function sortLines(text: string, options: SortOptions, randomInt: (max: number) => number = secureRandomInt): SortResult {
  const original = splitLines(text);
  let lines = options.removeEmpty ? original.filter((line) => line.trim() !== "") : original;

  if (options.dedupe) {
    const seen = new Set<string>();
    lines = lines.filter((line) => {
      const key = options.caseInsensitive ? line.toLowerCase() : line;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // "accent" ignores case only; "variant" (the default) puts lowercase before uppercase.
  const sensitivity = options.caseInsensitive ? "accent" : "variant";
  const collator = new Intl.Collator("en", { sensitivity, numeric: options.mode === "natural" });
  const length = (line: string) => Array.from(line).length;

  switch (options.mode) {
    case "az":
    case "natural":
      lines = [...lines].sort(collator.compare);
      break;
    case "za":
      lines = [...lines].sort((a, b) => collator.compare(b, a));
      break;
    case "length":
      lines = [...lines].sort((a, b) => length(a) - length(b));
      break;
    case "shuffle":
      lines = shuffle(lines, randomInt);
      break;
    case "reverse":
      lines = [...lines].reverse();
      break;
  }

  return { output: joinLines(lines), total: original.length, removed: original.length - lines.length };
}
