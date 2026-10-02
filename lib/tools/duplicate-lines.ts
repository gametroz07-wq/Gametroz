// Pure duplicate-line removal. No DOM access so it can be unit-tested.
import { joinLines, splitLines } from "./lines";

export type DuplicateOptions = {
  caseSensitive: boolean;
  /** Compare lines without their leading and trailing whitespace (the kept line stays as written). */
  trim: boolean;
  /** Leave empty lines alone instead of treating repeated ones as duplicates. */
  ignoreEmpty: boolean;
};

export type DuplicateResult = { output: string; total: number; kept: number; removed: number };

export function removeDuplicateLines(text: string, options: DuplicateOptions): DuplicateResult {
  const lines = splitLines(text);
  const seen = new Set<string>();
  const kept: string[] = [];

  for (const line of lines) {
    let key = options.trim ? line.trim() : line;
    if (options.ignoreEmpty && key === "") {
      kept.push(line);
      continue;
    }
    if (!options.caseSensitive) key = key.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(line);
  }

  return { output: joinLines(kept), total: lines.length, kept: kept.length, removed: lines.length - kept.length };
}
