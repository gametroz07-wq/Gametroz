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
    slug: "character-counter",
    name: "Character Counter",
    categorySlug: "text",
    shortDescription: "Count characters with and without spaces, bytes and lines, and check SMS or social limits.",
    description:
      "Count the characters in any text, with and without spaces, plus letters, digits, whitespace, lines and UTF-8 bytes. Pick a limit such as SMS, X or a meta description to see how many characters you have left.",
    howTo: [
      "Type or paste your text into the box.",
      "Read the counters: characters, characters without spaces, letters, digits, whitespace, lines and bytes.",
      "Choose a limit preset, or enter your own, to see how many characters remain or how far over you are.",
      "Trim the text until the counter turns green, then copy it or clear the box.",
    ],
    iconKey: "type",
    featured: false,
    sortOrder: 3,
    tags: ["characters", "character-limit", "sms", "bytes"],
    metaTitle: "Character Counter with Limit Checker",
    metaDescription:
      "Count characters with and without spaces, letters, digits, lines and UTF-8 bytes, and check SMS, X or meta description limits. Free, private and instant.",
    intro: [
      "Many places cap text by characters: 160 for a single SMS, 280 for an X post, roughly 160 for a search snippet. This counter shows the total as you type and, with a preset selected, how many characters you have left.",
      "It counts what a reader sees as one character, so an emoji or a letter with a combining accent counts once, even though both take more than one byte. The byte figure is the size of the text in UTF-8, which matters for databases and APIs with byte limits.",
    ],
    examples: [
      {
        input: "Hello 👋 café",
        output: "12 characters (10 without spaces), 16 bytes",
        note: "The waving hand is one character but takes 4 bytes, and é takes 2.",
      },
      {
        input: "café",
        output: "4 characters, 6 bytes",
        note: "An e followed by a combining accent is displayed, and counted, as one character.",
      },
      {
        input: "Your code is 481516. It expires in 10 minutes.",
        output: "46 of 160 characters, 114 left (SMS)",
        note: "A single SMS fits 160 characters when it uses only the basic GSM alphabet.",
      },
    ],
    faq: [
      {
        question: "Why do characters and bytes differ?",
        answer:
          "A character is what you see on screen. A byte is a unit of storage, and in UTF-8 plain English letters take one byte while accented letters take two, and most emoji take four. Use bytes when a system limits storage size rather than visible length.",
      },
      {
        question: "Does an emoji count as one character?",
        answer:
          "Yes, in this counter. Social networks may count emoji differently, and an SMS that contains an emoji switches encoding and fits only 70 characters per message, so treat the SMS preset as a guide for plain text.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    categorySlug: "text",
    shortDescription: "Switch text between upper, lower, title and sentence case, or camelCase, snake_case and more.",
    description:
      "Convert text to UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, aLtErNaTiNg or iNVERSE case in one click.",
    howTo: [
      "Paste or type your text into the input box.",
      "Click the case you want; the result appears immediately.",
      "For code styles such as camelCase or snake_case, put each name on its own line to convert several at once.",
      "Copy the result, or clear both boxes and start again.",
    ],
    iconKey: "type",
    featured: false,
    sortOrder: 4,
    tags: ["case", "title-case", "camelcase", "snake-case"],
    metaTitle: "Case Converter: Title, Sentence, camelCase",
    metaDescription:
      "Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case and more. Free, private and done in your browser.",
    intro: [
      "Fixing the capitalization of a headline, a pasted all-caps paragraph or a list of variable names by hand is slow and easy to get wrong. Choose a style and the whole text is converted at once.",
      "Title Case keeps short words such as of, the and to in lowercase unless they open or close the line. The code styles split words on spaces, punctuation and capital letters, so XMLHttpRequest becomes xml_http_request, and each line is converted separately.",
    ],
    examples: [
      { input: "the lord of the rings", output: "The Lord of the Rings", note: "Title Case." },
      { input: "XMLHttpRequest failed", output: "xml_http_request_failed", note: "snake_case." },
      { input: "hello world. it's a new day", output: "Hello world. It's a new day", note: "Sentence case." },
    ],
    faq: [
      {
        question: "Which words stay lowercase in Title Case?",
        answer:
          "Articles, short conjunctions and short prepositions such as a, the, and, of, in and to, unless they are the first or last word of a line. Style guides differ on the exact list, so review the result for proper nouns.",
      },
      {
        question: "Can it convert many variable names at once?",
        answer:
          "Yes. Put one name per line and choose camelCase, PascalCase, snake_case, kebab-case or CONSTANT_CASE; every line is converted on its own and line breaks are kept.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    categorySlug: "text",
    shortDescription: "Delete repeated lines from a list and keep the first occurrence of each, in order.",
    description:
      "Paste a list and remove every repeated line while keeping the first occurrence and the original order. Choose whether case matters, trim spaces before comparing, and leave empty lines alone.",
    howTo: [
      "Paste your list with one item per line.",
      "Set the options: case sensitivity, trimming before comparing, and whether to ignore empty lines.",
      "Check the summary to see how many lines were removed.",
      "Copy the cleaned list or clear the box.",
    ],
    iconKey: "type",
    featured: false,
    sortOrder: 5,
    tags: ["duplicates", "lines", "unique", "list-cleaner"],
    metaTitle: "Remove Duplicate Lines from a List",
    metaDescription:
      "Remove duplicate lines from any list and keep the first of each, in the original order. Optional case-insensitive match and trimming. Free and private.",
    intro: [
      "Email lists, keyword exports, log files and to-do lists pick up repeated lines as they are merged. This tool keeps the first time each line appears and drops the rest, so the order you started with is preserved.",
      "By default lines must match exactly. Turn on case-insensitive matching to treat Apple and apple as the same, or trimming to ignore stray spaces around a line. The kept line is always shown exactly as you wrote it.",
    ],
    examples: [
      {
        input: "apple\nBanana\napple\nbanana\nCherry",
        output: "apple\nBanana\nbanana\nCherry",
        note: "Case sensitive: only the exact repeat of apple is removed.",
      },
      {
        input: "apple\nBanana\napple\nbanana\nCherry",
        output: "apple\nBanana\nCherry",
        note: "Case insensitive: banana counts as a repeat of Banana.",
      },
    ],
    faq: [
      {
        question: "What does ignore empty lines do?",
        answer:
          "Blank lines are left exactly where they are instead of being treated as duplicates of each other. That keeps the spacing of a list that has blank separator lines. To delete blank lines instead, use Remove Extra Spaces.",
      },
      {
        question: "Is the order of my lines changed?",
        answer:
          "No. The first occurrence of each line stays in its original position. To sort the list as well, use the Text Sorter with its duplicate option.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "remove-extra-spaces",
    name: "Remove Extra Spaces",
    categorySlug: "text",
    shortDescription: "Collapse repeated spaces and tabs, trim every line and clean up blank lines.",
    description:
      "Clean messy text by collapsing runs of spaces and tabs into one space and trimming each line. Optionally delete empty lines or join all lines into a single paragraph.",
    howTo: [
      "Paste the text you want to clean.",
      "Choose whether to remove empty lines or to join all lines into one paragraph.",
      "Read the summary to see how many characters, empty lines and line breaks were removed.",
      "Copy the cleaned text or clear the box.",
    ],
    iconKey: "type",
    featured: false,
    sortOrder: 6,
    tags: ["spaces", "whitespace", "clean-text", "trim"],
    metaTitle: "Remove Extra Spaces from Text Online",
    metaDescription:
      "Collapse double spaces and tabs, trim every line, delete blank lines or join lines into one paragraph, with a summary of the changes. Free and private.",
    intro: [
      "Text copied from PDFs, emails and spreadsheets often arrives with double spaces, stray tabs and broken lines. Cleaning it by hand is tedious and easy to miss.",
      "Runs of spaces, tabs and non-breaking spaces become a single space, and each line is trimmed. Blank lines are kept unless you ask for them to be removed, and joining lines turns a hard-wrapped paragraph back into one line of text.",
    ],
    examples: [
      {
        input: "  Hello    world \t from   here  ",
        output: "Hello world from here",
        note: "Spaces and tabs collapsed, line trimmed.",
      },
      {
        input: "Line one\n\n  line   two\nline three",
        output: "Line one line two line three",
        note: "With Join lines into one switched on.",
      },
    ],
    faq: [
      {
        question: "Does it remove spaces between words completely?",
        answer:
          "No. Several spaces in a row become exactly one, so words stay separated. Only whitespace at the start and end of each line is removed entirely.",
      },
      {
        question: "Does it change non-breaking spaces?",
        answer:
          "Yes. Non-breaking spaces and other Unicode space characters count as spaces and are collapsed into a normal space, which is usually what you want when cleaning pasted web text.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "text-sorter",
    name: "Text Sorter",
    categorySlug: "text",
    shortDescription: "Sort lines A to Z, Z to A, by number, by length, shuffle them or reverse the order.",
    description:
      "Sort a list line by line alphabetically, in reverse, in natural numeric order or by length, shuffle it randomly, or reverse it. Optionally ignore case, drop empty lines and remove duplicates.",
    howTo: [
      "Paste your list with one item per line.",
      "Pick a sort order from the menu.",
      "Turn on the options you need: ignore case, remove empty lines or remove duplicates.",
      "Copy the sorted list, or press Shuffle again for a new random order.",
    ],
    iconKey: "type",
    featured: false,
    sortOrder: 7,
    tags: ["sort", "alphabetical", "lines", "shuffle"],
    metaTitle: "Text Sorter: Sort Lines Alphabetically",
    metaDescription:
      "Sort lines A to Z, Z to A, by natural number or length, shuffle randomly or reverse order, with optional dedupe and case-insensitive sorting. Free.",
    intro: [
      "Alphabetizing a guest list, ordering file names that contain numbers or randomizing a list of names are all line-sorting jobs. Paste the list and choose how it should be ordered.",
      "Alphabetical sorting compares text character by character, so item10 comes before item2. Natural order compares the numbers by value and puts item2 first. The shuffle uses your browser's secure random generator, so every ordering is equally likely.",
    ],
    examples: [
      { input: "item10\nitem2\nitem1", output: "item1\nitem10\nitem2", note: "A to Z compares digits as text." },
      { input: "item10\nitem2\nitem1", output: "item1\nitem2\nitem10", note: "Natural order compares numbers by value." },
      { input: "pear\nfig\nbanana", output: "fig\npear\nbanana", note: "By length, shortest line first." },
    ],
    faq: [
      {
        question: "Why does item10 come before item2?",
        answer:
          "Plain alphabetical sorting compares one character at a time, and 1 comes before 2. Choose natural order to sort the numbers inside a line by their value instead.",
      },
      {
        question: "Is the shuffle really random?",
        answer:
          "It uses the Web Crypto random number generator built into your browser with an unbiased Fisher-Yates shuffle, so no ordering is favored. It is a good fit for draws and raffles that do not need an audit trail.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    categorySlug: "text",
    shortDescription: "Turn a title into a clean, lowercase URL slug with accents removed and an optional length limit.",
    description:
      "Create a URL-friendly slug from any title. Accents are transliterated, symbols and emoji are dropped, and you can choose the separator, remove common stop words and cap the length without cutting words.",
    howTo: [
      "Type or paste a title or phrase.",
      "Choose a hyphen or an underscore as the separator.",
      "Optionally remove stop words such as the and of, and set a maximum length.",
      "Check the live preview, then copy the slug into your CMS or URL.",
    ],
    iconKey: "type",
    featured: false,
    sortOrder: 8,
    tags: ["slug", "url", "seo", "permalink"],
    metaTitle: "Slug Generator: Clean URL Slugs",
    metaDescription:
      "Turn any title into a clean URL slug: accents transliterated, symbols removed, optional stop words and length limit. Live preview, free and private.",
    intro: [
      "A good slug is short, lowercase and readable: it describes the page in the address bar and in search results. Type a title and the slug updates as you go.",
      "Accented letters are converted to plain ones (café becomes cafe), an ampersand becomes and, apostrophes are dropped and any other symbol or emoji turns into a separator. If you set a maximum length, whole words are kept and the slug is cut at the last word that fits.",
    ],
    examples: [
      {
        input: "Crème Brûlée & Café: 10 Easy Recipes!",
        output: "creme-brulee-and-cafe-10-easy-recipes",
        note: "Accents transliterated, ampersand spelled out.",
      },
      {
        input: "The Art of Making Perfect Sourdough Bread at Home",
        output: "art-making-perfect-sourdough",
        note: "Stop words removed and a 30 character limit.",
      },
      {
        input: "Rock 'n' Roll 🎸 Night",
        output: "rock_n_roll_night",
        note: "Underscore separator; the emoji is dropped.",
      },
    ],
    faq: [
      {
        question: "What happens to non-Latin text?",
        answer:
          "Letters that have no Latin equivalent, such as Chinese, Arabic or Cyrillic characters, cannot be shown in a plain ASCII slug and are dropped. If nothing is left, the tool tells you instead of returning an empty slug silently.",
      },
      {
        question: "Hyphen or underscore?",
        answer:
          "Use hyphens. Search engines treat a hyphen as a word separator, while an underscore can join words together. Underscores are mainly useful for file names and identifiers.",
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
