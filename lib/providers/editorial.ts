import type { NormalizedGame, ValidationIssue } from "./types";

/**
 * Editorial heuristics. They never reject: each finding is a warning with the code
 * EDITORIAL_REVIEW_REQUIRED, so the game stays in REVIEW until a human decides.
 */

/** Third-party brands and franchises that need a rights check before publishing. */
export const KNOWN_BRANDS = [
  "resident evil",
  "roblox",
  "minecraft",
  "fortnite",
  "mario",
  "sonic",
  "pokemon",
  "pokémon",
  "zelda",
  "gta",
  "grand theft auto",
  "call of duty",
  "fifa",
  "among us",
  "barbie",
  "spider-man",
  "spiderman",
  "batman",
  "marvel",
  "disney",
  "frozen",
  "pac-man",
  "pacman",
  "tetris",
  "subway surfers",
  "angry birds",
  "candy crush",
  "geometry dash",
  "plants vs zombies",
  "clash of clans",
  "hello kitty",
  "lego",
  "hot wheels",
  "street fighter",
  "mortal kombat",
  "squid game",
  "five nights at freddy",
  "fnaf",
  "peppa pig",
  "paw patrol",
  "pubg",
  "free fire",
  "brawl stars",
  "half-life",
  "half life",
  "halo",
  "terminator",
  "star wars",
  "harry potter",
  "temple run",
  "cut the rope",
  "spongebob",
  "naruto",
  "dragon ball",
  "shrek",
  "minions",
  "bluey",
  "nba",
  "nfl",
  "ufc",
  "wwe",
  "transformers",
  "valorant",
  "counter-strike",
  "counter strike",
  "toy story",
  "kung fu panda",
  "ninja turtles",
  "power rangers",
  "ghostbusters",
  "jurassic park",
  "mickey mouse",
  "tom and jerry",
  "need for speed",
  "fall guys",
  "rocket league",
  "league of legends",
  "poppy playtime",
  "huggy wuggy",
  "sprunki",
  "cocomelon",
  "genshin impact",
  "tekken",
  "pikachu",
  "ben 10",
  "the simpsons",
] as const;

const SEO_KEYWORDS = new Set(["game", "games", "online", "free", "play", "simulator", "unblocked", "io", "2024", "2025", "2026"]);
const MIN_INSTRUCTIONS_LENGTH = 25;
const MAX_TITLE_WORDS = 6;
const MIN_DESCRIPTION_LENGTH = 60;
/** Letters (any language, accents included), digits, spaces and ordinary title punctuation. */
const USUAL_TITLE_CHARACTERS = /^[\p{L}\p{N}\p{M}\s.,:;!?'"’‘“”&\-–—_()+#/@%*$]+$/u;
const PUNCTUATION_RUN = /[^\p{L}\p{N}\p{M}\s]{3,}/u;

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const containsTerm = (text: string, term: string) => new RegExp(`(^|[^a-z0-9])${escape(term)}($|[^a-z0-9])`, "i").test(text);

const issue = (message: string): ValidationIssue => ({ code: "EDITORIAL_REVIEW_REQUIRED", message, severity: "warning" });

export function editorialIssues(game: NormalizedGame): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const title = game.name.toLowerCase();
  const tagText = game.tags.join(" ").replace(/-/g, " ");

  const brands = KNOWN_BRANDS.filter((brand) => containsTerm(title, brand) || containsTerm(tagText, brand));
  if (brands.length) issues.push(issue(`Possible third-party brand: ${[...new Set(brands)].join(", ")}. Check rights before publishing.`));

  const words = title.split(/[^a-z0-9]+/).filter(Boolean);
  const keywordHits = words.filter((word) => SEO_KEYWORDS.has(word)).length;
  const repeated = words.length !== new Set(words).size;
  const shouting = game.name.length > 12 && game.name === game.name.toUpperCase() && /[A-Z]/.test(game.name);
  if (words.length > MAX_TITLE_WORDS || keywordHits >= 2 || repeated || shouting) {
    issues.push(issue("Title looks like SEO spam (keyword stuffing, too long or all caps). Consider a clean title."));
  }

  if (!USUAL_TITLE_CHARACTERS.test(game.name) || PUNCTUATION_RUN.test(game.name)) {
    issues.push(issue("Title has unusual characters (emoji, symbols or repeated punctuation). Consider a clean title."));
  }

  if (game.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    issues.push(issue(`Description is short (${game.description.trim().length} characters, under ${MIN_DESCRIPTION_LENGTH}). Expand it before publishing.`));
  }

  if (game.instructions.trim().length > 0 && game.instructions.trim().length < MIN_INSTRUCTIONS_LENGTH) {
    issues.push(issue(`Instructions are very short (${game.instructions.trim().length} characters). Add controls.`));
  }

  if (game.categoryMatch === "approximate") {
    issues.push(issue(`Category "${game.providerCategory}" was mapped approximately to "${game.category}". Confirm the category.`));
  }
  return issues;
}
