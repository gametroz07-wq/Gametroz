// UUID v4 generation and a validator that tells versions and variants apart.

export type UuidFormat = { uppercase: boolean; hyphens: boolean };
export type UuidListResult = { ok: true; uuids: string[] } | { ok: false; error: string };

export type UuidValidation =
  | { valid: false; error: string }
  | {
      valid: true;
      canonical: string;
      kind: "standard" | "nil" | "max";
      /** Only meaningful for the RFC variant. */
      version: number | null;
      variant: "RFC 9562" | "NCS" | "Microsoft" | "Reserved" | "Nil/Max";
    };

const hex = (byte: number) => byte.toString(16).padStart(2, "0");

/** Builds a version 4 UUID from 16 random bytes by setting the version and variant bits. */
export function uuidFromBytes(input: Uint8Array): string {
  if (input.length !== 16) throw new RangeError("A UUID needs exactly 16 bytes");
  const bytes = Uint8Array.from(input);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const text = Array.from(bytes, hex).join("");
  return `${text.slice(0, 8)}-${text.slice(8, 12)}-${text.slice(12, 16)}-${text.slice(16, 20)}-${text.slice(20)}`;
}

/** crypto.randomUUID when the browser has it, otherwise getRandomValues. */
export function generateUuidV4(): string {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi.randomUUID === "function") return cryptoApi.randomUUID();
  return uuidFromBytes(cryptoApi.getRandomValues(new Uint8Array(16)));
}

export function formatUuid(uuid: string, { uppercase, hyphens }: UuidFormat): string {
  const text = hyphens ? uuid : uuid.replace(/-/g, "");
  return uppercase ? text.toUpperCase() : text.toLowerCase();
}

export const MAX_UUID_COUNT = 100;

export function generateUuidList(
  options: UuidFormat & { count: number },
  generate: () => string = generateUuidV4,
): UuidListResult {
  if (!Number.isInteger(options.count) || options.count < 1 || options.count > MAX_UUID_COUNT) {
    return { ok: false, error: `Count must be a whole number between 1 and ${MAX_UUID_COUNT}.` };
  }
  return { ok: true, uuids: Array.from({ length: options.count }, () => formatUuid(generate(), options)) };
}

/** One-sentence summary of a validation result. */
export function describeUuid(result: UuidValidation): string {
  if (!result.valid) return result.error;
  if (result.kind === "nil") return "Valid UUID: the nil UUID (all zeros).";
  if (result.kind === "max") return "Valid UUID: the max UUID (all ones).";
  if (result.version !== null) return `Valid UUID, version ${result.version} (${result.variant} variant).`;
  return `Valid UUID with the ${result.variant} variant (no version).`;
}

export function validateUuid(text: string): UuidValidation {
  let value = text.trim().toLowerCase();
  if (value.startsWith("urn:uuid:")) value = value.slice(9);
  if (value.startsWith("{") && value.endsWith("}")) value = value.slice(1, -1);
  const digits = value.replace(/-/g, "");
  const hyphenated = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
  if (!/^[0-9a-f]{32}$/.test(digits) || (value.includes("-") && !hyphenated)) {
    return { valid: false, error: "Not a UUID. Expected 32 hex digits, usually as 8-4-4-4-12 groups." };
  }
  const canonical = `${digits.slice(0, 8)}-${digits.slice(8, 12)}-${digits.slice(12, 16)}-${digits.slice(16, 20)}-${digits.slice(20)}`;
  if (digits === "0".repeat(32)) return { valid: true, canonical, kind: "nil", version: null, variant: "Nil/Max" };
  if (digits === "f".repeat(32)) return { valid: true, canonical, kind: "max", version: null, variant: "Nil/Max" };

  const variantNibble = parseInt(digits[16], 16);
  const variant = variantNibble < 8 ? "NCS" : variantNibble < 12 ? "RFC 9562" : variantNibble < 14 ? "Microsoft" : "Reserved";
  return {
    valid: true,
    canonical,
    kind: "standard",
    version: variant === "RFC 9562" ? parseInt(digits[12], 16) : null,
    variant,
  };
}
