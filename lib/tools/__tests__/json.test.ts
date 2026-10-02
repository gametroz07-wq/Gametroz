import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { describeJsonError, formatJson, minifyJson, validateJson } from "../json";

function issueFor(input: string) {
  const result = validateJson(input);
  assert.equal(result.ok, false, `expected ${JSON.stringify(input)} to be invalid`);
  if (result.ok) throw new Error("unreachable");
  return result.error;
}

describe("formatJson", () => {
  it("pretty-prints with 2 spaces by default", () => {
    assert.deepEqual(formatJson('{"a":1,"b":[true,null,"x"],"c":{}}'), {
      ok: true,
      output: '{\n  "a": 1,\n  "b": [\n    true,\n    null,\n    "x"\n  ],\n  "c": {}\n}',
    });
  });

  it("supports 4 spaces and tabs", () => {
    assert.deepEqual(formatJson("[1]", 4), { ok: true, output: "[\n    1\n]" });
    assert.deepEqual(formatJson("[1]", "tab"), { ok: true, output: "[\n\t1\n]" });
  });

  it("keeps big numbers, number formats and key order untouched", () => {
    assert.deepEqual(formatJson('{"b":12345678901234567890,"1":1.50,"a":1e3}'), {
      ok: true,
      output: '{\n  "b": 12345678901234567890,\n  "1": 1.50,\n  "a": 1e3\n}',
    });
  });

  it("keeps duplicate keys and string escapes as written", () => {
    assert.deepEqual(formatJson('{"k":"a\\n\\u00e9","k":2}'), {
      ok: true,
      output: '{\n  "k": "a\\n\\u00e9",\n  "k": 2\n}',
    });
  });

  it("accepts any JSON value at the root", () => {
    assert.deepEqual(formatJson(' "hi" '), { ok: true, output: '"hi"' });
    assert.deepEqual(formatJson("42"), { ok: true, output: "42" });
  });

  it("returns the error for invalid input", () => {
    assert.equal(formatJson("{").ok, false);
  });
});

describe("minifyJson", () => {
  it("removes insignificant whitespace but not whitespace inside strings", () => {
    assert.deepEqual(minifyJson('{\n  "a" : [ 1 , 2 ],\n  "b": "x  y"\n}'), {
      ok: true,
      output: '{"a":[1,2],"b":"x  y"}',
    });
  });
});

describe("validateJson", () => {
  it("summarizes valid documents", () => {
    assert.deepEqual(validateJson('{"a":1,"b":2}'), { ok: true, kind: "object", size: 2 });
    assert.deepEqual(validateJson("[1,2,3]"), { ok: true, kind: "array", size: 3 });
    assert.deepEqual(validateJson("true"), { ok: true, kind: "boolean" });
    assert.deepEqual(validateJson("null"), { ok: true, kind: "null" });
    assert.deepEqual(validateJson('"x"'), { ok: true, kind: "string" });
    assert.deepEqual(validateJson("-1.5e+2"), { ok: true, kind: "number" });
  });

  it("reports line and column of the offending character", () => {
    const issue = issueFor('{\n  "a": 1,\n  "b": \n}');
    assert.equal(issue.line, 4);
    assert.equal(issue.column, 1);
    assert.match(issue.message, /unexpected/i);
  });

  it("flags trailing commas", () => {
    const issue = issueFor('{"tags": ["a", "b",]}');
    assert.equal(issue.line, 1);
    assert.equal(issue.column, 20);
    assert.match(issue.message, /trailing comma/i);
  });

  it("flags single-quoted strings and unquoted keys", () => {
    assert.match(issueFor("{'a': 1}").message, /double quotes/i);
    assert.match(issueFor("{a: 1}").message, /double quotes/i);
  });

  it("flags missing separators", () => {
    assert.match(issueFor('{"a" 1}').message, /":"/);
    assert.match(issueFor("[1 2]").message, /","/);
  });

  it("flags unterminated input at the end", () => {
    const issue = issueFor('{"a": [1, 2');
    assert.equal(issue.line, 1);
    assert.equal(issue.column, 12);
    assert.match(issue.message, /end of input/i);
  });

  it("flags invalid numbers, literals, escapes and control characters", () => {
    for (const input of ["[01]", "[1.]", "[.5]", "[tru]", '["\\x"]', '["a\nb"]', '["\\u12G4"]', "[+1]", "[1e]"]) {
      assert.ok(issueFor(input), input);
    }
  });

  it("flags data after the first value", () => {
    const issue = issueFor('{"a":1} {"b":2}');
    assert.equal(issue.column, 9);
    assert.match(issue.message, /after the end/i);
  });

  it("treats empty input as an error with a clear message", () => {
    assert.match(issueFor("  \n ").message, /empty/i);
  });

  it("rejects absurdly deep nesting instead of overflowing the stack", () => {
    assert.match(issueFor("[".repeat(5000)).message, /too deep/i);
  });

  it("counts lines for CRLF input", () => {
    const issue = issueFor('{\r\n"a": x}');
    assert.equal(issue.line, 2);
    assert.equal(issue.column, 6);
  });
});

describe("describeJsonError", () => {
  it("formats a readable one-line summary", () => {
    assert.equal(
      describeJsonError({ message: "Unexpected token }", line: 4, column: 1, offset: 20 }),
      "Line 4, column 1: Unexpected token }",
    );
  });
});
