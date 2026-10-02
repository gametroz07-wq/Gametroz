// JSON formatter, minifier and validator.
//
// This uses its own small parser instead of JSON.parse/JSON.stringify for two reasons:
//  1. Engines do not report error positions consistently, but a formatter needs line and column.
//  2. A round trip through JS values would silently change the data: integers above 2^53 lose
//     digits, "1.50" becomes 1.5, and integer-like keys are reordered. Here every scalar is kept
//     exactly as written.

export type JsonIssue = {
  message: string;
  /** 1-based. */
  line: number;
  /** 1-based, in characters. */
  column: number;
  /** 0-based character offset into the input. */
  offset: number;
};

export type JsonIndent = 2 | 4 | "tab";
export type JsonKind = "object" | "array" | "string" | "number" | "boolean" | "null";

export type JsonTextResult = { ok: true; output: string } | { ok: false; error: JsonIssue };
export type JsonValidation = ({ ok: true; kind: JsonKind } & { size?: number }) | { ok: false; error: JsonIssue };

type JsonNode =
  | { type: "object"; entries: { key: string; value: JsonNode }[] }
  | { type: "array"; items: JsonNode[] }
  | { type: "scalar"; kind: JsonKind; raw: string };

const MAX_DEPTH = 256;

class JsonSyntaxError extends Error {
  constructor(
    message: string,
    readonly offset: number,
  ) {
    super(message);
  }
}

const isDigit = (char: string | undefined) => char !== undefined && char >= "0" && char <= "9";
const isHex = (char: string | undefined) => char !== undefined && /^[0-9a-fA-F]$/.test(char);

class Parser {
  private index = 0;

  constructor(private readonly text: string) {}

  parseDocument(): JsonNode {
    this.skipWhitespace();
    if (this.index >= this.text.length) throw new JsonSyntaxError("Input is empty. Paste some JSON to check it.", 0);
    const value = this.parseValue(1);
    this.skipWhitespace();
    if (this.index < this.text.length) {
      throw new JsonSyntaxError("Unexpected data after the end of the JSON value", this.index);
    }
    return value;
  }

  private skipWhitespace() {
    while (this.index < this.text.length && " \t\n\r".includes(this.text[this.index])) this.index++;
  }

  private fail(message: string, offset = this.index): never {
    throw new JsonSyntaxError(message, offset);
  }

  private unexpected(): never {
    if (this.index >= this.text.length) this.fail("Unexpected end of input");
    this.fail(`Unexpected character "${this.text[this.index]}"`);
  }

  private parseValue(depth: number): JsonNode {
    if (depth > MAX_DEPTH) this.fail(`Nesting is too deep (limit is ${MAX_DEPTH} levels)`);
    const char = this.text[this.index];
    if (char === "{") return this.parseObject(depth);
    if (char === "[") return this.parseArray(depth);
    if (char === '"') return { type: "scalar", kind: "string", raw: this.parseString() };
    if (char === "'") this.fail("Strings must use double quotes, not single quotes");
    if (char === "-" || isDigit(char)) return { type: "scalar", kind: "number", raw: this.parseNumber() };
    for (const [literal, kind] of [
      ["true", "boolean"],
      ["false", "boolean"],
      ["null", "null"],
    ] as const) {
      if (this.text.startsWith(literal, this.index)) {
        this.index += literal.length;
        return { type: "scalar", kind, raw: literal };
      }
    }
    return this.unexpected();
  }

  private parseObject(depth: number): JsonNode {
    this.index++; // {
    const entries: { key: string; value: JsonNode }[] = [];
    this.skipWhitespace();
    if (this.text[this.index] === "}") {
      this.index++;
      return { type: "object", entries };
    }
    for (;;) {
      this.skipWhitespace();
      const char = this.text[this.index];
      if (char === "}" && entries.length > 0) this.fail("Trailing comma is not allowed in JSON");
      if (char === "'") this.fail("Strings must use double quotes, not single quotes");
      if (char !== '"') {
        if (this.index >= this.text.length) this.unexpected();
        this.fail("Property names must be wrapped in double quotes");
      }
      const key = this.parseString();
      this.skipWhitespace();
      if (this.text[this.index] !== ":") {
        if (this.index >= this.text.length) this.unexpected();
        this.fail('Expected ":" after the property name');
      }
      this.index++;
      this.skipWhitespace();
      entries.push({ key, value: this.parseValue(depth + 1) });
      this.skipWhitespace();
      const next = this.text[this.index];
      if (next === ",") {
        this.index++;
        continue;
      }
      if (next === "}") {
        this.index++;
        return { type: "object", entries };
      }
      if (this.index >= this.text.length) this.unexpected();
      this.fail('Expected "," or "}" after the property value');
    }
  }

  private parseArray(depth: number): JsonNode {
    this.index++; // [
    const items: JsonNode[] = [];
    this.skipWhitespace();
    if (this.text[this.index] === "]") {
      this.index++;
      return { type: "array", items };
    }
    for (;;) {
      this.skipWhitespace();
      if (this.text[this.index] === "]" && items.length > 0) this.fail("Trailing comma is not allowed in JSON");
      items.push(this.parseValue(depth + 1));
      this.skipWhitespace();
      const next = this.text[this.index];
      if (next === ",") {
        this.index++;
        continue;
      }
      if (next === "]") {
        this.index++;
        return { type: "array", items };
      }
      if (this.index >= this.text.length) this.unexpected();
      this.fail('Expected "," or "]" after the array item');
    }
  }

  private parseString(): string {
    const start = this.index;
    this.index++; // opening quote
    for (;;) {
      const char = this.text[this.index];
      if (char === undefined) this.fail("Unterminated string: the closing quote is missing", start);
      if (char === '"') {
        this.index++;
        return this.text.slice(start, this.index);
      }
      if (char < " ") this.fail("Line breaks and control characters must be escaped inside strings");
      if (char === "\\") {
        const escape = this.text[this.index + 1];
        if (escape === "u") {
          for (let offset = 2; offset <= 5; offset++) {
            if (!isHex(this.text[this.index + offset])) this.fail("Invalid unicode escape: expected 4 hex digits", this.index + offset);
          }
          this.index += 6;
          continue;
        }
        if (escape === undefined || !'"\\/bfnrt'.includes(escape)) this.fail("Invalid escape sequence", this.index);
        this.index += 2;
        continue;
      }
      this.index++;
    }
  }

  private parseNumber(): string {
    const start = this.index;
    if (this.text[this.index] === "-") this.index++;
    if (this.text[this.index] === "0") {
      this.index++;
      if (isDigit(this.text[this.index])) this.fail("Numbers cannot have leading zeros");
    } else if (isDigit(this.text[this.index])) {
      while (isDigit(this.text[this.index])) this.index++;
    } else {
      this.fail("Expected a digit in the number");
    }
    if (this.text[this.index] === ".") {
      this.index++;
      if (!isDigit(this.text[this.index])) this.fail("Expected a digit after the decimal point");
      while (isDigit(this.text[this.index])) this.index++;
    }
    if (this.text[this.index] === "e" || this.text[this.index] === "E") {
      this.index++;
      if (this.text[this.index] === "+" || this.text[this.index] === "-") this.index++;
      if (!isDigit(this.text[this.index])) this.fail("Expected a digit in the exponent");
      while (isDigit(this.text[this.index])) this.index++;
    }
    return this.text.slice(start, this.index);
  }
}

function toIssue(text: string, error: JsonSyntaxError): JsonIssue {
  const before = text.slice(0, error.offset);
  const breaks = before.match(/\r\n|\r|\n/g);
  const lastBreak = Math.max(before.lastIndexOf("\n"), before.lastIndexOf("\r"));
  return {
    message: error.message,
    line: (breaks?.length ?? 0) + 1,
    column: Array.from(before.slice(lastBreak + 1)).length + 1,
    offset: error.offset,
  };
}

type Parsed = { ok: true; node: JsonNode } | { ok: false; error: JsonIssue };

function parse(text: string): Parsed {
  try {
    return { ok: true, node: new Parser(text).parseDocument() };
  } catch (error) {
    if (error instanceof JsonSyntaxError) return { ok: false, error: toIssue(text, error) };
    throw error;
  }
}

function print(node: JsonNode, unit: string | null, depth: number): string {
  if (node.type === "scalar") return node.raw;
  const children =
    node.type === "array"
      ? node.items.map((item) => print(item, unit, depth + 1))
      : node.entries.map((entry) => `${entry.key}${unit === null ? ":" : ": "}${print(entry.value, unit, depth + 1)}`);
  const [open, close] = node.type === "array" ? ["[", "]"] : ["{", "}"];
  if (children.length === 0) return `${open}${close}`;
  if (unit === null) return `${open}${children.join(",")}${close}`;
  const inner = unit.repeat(depth + 1);
  return `${open}\n${children.map((child) => inner + child).join(",\n")}\n${unit.repeat(depth)}${close}`;
}

const unitFor = (indent: JsonIndent) => (indent === "tab" ? "\t" : " ".repeat(indent));

export function formatJson(text: string, indent: JsonIndent = 2): JsonTextResult {
  const parsed = parse(text);
  return parsed.ok ? { ok: true, output: print(parsed.node, unitFor(indent), 0) } : parsed;
}

export function minifyJson(text: string): JsonTextResult {
  const parsed = parse(text);
  return parsed.ok ? { ok: true, output: print(parsed.node, null, 0) } : parsed;
}

export function validateJson(text: string): JsonValidation {
  const parsed = parse(text);
  if (!parsed.ok) return parsed;
  const { node } = parsed;
  if (node.type === "scalar") return { ok: true, kind: node.kind };
  return { ok: true, kind: node.type, size: node.type === "array" ? node.items.length : node.entries.length };
}

export const describeJsonError = (error: JsonIssue) => `Line ${error.line}, column ${error.column}: ${error.message}`;
