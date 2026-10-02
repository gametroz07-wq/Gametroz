import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { decodeBase64, encodeBase64 } from "../base64";
import { getToolDefinition } from "../definitions";
import { hashText } from "../hash";
import { entropyBits, strengthLabel, type PasswordOptions } from "../password";
import { generateNumbers } from "../random-number";
import { contrastRatio, contrastWarning, qrCapacityBytes, validateQrInput } from "../qr";
import { dateTimeToTimestamp, describeTimestamp, parseTimestamp } from "../timestamp";
import { encodeUrlText, parseQueryString } from "../url-codec";
import { describeUuid, validateUuid } from "../uuid";

// The worked examples shown on the developer and generator tool pages must be what the tools really produce.

function example(slug: string, index: number) {
  const item = getToolDefinition(slug)?.examples[index];
  assert.ok(item, `${slug} example ${index}`);
  return item;
}

const NY = "America/New_York";

describe("developer tool examples match the logic", () => {
  it("base64-encoder-decoder", () => {
    for (const index of [0, 1]) {
      const { input, output } = example("base64-encoder-decoder", index);
      assert.equal(encodeBase64(input), output);
      assert.deepEqual(decodeBase64(output), { ok: true, output: input });
    }
    const broken = example("base64-encoder-decoder", 2);
    const result = decodeBase64(broken.input);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, broken.output);
  });

  it("url-encoder-decoder", () => {
    const component = example("url-encoder-decoder", 0);
    assert.deepEqual(encodeUrlText(component.input, "component"), { ok: true, output: component.output });
    const full = example("url-encoder-decoder", 1);
    assert.deepEqual(encodeUrlText(full.input, "full"), { ok: true, output: full.output });
    const query = example("url-encoder-decoder", 2);
    const parsed = parseQueryString(query.input);
    assert.ok(parsed.ok);
    if (parsed.ok) assert.equal(parsed.pairs.map((pair) => `${pair.key} = ${pair.value}`).join("\n"), query.output);
  });

  it("timestamp-converter", () => {
    const seconds = example("timestamp-converter", 0);
    const parsedSeconds = parseTimestamp(seconds.input, "auto");
    assert.ok(parsedSeconds.ok);
    if (parsedSeconds.ok) {
      const view = describeTimestamp(parsedSeconds.ms, { timeZone: NY, now: parsedSeconds.ms });
      assert.equal(seconds.output, `${view.iso}\n${view.us} (${NY})`);
    }

    const millis = example("timestamp-converter", 1);
    const parsedMillis = parseTimestamp(millis.input, "auto");
    assert.ok(parsedMillis.ok);
    if (parsedMillis.ok) assert.equal(millis.output, `Detected ${parsedMillis.unit}: ${new Date(parsedMillis.ms).toISOString()}`);

    const reverse = example("timestamp-converter", 2);
    assert.equal(reverse.input, "2023-11-14 17:13:20 in America/New_York");
    const converted = dateTimeToTimestamp("2023-11-14 17:13:20", NY);
    assert.ok(converted.ok);
    if (converted.ok) assert.equal(reverse.output, String(converted.ms / 1000));
  });

  it("hash-generator", async () => {
    const sha256 = example("hash-generator", 0);
    assert.equal(sha256.input, "abc");
    assert.equal(await hashText(sha256.input, "SHA-256"), sha256.output);
    const sha1 = example("hash-generator", 1);
    assert.equal(await hashText(sha1.input, "SHA-1"), sha1.output);
    const empty = example("hash-generator", 2);
    assert.equal(empty.input, "(empty text)");
    assert.equal(await hashText("", "SHA-256"), empty.output);
  });
});

const allSets: PasswordOptions = { length: 16, upper: true, lower: true, digits: true, symbols: true, excludeAmbiguous: false };

describe("generator tool examples match the logic", () => {
  it("uuid-generator", () => {
    const sample = example("uuid-generator", 0);
    const checked = validateUuid(sample.output);
    assert.ok(checked.valid && checked.version === 4);
    const valid = example("uuid-generator", 1);
    assert.equal(describeUuid(validateUuid(valid.input)), valid.output);
    const invalid = example("uuid-generator", 2);
    assert.equal(describeUuid(validateUuid(invalid.input)), invalid.output);
  });

  it("password-generator", () => {
    const cases: [number, PasswordOptions][] = [
      [0, allSets],
      [1, { ...allSets, length: 12, upper: false, digits: false, symbols: false }],
      [2, { ...allSets, length: 20, symbols: false, excludeAmbiguous: true }],
    ];
    for (const [index, options] of cases) {
      const bits = entropyBits(options);
      assert.equal(example("password-generator", index).output, `${Math.round(bits)} bits of entropy: ${strengthLabel(bits)}`);
    }
  });

  it("random-number-generator", () => {
    const lottery = example("random-number-generator", 0);
    const picked = lottery.output.replace(/^e\.g\. /, "").split(", ").map(Number);
    assert.equal(picked.length, 6);
    assert.equal(new Set(picked).size, 6);
    assert.deepEqual(picked, [...picked].sort((a, b) => a - b));
    assert.ok(picked.every((value) => value >= 1 && value <= 49));
    assert.ok(generateNumbers({ min: 1, max: 49, count: 6, unique: true, decimals: 0, sort: "asc" }).ok);

    const dice = example("random-number-generator", 1);
    const rolled = dice.output.replace(/^e\.g\. /, "").split(", ").map(Number);
    assert.equal(rolled.length, 2);
    assert.ok(rolled.every((value) => value >= 1 && value <= 6));

    const impossible = example("random-number-generator", 2);
    const result = generateNumbers({ min: 1, max: 6, count: 7, unique: true, decimals: 0, sort: "none" });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.error, impossible.output);
  });

  it("qr-code-generator", () => {
    const url = example("qr-code-generator", 0);
    assert.ok(validateQrInput("https://example.com/menu", "M").ok);
    assert.equal(url.output, `Fits level M (${new TextEncoder().encode("https://example.com/menu").length} of ${qrCapacityBytes("M").toLocaleString("en-US")} bytes)`);

    const dark = example("qr-code-generator", 1);
    assert.equal(dark.output, `Contrast ${contrastRatio("#1f2937", "#ffffff")?.toFixed(1)}:1, no warning`);
    assert.equal(contrastWarning("#1f2937", "#ffffff"), null);

    const light = example("qr-code-generator", 2);
    assert.equal(light.output, contrastWarning("#999999", "#ffffff"));
  });
});
