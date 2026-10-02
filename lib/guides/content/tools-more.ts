import type { GuideDefinition } from "../definitions";

// More tools guides (see tools.ts). Facts about the tools come from lib/tools/definitions.ts.

const temperatureGuide: GuideDefinition = {
  slug: "how-to-convert-fahrenheit-to-celsius",
  title: "How to Convert Fahrenheit to Celsius (and Back)",
  section: "tools",
  excerpt: "Subtract 32 and multiply by 5/9 to go from Fahrenheit to Celsius. See both formulas, a quick reference table, mental shortcuts and a note on Kelvin.",
  metaTitle: "Convert Fahrenheit to Celsius | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 26,
  tags: ["temperature", "converter", "fahrenheit"],
  body: [
    {
      type: "answer",
      text: "To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9. To go the other way, multiply Celsius by 9/5 and add 32. The [Temperature Converter](/tool/temperature-converter) shows the formula for every result.",
    },
    { type: "h2", text: "The two formulas" },
    {
      type: "ul",
      items: [
        "Fahrenheit to Celsius: °C = (°F - 32) × 5/9",
        "Celsius to Fahrenheit: °F = °C × 9/5 + 32",
      ],
    },
    {
      type: "p",
      text: "The 32 appears because the two scales start from different zero points: water freezes at 32 degrees Fahrenheit and at 0 degrees Celsius. The 9/5 factor appears because a Celsius degree is larger than a Fahrenheit degree. Between freezing and boiling water there are 100 Celsius degrees but 180 Fahrenheit degrees, and 180 divided by 100 is 9/5.",
    },
    { type: "h2", text: "Worked examples" },
    {
      type: "p",
      text: "To convert 68 °F: subtract 32 to get 36, then multiply by 5/9 to get 20, so 68 °F is 20 °C. To convert 25 °C: multiply by 9/5 to get 45, then add 32 to get 77, so 25 °C is 77 °F. The order matters. In the first case you subtract before multiplying, and in the second you multiply before adding.",
    },
    { type: "h2", text: "Quick reference table" },
    {
      type: "table",
      caption: "Common temperatures in Fahrenheit and Celsius",
      header: ["Situation", "Fahrenheit", "Celsius"],
      rows: [
        ["Water freezes", "32", "0"],
        ["Cold winter day", "14", "-10"],
        ["Cool room", "59", "15"],
        ["Comfortable room", "68", "20"],
        ["Warm day", "77", "25"],
        ["Normal body temperature, roughly", "98.6", "37"],
        ["Hot day", "95", "35"],
        ["Water boils at sea level", "212", "100"],
      ],
    },
    { type: "h2", text: "Mental shortcuts" },
    {
      type: "p",
      text: "For a rough Celsius to Fahrenheit estimate, double the number and add 30. For 20 °C that gives 70 °F, close to the exact 68. For Fahrenheit to Celsius, subtract 30 and halve it: 70 °F becomes 20 °C. The shortcut drifts as temperatures get more extreme, so use the exact formula when accuracy matters, such as in cooking or lab work.",
    },
    { type: "h2", text: "Where Kelvin fits in" },
    {
      type: "p",
      text: "Kelvin is the scientific scale. It uses the same size of degree as Celsius but starts at absolute zero, the lowest possible temperature, which is -273.15 °C. To convert Celsius to Kelvin, add 273.15. Kelvin is written without a degree sign, so 0 °C is 273.15 K. No temperature can be below absolute zero, and the [Temperature Converter](/tool/temperature-converter) checks for that, and also converts Rankine.",
    },
    { type: "h2", text: "Convert it step by step" },
    {
      type: "steps",
      items: [
        "Open the [Temperature Converter](/tool/temperature-converter).",
        "Enter the value and choose the scale it is in.",
        "Read the converted values and the formula shown with them.",
        "Round sensibly: whole degrees are fine for weather, one decimal for cooking or science.",
      ],
    },
    { type: "h2", text: "Other US and metric conversions" },
    {
      type: "p",
      text: "Temperature is rarely the only unit you need to switch when you read a metric recipe or a travel guide. The [Length Converter](/tool/length-converter) moves between inches, feet, miles, centimeters and kilometers, and the [Weight Converter](/tool/weight-converter) converts ounces, pounds, grams and kilograms. If you are comparing percentages in the conversion, for example a temperature rise as a share, see [How to Calculate Percentages](/guide/how-to-calculate-percentages).",
    },
    { type: "h2", text: "Where each scale is used" },
    {
      type: "p",
      text: "The United States uses Fahrenheit for weather, cooking and body temperature in everyday life, while most of the rest of the world uses Celsius. Science is almost entirely done in Celsius and Kelvin. That is why you meet both: an American oven recipe may say 350 °F, while a European one says 180 °C for roughly the same heat. Neither is more correct, they are simply different scales with different reference points.",
    },
    { type: "h2", text: "Common mistakes to avoid" },
    {
      type: "ul",
      items: [
        "Multiplying before subtracting 32 when converting from Fahrenheit. Subtract first, then multiply.",
        "Using 9/5 where 5/9 belongs. Fahrenheit numbers are bigger than Celsius numbers for the same temperature above about -40, so the Celsius result should be smaller.",
        "Forgetting that -40 is the same on both scales, which makes a handy sanity check.",
        "Rounding too early. Keep extra decimals until the last step, then round once.",
      ],
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "temperature-converter" },
        { kind: "tool", slug: "length-converter" },
        { kind: "tool", slug: "weight-converter" },
      ],
    },
  ],
};

const imageFormatGuide: GuideDefinition = {
  slug: "how-to-convert-webp-and-png-to-jpg",
  title: "How to Convert WebP and PNG to JPG",
  section: "tools",
  excerpt: "Turn WebP and PNG images into widely compatible JPG files: handle transparency with a background color, choose a quality level and keep files private.",
  metaTitle: "Convert WebP and PNG to JPG | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 27,
  tags: ["images", "webp", "png", "jpg"],
  body: [
    {
      type: "answer",
      text: "Use the [WebP to JPG Converter](/tool/webp-to-jpg) or the [PNG to JPG Converter](/tool/png-to-jpg), pick a background color for any transparent areas, set the quality and download the result. Both accept up to 10 files at a time.",
    },
    { type: "h2", text: "Why you end up with WebP or PNG" },
    {
      type: "p",
      text: "WebP is a modern format used by many websites because it can produce smaller files than older formats. When you save an image from a page, you may get a WebP even though you expected a JPG. PNG is common for screenshots, logos and graphics with sharp edges, and it supports transparency. JPG is the format nearly every device, program, upload form and email client accepts, which is why people convert to it.",
    },
    {
      type: "table",
      caption: "How the three formats compare",
      header: ["Format", "Compression", "Transparency", "Best for"],
      rows: [
        ["JPG", "Lossy", "No", "Photographs and maximum compatibility"],
        ["PNG", "Lossless", "Yes", "Screenshots, logos, graphics with sharp edges"],
        ["WebP", "Lossy or lossless", "Yes", "Web images where small files matter"],
      ],
    },
    { type: "h2", text: "What happens to transparency" },
    {
      type: "p",
      text: "JPG has no transparent pixels, so a transparent area has to become a solid color. Without a choice, it may come out black or white in unexpected places. Both converters let you choose a background color. Pick white for documents and light pages, or match the color of the page where the image will appear.",
    },
    { type: "h2", text: "Convert step by step" },
    {
      type: "steps",
      items: [
        "Open the [WebP to JPG Converter](/tool/webp-to-jpg) for WebP files, or the [PNG to JPG Converter](/tool/png-to-jpg) for PNG files.",
        "Add your images. You can convert up to 10 at once.",
        "Choose a background color for transparent areas.",
        "Set the quality with the slider and check the preview.",
        "Download the converted JPG files.",
      ],
    },
    { type: "h2", text: "Choosing a quality level" },
    {
      type: "p",
      text: "JPG compression is lossy: lowering the quality shrinks the file by discarding detail, and the loss becomes visible as blocky patches or blurred edges. For photos, a moderate-to-high quality setting usually looks the same as the original while saving space. For screenshots with text, sharp edges show compression artifacts sooner, so keep the quality higher or stay with PNG.",
    },
    {
      type: "p",
      text: "A practical rule of thumb: use PNG while you are still editing, because it loses nothing, and make the JPG as the last step before sharing or uploading. If you receive a WebP that will not open in an older program, converting it once to JPG is usually the fastest fix.",
    },
    {
      type: "note",
      title: "Do not convert back and forth",
      text: "Each lossy save discards a little more detail. Keep the original file, convert a copy once, and avoid repeatedly re-saving the JPG.",
    },
    { type: "h2", text: "Privacy: local processing" },
    {
      type: "p",
      text: "Our converters run in your browser, and the tool pages state that nothing is uploaded. That means a private photo or a document screenshot is processed on your own device rather than sent to a server.",
    },
    { type: "h2", text: "After converting" },
    {
      type: "p",
      text: "If the JPG is still too big for an upload limit, shrink it further with the [Image Compressor](/tool/image-compressor), or reduce the pixel dimensions with the [Image Resizer](/tool/image-resizer). Resizing usually saves more space than lowering the quality. Our guide [How to Compress Images](/guide/how-to-compress-images) explains how to combine them.",
    },
    { type: "h2", text: "When you should keep the original format" },
    {
      type: "p",
      text: "Converting is not always the right move. Keep a PNG when it contains text, line art or a logo with hard edges, because lossy compression can leave fuzzy halos around them. Keep transparency when the image will sit on different backgrounds, such as a logo placed on a website. Convert to JPG when the image is a photograph, when you must upload it to a form that only accepts JPG, or when you need the smallest size with broad compatibility.",
    },
    { type: "h2", text: "Metadata and file names" },
    {
      type: "p",
      text: "Converted files keep their base name and change only the extension, so holiday-photo.png becomes holiday-photo.jpg. The converters do not carry PNG metadata across. If you rely on embedded information such as a capture date, keep the original file in a safe place and treat the JPG as a working copy for sharing.",
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "webp-to-jpg" },
        { kind: "tool", slug: "png-to-jpg" },
        { kind: "tool", slug: "image-compressor" },
        { kind: "tool", slug: "image-resizer" },
      ],
    },
  ],
};

const timestampGuide: GuideDefinition = {
  slug: "what-is-a-unix-timestamp",
  title: "What Is a Unix Timestamp?",
  section: "tools",
  excerpt: "A Unix timestamp counts the seconds since January 1, 1970 UTC. Learn seconds versus milliseconds, time zones, the year 2038 issue and how to convert one.",
  metaTitle: "What Is a Unix Timestamp? | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 28,
  tags: ["timestamp", "developer", "time"],
  body: [
    {
      type: "answer",
      text: "A Unix timestamp is the number of seconds that have passed since 00:00:00 UTC on January 1, 1970, known as the Unix epoch. Paste one into the [Unix Timestamp Converter](/tool/timestamp-converter) to see it as a readable date.",
    },
    { type: "h2", text: "Why computers use a single number" },
    {
      type: "p",
      text: "Dates are awkward for software. Months have different lengths, time zones shift, and daylight saving time moves clocks forward and back. A single running count of seconds avoids all of that. It is easy to store, sort and compare, and the difference between two timestamps is simply the number of seconds between two moments.",
    },
    { type: "h2", text: "Seconds versus milliseconds" },
    {
      type: "p",
      text: "The classic timestamp counts seconds, and has ten digits for dates around the present day. Many programming environments, including JavaScript, count milliseconds instead, which gives a thirteen-digit number. If a converted date lands in January 1970, or in a year thousands of years away, you have probably used the wrong unit.",
    },
    {
      type: "table",
      caption: "Examples of timestamp values",
      header: ["Timestamp", "Unit", "Meaning"],
      rows: [
        ["0", "Seconds", "January 1, 1970, 00:00:00 UTC (the epoch)"],
        ["86400", "Seconds", "January 2, 1970, 00:00:00 UTC (one day later)"],
        ["1000000000", "Seconds", "September 9, 2001, 01:46:40 UTC"],
        ["1000000000000", "Milliseconds", "The same moment as the row above"],
      ],
    },
    { type: "h2", text: "UTC and time zones" },
    {
      type: "p",
      text: "A timestamp has no time zone built in. It marks one absolute moment, the same everywhere on Earth. The time zone only matters when you display it: the same timestamp reads as different clock times in New York and in Tokyo. The converter shows both UTC and your local time, so you can see the difference.",
    },
    { type: "h2", text: "How to convert a timestamp" },
    {
      type: "steps",
      items: [
        "Open the [Unix Timestamp Converter](/tool/timestamp-converter).",
        "Paste the number. Check whether it has 10 digits (seconds) or 13 (milliseconds).",
        "Read the date in UTC and in your local time zone.",
        "To go the other way, enter a date and time and copy the resulting timestamp.",
      ],
    },
    { type: "h2", text: "The year 2038 problem" },
    {
      type: "p",
      text: "Some older systems store the timestamp as a signed 32-bit integer. The largest value it can hold is 2,147,483,647, which corresponds to January 19, 2038, at 03:14:07 UTC. One second later the number overflows and wraps to a negative value, which such a system would read as a date in 1901. Systems that use 64-bit integers are not affected on any practical time scale, and modern software has largely moved to them.",
    },
    { type: "h2", text: "Where you will meet timestamps" },
    {
      type: "ul",
      items: [
        "API responses and JSON data, where created and updated fields are often timestamps.",
        "Log files and database columns.",
        "Authentication tokens, which often store an expiry time as a timestamp.",
        "File metadata, such as when a file was last modified.",
      ],
    },
    {
      type: "p",
      text: "When a timestamp sits inside a JSON payload, the [JSON Formatter & Validator](/tool/json-formatter) makes the structure readable first; see [How to Format, Minify and Validate JSON](/guide/how-to-format-json). Related developer utilities include the [UUID Generator & Validator](/tool/uuid-generator) for unique identifiers and the [Hash Generator](/tool/hash-generator) for checksums. Our roundup [Best Free Online Developer Tools](/guide/best-free-online-developer-tools) covers the rest.",
    },
    { type: "h2", text: "Negative timestamps and leap seconds" },
    {
      type: "p",
      text: "Moments before the epoch are represented by negative numbers, so a timestamp of -86400 is December 31, 1969. Unix time also ignores leap seconds: every day is treated as exactly 86,400 seconds long. For almost every application that distinction does not matter, but it explains why timestamps cannot be used for precise astronomical timekeeping.",
    },
    { type: "h2", text: "Reading timestamps in the wild" },
    {
      type: "p",
      text: "Not every large number is a timestamp, so look for context. A field named created_at, expires or updated next to a ten-digit value is a strong hint. If the value has nine digits, it is a date before 2001, and if it has eleven or more, check whether it is in milliseconds. When in doubt, convert it and see whether the resulting date is plausible.",
    },
    { type: "h2", text: "Quick mental estimates" },
    {
      type: "p",
      text: "A few round numbers help when you read a log. A day is 86,400 seconds, an hour is 3,600, and a week is 604,800. Adding 3,600 to a timestamp moves it forward one hour, which is a quick way to reason about expiry times without a calculator. For anything exact, paste the value into the converter instead of doing arithmetic by hand.",
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "timestamp-converter" },
        { kind: "tool", slug: "json-formatter" },
        { kind: "tool", slug: "uuid-generator" },
        { kind: "tool", slug: "hash-generator" },
      ],
    },
  ],
};

const compressGuide: GuideDefinition = {
  slug: "how-to-compress-images",
  title: "How to Compress Images Without Losing Quality",
  section: "tools",
  excerpt: "Make photos smaller for the web or email: understand compression versus resizing, choose a format and a quality setting, then shrink images step by step.",
  metaTitle: "Compress Images Without Losing Quality | Gametroz",
  publishedAt: "2026-09-10",
  updatedAt: "2026-10-02",
  featured: true,
  sortOrder: 20,
  tags: ["images", "compression", "web"],
  body: [
    {
      type: "answer",
      text: "Resize the image to the size it will actually be displayed, then compress it with the [Image Compressor](/tool/image-compressor) at a quality setting where you cannot see the difference. Resizing first usually saves the most space.",
    },
    { type: "h2", text: "Compression versus resizing" },
    {
      type: "p",
      text: "These are two different ways to make a file smaller. Resizing changes the pixel dimensions: a 4000-pixel-wide photo shown at 1200 pixels wastes data on pixels no one sees. Compression keeps the dimensions but stores the pixels more efficiently. Lossy compression does that by discarding detail the eye is least likely to notice. Doing both gives the smallest result.",
    },
    { type: "h2", text: "Pick the right format" },
    {
      type: "table",
      caption: "Which format suits which image",
      header: ["Format", "Strength", "Watch out for"],
      rows: [
        ["JPG", "Small files for photographs", "Lossy, no transparency"],
        ["PNG", "Sharp edges, text and transparency", "Large for photographs"],
        ["WebP", "Often smaller than JPG or PNG", "Some older software cannot open it"],
      ],
    },
    {
      type: "p",
      text: "The [Image Compressor](/tool/image-compressor) accepts JPEG, PNG and WebP and saves to JPEG or WebP. If you need a JPG from a WebP or PNG, see [How to Convert WebP and PNG to JPG](/guide/how-to-convert-webp-and-png-to-jpg).",
    },
    { type: "h2", text: "Compress step by step" },
    {
      type: "steps",
      items: [
        "Keep a copy of the original file in case you need to edit it again.",
        "Open the [Image Resizer](/tool/image-resizer) and set the width you need, with the aspect ratio locked.",
        "Open the [Image Compressor](/tool/image-compressor) and add the resized image.",
        "Start with a high quality setting and lower it gradually, comparing with the original.",
        "Stop just before you can see artifacts, then download the result.",
      ],
    },
    { type: "h2", text: "Choosing a quality setting" },
    {
      type: "p",
      text: "There is no universal number, because the effect depends on the picture. Photographs with soft gradients, such as skies, show banding earlier than busy scenes such as foliage. Test your own image: zoom in on edges and smooth areas, compare with the original and pick the lowest setting that still looks the same to you.",
    },
    { type: "h2", text: "How much can you save?" },
    {
      type: "p",
      text: "Savings depend on the picture and the starting point. A large photo straight from a phone camera often shrinks dramatically once it is resized to web dimensions, because most of its pixels are never displayed. A graphic that is already small and compressed may barely change. Compare the file sizes before and after, and stop when the gain is no longer worth any visible loss.",
    },
    { type: "h2", text: "Typical targets" },
    {
      type: "ul",
      items: [
        "Website images: match the pixel width to the largest size the image is displayed at.",
        "Email attachments: reduce the dimensions first, since many mail services limit total attachment size.",
        "Profile pictures and thumbnails: small dimensions need very small files.",
        "Archive or print: keep the original untouched and compress only copies.",
      ],
    },
    {
      type: "note",
      title: "Private by design",
      text: "The tool pages state that the image tools process files in your browser and nothing is uploaded, so you can shrink personal photos without sending them to a server.",
    },
    {
      type: "p",
      text: "Percent changes help when you compare sizes: going from 2 MB to 500 KB is a 75 percent reduction, which our guide [How to Calculate Percentages](/guide/how-to-calculate-percentages) explains. The [Data Storage Converter](/tool/data-storage-converter) is handy for switching between KB, MB and GB when you check upload limits.",
    },
    { type: "h2", text: "Lossy and lossless compression" },
    {
      type: "p",
      text: "Lossless compression shrinks a file in a way that can be reversed exactly, so no detail is lost, but the savings are modest. Lossy compression throws away information that is hard to see and can save far more space. JPG is always lossy. PNG is lossless. WebP can be either. Because lossy changes are permanent, always compress a copy and keep the original untouched.",
    },
    { type: "h2", text: "Mistakes that waste space or quality" },
    {
      type: "ul",
      items: [
        "Compressing an image that is still far larger than the space it will fill. Resize it first.",
        "Saving a screenshot with text as a heavily compressed JPG, which blurs the letters.",
        "Compressing the same JPG several times. Each pass loses a little more.",
        "Using PNG for photographs, which produces very large files for little visual benefit.",
      ],
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "image-compressor" },
        { kind: "tool", slug: "image-resizer" },
        { kind: "tool", slug: "webp-to-jpg" },
        { kind: "tool", slug: "data-storage-converter" },
      ],
    },
  ],
};

const devToolsGuide: GuideDefinition = {
  slug: "best-free-online-developer-tools",
  title: "Best Free Online Developer Tools",
  section: "tools",
  excerpt: "A tour of the free developer and generator tools in the Gametroz catalog: JSON, Base64, URL, timestamps, hashes, UUIDs, passwords, QR codes and more.",
  metaTitle: "Best Free Online Developer Tools | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 29,
  tags: ["developer", "tools", "generators"],
  body: [
    {
      type: "answer",
      text: "For everyday development tasks, the free tools in our Developer and Generators categories cover formatting JSON, encoding text, converting timestamps, hashing, and creating UUIDs, passwords, random numbers, QR codes and slugs. Here is what each one does and when to reach for it.",
    },
    { type: "h2", text: "How this list was chosen" },
    {
      type: "p",
      text: "This is not a ranking. It is a tour of every tool in the [Developer](/tools/developer) and [Generators](/tools/generators) categories of this site, grouped by the job each one does. Browse the full categories to see everything available.",
    },
    { type: "h2", text: "Developer tools at a glance" },
    {
      type: "table",
      caption: "Developer tools and what they are for",
      header: ["Tool", "What it does", "Reach for it when"],
      rows: [
        ["[JSON Formatter & Validator](/tool/json-formatter)", "Formats, minifies and validates JSON with line and column errors", "An API response is unreadable or a parser rejects your data"],
        ["[Base64 Encoder & Decoder](/tool/base64-encoder-decoder)", "Encodes and decodes Base64 with UTF-8 handling and a URL-safe option", "A value looks like random letters ending in equals signs"],
        ["[URL Encoder & Decoder](/tool/url-encoder-decoder)", "Percent-encodes and decodes URLs and lists query parameters", "A link contains %20 and other escaped characters"],
        ["[Unix Timestamp Converter](/tool/timestamp-converter)", "Converts timestamps to dates and back, in UTC and local time", "A log or API shows a long number instead of a date"],
        ["[Hash Generator](/tool/hash-generator)", "Creates SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text or a file", "You need to verify that a file or string matches a checksum"],
      ],
    },
    { type: "h2", text: "Generators at a glance" },
    {
      type: "table",
      caption: "Generator tools and what they are for",
      header: ["Tool", "What it does", "Reach for it when"],
      rows: [
        ["[UUID Generator & Validator](/tool/uuid-generator)", "Creates random version 4 UUIDs in bulk and validates existing ones", "You need unique identifiers for test data or records"],
        ["[Password Generator](/tool/password-generator)", "Creates random passwords with chosen length and character types", "You are creating or changing an account password"],
        ["[Random Number Generator](/tool/random-number-generator)", "Picks numbers in a range, with unique-only and decimals options", "You need a fair draw or sample data"],
        ["[QR Code Generator](/tool/qr-code-generator)", "Makes a QR code from a URL or text, downloadable as PNG or SVG", "You want people to open a link by scanning"],
        ["[Slug Generator](/tool/slug-generator)", "Turns a title into a clean lowercase URL slug", "You are publishing a page and need a tidy web address"],
      ],
    },
    { type: "h2", text: "A few workflows that combine them" },
    {
      type: "ul",
      items: [
        "Debug an API response: format it with the JSON Formatter, decode any Base64 field, then convert timestamp fields to dates.",
        "Share a link: clean the title with the Slug Generator and make a QR code for print.",
        "Verify a download: generate a SHA-256 hash of the file and compare it with the value the publisher lists.",
        "Create test data: generate UUIDs and random numbers in bulk.",
      ],
    },
    { type: "h2", text: "Guides for individual tools" },
    {
      type: "p",
      text: "Go deeper with [How to Format, Minify and Validate JSON](/guide/how-to-format-json), [What Is a Unix Timestamp?](/guide/what-is-a-unix-timestamp) and [How to Generate a Strong Password](/guide/how-to-generate-a-strong-password).",
    },
    { type: "h2", text: "A note on sensitive data" },
    {
      type: "p",
      text: "Some of our tools say on their pages that they work locally in your browser, such as the Hash Generator and the image tools. Even so, avoid pasting production secrets, private keys or customer data into any online tool unless you have confirmed how it handles your input. For real accounts, generate passwords and store them in a password manager rather than leaving them in a browser tab.",
    },
    { type: "h2", text: "Choosing the right tool for the job" },
    {
      type: "p",
      text: "Many tasks look alike but need different tools. Base64 and URL encoding both turn text into a safe-looking string, but Base64 is for carrying binary or arbitrary text inside plain text, while percent-encoding is for putting values into a web address. A hash is one-way: it identifies data but cannot be decoded back. A UUID is an identifier, not a secret, so never use one as a password. Picking the right tool avoids a surprising amount of debugging.",
    },
    {
      type: "items",
      title: "Tools in this guide",
      refs: [
        { kind: "tool", slug: "json-formatter" },
        { kind: "tool", slug: "base64-encoder-decoder" },
        { kind: "tool", slug: "url-encoder-decoder" },
        { kind: "tool", slug: "timestamp-converter" },
        { kind: "tool", slug: "hash-generator" },
        { kind: "tool", slug: "uuid-generator" },
        { kind: "tool", slug: "password-generator" },
        { kind: "tool", slug: "random-number-generator" },
        { kind: "tool", slug: "qr-code-generator" },
        { kind: "tool", slug: "slug-generator" },
      ],
    },
  ],
};

export const toolGuidesMore: GuideDefinition[] = [temperatureGuide, imageFormatGuide, timestampGuide, compressGuide, devToolsGuide];
