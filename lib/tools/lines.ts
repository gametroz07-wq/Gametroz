// Shared line helpers for the text tools. No DOM access so they can be unit-tested.

/** Splits on CRLF, CR or LF. Empty text has no lines, so "" gives []. */
export function splitLines(text: string): string[] {
  return text === "" ? [] : text.split(/\r\n|\r|\n/);
}

export const joinLines = (lines: string[]) => lines.join("\n");
