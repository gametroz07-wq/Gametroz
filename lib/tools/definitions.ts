import type { IconKey } from "@/types/content";

/**
 * Source of truth for the Tools section. Every tool the site offers is defined here, with the
 * catalog fields stored in the database and the long-form content shown on its page.
 * `npm run tools:sync` writes the catalog fields to the database; the seed derives from the same data.
 * The tool's UI is resolved by its slug (see lib/tools/implemented.ts and components/tools/registry.tsx).
 */

export type ToolCategoryDefinition = {
  slug: string;
  name: string;
  description: string;
  iconKey: IconKey;
  sortOrder: number;
};

export type ToolExample = {
  input: string;
  output: string;
  note?: string;
};

export type ToolFaq = {
  question: string;
  answer: string;
};

export type ToolDefinition = {
  slug: string;
  name: string;
  categorySlug: string;
  /** One line, shown on cards and under the page title. */
  shortDescription: string;
  description: string;
  howTo: string[];
  iconKey: IconKey;
  featured: boolean;
  /** Global display order; also drives popularity ranking in the database. */
  sortOrder: number;
  tags: string[];
  /** Page title without the site suffix, up to 50 characters. */
  metaTitle: string;
  /** 70 to 160 characters. */
  metaDescription: string;
  /** One to three short paragraphs shown under the workspace. */
  intro: string[];
  examples: ToolExample[];
  /** Only questions people genuinely ask; at most four. */
  faq: ToolFaq[];
  /** True when the tool never sends data anywhere (all current tools). */
  localOnly: boolean;
};

export const toolCategoryDefinitions: ToolCategoryDefinition[] = [
  {
    slug: "text",
    name: "Text",
    description: "Count, clean, sort and reshape text for writing, editing and publishing.",
    iconKey: "type",
    sortOrder: 0,
  },
  {
    slug: "developer",
    name: "Developer",
    description: "Format, encode, hash and inspect data without leaving the browser tab.",
    iconKey: "braces",
    sortOrder: 1,
  },
  {
    slug: "generators",
    name: "Generators",
    description: "Create identifiers, passwords, random numbers and QR codes on demand.",
    iconKey: "wand",
    sortOrder: 2,
  },
  {
    slug: "calculators",
    name: "Calculators",
    description: "Quick answers for percentages, prices, dates and everyday health or money questions.",
    iconKey: "calculator",
    sortOrder: 3,
  },
  {
    slug: "converters",
    name: "Converters",
    description: "Switch between units of length, weight, temperature and data size.",
    iconKey: "arrows",
    sortOrder: 4,
  },
  {
    slug: "images",
    name: "Images",
    description: "Compress, resize and convert pictures locally, so your files never leave your device.",
    iconKey: "image",
    sortOrder: 5,
  },
];

export const toolDefinitions: ToolDefinition[] = [
  {
    slug: "word-counter",
    name: "Word Counter",
    categorySlug: "text",
    shortDescription: "Count words, characters, sentences and reading time as you type.",
    description:
      "Paste or type any text and see words, characters, sentences, paragraphs and lines update instantly, together with estimated reading and speaking time.",
    howTo: [
      "Type or paste your text into the box.",
      "Read the live counters above it; nothing needs to be submitted.",
      "Check reading and speaking time to see how long your text takes to deliver.",
      "Edit until you reach your target, then use Copy or Clear when you are done.",
    ],
    iconKey: "type",
    featured: true,
    sortOrder: 0,
    tags: ["words", "characters", "writing", "reading-time"],
    metaTitle: "Word Counter: Count Words & Characters",
    metaDescription:
      "Count words, characters, sentences and paragraphs as you type, with reading and speaking time. Free, private and processed in your browser.",
    intro: [
      "Essays, captions, cover letters and meta descriptions all come with limits. This counter shows where you stand while you write, so you do not have to paste text into a document just to check its length.",
      "Besides words and characters it counts sentences, paragraphs and lines, and estimates how long the text takes to read silently or to say out loud. Everything is calculated in your browser as you type.",
    ],
    examples: [
      {
        input: "The quick brown fox jumps over the lazy dog.",
        output: "9 words, 44 characters (36 without spaces), 1 sentence",
        note: "Spaces count as characters in the total, but not in the figure without spaces.",
      },
    ],
    faq: [
      {
        question: "What counts as a word?",
        answer:
          "Any run of characters separated by whitespace. A hyphenated term such as well-known and a contraction such as don't each count as one word, and a number counts too.",
      },
      {
        question: "How are reading and speaking times estimated?",
        answer:
          "Reading time assumes about 230 words per minute, a typical pace for silent reading. Speaking time assumes about 130 words per minute, a comfortable pace for a speech or voice-over. Both are estimates, not measurements.",
      },
      {
        question: "Is my text saved or sent anywhere?",
        answer:
          "No. The counting happens in your browser and nothing is uploaded or stored. If you close or reload the tab, the text is gone.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    categorySlug: "developer",
    shortDescription: "Format, minify and validate JSON, with the line and column of any error.",
    description:
      "Pretty-print JSON with 2 spaces, 4 spaces or tabs, minify it for production, or validate it and get the exact line and column of the first syntax error.",
    howTo: [
      "Paste your JSON into the input box.",
      "Choose Format, Minify or Validate.",
      "If the JSON is invalid, read the error: it names the line, the column and what was expected.",
      "Fix the problem and run it again, then copy the result.",
    ],
    iconKey: "braces",
    featured: true,
    sortOrder: 1,
    tags: ["json", "format", "validate", "minify"],
    metaTitle: "JSON Formatter & Validator Online",
    metaDescription:
      "Format, minify and validate JSON in your browser. Errors show the exact line and column. Free, private, and your data is never uploaded.",
    intro: [
      "API responses, config files and log lines often arrive as one unreadable line. Format turns them into indented JSON you can scan, and Minify squeezes them back down for transport or storage.",
      "Validate checks the syntax against the JSON specification and points to the first problem: a trailing comma, a single-quoted string, a missing colon. Values are never rewritten, so large numbers, number formats and key order stay exactly as you wrote them.",
    ],
    examples: [
      {
        input: '{"tool":"json-formatter","free":true,"limits":[1,2]}',
        output: '{\n  "tool": "json-formatter",\n  "free": true,\n  "limits": [\n    1,\n    2\n  ]\n}',
        note: "Formatted with 2 spaces.",
      },
      {
        input: '{"name": "Gametroz", "tags": ["games", "tools",]}',
        output: "Line 1, column 48: Trailing comma is not allowed in JSON",
        note: "JSON does not allow a comma after the last item.",
      },
    ],
    faq: [
      {
        question: "Why is my JSON invalid when it works in JavaScript?",
        answer:
          "JSON is stricter than JavaScript object syntax. Keys and strings need double quotes, trailing commas are not allowed, and comments, undefined and single quotes are not part of the format.",
      },
      {
        question: "Does formatting change my data?",
        answer:
          "No. Only whitespace changes. Numbers, strings, key order and duplicate keys are kept exactly as written, which matters for IDs larger than 9,007,199,254,740,991.",
      },
      {
        question: "Is there a size limit?",
        answer:
          "There is no fixed limit, but everything runs in your browser, so very large files (tens of megabytes) may feel slow on a phone. Nesting deeper than 256 levels is rejected.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    categorySlug: "calculators",
    shortDescription: "Find a percentage of a number, what percent one number is of another, and percent change.",
    description:
      "Four everyday percentage calculations side by side: X% of Y, X is what percent of Y, percentage change between two values, and increasing or decreasing a value by a percentage.",
    howTo: [
      "Find the card that matches your question.",
      "Enter your two numbers; the answer updates as you type.",
      "Use the increase and decrease card to add or remove a percentage, for example a tax or a discount.",
      "Copy a result or reset the form to start over.",
    ],
    iconKey: "percent",
    featured: true,
    sortOrder: 2,
    tags: ["percentage", "percent-change", "math", "calculator"],
    metaTitle: "Percentage Calculator: Percent Of & Change",
    metaDescription:
      "Calculate X% of a number, what percent one number is of another, percent increase or decrease, and add or remove a percentage. Free and instant.",
    intro: [
      "Percentages show up in discounts, tips, grades, growth reports and recipes. Each card here answers one specific question, so you can pick the one that matches yours instead of rearranging a formula.",
      "Results update as you type, show a sensible number of decimals, and say so when a calculation is not possible, such as a percentage of zero.",
    ],
    examples: [
      { input: "15% of 240", output: "36" },
      { input: "45 is what percent of 180", output: "25%" },
      { input: "Change from 80 to 100", output: "+25%", note: "Percent change is measured against the starting value." },
    ],
    faq: [
      {
        question: "How is percentage change calculated?",
        answer:
          "Subtract the old value from the new one, divide by the old value, and multiply by 100. Going from 80 to 100 is (100 - 80) / 80 = 25% more. Going back from 100 to 80 is a 20% decrease, because the starting value is different.",
      },
      {
        question: "Why can't I calculate a change from zero?",
        answer:
          "A change is measured relative to the starting value, and dividing by zero has no meaning. A jump from 0 to 10 cannot be expressed as a percentage.",
      },
    ],
    localOnly: true,
  },
];

const definitionsBySlug = new Map(toolDefinitions.map((tool) => [tool.slug, tool]));

export function getToolDefinition(slug: string) {
  return definitionsBySlug.get(slug);
}
