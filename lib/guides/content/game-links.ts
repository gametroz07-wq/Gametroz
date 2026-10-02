import type { GuideBlock, GuideItemRef } from "@/types/content";

/**
 * Game names as the catalog stores them, keyed by slug. Every game a guide mentions is written as a link built
 * from this map, so a link label always matches the game page. `npm run guides:sync` checks that each slug is
 * a published game in the target database.
 */
export const gameNames = {
  // replacements for games archived before the release
  "fish-super-io-eating": "Fish Super IO Eating",
  "zombies-4-weapon-merge": "Zombies 4 Weapon Merge",
  "neon-velocity": "Neon Velocity",
  // racing
  "drift-car-driving": "Drift Car Driving",
  "rapid-apex-rush": "Rapid Apex Rush",
  "drive-zone": "Drive Zone",
  "max-speed": "Max Speed",
  "monsters-wheels-2": "Monsters Wheels 2",
  "ultimate-bike-stunt-racing": "Ultimate Bike Stunt Racing",
  "go-kart-racing-game": "Go Kart Racing Game",
  "buggy-racing": "Buggy Racing",
  "boat-attack": "Boat Attack",
  "superbike-hero": "Superbike Hero",
  "drive-pro-3d": "Drive Pro 3D",
  // puzzle
  pondhero: "PondHero",
  "worm-puzzle-snake-apple": "Worm Puzzle Snake Apple",
  "monster-escape-logic-puzzle-adventure": "Monster Escape: Logic Puzzle Adventure",
  "pixel-flow": "Pixel Flow",
  "repeat-pixel-arts": "Repeat Pixel Arts",
  "tumble-boat": "Tumble Boat",
  "screw-master-3d-pin-puzzle": "Screw Master 3D: Pin Puzzle",
  "slpoing-path": "SLPOING PATH",
  "bridge-builder-3d": "Bridge Builder 3D",
  "paint-tiles-puzzle": "Paint Tiles Puzzle",
  "rescue-sharp-turn": "Rescue Sharp Turn",
  "go-find-the-cake": "Go Find The Cake",
  // action
  "steel-directive-city-zero": "Steel Directive: City Zero",
  "hellforge-demon-protocol": "Hellforge: Demon Protocol",
  "call-of-tanks": "Call of Tanks",
  "hit-tank-battle": "Hit Tank Battle",
  "zombie-siege": "Zombie Siege",
  "space-war-symphony": "Space War Symphony",
  "arrow-survival-15-seconds": "Arrow Survival: 15 Seconds",
  "apocalypse-rush": "Apocalypse Rush",
  "air-fighter-3d": "Air Fighter 3D",
  "the-zombie-house": "The Zombie House",
  "vector-parkour": "Vector Parkour",
  "space-shooter-boss": "Space Shooter Boss",
  // arcade
  "halloween-fighters": "Halloween Fighters",
  "heist-idle": "Heist Idle",
  "haunted-house-idle": "Haunted House Idle",
  "extreme-ball-balancer-3d": "Extreme Ball Balancer 3D",
  "birdy-trip": "Birdy Trip",
  "stickboys-hook": "StickBoys Hook",
  clucknrun: "CluckNRun",
  "mini-car-simulator": "Mini Car Simulator",
  "1945-air-force-airplane": "1945 Air Force Airplane",
  "mini-switcher": "Mini Switcher",
  "12-minibattles": "12 MiniBattles",
  // casual
  "arrow-patrol": "Arrow Patrol",
  "throw-sword": "Throw Sword",
  "world-archery-league": "World Archery League",
  "magic-coloring-book-for-little-artists": "Magic Coloring Book for Little Artists",
  "neon-jumper": "NEON JUMPER",
  "crazy-three-puzzle": "Crazy Three Puzzle",
  "pixel-destroyer": "Pixel Destroyer",
  "one-line-drawling": "One Line Drawling",
  "balls-vs-lasers": "Balls Vs Lasers",
  "sink-or-float": "Sink or Float",
  "panda-lu-treehouse": "Panda Lu Treehouse",
  "flex-escape": "Flex Escape",
  "bubbla-boing": "Bubbla Boing",
  // sports
  "dream-football-game": "Dream Football Game",
  "mini-pool-3d": "Mini Pool 3D",
  "flick-shot-soccer": "Flick Shot Soccer",
  "crazy-kick-ball": "Crazy Kick Ball",
  "basketball-school": "Basketball School",
  "basketball-arcade": "Basketball Arcade",
  "basketball-park": "Basketball Park",
  "mini-golf-3d": "Mini Golf 3D",
  "football-kick-3d": "Football Kick 3D",
  "super-motocross": "Super Motocross",
  // adventure
  "octopus-run": "Octopus Run",
  "farming-simulation-game": "Farming Simulation Game",
  "hamster-escape-prison": "Hamster Escape: Prison",
} as const;

export type GameSlug = keyof typeof gameNames;

/** Inline link to a game page: `[Name](/game/slug)`. */
export const game = (slug: GameSlug) => `[${gameNames[slug]}](/game/${slug})`;

/** Link to a listing page or another guide with a custom label. */
export const link = (label: string, path: string) => `[${label}](${path})`;

/** A cards block for a list of games. */
export const gameCards = (slugs: GameSlug[], title?: string): GuideBlock => ({
  type: "items",
  ...(title ? { title } : {}),
  refs: slugs.map((slug): GuideItemRef => ({ kind: "game", slug })),
});

/** How the picks were chosen; shared wording so every list states the same, true method. */
export const selectionNote = (category: string) =>
  `These games come from the top of the ${category} category in the Gametroz catalog, ordered by the popularity rankings the game provider's feeds supply (most played, best games, hot games and editor picks). We then kept titles that suit this topic and left out games built around third-party brands. It is a curated starting list, not a test result: Gametroz does not publish ratings or scores.`;
