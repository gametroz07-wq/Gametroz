import type { Category, Game, GameControl } from "@/types/content";

// Seed source data (the Phase 2 mock catalog). Only prisma/seed.ts imports this file.

export const gameCategories: Category[] = [
  { slug: "action", name: "Action", iconKey: "swords", description: "Fast reflexes, big moments. Shooters, fighters and platformers you can play right now." },
  { slug: "adventure", name: "Adventure", iconKey: "map", description: "Explore worlds, solve mysteries and uncover secrets at your own pace." },
  { slug: "arcade", name: "Arcade", iconKey: "joystick", description: "Classic pick-up-and-play games built for one more try." },
  { slug: "casual", name: "Casual", iconKey: "sparkles", description: "Relaxing games for a quick break. Easy to learn, hard to put down." },
  { slug: "puzzle", name: "Puzzle", iconKey: "puzzle", description: "Train your brain with match, logic and block puzzles." },
  { slug: "racing", name: "Racing", iconKey: "car", description: "Cars, bikes and stunts. Hit the gas and beat the clock." },
  { slug: "sports", name: "Sports", iconKey: "trophy", description: "Football, basketball, golf and more, straight from your browser." },
  { slug: "strategy", name: "Strategy", iconKey: "crown", description: "Plan, build and outsmart your opponents." },
];

const controlsByCategory: Record<string, GameControl[]> = {
  action: [
    { input: "W A S D / Arrow keys", action: "Move" },
    { input: "Space", action: "Jump" },
    { input: "Mouse click", action: "Attack" },
  ],
  adventure: [
    { input: "Arrow keys", action: "Move" },
    { input: "E", action: "Interact" },
    { input: "Mouse / Tap", action: "Select items" },
  ],
  arcade: [
    { input: "Arrow keys / Swipe", action: "Move" },
    { input: "Space / Tap", action: "Action" },
  ],
  casual: [{ input: "Mouse / Tap", action: "Select and play" }],
  puzzle: [
    { input: "Mouse / Tap", action: "Select and move pieces" },
    { input: "Z", action: "Undo" },
  ],
  racing: [
    { input: "Arrow keys / W A S D", action: "Steer and accelerate" },
    { input: "Space", action: "Nitro" },
    { input: "Tilt / On-screen buttons", action: "Mobile controls" },
  ],
  sports: [
    { input: "Mouse drag / Swipe", action: "Aim and shoot" },
    { input: "Arrow keys", action: "Move player" },
  ],
  strategy: [
    { input: "Mouse / Tap", action: "Select, build and attack" },
    { input: "Scroll / Pinch", action: "Zoom the map" },
  ],
};

const instructionsByCategory: Record<string, string> = {
  action: "Dodge enemy attacks, collect power-ups and clear each stage before the timer runs out.",
  adventure: "Explore every area, talk to characters and combine items to unlock the next chapter.",
  arcade: "Survive as long as you can, chain combos for bonus points and beat your best score.",
  casual: "Complete each level's goal to earn stars. There is no rush — play at your own pace.",
  puzzle: "Plan your moves carefully. Each level adds a new rule, so read the hint before you start.",
  racing: "Finish in first place to unlock new tracks and upgrades. Save your nitro for the straights.",
  sports: "Time your shots and watch the power meter. Win matches to move up the league table.",
  strategy: "Gather resources, upgrade your base and send units at the right moment to win each map.",
};

type GameSeed = {
  slug: string;
  name: string;
  category: string;
  tags: string[];
  short: string;
  description: string;
  orientation?: Game["orientation"];
  featured?: boolean;
  trending?: boolean;
  popularity: number;
  publishedAt: string;
};

const seeds: GameSeed[] = [
  // Action
  { slug: "sky-raiders", name: "Sky Raiders", category: "action", tags: ["shooter", "planes", "arcade"], short: "Fly a jet through waves of enemy squadrons.", description: "Pilot a nimble jet through stormy skies and take down enemy squadrons. Upgrade your weapons between missions and face a boss at the end of every sector.", trending: true, featured: true, popularity: 96, publishedAt: "2026-09-12" },
  { slug: "ninja-dash", name: "Ninja Dash", category: "action", tags: ["platformer", "ninja", "runner"], short: "Run, slash and wall-jump across rooftops.", description: "A fast platformer where every jump counts. Slice through obstacles, wall-jump between rooftops and collect scrolls hidden across each district.", trending: true, popularity: 88, publishedAt: "2026-08-03" },
  { slug: "robot-arena", name: "Robot Arena", category: "action", tags: ["robots", "fighting", "multiplayer"], short: "Build a battle bot and fight in the arena.", description: "Assemble a battle robot from dozens of parts and send it into the arena. Each victory unlocks new armor, weapons and harder opponents.", popularity: 74, publishedAt: "2026-09-25" },
  { slug: "zombie-outpost", name: "Zombie Outpost", category: "action", tags: ["zombies", "shooter", "survival"], short: "Hold the outpost until the rescue arrives.", description: "Defend a remote outpost from endless zombie waves. Place barricades, manage your ammo and survive until the rescue helicopter lands.", popularity: 81, publishedAt: "2026-06-18" },
  // Adventure
  { slug: "lost-temple", name: "Lost Temple", category: "adventure", tags: ["exploration", "treasure", "puzzle"], short: "Uncover the secrets of an ancient temple.", description: "Venture deep into a forgotten temple full of traps and riddles. Find the relics that open each chamber and escape before the ceiling closes in.", featured: true, popularity: 79, publishedAt: "2026-07-22" },
  { slug: "pixel-quest", name: "Pixel Quest", category: "adventure", tags: ["pixel", "rpg", "retro"], short: "A retro RPG with dungeons and boss fights.", description: "A pixel-art adventure with dungeons, side quests and boss battles. Level up your hero and recruit allies on the way to the dark tower.", trending: true, popularity: 85, publishedAt: "2026-09-02" },
  { slug: "island-escape", name: "Island Escape", category: "adventure", tags: ["escape", "survival", "exploration"], short: "Craft tools and find your way off the island.", description: "Stranded on a tropical island, you must gather materials, craft tools and repair a boat. Every day the tide reveals new places to explore.", popularity: 67, publishedAt: "2026-09-28" },
  // Arcade
  { slug: "neon-snake", name: "Neon Snake", category: "arcade", tags: ["snake", "retro", "classic"], short: "The classic snake game with a neon twist.", description: "Eat, grow and avoid your own tail in a glowing neon grid. Power-ups slow time, shrink your snake or double your points for a few seconds.", trending: true, popularity: 90, publishedAt: "2026-05-30" },
  { slug: "brick-breaker-x", name: "Brick Breaker X", category: "arcade", tags: ["breakout", "classic", "paddle"], short: "Smash every brick with your paddle and ball.", description: "A modern take on the brick-breaking classic. Bounce the ball, catch multi-ball power-ups and clear 60 handcrafted levels.", popularity: 77, publishedAt: "2026-04-14" },
  { slug: "space-defender", name: "Space Defender", category: "arcade", tags: ["space", "shooter", "retro"], short: "Protect the planet from the alien fleet.", description: "Slide your cannon across the screen and blast incoming alien formations. Each wave flies faster, and the mothership appears every fifth round.", popularity: 72, publishedAt: "2026-09-20" },
  { slug: "flappy-comet", name: "Flappy Comet", category: "arcade", tags: ["one-button", "endless", "space"], short: "Tap to keep your comet flying between asteroids.", description: "A one-button endless game: tap to boost your comet and slip through gaps in the asteroid belt. Simple to learn and very hard to master.", orientation: "portrait", popularity: 69, publishedAt: "2026-08-21" },
  // Casual
  { slug: "gem-match", name: "Gem Match", category: "casual", tags: ["match-3", "gems", "relaxing"], short: "Swap gems and make matches of three or more.", description: "Swap neighbouring gems to make lines of three or more. Special combos clear entire rows, and every level has a new goal to complete.", trending: true, featured: true, popularity: 93, publishedAt: "2026-07-01" },
  { slug: "cozy-cafe", name: "Cozy Café", category: "casual", tags: ["cooking", "management", "relaxing"], short: "Serve coffee and grow your little café.", description: "Brew coffee, bake pastries and keep your customers happy. Earn tips to decorate the café and unlock new recipes.", popularity: 75, publishedAt: "2026-09-15" },
  { slug: "bubble-pop", name: "Bubble Pop", category: "casual", tags: ["bubble-shooter", "colors", "relaxing"], short: "Aim, shoot and pop matching bubbles.", description: "Aim the launcher and pop groups of matching bubbles before they reach the bottom. Bounce shots off the walls for tricky angles.", popularity: 80, publishedAt: "2026-03-09" },
  { slug: "garden-friends", name: "Garden Friends", category: "casual", tags: ["farming", "animals", "relaxing"], short: "Plant, water and harvest a colorful garden.", description: "Grow flowers and vegetables, care for garden animals and trade your harvest with the neighbours. A calm game for short breaks.", orientation: "portrait", popularity: 64, publishedAt: "2026-09-27" },
  // Puzzle
  { slug: "block-cascade", name: "Block Cascade", category: "puzzle", tags: ["blocks", "tetris-like", "logic"], short: "Fit falling blocks and clear the lines.", description: "Rotate and drop falling blocks to complete lines. The speed increases every level, so plan ahead and keep the board clear.", trending: true, popularity: 91, publishedAt: "2026-06-05" },
  { slug: "pipe-flow", name: "Pipe Flow", category: "puzzle", tags: ["pipes", "logic", "connect"], short: "Connect the pipes before the water flows.", description: "Rotate pipe pieces to build a path from the source to the drain. Later levels add valves, splitters and a ticking clock.", popularity: 70, publishedAt: "2026-08-11" },
  { slug: "word-grid", name: "Word Grid", category: "puzzle", tags: ["words", "brain", "vocabulary"], short: "Find hidden words in the letter grid.", description: "Swipe across the grid to find hidden words. Each themed board has a bonus word that unlocks extra hints.", popularity: 66, publishedAt: "2026-09-23" },
  { slug: "sudoku-daily", name: "Sudoku Daily", category: "puzzle", tags: ["sudoku", "numbers", "logic"], short: "A fresh sudoku puzzle every day.", description: "Classic 9x9 sudoku with four difficulty levels. Use pencil marks, get a hint when you are stuck and keep your daily streak alive.", popularity: 83, publishedAt: "2026-02-17" },
  // Racing
  { slug: "neon-drift", name: "Neon Drift", category: "racing", tags: ["cars", "drift", "neon"], short: "Drift through neon-lit city circuits.", description: "Master the art of drifting on glowing city tracks. Chain long drifts to fill your boost meter and unlock new cars in the garage.", trending: true, featured: true, popularity: 97, publishedAt: "2026-08-28" },
  { slug: "moto-stunts", name: "Moto Stunts", category: "racing", tags: ["motorbike", "stunts", "physics"], short: "Flip your bike over ramps and loops.", description: "Ride a dirt bike across ramps, loops and crumbling bridges. Land flips to earn bonus time and reach the finish line in one piece.", trending: true, popularity: 89, publishedAt: "2026-07-14" },
  { slug: "turbo-lane", name: "Turbo Lane", category: "racing", tags: ["highway", "traffic", "endless"], short: "Weave through highway traffic at full speed.", description: "An endless highway racer: overtake traffic, near-miss for points and refuel before you run dry.", orientation: "portrait", popularity: 76, publishedAt: "2026-09-26" },
  { slug: "kart-rally", name: "Kart Rally", category: "racing", tags: ["karts", "multiplayer", "items"], short: "Kart races with items and shortcuts.", description: "Race colorful karts across eight tracks. Grab item boxes, find hidden shortcuts and fight for the gold cup.", popularity: 84, publishedAt: "2026-05-02" },
  // Sports
  { slug: "goal-rush", name: "Goal Rush", category: "sports", tags: ["football", "soccer", "penalties"], short: "Score penalties and climb the league.", description: "Curl penalties past the keeper and save shots at the other end. Win tournaments to unlock new kits and stadiums.", trending: true, popularity: 87, publishedAt: "2026-06-29" },
  { slug: "hoop-shot", name: "Hoop Shot", category: "sports", tags: ["basketball", "arcade", "timing"], short: "Swipe to shoot hoops against the clock.", description: "Shoot as many baskets as you can before the buzzer. Hit swishes in a row to light the ball on fire for double points.", orientation: "portrait", popularity: 78, publishedAt: "2026-09-08" },
  { slug: "mini-golf-world", name: "Mini Golf World", category: "sports", tags: ["golf", "physics", "relaxing"], short: "Putt your way through 54 creative holes.", description: "Plan each putt across windmills, ramps and moving platforms. Finish under par to earn stars and unlock new courses.", popularity: 73, publishedAt: "2026-03-27" },
  { slug: "table-tennis-pro", name: "Table Tennis Pro", category: "sports", tags: ["ping-pong", "reflexes", "timing"], short: "Fast table tennis rallies with spin shots.", description: "Return smashes, add topspin and outplay opponents in quick table tennis matches. Each tournament round gets faster.", popularity: 68, publishedAt: "2026-09-29" },
  // Strategy
  { slug: "tower-guard", name: "Tower Guard", category: "strategy", tags: ["tower-defense", "fantasy", "upgrades"], short: "Build towers and stop the invading army.", description: "Place archers, mages and cannons along the path to stop each wave. Upgrade towers between rounds and use spells in emergencies.", trending: true, featured: true, popularity: 92, publishedAt: "2026-07-19" },
  { slug: "kingdom-builder", name: "Kingdom Builder", category: "strategy", tags: ["city-builder", "medieval", "resources"], short: "Grow a village into a thriving kingdom.", description: "Gather wood, stone and gold to grow a small village into a kingdom. Balance food and happiness while you expand your borders.", popularity: 82, publishedAt: "2026-04-25" },
  { slug: "galaxy-conquest", name: "Galaxy Conquest", category: "strategy", tags: ["space", "conquest", "turn-based"], short: "Turn-based battles for control of the galaxy.", description: "Command a fleet in turn-based battles across the galaxy. Capture planets, research technology and form alliances to win.", popularity: 71, publishedAt: "2026-09-18" },
];

const categoryBySlug = new Map(gameCategories.map((category) => [category.slug, category]));

export const games: Game[] = seeds.map((seed) => {
  const category = categoryBySlug.get(seed.category);
  if (!category) throw new Error(`Unknown game category: ${seed.category}`);
  return {
    slug: seed.slug,
    name: seed.name,
    category: { name: category.name, slug: category.slug },
    thumbnailUrl: `/mock/games/${seed.slug}.svg`,
    shortDescription: seed.short,
    description: seed.description,
    instructions: instructionsByCategory[seed.category],
    controls: controlsByCategory[seed.category],
    tags: seed.tags,
    orientation: seed.orientation ?? "landscape",
    featured: seed.featured ?? false,
    trending: seed.trending ?? false,
    popularity: seed.popularity,
    publishedAt: seed.publishedAt,
    embedUrl: null,
    providerSlug: null,
  };
});
