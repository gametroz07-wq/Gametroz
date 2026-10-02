import type { GuideDefinition } from "../definitions";
import { game, gameCards, link, selectionNote } from "./game-links";

// "Best of" lists, part 1: racing, puzzle, action. Every fact about a game comes from its catalog entry
// (description, category, controls, orientation, 2D/3D tag). No ratings, player counts or testing claims.

export const racingGuide: GuideDefinition = {
  slug: "best-racing-games-online",
  title: "The Best Racing Games to Play Online",
  section: "games",
  excerpt: "Eleven free racing games you can play in your browser, from drifting and monster trucks to karts and boats, with controls and screen layout for each.",
  metaTitle: "Best Racing Games to Play Online Free | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: true,
  sortOrder: 2,
  tags: ["racing", "cars", "ranking"],
  body: [
    {
      type: "answer",
      text: `For drifting, start with ${game("drift-car-driving")}; for trucks, ${game("monsters-wheels-2")}; for stunts, ${game("ultimate-bike-stunt-racing")}. All eleven games below run in your browser with no download.`,
    },
    { type: "h2", text: "How these racing games were picked" },
    { type: "p", text: selectionNote("racing") },
    { type: "h2", text: "Pick by what you want to drive" },
    {
      type: "ul",
      items: [
        `Circuit racing: ${game("rapid-apex-rush")} is a formula-style race against rival cars.`,
        `Stunts and jumps: ${game("max-speed")} and ${game("ultimate-bike-stunt-racing")}.`,
        `Trucks and buggies: ${game("monsters-wheels-2")} and ${game("buggy-racing")}.`,
        `Mixed terrain: ${game("drive-zone")} covers city streets, rally tracks and off-road ground.`,
        `Karts, boats and bikes: ${game("go-kart-racing-game")}, ${game("boat-attack")} and ${game("superbike-hero")}.`,
        `Quick one-touch driving on a phone: ${game("drive-pro-3d")}.`,
      ],
    },
    { type: "h2", text: "Controls and screen layout at a glance" },
    {
      type: "table",
      caption: "Controls and screen orientation of the racing games in this list",
      header: ["Game", "Controls", "Screen"],
      rows: [
        [game("drift-car-driving"), "W A S D or arrow keys; mouse for menu buttons", "Landscape"],
        [game("rapid-apex-rush"), "Arrow keys to turn; more instructions in the game", "Landscape"],
        [game("drive-zone"), "W accelerate, S brake or reverse, A and D steer, C camera, Esc pause; on-screen controls on mobile", "Landscape"],
        [game("max-speed"), "Up and down for flips, Shift or Space for nitro, left and right to turn", "Landscape"],
        [game("monsters-wheels-2"), "Up or W accelerate, Down or S brake, left and right lean in the air, Space or X nitro", "Landscape"],
        [game("ultimate-bike-stunt-racing"), "Right arrow drive, left arrow brake, up and down arrows flip, Space jump", "Landscape"],
        [game("go-kart-racing-game"), "W A S D or arrow keys; mouse for buttons", "Landscape"],
        [game("buggy-racing"), "Keyboard, or on-screen controls on mobile", "Landscape"],
        [game("boat-attack"), "W A S D or arrows to drive, R reloads the boat, P pauses", "Landscape"],
        [game("superbike-hero"), "W A S D or arrow keys; touch to steer on mobile", "Landscape"],
        [game("drive-pro-3d"), "Press and hold to accelerate, release to brake", "Portrait"],
      ],
    },
    { type: "h2", text: "The picks" },
    { type: "h3", text: "Cars and circuits" },
    {
      type: "p",
      text: `${game("drift-car-driving")} is a 3D driving game built around highway drifting and car simulation. ${game("rapid-apex-rush")} is a formula-racing challenge: you take tight corners, use speed boosts, dodge rival vehicles and hazards and look for the fastest racing line. It is tagged multiplayer in the catalog. ${game("drive-zone")} sends you through city streets, rally tracks and off-road terrain in 3D.`,
    },
    { type: "h3", text: "Stunts and jumps" },
    {
      type: "p",
      text: `${game("max-speed")} puts sports cars on 3D tracks with jumps and stunts, and lets you upgrade and customize the cars. In ${game("ultimate-bike-stunt-racing")} you choose from a range of bikes and race stunt tracks; its description says most levels are easy but beating the top time is hard.`,
    },
    { type: "h3", text: "Trucks, buggies and karts" },
    {
      type: "p",
      text: `${game("monsters-wheels-2")} has 24 levels across jungles, a beach, an amusement park and the Arizona desert. Events include racing a full grid, flattening parked cars, landing a backflip and beating the clock, and the three monster trucks can be upgraded in engine, suspension, tyres and nitro. ${game("buggy-racing")} offers three buggies, three characters and three modes: Racing, Time Lap and Endless. ${game("go-kart-racing-game")} is a kart race with obstacles and rewards on the track.`,
    },
    { type: "h3", text: "Boats, bikes and one-touch driving" },
    {
      type: "p",
      text: `${game("boat-attack")} is a one-player motorboat championship set among emerald waters and limestone islands. ${game("superbike-hero")} is a 3D superbike series across Europe and the Middle East where you boost, collect coins and upgrade your bike. ${game("drive-pro-3d")} is the odd one out: a portrait-mode game where holding accelerates and releasing brakes, so you steer through traffic with timing alone.`,
    },
    gameCards(
      ["drift-car-driving", "rapid-apex-rush", "drive-zone", "max-speed", "monsters-wheels-2", "ultimate-bike-stunt-racing", "go-kart-racing-game", "buggy-racing", "boat-attack", "superbike-hero", "drive-pro-3d"],
      "Racing games in this guide",
    ),
    { type: "h2", text: "Tips for racing in a browser" },
    {
      type: "ul",
      items: [
        "Click inside the game once before you press keys, so the keyboard controls reach the game instead of the page.",
        "Most of these games use W A S D or the arrow keys. If a game has more controls than you expected, the in-game instructions screen lists them.",
        `On a phone, landscape games expect you to turn the device sideways; ${game("drive-pro-3d")} is built for portrait. See ${link("how to play games in fullscreen", "/guide/how-to-play-games-in-fullscreen")} for both layouts.`,
        `If a 3D race stutters on an older computer, read ${link("browser games for low-end PCs", "/guide/browser-games-for-low-end-pcs")}.`,
      ],
    },
    { type: "note", title: "More racing", text: `The full ${link("racing category", "/games/racing")} lists every racing game in the catalog, and ${link("the best free browser games", "/guide/best-free-browser-games")} picks across all genres.` },
  ],
};

export const puzzleGuide: GuideDefinition = {
  slug: "best-puzzle-games-online",
  title: "The Best Puzzle Games to Play Online",
  section: "games",
  excerpt: "Eleven free puzzle games to play in your browser, grouped by puzzle type, with a plain description of how each one works and which screen it suits.",
  metaTitle: "Best Puzzle Games to Play Online Free | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 3,
  tags: ["puzzle", "brain", "ranking"],
  body: [
    {
      type: "answer",
      text: `For a memory test try ${game("pondhero")}, for physics try ${game("tumble-boat")}, and for quick reactions try ${game("pixel-flow")}. Every game below is free and plays in the browser.`,
    },
    { type: "h2", text: "How these puzzle games were picked" },
    { type: "p", text: selectionNote("puzzle") },
    { type: "h2", text: "Choose by puzzle type" },
    {
      type: "ul",
      items: [
        `Memory: ${game("pondhero")} shows a safe path across a pond, hides it, and asks you to guide a frog along the same route.`,
        `Logic and rotation: ${game("monster-escape-logic-puzzle-adventure")} has 60 levels in which you rotate the world to reach a key.`,
        `Drawing and painting: ${game("slpoing-path")}, ${game("paint-tiles-puzzle")} and ${game("repeat-pixel-arts")}.`,
        `Physics and building: ${game("bridge-builder-3d")} and ${game("tumble-boat")}.`,
        `Mechanisms and chain reactions: ${game("rescue-sharp-turn")} and ${game("screw-master-3d-pin-puzzle")}.`,
        `Reaction and ordering: ${game("pixel-flow")}; route planning: ${game("go-find-the-cake")}; spatial snake puzzles: ${game("worm-puzzle-snake-apple")}.`,
      ],
    },
    { type: "h2", text: "How each game is played" },
    {
      type: "table",
      caption: "Puzzle type, input and screen orientation for each puzzle game in this list",
      header: ["Game", "What you do", "Screen"],
      rows: [
        [game("pondhero"), "Memorize the path, then click the same route", "Landscape"],
        [game("worm-puzzle-snake-apple"), "Arrow keys or drag on PC; on-screen button on mobile", "Landscape"],
        [game("monster-escape-logic-puzzle-adventure"), "On-screen buttons rotate the world; tap beside the monster to walk", "Portrait"],
        [game("pixel-flow"), "Tap to send cannons onto the conveyor; they fire at matching colors", "Landscape"],
        [game("repeat-pixel-arts"), "Pick a color, click pixels to copy the pattern shown", "Landscape"],
        [game("tumble-boat"), "Click and drag to remove blocks without tipping the tower", "Portrait"],
        [game("screw-master-3d-pin-puzzle"), "Twist screws and collect mechanisms in a 3D scene", "Portrait"],
        [game("slpoing-path"), "Draw lines so the ball rolls to the target block", "Landscape"],
        [game("bridge-builder-3d"), "Use mouse or touch to build a bridge that holds a vehicle", "Landscape"],
        [game("paint-tiles-puzzle"), "Tap the brush to fill the tile grid with the right colors", "Portrait"],
        [game("rescue-sharp-turn"), "Click the right objects in a small 3D scene", "Portrait"],
      ],
    },
    { type: "h2", text: "What to expect from each pick" },
    {
      type: "p",
      text: `${game("pondhero")} gets longer and trickier as you progress, and one wrong step means starting the path again. ${game("worm-puzzle-snake-apple")} mixes classic snake movement with spatial puzzles: you escape traps and guide snakes through levels. ${game("monster-escape-logic-puzzle-adventure")} asks you to avoid falling boxes and sharp thorns while you rotate the dungeon.`,
    },
    {
      type: "p",
      text: `${game("pixel-flow")} is about the order of your actions: cannons fire at pixel blocks of their own color, spare slots are limited, and you have to avoid overloading the conveyor. ${game("repeat-pixel-arts")} is a 2D copying puzzle with a varied color palette. ${game("paint-tiles-puzzle")} is described as a relaxing mix of drawing and logic on a tile grid.`,
    },
    {
      type: "p",
      text: `${game("bridge-builder-3d")} uses different materials to build structures that support a vehicle, across four locations, and includes a built-in hint system. ${game("tumble-boat")} starts a boat on a stack of blocks that you remove one by one. ${game("rescue-sharp-turn")} has short levels where you trigger mechanisms, move rocks or release water to rescue a character. ${game("screw-master-3d-pin-puzzle")} is a 3D puzzle about twisting screws, and ${game("go-find-the-cake")} has you plan a route to deliver cakes to children.`,
    },
    gameCards(
      ["pondhero", "worm-puzzle-snake-apple", "monster-escape-logic-puzzle-adventure", "pixel-flow", "repeat-pixel-arts", "tumble-boat", "screw-master-3d-pin-puzzle", "slpoing-path", "bridge-builder-3d", "paint-tiles-puzzle", "rescue-sharp-turn", "go-find-the-cake"],
      "Puzzle games in this guide",
    ),
    { type: "h2", text: "Tips for getting unstuck" },
    {
      type: "ul",
      items: [
        "Read the first-level hints and any tutorial. Several of these games teach their rules one step at a time.",
        "Restart a level instead of pushing on after a mistake; most puzzle levels here are short.",
        `Portrait games such as ${game("tumble-boat")} suit a phone held upright, while landscape ones fill a laptop screen better. The ${link("fullscreen guide", "/guide/how-to-play-games-in-fullscreen")} explains both.`,
      ],
    },
    { type: "note", title: "More puzzles", text: `Browse the full ${link("puzzle category", "/games/puzzle")}, or compare with the ${link("best casual browser games", "/guide/best-casual-browser-games")} for relaxed one-tap play.` },
  ],
};

export const actionGuide: GuideDefinition = {
  slug: "best-action-games-online",
  title: "The Best Action Games to Play Online",
  section: "games",
  excerpt: "Eleven free action games for your browser, from 2D run-and-gun shooters and tank battles to survival and parkour, with controls and what each one offers.",
  metaTitle: "Best Action Games to Play Online Free | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 4,
  tags: ["action", "shooter", "ranking"],
  body: [
    {
      type: "answer",
      text: `For a 2D shooter with missions, try ${game("steel-directive-city-zero")} or ${game("hellforge-demon-protocol")}; for tanks, ${game("call-of-tanks")} or ${game("hit-tank-battle")}. All of these are free and run in the browser.`,
    },
    { type: "h2", text: "How these action games were picked" },
    { type: "p", text: selectionNote("action") },
    { type: "note", title: "Content note", text: "Several action games involve shooting, zombies or combat. Read the description on each game page before letting younger players try one." },
    { type: "h2", text: "Pick by style" },
    {
      type: "ul",
      items: [
        `Side-scrolling shooters: ${game("steel-directive-city-zero")} and ${game("hellforge-demon-protocol")}, both 20-mission 2D campaigns.`,
        `Tanks and aircraft: ${game("call-of-tanks")}, ${game("hit-tank-battle")} and ${game("air-fighter-3d")}.`,
        `Survival and defense: ${game("zombie-siege")}, ${game("the-zombie-house")} and ${game("apocalypse-rush")}.`,
        `Skill and rhythm: ${game("space-war-symphony")} and ${game("arrow-survival-15-seconds")}.`,
        `Movement: ${game("vector-parkour")} is a free-running game built on parkour techniques.`,
      ],
    },
    { type: "h2", text: "Controls at a glance" },
    {
      type: "table",
      caption: "Main controls and screen orientation of the action games in this list",
      header: ["Game", "Controls", "Screen"],
      rows: [
        [game("steel-directive-city-zero"), "A and D move, Space jump, mouse click or J shoot, E interact", "Landscape"],
        [game("hellforge-demon-protocol"), "A and D move, Space jump, mouse aim, left click or J fire", "Landscape"],
        [game("call-of-tanks"), "Click or tap cards to deploy units", "Landscape"],
        [game("hit-tank-battle"), "W A S D move, Space or left click to fire", "Landscape"],
        [game("zombie-siege"), "W A S D or arrows move, auto-fire, E bomb, Shift dash", "Portrait; landscape only on mobile"],
        [game("space-war-symphony"), "Mouse moves the ship, click to fire on the beat", "Landscape"],
        [game("arrow-survival-15-seconds"), "A and D move, W or Space jump, J or X shoot arrows", "Landscape"],
        [game("apocalypse-rush"), "Two players: arrow keys and K, or W A S D and C", "Landscape"],
        [game("air-fighter-3d"), "Hold the left mouse button and drag to steer", "Landscape"],
        [game("the-zombie-house"), "W A S D move, click to shoot; two joysticks on mobile", "Landscape"],
        [game("vector-parkour"), "Keyboard or mouse", "Landscape"],
      ],
    },
    { type: "h2", text: "The picks" },
    { type: "h3", text: "2D shooters" },
    {
      type: "p",
      text: `${game("steel-directive-city-zero")} casts you as an armored enforcer fighting gangs, robots and bosses over 20 missions. You rescue civilians, collect evidence and use cover, grenades and shields. ${game("hellforge-demon-protocol")} is a side-scrolling run-and-gun campaign with 20 industrial missions, 16 trap types, six weapons and ten bosses, with checkpoints and three lives.`,
    },
    { type: "h3", text: "Tanks and aircraft" },
    {
      type: "p",
      text: `${game("call-of-tanks")} is a deployment game: you pick which tank units to send into battle, and upgrade your defenses and tanks. ${game("hit-tank-battle")} is a 3D tank game where you move, dodge enemy fire and destroy every opponent in an arena. In ${game("air-fighter-3d")} you fly a fighter aircraft through dogfights.`,
    },
    { type: "h3", text: "Survival and defense" },
    {
      type: "p",
      text: `${game("zombie-siege")} auto-fires when zombies get close while you move, rescue survivors to build a squad and escort them to a safe zone; its instructions say mobile play is landscape only. ${game("the-zombie-house")} has you protect a house from endless waves and spend coins on upgrades for both the player and the house. ${game("apocalypse-rush")} is a 2D defense game for one or two players who protect a trailer against waves of enemies.`,
    },
    { type: "h3", text: "Rhythm, reflexes and parkour" },
    {
      type: "p",
      text: `${game("space-war-symphony")} is a rhythm-tuned shooter where timing shots to the beat boosts damage, and bosses use distinct bullet patterns. ${game("arrow-survival-15-seconds")} is a pixel-art 2D platformer with 40 levels where you survive 15 seconds per level. ${game("vector-parkour")} has you run, jump and climb in pursuit-style parkour.`,
    },
    gameCards(
      ["steel-directive-city-zero", "hellforge-demon-protocol", "call-of-tanks", "hit-tank-battle", "zombie-siege", "space-war-symphony", "arrow-survival-15-seconds", "apocalypse-rush", "air-fighter-3d", "the-zombie-house", "vector-parkour"],
      "Action games in this guide",
    ),
    { type: "h2", text: "Tips for action games in the browser" },
    {
      type: "ul",
      items: [
        "Click the game first so keyboard input goes to it, and check the in-game controls screen: many of these games list extra keys for dodging or grenades.",
        `Two-player games such as ${game("apocalypse-rush")} share one keyboard, so each player uses a different set of keys.`,
        `The 2D games run lighter than the 3D ones; if performance is a problem, see ${link("browser games for low-end PCs", "/guide/browser-games-for-low-end-pcs")}.`,
      ],
    },
    { type: "note", title: "More action", text: `See every title in the ${link("action category", "/games/action")}, or try ${link("arcade games", "/guide/best-arcade-games-online")} for shorter sessions.` },
  ],
};
