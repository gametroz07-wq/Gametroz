export type AdPlacement = "home-feed" | "game-below-player" | "sidebar" | "content-inline";

export type AdsterraUnit = { key: string; width: number; height: number };

// One Adsterra "Banner" ad unit per size (publisher dashboard).
const units = {
  leaderboard: { key: "4f998a3575ccd1d7d3e64b1ffb21b565", width: 728, height: 90 },
  mobileBanner: { key: "ff187ad8d96afcaa47ad5f7c275a77bc", width: 320, height: 50 },
  rectangle: { key: "a9cc540db376b3232253d7a71aa9a717", width: 300, height: 250 },
  skyscraper: { key: "a0c7c9af13771e161789fa146e3f4ef7", width: 160, height: 300 },
} satisfies Record<string, AdsterraUnit>;

// Tailwind breakpoints: md = 768px, lg = 1024px.
const horizontal = [
  { media: "(min-width: 768px)", unit: units.leaderboard },
  { media: "(max-width: 767.98px)", unit: units.mobileBanner },
];

/**
 * Units per placement. The first candidate whose media query matches is the only one loaded, so a
 * hidden size never counts an impression; a placement with no match loads nothing.
 */
export const placementUnits: Record<AdPlacement, { media: string; unit: AdsterraUnit }[]> = {
  "home-feed": horizontal,
  "game-below-player": horizontal,
  "content-inline": [{ media: "all", unit: units.rectangle }],
  sidebar: [{ media: "(min-width: 1024px)", unit: units.skyscraper }],
};

/**
 * Each unit runs in its own iframe document. Adsterra's snippet reads a global `atOptions`, so
 * several units on one page would overwrite each other; a separate document per unit avoids that.
 * No allow-top-navigation: an ad can open the advertiser in a new tab on click, but can never
 * redirect the Gametroz page. allow-same-origin keeps the ad's own storage and cookies working.
 */
export const ADSTERRA_FRAME_SANDBOX = "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox";

export function buildAdsterraSrcDoc({ key, width, height }: AdsterraUnit) {
  const options = JSON.stringify({ key, format: "iframe", height, width, params: {} });
  return [
    "<!doctype html><html><head><meta charset=\"utf-8\">",
    "<style>html,body{margin:0;overflow:hidden;background:transparent}</style></head><body>",
    `<script>atOptions = ${options};</script>`,
    `<script src="https://www.highrevenueformat.com/${key}/invoke.js"></script>`,
    "</body></html>",
  ].join("");
}
