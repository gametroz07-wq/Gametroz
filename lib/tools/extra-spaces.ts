// Pure whitespace cleanup. No DOM access so it can be unit-tested.
import { joinLines, splitLines } from "./lines";

export type ExtraSpacesOptions = {
  removeEmptyLines: boolean;
  /** Replace line breaks with single spaces (implies removing empty lines). */
  joinLines: boolean;
};

export type ExtraSpacesResult = {
  output: string;
  charactersRemoved: number;
  emptyLinesRemoved: number;
  lineBreaksRemoved: number;
};

// Any whitespace that is not a line break: spaces, tabs, non-breaking and Unicode spaces.
const HORIZONTAL_SPACE = /[^\S\r\n]+/g;

export function removeExtraSpaces(text: string, options: ExtraSpacesOptions): ExtraSpacesResult {
  const cleaned = splitLines(text).map((line) => line.replace(HORIZONTAL_SPACE, " ").trim());
  const dropEmpty = options.removeEmptyLines || options.joinLines;
  const lines = dropEmpty ? cleaned.filter((line) => line !== "") : cleaned;
  const output = options.joinLines ? lines.join(" ") : joinLines(lines);

  return {
    output,
    charactersRemoved: text.length - output.length,
    emptyLinesRemoved: cleaned.length - lines.length,
    lineBreaksRemoved: options.joinLines ? Math.max(0, cleaned.length - 1) : 0,
  };
}
