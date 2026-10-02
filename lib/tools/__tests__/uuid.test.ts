import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeUuid, formatUuid, generateUuidList, generateUuidV4, uuidFromBytes, validateUuid } from "../uuid";

describe("uuidFromBytes", () => {
  it("sets the version 4 and RFC variant bits", () => {
    assert.equal(uuidFromBytes(new Uint8Array(16).fill(0xff)), "ffffffff-ffff-4fff-bfff-ffffffffffff");
    assert.equal(uuidFromBytes(new Uint8Array(16)), "00000000-0000-4000-8000-000000000000");
  });

  it("needs exactly 16 bytes", () => {
    assert.throws(() => uuidFromBytes(new Uint8Array(15)), RangeError);
  });
});

describe("generateUuidV4", () => {
  it("produces valid, distinct version 4 UUIDs", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i += 1) {
      const uuid = generateUuidV4();
      const result = validateUuid(uuid);
      assert.ok(result.valid && result.version === 4 && result.variant === "RFC 9562", uuid);
      seen.add(uuid);
    }
    assert.equal(seen.size, 200);
  });
});

describe("formatUuid", () => {
  const uuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
  it("applies the uppercase and hyphen options", () => {
    assert.equal(formatUuid(uuid, { uppercase: false, hyphens: true }), uuid);
    assert.equal(formatUuid(uuid, { uppercase: true, hyphens: true }), uuid.toUpperCase());
    assert.equal(formatUuid(uuid, { uppercase: false, hyphens: false }), "f47ac10b58cc4372a5670e02b2c3d479");
  });
});

describe("generateUuidList", () => {
  it("returns the requested number of UUIDs, one option set for all", () => {
    const result = generateUuidList({ count: 5, uppercase: true, hyphens: false });
    assert.ok(result.ok);
    if (result.ok) {
      assert.equal(result.uuids.length, 5);
      for (const uuid of result.uuids) assert.match(uuid, /^[0-9A-F]{32}$/);
    }
  });

  it("limits the count to 1 through 100", () => {
    for (const count of [0, 101, 2.5, Number.NaN, -3]) {
      const result = generateUuidList({ count, uppercase: false, hyphens: true });
      assert.equal(result.ok, false, String(count));
      if (!result.ok) assert.match(result.error, /1 and 100/);
    }
    assert.ok(generateUuidList({ count: 100, uppercase: false, hyphens: true }).ok);
  });

  it("uses an injected generator", () => {
    const result = generateUuidList({ count: 2, uppercase: false, hyphens: true }, () => "00000000-0000-4000-8000-000000000000");
    assert.deepEqual(result, { ok: true, uuids: ["00000000-0000-4000-8000-000000000000", "00000000-0000-4000-8000-000000000000"] });
  });
});

describe("describeUuid", () => {
  it("summarizes a validation result in one sentence", () => {
    assert.equal(describeUuid(validateUuid("f47ac10b-58cc-4372-a567-0e02b2c3d479")), "Valid UUID, version 4 (RFC 9562 variant).");
    assert.equal(describeUuid(validateUuid("00000000-0000-0000-0000-000000000000")), "Valid UUID: the nil UUID (all zeros).");
    assert.equal(describeUuid(validateUuid("ffffffff-ffff-ffff-ffff-ffffffffffff")), "Valid UUID: the max UUID (all ones).");
    assert.equal(describeUuid(validateUuid("123e4567-e89b-12d3-c456-426614174000")), "Valid UUID with the Microsoft variant (no version).");
    assert.match(describeUuid(validateUuid("nope")), /^Not a UUID/);
  });
});

describe("validateUuid", () => {
  it("detects the version of RFC UUIDs", () => {
    const cases: [string, number][] = [
      ["123e4567-e89b-12d3-a456-426614174000", 1],
      ["6ba7b810-9dad-11d1-80b4-00c04fd430c8", 1],
      ["f47ac10b-58cc-4372-a567-0e02b2c3d479", 4],
      ["018f3c0e-8c1a-7d3b-9a4b-1c2d3e4f5a6b", 7],
    ];
    for (const [uuid, version] of cases) {
      const result = validateUuid(uuid);
      assert.ok(result.valid, uuid);
      if (result.valid) {
        assert.equal(result.version, version, uuid);
        assert.equal(result.canonical, uuid);
      }
    }
  });

  it("accepts braces, the urn prefix, uppercase and missing hyphens", () => {
    const expected = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    for (const text of [
      "{F47AC10B-58CC-4372-A567-0E02B2C3D479}",
      "urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "F47AC10B58CC4372A5670E02B2C3D479",
      "  f47ac10b-58cc-4372-a567-0e02b2c3d479  ",
    ]) {
      const result = validateUuid(text);
      assert.ok(result.valid, text);
      if (result.valid) assert.equal(result.canonical, expected);
    }
  });

  it("recognizes the nil and max UUIDs", () => {
    const nil = validateUuid("00000000-0000-0000-0000-000000000000");
    assert.ok(nil.valid && nil.kind === "nil" && nil.version === null);
    const max = validateUuid("ffffffff-ffff-ffff-ffff-ffffffffffff");
    assert.ok(max.valid && max.kind === "max" && max.version === null);
  });

  it("reports non-RFC variants without claiming a version", () => {
    const result = validateUuid("123e4567-e89b-12d3-c456-426614174000");
    assert.ok(result.valid);
    if (result.valid) {
      assert.equal(result.variant, "Microsoft");
      assert.equal(result.version, null);
    }
  });

  it("rejects malformed text", () => {
    for (const text of ["", "not-a-uuid", "f47ac10b-58cc-4372-a567-0e02b2c3d47", "g47ac10b-58cc-4372-a567-0e02b2c3d479", "f47ac10b-58cc-4372-a567-0e02b2c3d479x"]) {
      assert.equal(validateUuid(text).valid, false, text);
    }
  });
});
