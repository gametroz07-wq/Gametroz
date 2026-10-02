import type { GuideDefinition } from "../definitions";
import { toolGuidesMore } from "./tools-more";

// Tools guides. Original how-to content; every tool or app named is linked and shown as a card.
// Facts about the tools come from lib/tools/definitions.ts; the rest is widely established general knowledge.

const jsonGuide: GuideDefinition = {
  slug: "how-to-format-json",
  title: "How to Format, Minify and Validate JSON",
  section: "tools",
  excerpt: "Make messy JSON readable, shrink it again for production, and find the exact line and column of a syntax error, with the five mistakes behind most failures.",
  metaTitle: "How to Format and Validate JSON | Gametroz",
  publishedAt: "2026-09-18",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 21,
  tags: ["json", "developer", "format"],
  body: [
    {
      type: "answer",
      text: "Paste your JSON into the [JSON Formatter & Validator](/tool/json-formatter), choose Format to indent it or Minify to compress it, and read the line and column it reports if the data is invalid. Most errors come from a handful of small syntax slips.",
    },
    { type: "h2", text: "Formatting, minifying and validating: what each does" },
    {
      type: "p",
      text: "JSON is plain text, so the same data can be written in many ways. Formatting (also called pretty-printing) adds line breaks and indentation so a person can follow the nesting. Minifying removes every space and line break that is not inside a string, so the file is as small as it can be. Validating checks that the text follows the JSON grammar, which is stricter than JavaScript object syntax.",
    },
    {
      type: "table",
      caption: "When to use each mode",
      header: ["Mode", "What changes", "Use it when"],
      rows: [
        ["Format", "Adds indentation and line breaks", "You are reading, debugging or reviewing data"],
        ["Minify", "Removes unneeded whitespace", "You are sending data over the network or storing it compactly"],
        ["Validate", "Checks the syntax, changes nothing", "A parser rejects your data and you need to know why"],
      ],
    },
    { type: "h2", text: "Format JSON step by step" },
    {
      type: "steps",
      items: [
        "Open the [JSON Formatter & Validator](/tool/json-formatter) and paste your text into the input box.",
        "Choose Format to get indented output, or Minify for the compact form.",
        "If the text is invalid, read the message. It points to the line and column where the parser gave up.",
        "Fix that spot, run it again, and repeat until the output appears.",
        "Copy the result back into your editor, request body or config file.",
      ],
    },
    { type: "h2", text: "The five mistakes behind most JSON errors" },
    {
      type: "ul",
      items: [
        "A trailing comma after the last item in an object or array. JSON does not allow it, even though many programming languages do.",
        "Single quotes. Strings and property names must use double quotes.",
        "Unquoted property names. `{name: 1}` works in JavaScript, but JSON needs `{\"name\": 1}`.",
        "Comments. JSON has no comment syntax, so `//` and `/* */` make the text invalid.",
        "Unescaped characters inside strings, such as a raw line break or a stray backslash. Use `\\n` for a new line and `\\\\` for a backslash.",
      ],
    },
    { type: "h2", text: "Reading an error location" },
    {
      type: "p",
      text: "A parser reports the point where the text stopped making sense, which is often just after the real mistake. If the error says line 12, look at the end of line 11 as well: a missing comma or a missing closing bracket is usually found there. A message about an unexpected end of data almost always means a bracket or brace was never closed.",
    },
    { type: "h2", text: "Related encoding tasks" },
    {
      type: "p",
      text: "JSON often travels inside other formats. If a value arrives as an opaque string of letters and digits ending in equals signs, it may be Base64, which the [Base64 Encoder & Decoder](/tool/base64-encoder-decoder) can unpack before you format it. If JSON is part of a web address or query string, it will be percent-encoded, and the [URL Encoder & Decoder](/tool/url-encoder-decoder) restores the readable text.",
    },
    {
      type: "p",
      text: "Dates inside JSON are often Unix timestamps. Our guide [What Is a Unix Timestamp?](/guide/what-is-a-unix-timestamp) explains how to read them, and the broader roundup [Best Free Online Developer Tools](/guide/best-free-online-developer-tools) lists the other utilities that help with everyday debugging.",
    },
    { type: "h2", text: "A note on sensitive data" },
    {
      type: "p",
      text: "Only paste data you are comfortable handling in a browser tab. For API keys, tokens or customer records, check how any online tool processes your input first, or format the data locally in your own editor.",
    },
    { type: "h2", text: "Choosing between two and four spaces" },
    {
      type: "p",
      text: "Indentation width is a matter of taste and team convention. Two spaces keep deeply nested data narrow enough to fit on screen, while four spaces make each level easier to spot. The data means exactly the same either way, because JSON ignores whitespace outside strings, so pick the style your project already uses and stay consistent.",
    },
    { type: "h2", text: "A before and after example" },
    {
      type: "p",
      text: "Minified text such as {\"id\":7,\"tags\":[\"a\",\"b\"],\"active\":true} is valid but hard to scan. Formatted, the same data puts each property on its own line with the array items indented beneath it. Nothing about the values changes: strings, numbers, true, false, null, arrays and objects are the only types JSON has, and the formatter simply lays them out for you.",
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "json-formatter" },
        { kind: "tool", slug: "base64-encoder-decoder" },
        { kind: "tool", slug: "url-encoder-decoder" },
        { kind: "tool", slug: "timestamp-converter" },
      ],
    },
  ],
};

const wordCountGuide: GuideDefinition = {
  slug: "how-to-count-words-and-characters",
  title: "How to Count Words and Characters in Any Text",
  section: "tools",
  excerpt: "Know the difference between word and character counts, check limits such as 160-character texts and 280-character posts, and tidy text before you count.",
  metaTitle: "How to Count Words and Characters | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 22,
  tags: ["text", "word count", "characters"],
  body: [
    {
      type: "answer",
      text: "Paste your text into the [Word Counter](/tool/word-counter) when a length is measured in words, and into the [Character Counter](/tool/character-counter) when a limit is measured in characters. Check whether the limit counts spaces, because that changes the result.",
    },
    { type: "h2", text: "Words versus characters" },
    {
      type: "p",
      text: "A word count is the number of groups of letters separated by spaces. A character count is the number of individual symbols, which can include letters, digits, punctuation, spaces and line breaks. Essays, articles and assignments are usually set in words. Text messages, social posts, search snippets and form fields are usually set in characters.",
    },
    {
      type: "p",
      text: "The two numbers move differently. A short word such as \"a\" adds one word but only one or two characters, while a long term adds one word and many characters. Never convert from one to the other by guessing: count the real text.",
    },
    { type: "h2", text: "Limits people run into" },
    {
      type: "table",
      caption: "Common length limits, with what is measured",
      header: ["Where", "Typical limit", "Measured in"],
      rows: [
        ["Single SMS text message", "160 characters (standard GSM-7 alphabet)", "Characters"],
        ["Post on X", "280 characters (standard accounts)", "Characters"],
        ["Meta description in search results", "About 150 to 160 characters before it may be cut off", "Characters, roughly"],
        ["Page title in search results", "About 50 to 60 characters before it may be cut off", "Characters, roughly"],
        ["Essay or assignment", "Set by the instructor, such as 500 words", "Words"],
      ],
    },
    {
      type: "note",
      title: "Limits change",
      text: "Platforms revise their limits, and some count emoji, links or non-Latin letters differently. SMS messages that contain emoji or certain accented characters switch to a different encoding with a lower per-message limit, so a text that looks short can still be split into two. Check the current rule where you are publishing.",
    },
    { type: "h2", text: "Count text step by step" },
    {
      type: "steps",
      items: [
        "Decide what the limit measures: words or characters, and with or without spaces.",
        "Paste the full text into the matching counter, including headings and any signature.",
        "Compare the result with the limit and trim or expand as needed.",
        "Count again after every edit, because a small rewrite can push you over.",
      ],
    },
    { type: "h2", text: "Clean the text first" },
    {
      type: "p",
      text: "Hidden clutter changes character counts. Double spaces after a period, trailing spaces at the end of lines and extra blank lines all count as characters. Run the text through [Remove Extra Spaces](/tool/remove-extra-spaces) first to collapse repeated spaces, trim each line and clean up blank lines, then count.",
    },
    {
      type: "p",
      text: "Headlines and titles often need consistent capitalization. The [Case Converter](/tool/case-converter) switches between upper, lower, title and sentence case, which is quicker than retyping and does not change the length of the text.",
    },
    { type: "h2", text: "Tips for staying under a limit" },
    {
      type: "ul",
      items: [
        "Lead with the point. If the end gets cut off by a limit, the important part has already been seen.",
        "Replace long phrases with shorter ones before deleting content.",
        "Remove filler such as \"very\", \"really\" and \"in order to\".",
        "Keep a version at the full length and a trimmed version for each platform.",
      ],
    },
    {
      type: "p",
      text: "Percentages come up when you are working toward a target, for example cutting a draft by 20 percent. Our guide [How to Calculate Percentages](/guide/how-to-calculate-percentages) shows the three formulas behind that kind of arithmetic.",
    },
    { type: "h2", text: "What counts as a word" },
    {
      type: "p",
      text: "Counters split text wherever they find whitespace, so a hyphenated term such as well-known usually counts as one word, while a phrase written with spaces counts as several. Numbers, abbreviations and stand-alone symbols can count as words too. Different programs apply slightly different rules, which is why a word processor and an online counter sometimes disagree by a few words. If a limit is strict, count with the same tool the recipient uses, or leave a small margin.",
    },
    { type: "h2", text: "Characters with and without spaces" },
    {
      type: "p",
      text: "Some limits count every character including spaces and line breaks, and others only count visible characters. A 160-character text message counts the spaces, while some assignments quote a count without spaces. Read the rule, then choose the matching figure from the counter. When you are unsure, assume spaces count, because that is the stricter reading.",
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "word-counter" },
        { kind: "tool", slug: "character-counter" },
        { kind: "tool", slug: "case-converter" },
        { kind: "tool", slug: "remove-extra-spaces" },
      ],
    },
  ],
};

const passwordGuide: GuideDefinition = {
  slug: "how-to-generate-a-strong-password",
  title: "How to Generate a Strong Password",
  section: "tools",
  excerpt: "Length matters more than tricks. Learn what makes a password strong, how passphrases work, and why a password manager makes unique passwords practical.",
  metaTitle: "How to Generate a Strong Password | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 23,
  tags: ["password", "security", "generator"],
  body: [
    {
      type: "answer",
      text: "Use a long, random password that you do not reuse anywhere else: 16 or more characters from a generator such as the [Password Generator](/tool/password-generator), saved in a password manager. Length and uniqueness matter more than clever substitutions.",
    },
    { type: "h2", text: "What makes a password strong" },
    {
      type: "p",
      text: "Attackers do not guess one password at a time by hand. Software tries enormous numbers of candidates, starting with common words, names, dates and predictable patterns. A strong password is one that no such list contains, because it was produced by chance rather than by a person's habits.",
    },
    {
      type: "ul",
      items: [
        "Length: every added character multiplies the number of possibilities. Aim for at least 16 characters for important accounts.",
        "Randomness: a generator avoids the patterns people fall into, such as a capital first letter and a number at the end.",
        "Uniqueness: a password reused on two sites means a leak at one site opens the other.",
        "No personal details: names, birthdays, pet names and favorite teams are easy to find or guess.",
      ],
    },
    { type: "h2", text: "Character sets and entropy" },
    {
      type: "p",
      text: "Using more kinds of characters (lowercase, uppercase, digits and symbols) increases the pool each position is drawn from. Entropy is the usual way to express the result: it measures unpredictability in bits, and each extra bit doubles the number of possibilities. The [Password Generator](/tool/password-generator) lets you choose the length and character types and shows an entropy estimate, so you can see the effect of each choice.",
    },
    {
      type: "table",
      caption: "Rough effect of length and character types",
      header: ["Password", "Pool per character", "Effect"],
      rows: [
        ["8 lowercase letters", "26", "Small search space; weak for anything important"],
        ["12 mixed letters and digits", "62", "Far larger, but still modest for high-value accounts"],
        ["16 characters with symbols", "About 90 or more", "Strong choice for most accounts"],
        ["20 or more random characters", "About 90 or more", "Comfortable margin for critical accounts"],
      ],
    },
    { type: "h2", text: "Passphrases" },
    {
      type: "p",
      text: "A passphrase strings together several unrelated, randomly chosen words, for example four to six of them. It is easier to type and remember than a random string, which makes it a good fit for the one password you must know by heart, such as the one that unlocks your password manager. The words must be chosen at random: a quote, a song lyric or a sentence you made up is far easier to guess.",
    },
    { type: "h2", text: "Generate a password step by step" },
    {
      type: "steps",
      items: [
        "Open the [Password Generator](/tool/password-generator) and set the length to at least 16.",
        "Keep lowercase, uppercase, digits and symbols enabled unless the site rejects some symbols.",
        "Generate the password and copy it straight into your password manager.",
        "Paste it into the site's sign-up or change-password form.",
        "Turn on two-factor authentication wherever it is offered.",
      ],
    },
    { type: "h2", text: "Why you need a password manager" },
    {
      type: "p",
      text: "Nobody can memorize dozens of unique 16-character passwords, which is why people reuse them. A password manager stores them encrypted and fills them in for you, so you only remember one strong passphrase. Our catalog lists three free options. [Bitwarden](/app/bitwarden) is free with paid plans and its apps are open source under GPL-3.0. [KeePassXC](/app/keepassxc) is free and open source and keeps your vault in a file on your own device. [Proton Pass](/app/proton-pass) is free with paid plans and runs on desktop, mobile and the web.",
    },
    {
      type: "p",
      text: "For a side-by-side comparison, read [The Best Free Password Managers](/guide/best-free-password-managers).",
    },
    { type: "h2", text: "Habits that matter more than tricks" },
    {
      type: "ul",
      items: [
        "Never send a password by email or chat.",
        "Change a password right away if a service reports a breach.",
        "Be careful with the recovery questions: use random answers stored in your manager.",
        "Do not enter a password on a page you reached from an email link; type the address or use a bookmark.",
      ],
    },
    { type: "h2", text: "Common password myths" },
    {
      type: "ul",
      items: [
        "Swapping letters for look-alike symbols, such as an at sign for an a, adds very little because attackers try those swaps too.",
        "Changing a password every few weeks is not needed unless you suspect a leak. A long unique password that stays put is safer than a weak one that rotates.",
        "A password that is hard to remember is not the same as a strong one. Randomness, not difficulty to recall, creates strength.",
        "Writing a password down is not always bad. A note kept somewhere physically safe can be better than reusing one password everywhere, though a manager is the better solution.",
      ],
    },
    {
      type: "items",
      title: "Tools and apps in this guide",
      refs: [
        { kind: "tool", slug: "password-generator" },
        { kind: "app", slug: "bitwarden" },
        { kind: "app", slug: "keepassxc" },
        { kind: "app", slug: "proton-pass" },
      ],
    },
  ],
};

const percentGuide: GuideDefinition = {
  slug: "how-to-calculate-percentages",
  title: "How to Calculate Percentages: Three Formulas",
  section: "tools",
  excerpt: "Three formulas solve most everyday percentage problems. See each one with worked examples, including percent change, then check your answer with a calculator.",
  metaTitle: "How to Calculate Percentages Quickly | Gametroz",
  publishedAt: "2026-07-30",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 24,
  tags: ["math", "percentage", "calculator"],
  body: [
    {
      type: "answer",
      text: "To find X percent of a number, multiply the number by X and divide by 100. To find what percent A is of B, divide A by B and multiply by 100. Use the [Percentage Calculator](/tool/percentage-calculator) to check any of them.",
    },
    { type: "h2", text: "Formula 1: X percent of a number" },
    {
      type: "p",
      text: "Percent means \"per hundred\", so 20 percent is 20 out of every 100, or 0.20. To find a percentage of a number, turn the percentage into a decimal and multiply.",
    },
    {
      type: "ul",
      items: [
        "20% of 50 = 50 × 20 / 100 = 10",
        "15% of 80 = 80 × 0.15 = 12",
        "5% of 240 = 240 × 0.05 = 12",
      ],
    },
    {
      type: "p",
      text: "A quick mental shortcut is to find 10 percent by moving the decimal point one place left, then build from it. For 35% of 60, 10% is 6, so 30% is 18, and 5% is half of 6, which is 3. Together, that is 21.",
    },
    { type: "h2", text: "Formula 2: what percent is A of B" },
    {
      type: "p",
      text: "Divide the part by the whole and multiply by 100. If you answered 15 questions correctly out of 60, the share is 15 / 60 = 0.25, so 25 percent. The whole always goes underneath. A common slip is dividing by the wrong number, so say the sentence out loud first: \"A is what percent of B?\"",
    },
    { type: "h2", text: "Formula 3: percentage change" },
    {
      type: "p",
      text: "Subtract the old value from the new value, divide by the old value, and multiply by 100. A positive result is an increase and a negative result is a decrease.",
    },
    {
      type: "table",
      caption: "Percentage change examples",
      header: ["Old", "New", "Calculation", "Change"],
      rows: [
        ["40", "50", "(50 - 40) / 40 × 100", "+25%"],
        ["200", "150", "(150 - 200) / 200 × 100", "-25%"],
        ["80", "100", "(100 - 80) / 80 × 100", "+25%"],
      ],
    },
    {
      type: "note",
      title: "Up and down are not symmetric",
      text: "A 50 percent increase followed by a 50 percent decrease does not return you to the start. Starting at 100, a 50 percent increase gives 150, and 50 percent of 150 is 75, so the result is 75. Each change is measured against a different base.",
    },
    { type: "h2", text: "Finding the original from a percentage" },
    {
      type: "p",
      text: "If 30 is 20 percent of a number, divide 30 by 0.20 to get 150. To undo a percentage increase, divide the new value by 1 plus the rate. If a price is 110 after a 10 percent increase, the original was 110 / 1.10 = 100.",
    },
    { type: "h2", text: "Percentages in everyday life" },
    {
      type: "ul",
      items: [
        "Discounts: a 30 percent discount on a 60 dollar item takes off 18 dollars, leaving 42.",
        "Tips: a 20 percent tip on a 45 dollar meal is 9 dollars.",
        "Grades: 42 points out of 50 is 84 percent.",
        "Growth: moving from 1,200 to 1,500 visitors is a 25 percent increase.",
      ],
    },
    {
      type: "p",
      text: "For shopping, the [Discount Calculator](/tool/discount-calculator) takes a percentage or dollar amount off a price, and our guide [How to Calculate a Discount and Sales Tax](/guide/how-to-calculate-a-discount-and-sales-tax) covers stacked discounts and checkout totals. For bills, see the [Tip Calculator](/tool/tip-calculator).",
    },
    { type: "h2", text: "Check your work" },
    {
      type: "steps",
      items: [
        "Estimate first: 20 percent is about one fifth, so 20% of 49 should be close to 10.",
        "Calculate with the formula that matches the question.",
        "Confirm the result with the [Percentage Calculator](/tool/percentage-calculator).",
        "Ask whether the answer makes sense, such as a discount larger than the price.",
      ],
    },
    { type: "h2", text: "Percentage points versus percent" },
    {
      type: "p",
      text: "These two phrases are easy to mix up. If an interest rate rises from 4 percent to 5 percent, it has gone up by one percentage point, but that is a 25 percent increase relative to the old rate, because 1 divided by 4 is 0.25. News stories and reports use both, so check which one the writer means before you compare numbers.",
    },
    { type: "h2", text: "Converting between fractions, decimals and percents" },
    {
      type: "p",
      text: "A percentage is the same thing as a decimal multiplied by 100 and the same thing as a fraction with 100 underneath. So 0.25, 25 percent and 1/4 are three ways to write one quantity. Move the decimal point two places to the right to turn a decimal into a percentage, and two places to the left to go back. Useful anchors to remember are 50 percent as one half, 25 percent as one quarter and 10 percent as one tenth.",
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "percentage-calculator" },
        { kind: "tool", slug: "discount-calculator" },
        { kind: "tool", slug: "tip-calculator" },
      ],
    },
  ],
};

const discountTaxGuide: GuideDefinition = {
  slug: "how-to-calculate-a-discount-and-sales-tax",
  title: "How to Calculate a Discount and Sales Tax",
  section: "tools",
  excerpt: "Work out the real US checkout total: apply the discount first, add sales tax after, handle stacked coupons, and keep tip and tax straight at restaurants.",
  metaTitle: "Calculate a Discount and Sales Tax | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 25,
  tags: ["discount", "sales tax", "shopping"],
  body: [
    {
      type: "answer",
      text: "Subtract the discount from the price first, then add sales tax to the discounted amount. The [Discount Calculator](/tool/discount-calculator) does both steps and handles a second discount and sales tax for you.",
    },
    { type: "h2", text: "The order of operations at checkout" },
    {
      type: "p",
      text: "In the United States, the price on the tag is normally before sales tax. At checkout, store discounts are generally subtracted first and tax is then charged on what remains, so the discount also reduces the tax. Sales tax rates vary by state and sometimes by city or county, and some items are taxed differently or not at all, so use the rate shown on your receipt or your local tax authority's current rate.",
    },
    { type: "h2", text: "A worked example" },
    {
      type: "p",
      text: "Take an 80 dollar jacket with 25 percent off and an example sales tax rate of 7 percent. These numbers are illustrations, not a real rate for your area.",
    },
    {
      type: "table",
      caption: "Jacket example: 80 dollars, 25% off, 7% example sales tax",
      header: ["Step", "Calculation", "Result"],
      rows: [
        ["Discount amount", "80 × 0.25", "20.00"],
        ["Discounted price", "80 - 20", "60.00"],
        ["Sales tax", "60 × 0.07", "4.20"],
        ["Total at checkout", "60 + 4.20", "64.20"],
      ],
    },
    { type: "h2", text: "Stacked discounts" },
    {
      type: "p",
      text: "Two discounts do not simply add up. A 20 percent sale plus a 10 percent coupon is not 30 percent off, because the second discount applies to the already reduced price when the coupon is stacked. Multiply the remaining shares instead: 0.80 × 0.90 = 0.72, which means you pay 72 percent of the original, or 28 percent off in total.",
    },
    {
      type: "ul",
      items: [
        "Some coupons apply to the original price rather than the sale price. Read the terms.",
        "A fixed dollar coupon, such as 10 dollars off, is subtracted in a single step and does not stack as a percentage.",
        "Store credit and gift cards usually count as payment after tax, not as a discount.",
      ],
    },
    { type: "h2", text: "Tip is not tax" },
    {
      type: "p",
      text: "At a restaurant, sales tax is added by the restaurant and shown on the check, while the tip is voluntary and set by you. They are separate. Many people calculate the tip on the pre-tax subtotal, while others tip on the total including tax; both are common, and the tool lets you decide. A 20 percent tip on a 45 dollar subtotal is 9 dollars, whereas the same percentage on a 48 dollar total with tax is 9.60.",
    },
    {
      type: "p",
      text: "The [Tip Calculator](/tool/tip-calculator) turns a bill into a tip, a total and each person's share, with 15 to 25 percent presets and a round-up option.",
    },
    { type: "h2", text: "Calculate it step by step" },
    {
      type: "steps",
      items: [
        "Enter the original price in the [Discount Calculator](/tool/discount-calculator).",
        "Choose a percent or dollar discount, and add a second discount if you have one.",
        "Add your sales tax rate to see the final total.",
        "For a restaurant check, move to the [Tip Calculator](/tool/tip-calculator).",
        "Double-check any unusual percentage with the [Percentage Calculator](/tool/percentage-calculator).",
      ],
    },
    { type: "h2", text: "Common mistakes" },
    {
      type: "ul",
      items: [
        "Adding two percent discounts together instead of multiplying the remaining shares.",
        "Applying tax first and then the discount, which gives a different, usually wrong, total.",
        "Forgetting that a percentage off a higher price saves more dollars than the same percentage off a lower one.",
        "Comparing a discount percentage without checking the original price, which may have been raised.",
      ],
    },
    {
      type: "p",
      text: "The formulas behind all of this are explained in [How to Calculate Percentages](/guide/how-to-calculate-percentages).",
    },
    { type: "h2", text: "Dollars off versus percent off" },
    {
      type: "p",
      text: "A sign that says 10 dollars off and one that says 10 percent off are only equal at a single price: 100 dollars. On a 40 dollar item, 10 percent is just 4 dollars, so the fixed discount wins; on a 300 dollar item, 10 percent is 30 dollars, so the percentage wins. Compare the final amounts rather than the headline numbers. The Discount Calculator accepts either kind, which makes the comparison quick.",
    },
    { type: "h2", text: "Working backward from the total" },
    {
      type: "p",
      text: "If you know the total with tax and want the pre-tax price, divide the total by 1 plus the tax rate written as a decimal. With an example 7 percent rate, a 64.20 dollar total divided by 1.07 is 60 dollars. This is handy for checking a receipt or splitting costs when only the final amount is on the statement.",
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "discount-calculator" },
        { kind: "tool", slug: "tip-calculator" },
        { kind: "tool", slug: "percentage-calculator" },
      ],
    },
  ],
};

export const toolGuides: GuideDefinition[] = [jsonGuide, wordCountGuide, passwordGuide, percentGuide, discountTaxGuide, ...toolGuidesMore];
