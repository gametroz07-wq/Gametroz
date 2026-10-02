// Percent-encoding helpers around encodeURIComponent / encodeURI that report errors instead of throwing.

import type { CodecResult } from "./base64";

export type UrlMode = "component" | "full";

export type QueryPair = { key: string; value: string };
export type QueryResult = { ok: true; pairs: QueryPair[] } | { ok: false; error: string };

const MALFORMED = 'Malformed percent-encoding. Each "%" must be followed by two hex digits and the bytes must form valid UTF-8.';

export function encodeUrlText(text: string, mode: UrlMode): CodecResult {
  try {
    return { ok: true, output: mode === "component" ? encodeURIComponent(text) : encodeURI(text) };
  } catch {
    return { ok: false, error: "The text contains an unpaired surrogate character that cannot be encoded as UTF-8." };
  }
}

export function decodeUrlText(text: string, { mode, plusAsSpace }: { mode: UrlMode; plusAsSpace: boolean }): CodecResult {
  const source = plusAsSpace ? text.replace(/\+/g, " ") : text;
  try {
    return { ok: true, output: mode === "component" ? decodeURIComponent(source) : decodeURI(source) };
  } catch {
    return { ok: false, error: MALFORMED };
  }
}

function decodePart(part: string) {
  return decodeURIComponent(part.replace(/\+/g, " "));
}

/** Lists the key/value pairs of a full URL, "?a=1&b=2" or "a=1&b=2". Repeated keys are kept. */
export function parseQueryString(input: string): QueryResult {
  let query = input.trim();
  const hash = query.indexOf("#");
  if (hash !== -1) query = query.slice(0, hash);
  const question = query.indexOf("?");
  if (question !== -1) query = query.slice(question + 1);
  else if (/^[a-z][a-z0-9+.-]*:\/\//i.test(query)) query = "";

  const pairs: QueryPair[] = [];
  for (const part of query.split("&")) {
    if (part === "") continue;
    const equals = part.indexOf("=");
    const rawKey = equals === -1 ? part : part.slice(0, equals);
    const rawValue = equals === -1 ? "" : part.slice(equals + 1);
    try {
      pairs.push({ key: decodePart(rawKey), value: decodePart(rawValue) });
    } catch {
      return { ok: false, error: `Could not decode "${part}". ${MALFORMED}` };
    }
  }
  return { ok: true, pairs };
}
