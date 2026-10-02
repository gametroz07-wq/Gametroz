import { absoluteUrl } from "./structured-data";

type LlmsInput = { siteUrl: string; name: string; description: string; contactEmail: string };

/**
 * Plain-text site guide for language-model crawlers (llmstxt.org format). Informational only: it
 * restates what the site is and where its sections live, and links only to public pages.
 */
export function buildLlmsTxt({ siteUrl, name, description, contactEmail }: LlmsInput) {
  const link = (label: string, path: string, note: string) => `- [${label}](${absoluteUrl(path, siteUrl)}): ${note}`;
  return [
    `# ${name}`,
    "",
    `> ${description}`,
    "",
    `${name} is an English-language website with four sections. Games are HTML5 games supplied by the third-party provider GameMonetize; ${name} does not develop them. Tools run in your browser. Apps are listings that link to the publisher's official download page.`,
    "",
    "## Sections",
    "",
    link("Games", "/games", "free HTML5 browser games grouped by category, playable without a download or sign-up"),
    link("Tools", "/tools", "free online tools (text, calculators, converters, developer and image tools) that run in your browser"),
    link("Apps", "/apps", "directory of free software by platform, each linked to the official publisher"),
    link("Guides", "/guides", "articles and how-tos about games, tools and apps"),
    "",
    "## About and policies",
    "",
    link("About", "/about", "what the site offers and where its content comes from"),
    link("Editorial policy", "/editorial-policy", "how games and apps are selected, checked and corrected"),
    link("Contact", "/contact", `report a problem or ask a question: ${contactEmail}`),
    link("Privacy policy", "/privacy", "how data is handled"),
    link("Terms of use", "/terms", "terms for using the site"),
    "",
  ].join("\n");
}
