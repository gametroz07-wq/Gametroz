import type { Category, IconKey, Tool, ToolComponentKey } from "@/types/content";

// Seed source data (the Phase 2 mock catalog). Only prisma/seed.ts imports this file.

export const toolCategories: Category[] = [
  { slug: "images", name: "Images", iconKey: "image", description: "Compress, resize and convert images right in your browser. Your files never leave your device." },
  { slug: "pdf", name: "PDF", iconKey: "file", description: "Merge, split and convert PDF documents in seconds." },
  { slug: "text", name: "Text", iconKey: "type", description: "Count, clean and transform text for writing and editing." },
  { slug: "developer", name: "Developer", iconKey: "braces", description: "Format, encode and generate data for everyday development work." },
  { slug: "calculators", name: "Calculators", iconKey: "calculator", description: "Quick calculators for percentages, discounts and everyday math." },
  { slug: "seo", name: "SEO", iconKey: "search", description: "Preview and check how your pages appear in search results." },
  { slug: "converters", name: "Converters", iconKey: "arrows", description: "Convert units, timestamps and formats instantly." },
];

type ToolSeed = {
  slug: string;
  name: string;
  category: string;
  iconKey?: IconKey;
  short: string;
  description: string;
  howTo: string[];
  tags: string[];
  featured?: boolean;
  popularity: number;
  componentKey?: ToolComponentKey;
};

const seeds: ToolSeed[] = [
  // Images
  { slug: "image-compressor", name: "Image Compressor", category: "images", short: "Reduce image size without uploading your files.", description: "Shrink JPG, PNG and WebP images while keeping them sharp. Compression runs locally in your browser, so your photos stay private.", howTo: ["Drop one or more images.", "Choose a quality level.", "Download the compressed files."], tags: ["compress", "jpg", "png", "webp"], featured: true, popularity: 95, componentKey: "image-converter" },
  { slug: "image-resizer", name: "Image Resizer", category: "images", short: "Resize images to exact pixel dimensions.", description: "Resize photos to exact widths and heights or scale them by percentage. Keep the aspect ratio locked to avoid stretching.", howTo: ["Drop an image.", "Enter the new width or height.", "Download the resized image."], tags: ["resize", "dimensions", "photo"], popularity: 82, componentKey: "image-converter" },
  { slug: "webp-to-jpg", name: "WebP to JPG", category: "images", short: "Convert WebP images to JPG in your browser.", description: "Turn WebP images into widely compatible JPG files. Convert several images at once without uploading them anywhere.", howTo: ["Drop your WebP files.", "Pick the JPG quality.", "Download the converted images."], tags: ["webp", "jpg", "convert"], featured: true, popularity: 90, componentKey: "image-converter" },
  { slug: "png-to-jpg", name: "PNG to JPG", category: "images", short: "Convert PNG images to lighter JPG files.", description: "Convert PNG screenshots and graphics to JPG to save space. Transparent areas are filled with the background color you choose.", howTo: ["Drop your PNG files.", "Choose a background color.", "Download the JPG files."], tags: ["png", "jpg", "convert"], popularity: 77, componentKey: "image-converter" },
  // PDF
  { slug: "merge-pdf", name: "Merge PDF", category: "pdf", short: "Combine several PDFs into one document.", description: "Combine multiple PDF files into a single document and reorder the pages before saving.", howTo: ["Add your PDF files.", "Drag to set the order.", "Download the merged PDF."], tags: ["pdf", "merge", "combine"], popularity: 86 },
  { slug: "pdf-to-jpg", name: "PDF to JPG", category: "pdf", short: "Turn each PDF page into a JPG image.", description: "Export every page of a PDF as a separate JPG image, ready to share or insert into a presentation.", howTo: ["Drop a PDF file.", "Select the pages.", "Download the images."], tags: ["pdf", "jpg", "convert"], popularity: 74 },
  // Text
  { slug: "word-counter", name: "Word Counter", category: "text", short: "Count words, characters and reading time instantly.", description: "Paste or type your text to see words, characters, sentences, paragraphs and estimated reading time update as you write.", howTo: ["Paste or type your text.", "Read the live counters.", "Edit until you hit your target."], tags: ["words", "characters", "writing"], featured: true, popularity: 94, componentKey: "word-counter" },
  { slug: "character-counter", name: "Character Counter", category: "text", iconKey: "type", short: "Count characters with and without spaces.", description: "Check character limits for posts, titles and descriptions, with and without spaces.", howTo: ["Paste your text.", "Check the character count.", "Trim until it fits."], tags: ["characters", "limits", "social"], popularity: 80, componentKey: "word-counter" },
  { slug: "case-converter", name: "Case Converter", category: "text", short: "Switch text to UPPER, lower or Title Case.", description: "Convert text between uppercase, lowercase, title case and sentence case with one click.", howTo: ["Paste your text.", "Pick a case style.", "Copy the result."], tags: ["uppercase", "lowercase", "title-case"], popularity: 71 },
  // Developer
  { slug: "json-formatter", name: "JSON Formatter", category: "developer", short: "Format, validate and minify JSON in your browser.", description: "Pretty-print JSON with clean indentation, spot syntax errors and minify it for production.", howTo: ["Paste your JSON.", "Click Format or Minify.", "Copy the result."], tags: ["json", "format", "validate"], featured: true, popularity: 92, componentKey: "json-formatter" },
  { slug: "base64-encoder-decoder", name: "Base64 Encoder / Decoder", category: "developer", iconKey: "code", short: "Encode and decode Base64 strings.", description: "Encode text to Base64 or decode Base64 back to readable text. Handy for data URLs and API debugging.", howTo: ["Paste your text or Base64.", "Choose Encode or Decode.", "Copy the output."], tags: ["base64", "encode", "decode"], popularity: 78 },
  { slug: "uuid-generator", name: "UUID Generator", category: "developer", iconKey: "code", short: "Generate random UUID v4 identifiers.", description: "Generate one or many random UUID v4 identifiers, ready to copy into your code or database.", howTo: ["Choose how many UUIDs.", "Click Generate.", "Copy them."], tags: ["uuid", "guid", "random"], popularity: 70 },
  // Calculators
  { slug: "percentage-calculator", name: "Percentage Calculator", category: "calculators", short: "Work out percentages, increases and discounts.", description: "Find X% of a number, what percentage one number is of another, and the change between two values.", howTo: ["Enter your numbers.", "Read the result instantly.", "Switch the calculation type if needed."], tags: ["percentage", "math", "calculator"], featured: true, popularity: 91, componentKey: "percentage-calculator" },
  { slug: "discount-calculator", name: "Discount Calculator", category: "calculators", short: "See the final price after a discount.", description: "Enter a price and a discount to see how much you save and what you will pay.", howTo: ["Enter the original price.", "Enter the discount.", "See the final price."], tags: ["discount", "sale", "price"], popularity: 73, componentKey: "percentage-calculator" },
  // SEO
  { slug: "meta-title-preview", name: "Meta Title Preview", category: "seo", short: "Preview how your title looks in search results.", description: "Check whether your page title and description fit in search results before you publish.", howTo: ["Enter your title and description.", "Check the preview.", "Shorten anything that gets cut off."], tags: ["seo", "meta", "serp"], popularity: 68 },
  // Converters
  { slug: "unit-converter", name: "Unit Converter", category: "converters", short: "Convert length, weight and temperature.", description: "Convert between metric and imperial units for length, weight, volume and temperature.", howTo: ["Pick a unit type.", "Enter a value.", "Read the converted value."], tags: ["units", "metric", "imperial"], popularity: 75 },
];

const categoryBySlug = new Map(toolCategories.map((category) => [category.slug, category]));

export const tools: Tool[] = seeds.map((seed) => {
  const category = categoryBySlug.get(seed.category);
  if (!category) throw new Error(`Unknown tool category: ${seed.category}`);
  return {
    slug: seed.slug,
    name: seed.name,
    shortDescription: seed.short,
    category: { name: category.name, slug: category.slug },
    iconKey: seed.iconKey ?? category.iconKey,
    description: seed.description,
    howTo: seed.howTo,
    tags: seed.tags,
    featured: seed.featured ?? false,
    popularity: seed.popularity,
    componentKey: seed.componentKey,
  };
});
