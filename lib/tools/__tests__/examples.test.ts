import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { convertCase, type CaseMode } from "../case-convert";
import { countCharacters, limitStatus } from "../character-count";
import { getToolDefinition } from "../definitions";
import { removeDuplicateLines } from "../duplicate-lines";
import { removeExtraSpaces } from "../extra-spaces";
import { slugify } from "../slug";
import { sortLines } from "../text-sorter";
import { describeJsonError, formatJson, validateJson } from "../json";
import { formatNumber, percentChange, percentOf, whatPercent } from "../percentage";
import { countText } from "../text-stats";

// The worked examples shown on tool pages must be what the tool really produces.

function example(slug: string, index: number) {
  const item = getToolDefinition(slug)?.examples[index];
  assert.ok(item, `${slug} example ${index}`);
  return item;
}

describe("worked examples match the tool logic", () => {
  it("word-counter", () => {
    const { input, output } = example("word-counter", 0);
    const stats = countText(input);
    assert.equal(output, `${stats.words} words, ${stats.characters} characters (${stats.charactersNoSpaces} without spaces), ${stats.sentences} sentence`);
  });

  it("character-counter", () => {
    const first = example("character-counter", 0);
    const stats = countCharacters(first.input);
    assert.equal(first.output, `${stats.characters} characters (${stats.charactersNoSpaces} without spaces), ${stats.bytes} bytes`);

    const second = example("character-counter", 1);
    const accent = countCharacters(second.input);
    assert.equal(second.output, `${accent.characters} characters, ${accent.bytes} bytes`);

    const sms = example("character-counter", 2);
    const smsStatus = limitStatus(countCharacters(sms.input).characters, 160);
    assert.equal(sms.output, `${countCharacters(sms.input).characters} of 160 characters, ${smsStatus.remaining} left (SMS)`);
  });

  it("case-converter", () => {
    const modes: CaseMode[] = ["title", "snake", "sentence"];
    modes.forEach((mode, index) => {
      const { input, output } = example("case-converter", index);
      assert.equal(convertCase(input, mode), output, mode);
    });
  });

  it("remove-duplicate-lines", () => {
    const base = { caseSensitive: true, trim: false, ignoreEmpty: false };
    const sensitive = example("remove-duplicate-lines", 0);
    assert.equal(removeDuplicateLines(sensitive.input, base).output, sensitive.output);
    const insensitive = example("remove-duplicate-lines", 1);
    assert.equal(removeDuplicateLines(insensitive.input, { ...base, caseSensitive: false }).output, insensitive.output);
  });

  it("remove-extra-spaces", () => {
    const plain = example("remove-extra-spaces", 0);
    assert.equal(removeExtraSpaces(plain.input, { removeEmptyLines: false, joinLines: false }).output, plain.output);
    const joined = example("remove-extra-spaces", 1);
    assert.equal(removeExtraSpaces(joined.input, { removeEmptyLines: false, joinLines: true }).output, joined.output);
  });

  it("text-sorter", () => {
    const base = { caseInsensitive: false, removeEmpty: false, dedupe: false };
    const modes = ["az", "natural", "length"] as const;
    modes.forEach((mode, index) => {
      const { input, output } = example("text-sorter", index);
      assert.equal(sortLines(input, { ...base, mode }).output, output, mode);
    });
  });

  it("slug-generator", () => {
    const base = { separator: "-" as const, maxLength: null, removeStopWords: false };
    assert.equal(slugify(example("slug-generator", 0).input, base), example("slug-generator", 0).output);
    assert.equal(
      slugify(example("slug-generator", 1).input, { ...base, removeStopWords: true, maxLength: 30 }),
      example("slug-generator", 1).output,
    );
    assert.equal(slugify(example("slug-generator", 2).input, { ...base, separator: "_" }), example("slug-generator", 2).output);
  });

  it("json-formatter: format and error", () => {
    const formatted = example("json-formatter", 0);
    assert.deepEqual(formatJson(formatted.input), { ok: true, output: formatted.output });

    const broken = example("json-formatter", 1);
    const result = validateJson(broken.input);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(broken.output, describeJsonError(result.error));
  });

  it("percentage-calculator", () => {
    assert.equal(example("percentage-calculator", 0).output, `${formatNumber(percentOf(15, 240))}`);
    assert.equal(example("percentage-calculator", 1).output, `${formatNumber(whatPercent(45, 180) ?? NaN)}%`);
    const change = percentChange(80, 100);
    assert.equal(example("percentage-calculator", 2).output, `+${formatNumber(change?.percent ?? NaN)}%`);
  });
});
