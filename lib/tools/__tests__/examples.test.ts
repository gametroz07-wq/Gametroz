import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getToolDefinition } from "../definitions";
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
