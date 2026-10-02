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
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder & Decoder",
    categorySlug: "developer",
    shortDescription: "Encode text to Base64 or decode it back, with correct UTF-8 handling and a URL-safe option.",
    description:
      "Convert text to Base64 and Base64 back to text. Emoji and accented letters round-trip correctly because the text is handled as UTF-8, and a URL-safe alphabet is available for tokens and query strings.",
    howTo: [
      "Choose Encode or Decode.",
      "Type or paste your text or Base64 string.",
      "For tokens and URLs, turn on the URL-safe alphabet, and drop the = padding if you need to.",
      "Copy the result, or use Swap to run the output back through the opposite direction.",
    ],
    iconKey: "braces",
    featured: false,
    sortOrder: 9,
    tags: ["base64", "encode", "decode", "utf-8"],
    metaTitle: "Base64 Encoder & Decoder Online",
    metaDescription:
      "Encode and decode Base64 in your browser with full UTF-8 support, a URL-safe option and clear errors for invalid input. Free, private and instant.",
    intro: [
      "Base64 turns bytes into plain ASCII letters, digits and a few symbols, so data can travel through systems that only accept text: email bodies, JSON fields, data URLs, HTTP headers. It is an encoding, not encryption, so anyone can reverse it.",
      "Text is converted to UTF-8 before encoding, so café, 日本語 and emoji come out right, which the browser's built-in btoa cannot do on its own. Decoding accepts standard and URL-safe input, with or without padding, and tells you exactly where invalid input goes wrong. It works the same on a phone.",
    ],
    examples: [
      { input: "Hello, Gametroz!", output: "SGVsbG8sIEdhbWV0cm96IQ==", note: "Plain ASCII text, standard alphabet." },
      { input: "Café ☕", output: "Q2Fmw6kg4piV", note: "The accent and the emoji are encoded as UTF-8 bytes." },
      {
        input: "SGVsbG8*",
        output: 'Invalid character "*" at position 8. Base64 uses A-Z, a-z, 0-9, + / (or - _) and = padding.',
        note: "Decoding reports the first character that does not belong.",
      },
    ],
    faq: [
      {
        question: "Is Base64 a form of encryption?",
        answer:
          "No. Base64 only changes how data is written, and anyone can decode it in one step. Never use it to hide passwords or secrets; use real encryption for that.",
      },
      {
        question: "What is URL-safe Base64?",
        answer:
          "The standard alphabet uses + and /, which have special meaning in URLs. The URL-safe variant swaps them for - and _ and often drops the trailing = padding, which is why JWTs and many tokens look the way they do.",
      },
      {
        question: "Why does decoding say the bytes are not valid UTF-8?",
        answer:
          "The Base64 itself is fine, but it does not hold text. It probably encodes binary data such as an image or a compressed file, which cannot be shown as readable characters.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder & Decoder",
    categorySlug: "developer",
    shortDescription: "Percent-encode or decode URLs and query values, and list the key/value pairs of any query string.",
    description:
      "Encode text with encodeURIComponent for a single value or encodeURI for a whole address, decode percent-escapes with clear errors for malformed ones, and break a query string into a readable list of keys and values.",
    howTo: [
      "Pick Encode or Decode, then choose the mode: component for a single value, full URL for a whole address.",
      "Paste your text or URL.",
      "When decoding query strings, turn on plus-as-space so form data reads correctly.",
      "Use the query parser to list every key and value of a URL, then copy what you need.",
    ],
    iconKey: "globe",
    featured: false,
    sortOrder: 10,
    tags: ["url", "percent-encoding", "query-string", "encode"],
    metaTitle: "URL Encoder & Decoder: Percent Encoding",
    metaDescription:
      "Encode or decode URLs with encodeURIComponent or encodeURI, spot malformed percent-escapes, and parse query strings into key/value pairs. Free and private.",
    intro: [
      "URLs can only carry a limited set of characters. Spaces, accents, ampersands and slashes inside a value must be written as percent-escapes such as %20 or %C3%A9, otherwise they break the address or change its meaning.",
      "Component mode encodes everything that is not safe inside one value, which is what you want for a query parameter. Full URL mode leaves the structure (:, /, ?, &, =, #) alone and only escapes the rest. The query parser splits a URL into its keys and values and keeps repeated keys, which makes long tracking links easy to read.",
    ],
    examples: [
      { input: "name=Ana & Bob/2026?", output: "name%3DAna%20%26%20Bob%2F2026%3F", note: "Component mode: every reserved character is escaped." },
      {
        input: "https://example.com/a b?q=café",
        output: "https://example.com/a%20b?q=caf%C3%A9",
        note: "Full URL mode keeps the address structure and escapes only the space and the accent.",
      },
      {
        input: "https://shop.example.com/search?q=red+shoes&size=9&sort=price%20asc",
        output: "q = red shoes\nsize = 9\nsort = price asc",
        note: "Query parser: each parameter on its own line, decoded.",
      },
    ],
    faq: [
      {
        question: "Should I use component or full URL mode?",
        answer:
          "Use component mode for a single piece such as a query value or a path segment. Use full URL mode only when you already have a complete address and want to escape stray spaces or non-ASCII characters without breaking its structure.",
      },
      {
        question: "Why does decoding fail with a malformed percent-encoding error?",
        answer:
          "A percent sign must be followed by two hex digits, and the escaped bytes must form valid UTF-8. A lone % (as in 100%) or a truncated sequence such as %E2%98 cannot be decoded.",
      },
      {
        question: "What does plus-as-space do?",
        answer:
          "HTML forms write a space as + in query strings, while %20 is used everywhere else. Turn the option on when decoding form data or query strings, and leave it off for paths and other text where a + is a real plus sign.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "timestamp-converter",
    name: "Unix Timestamp Converter",
    categorySlug: "developer",
    shortDescription: "Convert Unix timestamps to readable dates and dates back to timestamps, in UTC and your time zone.",
    description:
      "Paste a Unix timestamp in seconds or milliseconds and see it as UTC ISO 8601, your local time, a US-style date and a relative time. Or pick a date and time to get its timestamp.",
    howTo: [
      "Paste a Unix timestamp, or press Now to use the current time.",
      "Leave the unit on Auto-detect, or force seconds or milliseconds.",
      "Read the UTC, local, US-style and relative results, and copy any of them.",
      "To go the other way, pick a date and time in the second panel to get its timestamp.",
    ],
    iconKey: "terminal",
    featured: false,
    sortOrder: 11,
    tags: ["timestamp", "unix-time", "epoch", "date"],
    metaTitle: "Unix Timestamp Converter to Date & Back",
    metaDescription:
      "Convert Unix timestamps in seconds or milliseconds to UTC, local and US-formatted dates, see relative time, and turn any date into a timestamp. Free.",
    intro: [
      "A Unix timestamp counts the seconds (or milliseconds) since January 1, 1970 at 00:00:00 UTC. Logs, APIs, databases and JWTs use it because it is a single number with no time zone attached.",
      "The tool tells seconds and milliseconds apart by size, so a 10-digit value is read as seconds and a 13-digit value as milliseconds. You can override that. Results are shown as UTC (ISO 8601), in your device's time zone, in a US-friendly format and as relative time, such as 3 days ago. The date-to-timestamp panel reads the time in your time zone.",
    ],
    examples: [
      {
        input: "1700000000",
        output: "2023-11-14T22:13:20.000Z\nTuesday, November 14, 2023, 5:13:20 PM (America/New_York)",
        note: "Ten digits are read as seconds; the second line is the same moment in New York.",
      },
      {
        input: "1700000000000",
        output: "Detected milliseconds: 2023-11-14T22:13:20.000Z",
        note: "Thirteen digits are read as milliseconds, so it is the same moment.",
      },
      {
        input: "2023-11-14 17:13:20 in America/New_York",
        output: "1700000000",
        note: "A wall-clock time in a time zone converted to Unix seconds.",
      },
    ],
    faq: [
      {
        question: "How does the tool tell seconds from milliseconds?",
        answer:
          "By magnitude. Values with an absolute size of 100 billion or more are read as milliseconds, anything smaller as seconds. That covers every date from 1973 to the year 5138 in seconds. Choose a unit yourself if you have an unusual value.",
      },
      {
        question: "What time zone is used for local time?",
        answer:
          "The time zone your browser reports for your device. The date-to-timestamp panel reads the date and time you enter in that same zone, including its daylight saving rules.",
      },
      {
        question: "What happens in 2038?",
        answer:
          "Systems that store seconds in a signed 32-bit number overflow on January 19, 2038. This converter uses 64-bit floating point numbers, so dates far beyond 2038 work fine here.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator (SHA-256 & more)",
    categorySlug: "developer",
    shortDescription: "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text or a file, locally in your browser.",
    description:
      "Compute SHA-1, SHA-256, SHA-384 and SHA-512 checksums for text or a file using your browser's Web Crypto API. Files are read on your device and never uploaded. MD5 is not offered.",
    howTo: [
      "Type or paste text, or choose a file to hash.",
      "Pick lowercase or uppercase hex output.",
      "Read all four hashes, which update as you type.",
      "Copy the hash you need, or compare it with a published checksum to verify a download.",
    ],
    iconKey: "shield",
    featured: false,
    sortOrder: 12,
    tags: ["hash", "sha-256", "checksum", "sha-1"],
    metaTitle: "Hash Generator: SHA-256, SHA-1, SHA-512",
    metaDescription:
      "Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes for text or files using Web Crypto. Everything stays in your browser. Free; MD5 is not offered.",
    intro: [
      "A hash is a fixed-length fingerprint of some data: the same input always gives the same hash, and changing a single character changes it completely. It is used to verify downloads, detect changes and identify content.",
      "Hashes are computed with the Web Crypto API built into your browser. Files are read on your device, so nothing is uploaded, and very large files are limited only by your device's memory. MD5 is not offered because it is broken for security use and the browser does not provide it. SHA-1 is included for compatibility with older systems, but it should not be used for anything security-related; prefer SHA-256 or stronger.",
    ],
    examples: [
      { input: "abc", output: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", note: "SHA-256 of the text abc." },
      { input: "abc", output: "a9993e364706816aba3e25717850c26c9cd0d89d", note: "SHA-1 of the same text: shorter, and no longer considered safe." },
      {
        input: "(empty text)",
        output: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        note: "Even nothing has a SHA-256 hash.",
      },
    ],
    faq: [
      {
        question: "Why is there no MD5?",
        answer:
          "MD5 has been broken for security purposes for years, and the Web Crypto API deliberately leaves it out. To compare a download against an old MD5 checksum, use a command-line tool; for new work, use SHA-256.",
      },
      {
        question: "Is SHA-1 safe to use?",
        answer:
          "Not for security. Collisions can be produced deliberately, so it should not be used for signatures or certificates. It is still fine for non-adversarial uses such as matching an existing checksum or a Git object ID.",
      },
      {
        question: "Can I hash a password with this?",
        answer:
          "You can compute the hash, but a plain SHA hash is the wrong way to store passwords because it is fast to brute-force. Real systems use slow, salted algorithms such as Argon2, scrypt or bcrypt.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator & Validator",
    categorySlug: "generators",
    shortDescription: "Generate random version 4 UUIDs in bulk, or check whether a UUID is valid and which version it is.",
    description:
      "Create up to 100 random version 4 UUIDs at once with uppercase and hyphen options, or paste UUIDs to validate them and see their version and variant.",
    howTo: [
      "Choose how many UUIDs you need, from 1 to 100.",
      "Set uppercase or no hyphens if your system expects it, then press Generate.",
      "Copy one UUID or the whole list.",
      "To check existing ones, paste them into the validator, one per line.",
    ],
    iconKey: "code",
    featured: false,
    sortOrder: 13,
    tags: ["uuid", "guid", "identifier", "random"],
    metaTitle: "UUID Generator & Validator (v4)",
    metaDescription:
      "Generate random v4 UUIDs in bulk with uppercase and no-hyphen options, and validate pasted UUIDs to see their version. Free, private, and runs in your browser.",
    intro: [
      "A UUID is a 128-bit identifier written as 32 hex digits in five groups, such as f47ac10b-58cc-4372-a567-0e02b2c3d479. Version 4 UUIDs are random, so you can create them anywhere without a central counter and still expect no collisions.",
      "They are generated with your browser's cryptographic random number generator. The validator accepts the usual spellings (with braces, a urn:uuid: prefix, uppercase or without hyphens) and tells you the version and variant, for example whether an identifier is time-based version 1 or version 7. Nothing is sent or stored.",
    ],
    examples: [
      {
        input: "Generate 1 UUID (version 4)",
        output: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        note: "A sample result; every click gives a new random value.",
      },
      { input: "123e4567-e89b-12d3-a456-426614174000", output: "Valid UUID, version 1 (RFC 9562 variant).", note: "Validator: a time-based UUID." },
      {
        input: "f47ac10b-58cc-4372-a567-0e02b2c3d47",
        output: "Not a UUID. Expected 32 hex digits, usually as 8-4-4-4-12 groups.",
        note: "One digit short, so it is rejected.",
      },
    ],
    faq: [
      {
        question: "Can two UUIDs ever be the same?",
        answer:
          "In theory yes, in practice no. A version 4 UUID has 122 random bits, so you would need to generate billions per second for decades before a collision became likely.",
      },
      {
        question: "What is the difference between a UUID and a GUID?",
        answer:
          "Nothing in practice. GUID is Microsoft's name for the same 128-bit format, and it is often written in uppercase or with braces, which this tool can produce and read.",
      },
      {
        question: "Are these UUIDs safe to use as secrets?",
        answer:
          "They are random, but a UUID is an identifier, not a credential. Do not use one as a password or an access token; use a long random token generated for that purpose.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    categorySlug: "generators",
    shortDescription: "Create strong random passwords with the length and character types you choose, with an entropy estimate.",
    description:
      "Generate random passwords from 8 to 128 characters using uppercase, lowercase, digits and symbols, with an option to skip look-alike characters. Passwords are created in your browser with a cryptographic random number generator and are never stored.",
    howTo: [
      "Set the length, from 8 to 128 characters; longer is stronger.",
      "Choose the character types to include, and exclude look-alike characters if you will type it by hand.",
      "Press Generate; make several at once if you want to pick one.",
      "Copy the password straight into your password manager.",
    ],
    iconKey: "shield",
    featured: true,
    sortOrder: 14,
    tags: ["password", "random", "security", "entropy"],
    metaTitle: "Random Password Generator: Strong & Secure",
    metaDescription:
      "Generate strong random passwords up to 128 characters with an entropy estimate. Uses your browser's secure random generator; nothing is stored or sent.",
    intro: [
      "A strong password is long and unpredictable. This generator picks each character with your browser's cryptographic random number generator and avoids modulo bias, so every allowed character is equally likely. Each selected character type is guaranteed to appear at least once.",
      "The strength meter shows an estimate of entropy in bits, which grows with length and with the size of the character pool. Passwords are generated on your device and are not saved, logged or sent anywhere, and they are gone when you leave the page or press Clear. Use a password manager to keep them.",
    ],
    examples: [
      {
        input: "16 characters, uppercase + lowercase + digits + symbols",
        output: "103 bits of entropy: Very strong",
        note: "Using the full pool of 87 characters.",
      },
      {
        input: "12 characters, lowercase letters only",
        output: "56 bits of entropy: Fair",
        note: "Same idea with a much smaller pool.",
      },
      {
        input: "20 characters, letters and digits, no ambiguous characters",
        output: "116 bits of entropy: Very strong",
        note: "Skipping I, l, 1, O, 0 and o makes it easier to read aloud.",
      },
    ],
    faq: [
      {
        question: "How long should my password be?",
        answer:
          "At least 14 characters for most accounts, and 20 or more for important ones such as email or your password manager. Length adds more strength than extra symbols do.",
      },
      {
        question: "Is it safe to generate a password in a web page?",
        answer:
          "Here, yes: the password is created in your browser and never leaves it, and nothing is stored. Still, paste it directly into a password manager and avoid sharing it in chat or email.",
      },
      {
        question: "What does the entropy estimate mean?",
        answer:
          "It is the length times the base-2 logarithm of the character pool, a measure of how many guesses an attacker would need. It slightly overstates the true value because each selected type must appear once. Above 80 bits is very strong for online accounts.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    categorySlug: "generators",
    shortDescription: "Pick random numbers in any range, with unique-only, decimals and sorting, using secure randomness.",
    description:
      "Generate one or many random numbers between a minimum and maximum (both included), with options for unique values, decimal places and sorting. Quick presets cover dice and coin flips.",
    howTo: [
      "Enter the minimum and maximum; both can be picked.",
      "Set how many numbers you want, and turn on Unique to avoid repeats.",
      "Add decimal places or sorting if you need them, or tap a preset such as a die.",
      "Press Generate and copy the results.",
    ],
    iconKey: "sparkles",
    featured: false,
    sortOrder: 15,
    tags: ["random-number", "dice", "lottery", "generator"],
    metaTitle: "Random Number Generator: Range, Unique, Dice",
    metaDescription:
      "Generate random numbers in any range with unique-only, decimals and sorting. Uses secure browser randomness without bias. Free, with dice and coin presets.",
    intro: [
      "Choose a range and get fair random numbers: raffle picks, lottery-style draws, test data, dice rolls or a quick yes or no. Both the minimum and the maximum can come up.",
      "Numbers come from your browser's cryptographic random number generator. The tool throws away the few values that would make small results slightly more likely, so every number in the range has exactly the same chance. In unique mode a number appears at most once, and you get a clear message if the range is too small for the count you asked for.",
    ],
    examples: [
      {
        input: "Lottery style: 6 unique numbers from 1 to 49, sorted",
        output: "e.g. 4, 12, 19, 27, 38, 45",
        note: "A sample result; every draw is different.",
      },
      { input: "Roll two six-sided dice: min 1, max 6, count 2", output: "e.g. 3, 5", note: "Repeats are allowed, as with real dice." },
      {
        input: "7 unique numbers from 1 to 6",
        output: "Cannot pick 7 unique numbers from a range that only holds 6 values. Widen the range or lower the count.",
        note: "Impossible requests are explained instead of silently repeating numbers.",
      },
    ],
    faq: [
      {
        question: "Are the numbers truly random?",
        answer:
          "They come from the cryptographically secure generator built into your browser, which is much better than Math.random and is unbiased across the range. It is suitable for games, draws and sampling, but verify the rules of any official lottery or legal drawing yourself.",
      },
      {
        question: "How do decimals work?",
        answer:
          "With 2 decimal places, every value on that grid is equally likely, such as 1.25, 1.26 and so on up to the maximum. The maximum itself can be drawn, as long as it fits the grid.",
      },
      {
        question: "What are the limits?",
        answer:
          "Minimum and maximum can be between -1,000,000,000 and 1,000,000,000, you can ask for up to 1,000 numbers at once, and use up to 6 decimal places.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    categorySlug: "generators",
    shortDescription: "Make a QR code from a URL or text, choose colors and error correction, and download it as PNG or SVG.",
    description:
      "Create a QR code from any text or link, with four error correction levels, a size from 128 to 1024 pixels, custom colors with a contrast warning, and downloads as PNG or SVG. Generated on your device.",
    howTo: [
      "Type or paste a URL or any text.",
      "Pick an error correction level: higher levels survive damage better but hold less data.",
      "Choose the size and colors; keep a dark code on a light background.",
      "Scan the preview with your phone to test it, then download the PNG or SVG.",
    ],
    iconKey: "wand",
    featured: false,
    sortOrder: 16,
    tags: ["qr-code", "generator", "url", "svg"],
    metaTitle: "QR Code Generator: PNG & SVG Download",
    metaDescription:
      "Create a QR code from a link or text, pick colors and error correction, and download PNG or SVG. Generated in your browser, so your data is never uploaded.",
    intro: [
      "Paste a link, a Wi-Fi string, a phone number or plain text and get a QR code you can print or share. The code is generated entirely in your browser: your text is never sent to a server, and there is no account, watermark or expiry.",
      "Error correction lets a code stay readable when part of it is dirty or covered: level L restores about 7% of the data, M about 15%, Q about 25% and H about 30%. Download a PNG for documents and screens, or an SVG that stays sharp at any print size. The tool warns you when your colors have too little contrast to scan reliably.",
    ],
    examples: [
      {
        input: "https://example.com/menu (error correction M)",
        output: "Fits level M (24 of 2,331 bytes)",
        note: "A short link uses a tiny fraction of the capacity, so the code stays simple and easy to scan.",
      },
      { input: "Code #1f2937 on background #ffffff", output: "Contrast 14.7:1, no warning", note: "Dark gray on white scans reliably." },
      {
        input: "Code #999999 on background #ffffff",
        output: "Low contrast (2.8:1). Many scanners need at least 3:1, so this code may not scan. Use a darker code on a lighter background.",
        note: "Pale colors can look nice but fail in poor light.",
      },
    ],
    faq: [
      {
        question: "Does the QR code expire or track scans?",
        answer:
          "No. The code simply contains your text, so it works forever and nobody can see who scans it. If the link inside changes, the code does not update; point it at a redirect you control if you may need to change the destination.",
      },
      {
        question: "Which error correction level should I choose?",
        answer:
          "M is a good default. Use Q or H if the code will be printed on rough surfaces or partly covered by a logo, and L when you need to fit a lot of text.",
      },
      {
        question: "Why will my code not scan?",
        answer:
          "The usual causes are low contrast, an inverted (light on dark) code, a very small print size, or too much data. Keep a quiet margin around the code, use dark on light, and test with your phone before printing.",
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
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    categorySlug: "calculators",
    shortDescription: "Find the sale price and your savings from a percent or dollar discount, with a second discount and sales tax.",
    description:
      "Enter the original price and a percent or dollar amount off to see the sale price and how much you save. Optionally stack a second discount and add sales tax to estimate the total at checkout.",
    howTo: [
      "Enter the original price in dollars.",
      "Choose whether the discount is a percentage or a dollar amount, and enter it.",
      "Add a second discount for sales that stack, such as an extra 10% off clearance, and a sales tax rate if you want the checkout total.",
      "Read the sale price, what you save and the total, then copy the summary.",
    ],
    iconKey: "percent",
    featured: false,
    sortOrder: 17,
    tags: ["discount", "sale-price", "sales-tax", "savings"],
    metaTitle: "Discount Calculator: Sale Price & Savings",
    metaDescription:
      "Calculate the sale price and savings from a percent or dollar discount, stack a second discount and add sales tax to see your checkout total. Free.",
    intro: [
      "Seeing 30% off a $64.99 jacket is easy; seeing what you actually pay after an extra coupon and tax is not. Enter the price and the discount and the sale price, the savings and your effective percentage saved appear right away.",
      "A second discount is applied to the already reduced price, the way stores take stacked offers, and sales tax is added last, like at a US checkout. Amounts are rounded to the cent only at the end of each step, and nothing is stored or sent anywhere.",
    ],
    examples: [
      {
        input: "$80.00 item, 25% off",
        output: "Sale price $60.00, you save $20.00 (25%)",
      },
      {
        input: "$80.00 item, 25% off, then an extra 10% off",
        output: "Sale price $54.00, you save $26.00 (32.5%)",
        note: "The second discount applies to the reduced price, so 25% and 10% do not add up to 35%.",
      },
      {
        input: "$59.99 item, $10 off, 8.25% sales tax",
        output: "Sale price $49.99, tax $4.12, total $54.11",
        note: "Tax is charged on the discounted price.",
      },
    ],
    faq: [
      {
        question: "Why is 20% off and then another 20% off not 40% off?",
        answer:
          "The second discount is taken from the price after the first one, not from the original. A $100 item becomes $80 and then $64, so the total saving is 36%, not 40%.",
      },
      {
        question: "Is sales tax charged before or after the discount?",
        answer:
          "In most US states tax is figured on the price after a store discount, which is how this calculator works. Manufacturer coupons, rates and exemptions vary by state and city, so check your receipt for the exact figure.",
      },
      {
        question: "Does it work for currencies other than dollars?",
        answer:
          "The arithmetic is the same in any currency. Amounts are shown with a $ sign and nothing is converted, because the tool uses no exchange rates.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    categorySlug: "calculators",
    shortDescription: "Find your exact age in years, months and days, plus your next birthday and how many days away it is.",
    description:
      "Enter a birth date to see your exact age in years, months and days, the total months, weeks and days you have lived, and a countdown to your next birthday and the weekday it falls on.",
    howTo: [
      "Pick a birth date with the date picker or type it in.",
      "Leave the as-of date on today, or choose another date to see the age on that day.",
      "Read the exact age, the totals and the next birthday countdown.",
      "Copy the summary, or reset to start again.",
    ],
    iconKey: "calculator",
    featured: false,
    sortOrder: 18,
    tags: ["age", "birthday", "date", "countdown"],
    metaTitle: "Age Calculator: Exact Age in Years & Days",
    metaDescription:
      "Enter a birth date to see your exact age in years, months and days, total days lived and a countdown to your next birthday. Free and private.",
    intro: [
      "Forms ask for an age in whole years, but sometimes you need more: the months a child has turned, the days until a milestone, or what age someone was on a given date. This calculator gives all of it from a single birth date.",
      "The as-of date defaults to today and can be changed to any date, past or future. The next birthday shows the date, the weekday and the days left. Your dates are read in your browser and are never stored or sent.",
    ],
    examples: [
      {
        input: "Born March 15, 1990, as of October 1, 2026",
        output: "36 years, 6 months, 16 days (13,349 days old)",
      },
      {
        input: "Next birthday for someone born March 15, 1990 (as of October 1, 2026)",
        output: "Monday, March 15, 2027 (in 165 days, turning 37)",
      },
      {
        input: "Born February 29, 2000, as of February 28, 2025",
        output: "25 years, 0 months, 0 days. A February 29 birthday is counted on February 28 in years without a leap day.",
        note: "So the 25th birthday arrives on February 28, 2025.",
      },
    ],
    faq: [
      {
        question: "How is a February 29 birthday counted?",
        answer:
          "In years that have no February 29, the birthday is counted on February 28. Someone born on February 29, 2000 turns 25 on February 28, 2025. Some legal systems use March 1 instead, which shifts the result by one day in those years.",
      },
      {
        question: "How are the months and days worked out?",
        answer:
          "Whole months are counted forward from the birth date and the days are what is left over. If a month is too short for the birth day, for example the 31st, it counts to the last day of that month.",
      },
      {
        question: "Is my birth date saved anywhere?",
        answer: "No. The age is calculated in your browser and nothing is stored or uploaded, so it is gone when you close or reload the tab.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    categorySlug: "calculators",
    shortDescription: "Count the years, months, days and business days between two dates, or add and subtract days from a date.",
    description:
      "Find the time between two dates in years, months, days, total days and weeks, and the number of business days from Monday to Friday. A second panel adds or subtracts days from any date.",
    howTo: [
      "Pick a start date and an end date; either one can be the earlier date.",
      "Turn on Include end date if the last day should count as a full day, as for a hotel stay or a deadline.",
      "Read the breakdown, the total days and weeks, and the business days.",
      "To find a deadline, enter a date and a number of days in the second panel; use a negative number to go back.",
    ],
    iconKey: "calculator",
    featured: false,
    sortOrder: 19,
    tags: ["date-difference", "days-between-dates", "business-days", "add-days"],
    metaTitle: "Date Difference Calculator & Add Days",
    metaDescription:
      "Find the time between two dates in years, months, days and business days, optionally including the end date, or add or subtract days from a date.",
    intro: [
      "How long until a deadline, how many days are left on a lease, how far apart are two events? Pick two dates and get the gap as years, months and days, as total days and weeks, and as business days.",
      "Business days are Monday to Friday; public holidays are not removed because they differ by country, state and employer. The end date is not counted unless you turn on Include end date. The second panel adds or subtracts days from a date and tells you the weekday it lands on.",
    ],
    examples: [
      {
        input: "October 1, 2026 to December 25, 2026",
        output: "2 months, 24 days (85 days in total)",
      },
      {
        input: "Thursday, October 1, 2026 to Friday, October 9, 2026",
        output: "6 business days (Monday to Friday, end date not counted)",
        note: "Thursday, Friday, Monday, Tuesday, Wednesday and Thursday; no holidays are removed.",
      },
      {
        input: "Add 90 days to October 1, 2026",
        output: "Wednesday, December 30, 2026",
      },
    ],
    faq: [
      {
        question: "Does the calculation include the start and end dates?",
        answer:
          "By default the start date counts and the end date does not, so October 1 to October 2 is 1 day. Turn on Include end date to count both, which makes it 2 days.",
      },
      {
        question: "Are holidays excluded from business days?",
        answer:
          "No. Business days are simply Monday to Friday. Holidays differ by country, state and employer, so subtract any that apply from the result yourself.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    categorySlug: "calculators",
    shortDescription: "Calculate body mass index from feet, inches and pounds or from centimeters and kilograms, with the adult category.",
    description:
      "Enter your height and weight in US units or metric to get your BMI to one decimal, the standard adult category, and the weight range that falls in the healthy BMI range for your height. For adults age 20 and older.",
    howTo: [
      "Choose US units (feet, inches, pounds) or metric (centimeters, kilograms).",
      "Enter your height and weight.",
      "Read your BMI, its category and the healthy weight range for your height in both pounds and kilograms.",
      "Remember that BMI is a screening measure, not a diagnosis, and talk to a health professional about your own health.",
    ],
    iconKey: "calculator",
    featured: false,
    sortOrder: 20,
    tags: ["bmi", "body-mass-index", "weight", "health"],
    metaTitle: "BMI Calculator: US & Metric Units",
    metaDescription:
      "Calculate BMI from feet, inches and pounds or from centimeters and kilograms, see the adult category and a healthy weight range for your height. Free.",
    intro: [
      "Body mass index (BMI) compares your weight with your height: weight in kilograms divided by height in meters squared. It is a quick screening number, not a measure of health on its own, and it is not a diagnosis.",
      "The categories used here are the standard adult ranges from the WHO and the CDC for people age 20 and older: underweight below 18.5, healthy weight 18.5 to 24.9, overweight 25 to 29.9 and obesity 30 or higher. The tool also shows the weights that fall in the healthy range for your height. Nothing you enter is stored or sent.",
    ],
    examples: [
      { input: "5 ft 9 in, 160 lb", output: "BMI 23.6: Healthy weight" },
      { input: "175 cm, 70 kg", output: "BMI 22.9: Healthy weight" },
      {
        input: "Healthy weight range at 5 ft 9 in",
        output: "125.3 to 168.6 lb (56.8 to 76.5 kg)",
        note: "The weights that give a BMI from 18.5 to 24.9.",
      },
    ],
    faq: [
      {
        question: "What do the BMI categories mean?",
        answer:
          "Below 18.5 is underweight, 18.5 to 24.9 healthy weight, 25 to 29.9 overweight and 30 or higher obesity. These are the standard adult ranges used by the WHO and CDC to screen for possible weight-related health risks; they are not a diagnosis.",
      },
      {
        question: "Can I use this for children or teens?",
        answer:
          "No. For ages 2 to 19 the CDC compares BMI with growth charts for the child's age and sex, not with these adult cut-offs. This calculator is for adults age 20 and older.",
      },
      {
        question: "Why can BMI be misleading?",
        answer:
          "It uses only height and weight, so it does not tell muscle from fat or show where fat is carried. A muscular athlete can land in the overweight range. Treat it as a starting point for a conversation with a doctor, not a verdict.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    categorySlug: "calculators",
    shortDescription: "Work out the tip, the total and each person's share of a bill, with 15 to 25 percent presets and round-up.",
    description:
      "Enter the bill and pick a tip percentage to see the tip and total, then split it between any number of people. Optionally round each person's share up to the next whole dollar.",
    howTo: [
      "Enter the bill amount in dollars.",
      "Tap a tip preset (15, 18, 20, 22 or 25 percent) or type your own percentage.",
      "Set how many people are splitting the bill.",
      "Read the tip, total and amount per person, and turn on Round up each share if you want whole dollars.",
    ],
    iconKey: "calculator",
    featured: false,
    sortOrder: 21,
    tags: ["tip", "bill-splitter", "restaurant", "gratuity"],
    metaTitle: "Tip Calculator: Tip, Total & Bill Splitter",
    metaDescription:
      "Calculate the tip and total on a restaurant bill, split it between any number of people and optionally round each share up to the dollar. Free.",
    intro: [
      "At a US sit-down restaurant many diners leave 15 to 20 percent, and more for outstanding service. Enter the bill and a percentage and the tip, the total and each person's share update immediately.",
      "Shares are rounded up to the next cent so the group always covers the total, and you can round up to whole dollars for easy cash. The tool then shows exactly what the table pays and the tip you effectively left. Nothing is stored or sent.",
    ],
    examples: [
      {
        input: "$86.40 bill, 20% tip, 3 people",
        output: "Tip $17.28, total $103.68, $34.56 per person",
      },
      {
        input: "$64.50 bill, 18% tip, 4 people",
        output: "Tip $11.61, total $76.11, $19.03 each (rounded up to the next cent)",
        note: "$76.11 does not divide evenly, so each share is rounded up and the table pays one cent extra.",
      },
      {
        input: "$64.50 bill, 18% tip, 4 people, round up to the dollar",
        output: "$20.00 each, $80.00 paid, an effective tip of $15.50 (24.03%)",
      },
    ],
    faq: [
      {
        question: "Should I tip on the bill before or after tax?",
        answer:
          "Etiquette guides commonly suggest tipping on the pre-tax amount, while many people tip on the total for simplicity. Enter whichever amount you want to tip on.",
      },
      {
        question: "Why is the total per person a cent or two over?",
        answer:
          "A bill rarely divides evenly. Each share is rounded up to the next cent so that together the group covers the full total. The difference is shown as the rounding amount.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "length-converter",
    name: "Length Converter",
    categorySlug: "converters",
    shortDescription: "Convert between inches, feet, yards, miles, millimeters, centimeters, meters, kilometers and nautical miles.",
    description:
      "Convert a length between US customary and metric units and see it in every unit at once. A feet and inches helper reads and shows heights such as 5 ft 9 in.",
    howTo: [
      "Enter a value and pick the unit you are converting from.",
      "Pick the unit you want in the result, or use Swap to flip the two.",
      "Scan the all-units table to see the same length in every unit.",
      "For heights, switch to Feet + inches and enter both parts, or read the feet and inches line under the result.",
    ],
    iconKey: "arrows",
    featured: false,
    sortOrder: 22,
    tags: ["length", "feet-to-meters", "inches-to-cm", "miles-to-km"],
    metaTitle: "Length Converter: Feet, Inches, Meters & More",
    metaDescription:
      "Convert length between inches, feet, yards, miles, mm, cm, meters, km and nautical miles, with a full table and a feet and inches helper. Free.",
    intro: [
      "Recipes, furniture, trail maps and product listings mix US customary and metric lengths. Enter one value and see it in all nine units at the same time, with the unit you care about at the top.",
      "The conversions use the exact international definitions: 1 inch is 2.54 centimeters, 1 foot is 0.3048 meters, 1 mile is 1,609.344 meters and 1 nautical mile is 1,852 meters. Results show about seven significant digits, so you see 175.26 cm rather than a long tail of decimals.",
    ],
    examples: [
      { input: "1 in", output: "2.54 cm", note: "Exact by definition." },
      { input: "26.2 mi (a marathon)", output: "42.16481 km" },
      { input: "5 ft 9 in", output: "175.26 cm", note: "The helper converts feet and inches together." },
    ],
    faq: [
      {
        question: "How many centimeters are in an inch?",
        answer:
          "Exactly 2.54. Since 1959 the inch has been defined as 2.54 centimeters, which makes every inch, foot, yard and mile conversion exact.",
      },
      {
        question: "What is a nautical mile?",
        answer:
          "A nautical mile is exactly 1,852 meters, about 1.15 statute miles. It is used at sea and in aviation because it matches one minute of latitude.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "weight-converter",
    name: "Weight Converter",
    categorySlug: "converters",
    shortDescription: "Convert between ounces, pounds, stone, US short tons, milligrams, grams, kilograms and metric tons.",
    description:
      "Convert weight and mass between US customary and metric units, see every unit in one table, and read any value in pounds and ounces. Conversions use the exact definitions of the pound and ounce.",
    howTo: [
      "Enter a value and choose the unit you are converting from.",
      "Choose the unit you want in the result, or use Swap to reverse the conversion.",
      "Check the all-units table for the same weight in every unit.",
      "Use the pounds and ounces line for baby weights, produce and parcels, then copy the result.",
    ],
    iconKey: "arrows",
    featured: false,
    sortOrder: 23,
    tags: ["weight", "pounds-to-kg", "ounces", "mass"],
    metaTitle: "Weight Converter: Pounds, Kilograms, Ounces",
    metaDescription:
      "Convert weight between pounds, ounces, stone, US tons, grams, kilograms and metric tons, with exact factors and a pounds and ounces display. Free.",
    intro: [
      "Shipping labels, nutrition facts, gym plates and bathroom scales do not agree on units. Enter a weight once and see it in pounds, ounces, stone, tons, grams and kilograms together.",
      "The avoirdupois pound is defined as exactly 0.45359237 kilograms, an ounce is one sixteenth of a pound, a stone is 14 pounds and a US short ton is 2,000 pounds. Results show about seven significant digits, and the pounds and ounces line splits a weight the way a postal scale reads it.",
    ],
    examples: [
      { input: "150 lb", output: "68.03886 kg" },
      { input: "70 kg", output: "154.3236 lb" },
      {
        input: "3.5 kg (a typical newborn)",
        output: "7.716179 lb, or 7 lb 11.5 oz",
        note: "Pounds and ounces are rounded to one decimal of an ounce.",
      },
    ],
    faq: [
      {
        question: "What is the difference between a US ton and a metric ton?",
        answer:
          "A US short ton is 2,000 pounds, or about 907.18 kilograms. A metric ton, also called a tonne, is 1,000 kilograms, or about 2,204.6 pounds. The UK long ton of 2,240 pounds is not included.",
      },
      {
        question: "How many pounds are in a stone?",
        answer:
          "Exactly 14 pounds, which is about 6.35 kilograms. The stone is used mainly in the UK and Ireland for body weight.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "temperature-converter",
    name: "Temperature Converter",
    categorySlug: "converters",
    shortDescription: "Convert Fahrenheit, Celsius, Kelvin and Rankine, with the formula shown and a check for absolute zero.",
    description:
      "Convert a temperature between degrees Fahrenheit, degrees Celsius, kelvin and degrees Rankine, see all four at once, and read the formula used for the pair you picked. Values below absolute zero are rejected.",
    howTo: [
      "Enter a temperature; negative values are fine.",
      "Choose the unit you are converting from and the unit you want.",
      "Read the result and the formula underneath it, or use Swap to reverse the direction.",
      "Check the table for the same temperature in all four scales.",
    ],
    iconKey: "arrows",
    featured: false,
    sortOrder: 24,
    tags: ["temperature", "fahrenheit-to-celsius", "kelvin", "rankine"],
    metaTitle: "Temperature Converter: °F, °C & Kelvin",
    metaDescription:
      "Convert between Fahrenheit, Celsius, Kelvin and Rankine, see the formula behind each result, and get a clear error below absolute zero. Free.",
    intro: [
      "Oven dials, weather apps, lab sheets and science homework use different scales. Enter one temperature and see it in Fahrenheit, Celsius, Kelvin and Rankine at the same time, together with the formula that produced the result.",
      "Temperatures are converted through kelvin, so every pair is exact and reversible. A value below absolute zero (0 K, which is -273.15 °C or -459.67 °F) cannot exist, so the tool tells you instead of returning a meaningless number.",
    ],
    examples: [
      { input: "98.6 °F", output: "37 °C", note: "Average body temperature." },
      { input: "350 °F (a common oven setting)", output: "176.6667 °C" },
      { input: "0 K", output: "-459.67 °F", note: "Absolute zero." },
    ],
    faq: [
      {
        question: "What are the formulas for Fahrenheit and Celsius?",
        answer:
          "To go from Celsius to Fahrenheit, multiply by 9/5 and add 32. To go from Fahrenheit to Celsius, subtract 32 and multiply by 5/9. The tool shows the formula for whichever pair you choose.",
      },
      {
        question: "Why is there a lowest temperature I can enter?",
        answer:
          "Absolute zero, 0 K or -459.67 °F, is the lowest possible temperature, so nothing can be colder. Entering a lower value is almost always a typo, and the tool says so.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "data-storage-converter",
    name: "Data Storage Converter",
    categorySlug: "converters",
    shortDescription: "Convert bits, bytes, KB, MB, GB, TB, PB and binary KiB, MiB, GiB, TiB, with a download time estimate.",
    description:
      "Convert digital storage between bits, bytes, decimal units (KB, MB, GB, TB, PB) and binary units (KiB, MiB, GiB, TiB), see them all at once, and estimate how long a download takes at a given speed in Mbps.",
    howTo: [
      "Enter a size and choose the unit you are converting from.",
      "Choose the unit you want in the result, or use Swap.",
      "Compare the decimal and binary rows in the table to see why drive sizes look smaller on some computers.",
      "To estimate a download, enter your connection speed in Mbps under the table.",
    ],
    iconKey: "arrows",
    featured: false,
    sortOrder: 25,
    tags: ["data-storage", "gb-to-gib", "bytes", "download-time"],
    metaTitle: "Data Storage Converter: GB, GiB, TB & More",
    metaDescription:
      "Convert bits, bytes, KB, MB, GB, TB and PB, plus binary KiB, MiB, GiB and TiB, and estimate download time from file size and Mbps. Free.",
    intro: [
      "Storage is measured two ways. Decimal units (KB, MB, GB, TB) count in thousands and are used by drive makers and networks; binary units (KiB, MiB, GiB, TiB) count in powers of 1,024 and match how memory works. Both are listed here so you can compare them.",
      "That is why a drive sold as 1 TB shows about 931 GB in an operating system that reports binary sizes but labels them GB, as Windows does: 1,000,000,000,000 bytes is 931.32 GiB. Add a connection speed in Mbps to estimate how long a file takes to download.",
    ],
    examples: [
      { input: "1 TB (the label on a drive)", output: "931.3226 GiB", note: "Why a 1 TB drive looks smaller on Windows." },
      { input: "1 GiB", output: "1,073,741,824 bytes", note: "Binary: 1,024 x 1,024 x 1,024 bytes." },
      {
        input: "4.7 GB file at 100 Mbps",
        output: "6 min 16 s",
        note: "A DVD-sized download on a 100 megabit connection, ignoring overhead.",
      },
    ],
    faq: [
      {
        question: "Why does my 1 TB drive show about 931 GB?",
        answer:
          "The maker counts 1 TB as 1,000,000,000,000 bytes. Some systems, notably Windows, divide by 1,024 three times and call the result GB, which is really GiB: 931.32. Nothing is missing; the unit is just different.",
      },
      {
        question: "What is the difference between a megabit and a megabyte?",
        answer:
          "A byte is 8 bits. Internet speeds are quoted in megabits per second (Mbps) and file sizes in megabytes (MB), so a 100 Mbps connection moves at most 12.5 MB each second.",
      },
      {
        question: "How accurate is the download time?",
        answer:
          "It divides the size by the speed, counting 1 Mbps as 1,000,000 bits per second. Network overhead, server limits and Wi-Fi conditions make real downloads somewhat slower, so treat it as a best case.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor (JPEG & WebP)",
    categorySlug: "images",
    shortDescription: "Shrink JPEG, PNG and WebP images to JPEG or WebP with a quality slider. Private: nothing is uploaded.",
    description:
      "Compress a JPEG, PNG or WebP image to a smaller JPEG or WebP file right in your browser. Choose the quality, optionally limit the width, and compare the original and compressed size before you download. The image never leaves your device.",
    howTo: [
      "Drop an image onto the box or choose a file. JPEG, PNG and WebP up to 25 MB are accepted.",
      "Pick JPEG or WebP and move the quality slider. 80 is a good starting point.",
      "Optionally set a maximum width to scale large photos down as well.",
      "Compare the sizes. If the result is larger than the original, keep the original instead.",
      "Download the compressed image.",
    ],
    iconKey: "image",
    featured: false,
    sortOrder: 26,
    tags: ["image-compressor", "compress-image", "jpeg", "webp"],
    metaTitle: "Image Compressor: Reduce JPEG & WebP Size",
    metaDescription:
      "Compress JPEG, PNG and WebP images to smaller JPEG or WebP files with a quality slider and optional max width. Runs in your browser; files are never uploaded.",
    intro: [
      "Photos straight from a phone or camera are often several megabytes, which is more than most emails, forms and web pages need. This tool re-encodes your image as JPEG or WebP at the quality you choose, so you can trade a little detail for a much smaller file.",
      "Everything happens in your browser using the canvas, so the image is never uploaded and it works on a phone as well as a desktop. Nothing is stored; close the tab and it is gone. Re-encoding drops metadata such as EXIF (camera model, GPS location), which is also a privacy benefit.",
    ],
    examples: [
      {
        input: "4032 × 3024 photo, maximum width 1600",
        output: "1600 × 1200 px",
        note: "The height follows the original aspect ratio.",
      },
      {
        input: "1200 × 800 image, maximum width 1600",
        output: "1200 × 800 px, not enlarged",
        note: "A maximum width only ever shrinks an image.",
      },
      {
        input: "2,000,000 bytes original, 500,000 bytes result",
        output: "75% saved",
        note: "How the saving shown next to the sizes is worked out.",
      },
    ],
    faq: [
      {
        question: "Which quality should I choose?",
        answer:
          "For photos, 75 to 85 is usually hard to tell apart from the original while being much smaller. Go lower for thumbnails, and higher for images you will edit again.",
      },
      {
        question: "Why is my compressed image bigger than the original?",
        answer:
          "Files that are already well compressed, small images and screenshots with flat colors can grow when re-encoded. The tool warns you when that happens so you can keep the original.",
      },
      {
        question: "Is the image metadata kept?",
        answer:
          "No. Re-encoding through the canvas drops EXIF data such as the camera model and GPS position. Image orientation is applied to the pixels, so photos still appear the right way up.",
      },
      {
        question: "What happens to transparent PNG areas?",
        answer:
          "JPEG cannot store transparency, so transparent areas are filled with white. Choose WebP as the output to keep transparency.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    categorySlug: "images",
    shortDescription: "Resize a JPEG, PNG or WebP image by pixels or percentage, with aspect ratio lock. Nothing is uploaded.",
    description:
      "Change the dimensions of a JPEG, PNG or WebP image by exact pixels or by percentage, with an optional aspect ratio lock. High-quality downscaling runs in your browser, and the image never leaves your device.",
    howTo: [
      "Drop an image onto the box or choose a file.",
      "Choose Pixels or Percent. In Pixels mode, type a width or height; keep the lock on to preserve the proportions.",
      "Check the new dimensions and the file size next to the original.",
      "Download the resized image, which keeps the original format.",
    ],
    iconKey: "image",
    featured: false,
    sortOrder: 27,
    tags: ["image-resizer", "resize-image", "image-dimensions", "scale-image"],
    metaTitle: "Image Resizer: Change Image Size Online",
    metaDescription:
      "Resize JPEG, PNG and WebP images by width, height or percentage with aspect ratio lock and smooth downscaling. Free, runs in your browser, no upload.",
    intro: [
      "Resize a picture to the exact size a form, profile, store listing or document asks for. Enter a width or a height in pixels, or scale by a percentage; with the lock on, the other side follows automatically so the picture is not stretched.",
      "Large reductions are done in several halving steps with the browser's highest smoothing quality, which keeps edges cleaner than shrinking in one jump. The work happens on your device; nothing is uploaded or stored. The output keeps the format of the original and drops metadata such as EXIF.",
    ],
    examples: [
      {
        input: "4000 × 3000, width 1000, aspect ratio locked",
        output: "1000 × 750 px",
        note: "The height is calculated from the original proportions.",
      },
      { input: "1920 × 1080 at 50%", output: "960 × 540 px", note: "Percent mode scales both sides equally." },
      {
        input: "4000 × 3000 down to 400 × 300",
        output: "2000×1500 → 1000×750 → 500×375 → 400×300",
        note: "Large reductions are drawn in halving steps for a smoother result.",
      },
    ],
    faq: [
      {
        question: "Will making an image bigger improve it?",
        answer:
          "No. Enlarging only stretches the existing pixels, so the picture gets softer, not sharper. The tool allows it, up to 50 megapixels, because sometimes an exact size is required.",
      },
      {
        question: "Why is the file size different from the original?",
        answer:
          "Resizing re-encodes the image. A smaller picture usually means a smaller file, but a PNG of a photo or an already well-compressed JPEG can behave differently. Compare the two sizes shown before you download.",
      },
      {
        question: "What happens to transparency?",
        answer:
          "PNG and WebP keep their transparent areas. JPEG cannot store transparency, so a JPEG never has any to lose.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    categorySlug: "images",
    shortDescription: "Convert PNG images to JPG with a background color for transparency and a quality slider. Up to 10 files.",
    description:
      "Convert PNG images to JPG in your browser. Pick the background color that replaces transparent areas, set the JPG quality, and convert up to 10 files at once. Files are never uploaded.",
    howTo: [
      "Drop up to 10 PNG files onto the box, or choose them from your device.",
      "Pick the background color for transparent areas. White is the default.",
      "Set the JPG quality. 90 keeps text and edges crisp; lower values give smaller files.",
      "Download each converted file with its own button.",
    ],
    iconKey: "image",
    featured: false,
    sortOrder: 28,
    tags: ["png-to-jpg", "png-to-jpeg", "convert-image", "transparent-background"],
    metaTitle: "PNG to JPG Converter: Free, No Upload",
    metaDescription:
      "Convert PNG to JPG online with a custom background for transparent areas and adjustable quality. Batch up to 10 files. Everything stays in your browser.",
    intro: [
      "JPG files are usually much smaller than PNGs of the same photo, and they are accepted almost everywhere. This converter turns PNG images into JPG without uploading them anywhere, in batches of up to 10.",
      "JPG has no transparency, so any transparent area of a PNG has to be filled with a solid color. White is used by default, and you can pick any other background color. The converted file does not keep PNG metadata, and everything runs on your device.",
    ],
    examples: [
      { input: "holiday-photo.png", output: "holiday-photo.jpg", note: "The name is kept; only the extension changes." },
      {
        input: "PNG with a transparent logo, background #ffffff",
        output: "Transparent pixels become solid white",
        note: "Pick another color to match the page the image will sit on.",
      },
      { input: "Quality slider at 90", output: "Encoder quality 0.9", note: "The 1 to 100 slider maps to the browser's 0 to 1 setting." },
    ],
    faq: [
      {
        question: "What happens to the transparent parts of my PNG?",
        answer:
          "JPG cannot be transparent, so those areas are filled with the background color you choose, white by default. Pick a color that matches where the image will be used to avoid a visible box.",
      },
      {
        question: "Will the JPG look worse than the PNG?",
        answer:
          "JPG is lossy, so tiny differences are possible, especially around sharp text and thin lines. A quality of 90 or above keeps them very close. For screenshots and graphics with flat colors, PNG may be the better format.",
      },
      {
        question: "Is metadata copied to the JPG?",
        answer: "No. The image is redrawn and re-encoded, so PNG text chunks and color profiles are not carried over.",
      },
    ],
    localOnly: true,
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG Converter",
    categorySlug: "images",
    shortDescription: "Convert WebP images to JPG with a background color for transparency and a quality slider. Up to 10 files.",
    description:
      "Convert WebP images to JPG in your browser, with a background color for transparent areas and adjustable quality. Batch up to 10 files. Your files are never uploaded.",
    howTo: [
      "Drop up to 10 WebP files onto the box, or choose them from your device.",
      "Pick the background color for transparent areas. White is the default.",
      "Set the JPG quality. 85 to 90 is a good balance.",
      "Download each converted file with its own button.",
    ],
    iconKey: "image",
    featured: false,
    sortOrder: 29,
    tags: ["webp-to-jpg", "webp-to-jpeg", "convert-image", "image-format"],
    metaTitle: "WebP to JPG Converter: Free, No Upload",
    metaDescription:
      "Convert WebP to JPG online with a custom background for transparent areas and adjustable quality. Batch up to 10 files. Files stay in your browser.",
    intro: [
      "WebP images save bandwidth on websites, but many older apps, print services and upload forms still only accept JPG. This tool converts WebP files to JPG on your device, in batches of up to 10, without uploading anything.",
      "WebP can contain transparency and JPG cannot, so transparent areas are filled with a background color you choose (white by default). Reading WebP depends on your browser; current versions of Chrome, Edge, Firefox and Safari support it, and the tool tells you if yours does not.",
    ],
    examples: [
      { input: "banner.webp", output: "banner.jpg", note: "The name is kept; only the extension changes." },
      {
        input: "WebP with a transparent background, background #ffffff",
        output: "Transparent pixels become solid white",
        note: "Choose another color if the image will sit on a colored page.",
      },
      { input: "Quality slider at 85", output: "Encoder quality 0.85", note: "The 1 to 100 slider maps to the browser's 0 to 1 setting." },
    ],
    faq: [
      {
        question: "What happens to transparency in a WebP image?",
        answer:
          "JPG cannot store transparency, so transparent areas are filled with the background color you choose, white by default.",
      },
      {
        question: "What about animated WebP files?",
        answer:
          "The result is a single still image, normally the first frame. JPG cannot be animated, so use a video or GIF tool if you need the animation.",
      },
      {
        question: "Why does the tool say my browser cannot read WebP?",
        answer:
          "Very old browsers cannot decode WebP. Update your browser or open this page in a current Chrome, Edge, Firefox or Safari, then try again.",
      },
    ],
    localOnly: true,
  },
];

const definitionsBySlug = new Map(toolDefinitions.map((tool) => [tool.slug, tool]));

export function getToolDefinition(slug: string) {
  return definitionsBySlug.get(slug);
}
