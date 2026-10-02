// SHA family hashes through the Web Crypto API. MD5 is intentionally absent: it is broken for
// security use and crypto.subtle does not implement it.

export const hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
export type HashAlgorithm = (typeof hashAlgorithms)[number];

export function toHex(bytes: Uint8Array, uppercase = false): string {
  let hex = "";
  for (const byte of bytes) hex += byte.toString(16).padStart(2, "0");
  return uppercase ? hex.toUpperCase() : hex;
}

export async function hashBytes(
  data: ArrayBuffer | Uint8Array,
  algorithm: HashAlgorithm,
  { uppercase = false }: { uppercase?: boolean } = {},
): Promise<string> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const digest = await globalThis.crypto.subtle.digest(algorithm, bytes as Uint8Array<ArrayBuffer>);
  return toHex(new Uint8Array(digest), uppercase);
}

export function hashText(text: string, algorithm: HashAlgorithm, options: { uppercase?: boolean } = {}): Promise<string> {
  return hashBytes(new TextEncoder().encode(text), algorithm, options);
}
