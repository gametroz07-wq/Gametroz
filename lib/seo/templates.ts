import { siteConfig } from "@/lib/site";
import type { PlatformSlug } from "@/types/content";

// Pure text templates for titles, descriptions, intros and alt text. Everything here only restates
// facts the page already shows (counts, names); nothing is invented and no keywords are stacked.

const TITLE_LIMIT = 60;
const DESCRIPTION_MAX = 160;
const TITLE_SUFFIX_LENGTH = ` | ${siteConfig.name}`.length;

/**
 * First candidate whose title plus the " | Gametroz" suffix fits in 60 characters; when none fits,
 * the shortest candidate (a longer title is better than a wrong one).
 */
export function fitTitle(candidates: string[]) {
  const fits = candidates.find((candidate) => candidate.length + TITLE_SUFFIX_LENGTH <= TITLE_LIMIT);
  return fits ?? candidates.reduce((shortest, candidate) => (candidate.length < shortest.length ? candidate : shortest));
}

const PLATFORM_TITLE_LABELS: Record<PlatformSlug, string> = {
  windows: "Windows",
  mac: "Mac",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
  web: "Web",
};

/** "Windows", "Windows & Mac" or "Windows, Mac & More": short enough to keep the title within 60 characters. */
function platformPhrase(platforms: PlatformSlug[]) {
  const labels = platforms.map((platform) => PLATFORM_TITLE_LABELS[platform]);
  if (labels.length <= 2) return labels.join(" & ");
  return `${labels[0]}, ${labels[1]} & More`;
}

/** Targets the "{App} download" search intent; shortens until it fits 60 characters with the site suffix. */
export function appTitle(name: string, platforms: PlatformSlug[] = []) {
  const candidates = [`${name} Download (Official Link)`, `${name} Download`, name];
  if (platforms.length > 0) candidates.unshift(`${name} Download for ${platformPhrase(platforms)}`);
  return fitTitle(candidates);
}

export function platformTitle(name: string, slug: PlatformSlug) {
  return slug === "web" ? "Web Apps That Run in Your Browser" : `${name} Apps: Official Download Links`;
}

export function appCategoryTitle(name: string) {
  return fitTitle([`${name}: Software With Official Download Links`, `${name} Software: Official Links`, `${name} Software`]);
}

export function appCategoryDescription(base: string) {
  return extendDescription(base, ["Every listing links to the publisher's official download page.", "Gametroz does not host any downloads."]);
}

/** Visible intro under the H1 of an app category page. Carries the real count and example names. */
export function appCategoryIntro({ name, count, examples }: { name: string; count: number; examples: string[] }) {
  const examplesSentence = examples.length > 0 ? ` Examples include ${joinNames(examples.slice(0, 3))}.` : "";
  return `Browse ${count} ${plural(count, "app")} in the ${name} category, each linked to the publisher's official download page.${examplesSentence} Gametroz does not host or modify any files.`;
}

export function gameCategoryTitle(name: string) {
  return fitTitle([`Free ${name} Games - Play Online`, `Free ${name} Games`]);
}

/** Cuts at a word boundary and adds an ellipsis only when the text is longer than `max`. */
export function limitDescription(text: string, max = DESCRIPTION_MAX) {
  if (text.length <= max) return text;
  const head = text.slice(0, max - 1);
  const lastSpace = head.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? head.slice(0, lastSpace) : head;
  return `${cut.replace(/[\s,;:.\-–—]+$/, "")}…`;
}

const APP_TAIL = "Official download link, features, requirements and alternatives.";

export function appDescription(shortDescription: string) {
  const full = `${shortDescription} ${APP_TAIL}`;
  return full.length <= DESCRIPTION_MAX ? full : limitDescription(shortDescription, DESCRIPTION_MAX);
}

/** Appends tail sentences, in order, until `min` characters are reached without ever passing `max`. */
export function extendDescription(base: string, tails: string[], { min = 120, max = DESCRIPTION_MAX } = {}) {
  let text = base;
  for (const tail of tails) {
    if (text.length >= min) break;
    const next = `${text} ${tail}`;
    if (next.length <= max) text = next;
  }
  return text;
}

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

type GameCategoryInput = { name: string; count: number; examples: string[] };

const plural = (count: number, singular: string) => (count === 1 ? singular : `${singular}s`);

/**
 * Unique per category because it carries the real game count and the category's top games.
 * Aims for 120-155 characters; with long game names it drops examples before it overflows.
 */
export function gameCategoryDescription({ name, count, examples }: GameCategoryInput) {
  const head = `Play ${count} free ${name.toLowerCase()} ${plural(count, "game")} online in your browser`;
  const tails = [" No download or sign-up needed. Open any title and start playing right away.", " No download or sign-up needed.", ""];
  const candidates: string[] = [];
  for (const shown of [3, 2, 1, 0]) {
    if (shown > examples.length) continue;
    const body = shown > 0 ? `${head}, including ${joinNames(examples.slice(0, shown))}.` : `${head}.`;
    for (const tail of tails) candidates.push(`${body}${tail}`);
  }
  const inRange = candidates.find((text) => text.length >= 120 && text.length <= 155);
  if (inRange) return inRange;
  const longestFitting = candidates.filter((text) => text.length <= 155).sort((a, b) => b.length - a.length)[0];
  return longestFitting ?? limitDescription(candidates[0], 155);
}

/** Visible intro under the H1 of a game category page: two or three factual sentences. */
export function gameCategoryIntro({ name, count, examples }: GameCategoryInput) {
  return [
    `Browse ${count} free ${name.toLowerCase()} ${plural(count, "game")}, all playable in your browser with no download or sign-up.`,
    examples.length > 0 ? `Popular picks include ${joinNames(examples.slice(0, 3))}.` : null,
    "Open any game to see how to play it, or use the category links below to switch genres.",
  ]
    .filter(Boolean)
    .join(" ");
}

type PlatformIntroInput = { name: string; slug: PlatformSlug; count: number; examples: string[] };

/** Visible intro under the H1 of an apps platform page. */
export function platformIntro({ name, slug, count, examples }: PlatformIntroInput) {
  const apps = plural(count, "app");
  const examplesSentence = examples.length > 0 ? ` Examples include ${joinNames(examples.slice(0, 3))}.` : "";
  if (slug === "web") {
    return `Browse ${count} ${apps} you can use in your web browser. Each listing links to the publisher's official site, and Gametroz does not host any files.${examplesSentence}`;
  }
  return `Browse ${count} ${apps} for ${name}, each linked to the publisher's official download page. Gametroz does not host or modify any files.${examplesSentence}`;
}

/** Game thumbnails are described by the game they belong to. */
export function gameImageAlt(name: string) {
  return `${name} online game`;
}

export function appIconAlt(name: string) {
  return `${name} icon`;
}

/** "Play {Name} Online for Free", shortening to fit 60 characters with the site suffix. */
export function gameTitle(name: string) {
  return fitTitle([`Play ${name} Online for Free`, `${name} - Free Online Game`, name]);
}

/** One-sentence, answer-style summary. Built only from the game's name and category. */
export function gameSummary(name: string, category: string) {
  return `${name} is a free ${category.toLowerCase()} game you can play in your web browser.`;
}

export function orientationFact(orientation: "landscape" | "portrait") {
  return orientation === "portrait" ? "Portrait (suits phones and other tall screens)" : "Landscape";
}

const GAME_DESCRIPTION_MIN = 120;
const GAME_DESCRIPTION_MAX = 158;
const GAME_CTA = "Play free in your browser, no download.";

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Meta description from the provider text: leading sentences that fit 158 characters (word-safe cut with
 * an ellipsis only when cut), a sentence that merely repeats the game name is dropped, then the call to
 * action and category info are added only when room remains. Never invents facts.
 */
export function gameMetaDescription({ name, category, description }: { name: string; category: string; description: string }) {
  const sentences = description.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length > 1 && normalizeName(sentences[0]) === normalizeName(name)) sentences.shift();
  else if (sentences.length === 1 && normalizeName(sentences[0]) === normalizeName(name)) sentences.length = 0;

  let text = "";
  for (const sentence of sentences) {
    const next = text ? `${text} ${sentence}` : sentence;
    if (next.length > GAME_DESCRIPTION_MAX) break;
    text = next;
  }
  if (!text && sentences.length > 0) return limitDescription(sentences[0], GAME_DESCRIPTION_MAX);
  if (!text) text = gameSummary(name, category);

  const lower = category.toLowerCase();
  const tails = [` ${GAME_CTA}`, ` A free ${lower} game on ${siteConfig.name}.`, ` Browse more ${lower} games online.`];
  for (const [index, tail] of tails.entries()) {
    if (index > 0 && text.length >= GAME_DESCRIPTION_MIN) break;
    if (text.length + tail.length <= GAME_DESCRIPTION_MAX) text += tail;
  }
  return text;
}
