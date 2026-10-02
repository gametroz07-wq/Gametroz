import type { GuideDefinition } from "../definitions";
import { game, gameCards, link } from "./game-links";

// Explainers about playing browser games. Game facts come from the catalog; platform and browser
// instructions are standard, well-documented behavior and avoid promises about specific hardware.

export const lowEndGuide: GuideDefinition = {
  slug: "browser-games-for-low-end-pcs",
  title: "Browser Games for Low-End PCs and Chromebooks",
  section: "games",
  excerpt: "Why lighter 2D browser games tend to run better on older PCs and Chromebooks, twelve 2D picks to try, and practical settings that can help.",
  metaTitle: "Browser Games for Low-End PCs | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 8,
  tags: ["performance", "2d games", "chromebook"],
  body: [
    {
      type: "answer",
      text: `Lighter 2D games tend to run better than 3D games on older PCs and Chromebooks, so start with titles such as ${game("bubbla-boing")} or ${game("mini-switcher")}. Closing other tabs and turning on graphics acceleration can help further.`,
    },
    { type: "h2", text: "Why 2D games often run lighter" },
    {
      type: "p",
      text: "A 3D browser game has to build a scene from models, lighting and textures many times per second, and most 3D games lean on the graphics chip through a browser technology called WebGL. A 2D game mostly draws flat images and shapes, which usually asks less of the processor and the graphics hardware.",
    },
    {
      type: "p",
      text: "That is a tendency, not a guarantee. A carefully built 3D game can run well on modest hardware and a busy 2D game can still struggle. Gametroz does not measure the performance of individual games, so treat the list below as a sensible place to start rather than a promise.",
    },
    { type: "h2", text: "How these games were picked" },
    {
      type: "p",
      text: "Every game below carries the 2D tag in the Gametroz catalog. They come from the top of that group according to the popularity rankings that the game provider's feeds supply, with a mix of genres and without games built around third-party brands. The tag and the descriptions are the only evidence used: no benchmarks are involved.",
    },
    { type: "h2", text: "Twelve 2D games to try" },
    {
      type: "table",
      caption: "2D games with their category, controls and screen orientation",
      header: ["Game", "Category", "Controls", "Screen"],
      rows: [
        [game("steel-directive-city-zero"), "Action", "A and D move, Space jump, mouse click or J shoot", "Landscape"],
        [game("hellforge-demon-protocol"), "Action", "A and D move, Space jump, mouse aim and fire", "Landscape"],
        [game("space-shooter-boss"), "Action", "Move the mouse to steer, hold the left button to shoot", "Landscape"],
        [game("arrow-survival-15-seconds"), "Action", "A and D move, W or Space jump, J or X shoot", "Landscape"],
        [game("repeat-pixel-arts"), "Puzzle", "Pick a color, click pixels", "Landscape"],
        [game("slpoing-path"), "Puzzle", "Draw lines with the mouse or touch", "Landscape"],
        [game("stickboys-hook"), "Arcade", "Click or tap to rope", "Landscape"],
        [game("neon-velocity"), "Arcade", "A/D or arrow keys to move, W or Up to jump", "Landscape"],
        [game("mini-switcher"), "Arcade", "X, Space or left click switches gravity", "Landscape"],
        [game("12-minibattles"), "Arcade", "Two players, one button each: A and L", "Landscape"],
        [game("bubbla-boing"), "Casual", "Arrow keys move the paddle, Space shoots the ball", "Landscape"],
        [game("hamster-escape-prison"), "Adventure", "Solve puzzles and reaction tests; includes a tutorial", "Landscape"],
      ],
    },
    { type: "h2", text: "A closer look" },
    {
      type: "p",
      text: `${game("bubbla-boing")} is classic breakout play with multiple levels, power-ups and a paddle, and ${game("mini-switcher")} has you flip gravity to reach the goal across 30 levels, in a retro style meant to be a short, relaxing experience. ${game("12-minibattles")} fits two players on one keyboard with one-button games, including a soccer match and sniper warfare.`,
    },
    {
      type: "p",
      text: `${game("steel-directive-city-zero")} and ${game("hellforge-demon-protocol")} are 2D shooters with 20 missions each. ${game("space-shooter-boss")} sends a spaceship through enemy waves and meteor showers toward a final boss. ${game("arrow-survival-15-seconds")} is a pixel-art platformer in which you survive 15 seconds per level across 40 levels.`,
    },
    {
      type: "p",
      text: `For something quieter, ${game("repeat-pixel-arts")} asks you to copy a pixel pattern and ${game("slpoing-path")} has you draw lines so a ball can roll to a target. ${game("hamster-escape-prison")} mixes puzzles and reaction tests, and ${game("stickboys-hook")} and ${game("neon-velocity")} cover swinging and precision platforming.`,
    },
    gameCards(
      ["steel-directive-city-zero", "hellforge-demon-protocol", "space-shooter-boss", "arrow-survival-15-seconds", "repeat-pixel-arts", "slpoing-path", "stickboys-hook", "neon-velocity", "mini-switcher", "12-minibattles", "bubbla-boing", "hamster-escape-prison"],
      "2D games in this guide",
    ),
    { type: "h2", text: "Settings that can help" },
    {
      type: "steps",
      items: [
        "Close other tabs and programs. Every open tab uses memory and some processing time, and games compete with them.",
        "Check graphics acceleration. In Chrome and Edge, open Settings, then System, and make sure the option to use graphics or hardware acceleration when available is on. In Firefox, open Settings, then General, then Performance.",
        "Update your browser. Newer versions include performance and security fixes.",
        "Turn off battery or energy saver mode while you play, because it can slow the processor on purpose.",
        "Use fullscreen, or a smaller window if the game still stutters. Fewer pixels to draw can ease the load. The Fullscreen button under the player enlarges the game only.",
        "Try a private or incognito window. Extensions are usually switched off there, which shows whether one of them is slowing the page.",
      ],
    },
    { type: "note", title: "Still slow?", text: "Chrome and Edge have a built-in task manager (Shift+Esc on Windows) that shows which tab uses the most memory and processor time. If the game tab is the heavy one, try a different game from the table above." },
    { type: "h2", text: "Related guides" },
    {
      type: "p",
      text: `${link("How to play games in fullscreen", "/guide/how-to-play-games-in-fullscreen")} covers the Fullscreen button and browser shortcuts. For more picks across genres, see ${link("the best free browser games", "/guide/best-free-browser-games")} and ${link("the best arcade games", "/guide/best-arcade-games-online")}.`,
    },
  ],
};

export const noDownloadGuide: GuideDefinition = {
  slug: "games-you-can-play-without-downloading",
  title: "Games You Can Play Without Downloading",
  section: "games",
  excerpt: "What HTML5 browser games are, why they need no download or account, how to start one in a few clicks, and how to stay safe while you play.",
  metaTitle: "Games You Can Play Without Downloading | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 9,
  tags: ["html5", "no download", "safety"],
  body: [
    {
      type: "answer",
      text: "Browser games are built with web technologies, so they run inside the page you open and need no installer, plug-in or account. You need a modern browser, an internet connection and a game page to start.",
    },
    { type: "h2", text: "What is an HTML5 browser game?" },
    {
      type: "p",
      text: "An HTML5 game is a program written with the same technologies as a web page: HTML, JavaScript and browser graphics features such as canvas and WebGL. When you open a game page, your browser loads the game's files as part of the page and runs them, the way it runs any other page. Nothing is installed on your computer, and the old browser plug-ins that games once needed are not involved.",
    },
    {
      type: "p",
      text: "Gametroz embeds each game from its provider in a sandboxed frame. The sandbox limits what the game page can do to the rest of the site, which is one reason playing here does not involve installing anything.",
    },
    { type: "h2", text: "What you need" },
    {
      type: "ul",
      items: [
        "A current browser such as Chrome, Edge, Firefox or Safari.",
        "An internet connection, because the game loads when you open the page.",
        "A keyboard and mouse, or a touchscreen. Each game page lists its controls.",
        "No account: Gametroz does not require one to play.",
      ],
    },
    { type: "h2", text: "How to start a game" },
    {
      type: "steps",
      items: [
        `Open a game page, for example ${game("pondhero")} or ${game("bubbla-boing")}, or browse a category such as ${link("racing", "/games/racing")} or ${link("puzzle", "/games/puzzle")}.`,
        "Wait for the game to load inside the player.",
        "Click the game once so it receives your keyboard and mouse input, then press its play button.",
        "Read the controls on the game page. If you want a bigger view, use the Fullscreen button under the player.",
      ],
    },
    { type: "h2", text: "Staying safe while you play" },
    {
      type: "ul",
      items: [
        "A real browser game never needs an installer or a browser extension. If a page says you must download something to play, close it.",
        "Many free games show ads. If one opens a new tab, close that tab instead of downloading anything from it.",
        "Do not type passwords, payment details or personal information into a game.",
        "Keep your browser up to date, because updates include security fixes.",
        "Some action games include combat or scary themes. Read the description first if younger players will use the game.",
      ],
    },
    { type: "note", title: "No download is not the same as no data", text: "The browser still receives the game's files each time, and may keep some of them temporarily so the game loads faster next time. That is normal web behavior and does not install a program." },
    { type: "h2", text: "Browser games compared with installed games" },
    {
      type: "table",
      caption: "How browser games differ from games you install",
      header: ["Topic", "Browser game", "Installed game"],
      rows: [
        ["Getting started", "Open the page and press play", "Download, install, then launch"],
        ["Updates", "The page loads the current version each visit", "Usually updated through the game's launcher or store"],
        ["Saved progress", "Depends on the game; some keep it in the browser, so clearing site data can erase it", "Usually kept in a save file or an account"],
        ["Demands on your computer", "Often lighter, though 3D games can still be demanding", "Can use far more of the computer"],
      ],
    },
    { type: "h2", text: "A few games to try" },
    {
      type: "table",
      caption: "Games from different categories, with controls and screen orientation",
      header: ["Game", "Category", "How you play", "Screen"],
      rows: [
        [game("pondhero"), "Puzzle", "Remember a path and click it", "Landscape"],
        [game("bubbla-boing"), "Casual", "Arrow keys move the paddle, Space shoots the ball", "Landscape"],
        [game("mini-pool-3d"), "Sports", "Mouse click or tap", "Landscape"],
        [game("drift-car-driving"), "Racing", "W A S D or arrow keys", "Landscape"],
        [game("world-archery-league"), "Casual", "Mouse click or tap", "Landscape"],
        [game("call-of-tanks"), "Action", "Click or tap cards to deploy tanks", "Landscape"],
      ],
    },
    gameCards(["pondhero", "bubbla-boing", "mini-pool-3d", "drift-car-driving", "world-archery-league", "call-of-tanks"], "Games in this guide"),
    { type: "h2", text: "Where to go next" },
    {
      type: "p",
      text: `${link("The best free browser games", "/guide/best-free-browser-games")} picks across seven categories. If your computer is older, read ${link("browser games for low-end PCs", "/guide/browser-games-for-low-end-pcs")}, and ${link("how to play games in fullscreen", "/guide/how-to-play-games-in-fullscreen")} explains the Fullscreen button.`,
    },
  ],
};

export const fullscreenGuide: GuideDefinition = {
  slug: "how-to-play-games-in-fullscreen",
  title: "How to Play Browser Games in Fullscreen",
  section: "games",
  excerpt: "Use the Fullscreen button or a keyboard shortcut on Windows, Chromebook and Mac, and learn how portrait and landscape games behave on a phone.",
  metaTitle: "How to Play Browser Games in Fullscreen | Gametroz",
  publishedAt: "2026-10-02",
  updatedAt: "2026-10-02",
  featured: false,
  sortOrder: 10,
  tags: ["fullscreen", "tips", "mobile"],
  body: [
    {
      type: "answer",
      text: "Click the Fullscreen button under the game player to enlarge the game only, or use your browser's own shortcut: F11 on Windows, Ctrl+Cmd+F on a Mac. Press Esc to leave the game's fullscreen mode.",
    },
    { type: "h2", text: "Two kinds of fullscreen" },
    {
      type: "p",
      text: "The Fullscreen button on every Gametroz game page asks your browser to show just the game player across the whole screen, with the rest of the page hidden. A browser shortcut does something different: it hides the browser's toolbars and tabs, but the page, including the site header and the text around the game, is still there. For playing, the button is usually what you want.",
    },
    { type: "h2", text: "On a computer" },
    {
      type: "steps",
      items: [
        "Open a game page and wait for the game to load.",
        "Click the Fullscreen button under the player. The game fills the screen.",
        "Click inside the game once if the keyboard does not respond.",
        "Press Esc to leave fullscreen and return to the page.",
      ],
    },
    { type: "h3", text: "Keyboard shortcuts for the whole browser" },
    {
      type: "table",
      caption: "Browser fullscreen shortcuts by system",
      header: ["System", "Enter fullscreen", "Leave fullscreen"],
      rows: [
        ["Windows and Linux", "F11", "F11 again, or Esc in some browsers"],
        ["Mac", "Ctrl+Cmd+F", "Ctrl+Cmd+F again, or Esc"],
        ["Chromebook", "The fullscreen key in the top row of the keyboard", "Press the same key again"],
        ["Any system, game button", "Fullscreen button under the player", "Esc"],
      ],
    },
    { type: "h2", text: "On a phone or tablet" },
    {
      type: "p",
      text: "Phones show games in the orientation they were built for. The catalog records whether each game is landscape or portrait, and the examples below show the difference. Landscape games are meant to be played with the phone turned sideways; portrait games suit a phone held upright.",
    },
    {
      type: "table",
      caption: "Examples of landscape and portrait games",
      header: ["Game", "Screen", "What you do"],
      rows: [
        [game("dream-football-game"), "Landscape", "Keyboard keys for sprint, passes and shots"],
        [game("drift-car-driving"), "Landscape", "W A S D or arrow keys to drive"],
        [game("mini-pool-3d"), "Landscape", "Mouse click or tap"],
        [game("flick-shot-soccer"), "Portrait", "Drag to aim, release to kick"],
        [game("drive-pro-3d"), "Portrait", "Press and hold to accelerate, release to brake"],
        [game("monster-escape-logic-puzzle-adventure"), "Portrait", "On-screen buttons rotate the world"],
      ],
    },
    gameCards(["dream-football-game", "drift-car-driving", "mini-pool-3d", "flick-shot-soccer", "drive-pro-3d", "monster-escape-logic-puzzle-adventure", "zombie-siege"], "Games to try in each orientation"),
    {
      type: "steps",
      items: [
        "Open the game and check its screen orientation in the table above or on its page.",
        "Turn the phone to match: sideways for landscape, upright for portrait. If it does not rotate, check that rotation lock is off in your device settings.",
        "Tap the Fullscreen button. If your browser supports it, the game fills the screen.",
        "Scroll the page slightly if your browser hides its address bar when you scroll, which gives the game more room.",
      ],
    },
    {
      type: "p",
      text: `Some games say so in their own instructions. For example, ${game("zombie-siege")} lists mobile play as landscape only, so turn the phone sideways before you start it.`,
    },
    { type: "h2", text: "If fullscreen does not work" },
    {
      type: "ul",
      items: [
        "If the button says fullscreen is not available in this browser, the browser does not support it for web page elements. Some mobile browsers have limited or no support. Use the keyboard shortcut on a computer, or rotate the phone and scroll instead.",
        "If the game goes fullscreen but ignores the keyboard, click inside the game once to give it focus.",
        "If the picture looks too small or cut off, reset the browser zoom with Ctrl+0 (Cmd+0 on a Mac) and try again.",
        `If the game is slow in fullscreen, a larger screen means more pixels to draw. ${link("Browser games for low-end PCs", "/guide/browser-games-for-low-end-pcs")} lists settings that can help.`,
        "Browser extensions or pop-up blockers can interfere with some pages. Try a private window to check.",
      ],
    },
    { type: "note", title: "Quick reminder", text: "Esc leaves the game's fullscreen mode. F11 or Ctrl+Cmd+F is a separate browser setting, so use the same shortcut to turn it off." },
    { type: "h2", text: "Related guides" },
    {
      type: "p",
      text: `${link("Browser games for low-end PCs", "/guide/browser-games-for-low-end-pcs")} helps when a game is slow. ${link("Games you can play without downloading", "/guide/games-you-can-play-without-downloading")} explains how browser games work, and ${link("the best free browser games", "/guide/best-free-browser-games")} gives you something to play.`,
    },
  ],
};
