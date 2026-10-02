import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LINKS_VERIFIED_AT,
  appCategoryDefinitions,
  appDefinitions,
  getAppDefinition,
  platformDefinitions,
} from "../definitions";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const duplicates = (values: string[]) => values.filter((value, index) => values.indexOf(value) !== index);
const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

// Hosts a download page may live on besides the app's own website host. Anything else fails the test.
const EXTRA_OFFICIAL_HOSTS: Record<string, string[]> = {
  "windows-terminal": ["apps.microsoft.com"],
  "icloud-for-windows": ["apps.microsoft.com"],
  powertoys: ["github.com"],
  zoom: ["zoom.us"],
  "google-docs": ["google.com"],
  "microsoft-to-do": ["microsoft.com"],
};

const EXISTING_SLUGS = [
  "vlc-media-player",
  "7zip",
  "obs-studio",
  "libreoffice",
  "gimp",
  "firefox",
  "audacity",
  "notepad-plus-plus",
  "blender",
  "inkscape",
  "handbrake",
  "keepassxc",
  "thunderbird",
  "signal",
  "bitwarden",
  "ublock-origin",
];

describe("platform definitions", () => {
  it("covers windows, mac, linux, android, ios and web (no browser)", () => {
    assert.deepEqual(platformDefinitions.map((platform) => platform.slug).sort(), ["android", "ios", "linux", "mac", "web", "windows"]);
    assert.deepEqual(duplicates(platformDefinitions.map((platform) => String(platform.sortOrder))), []);
    for (const platform of platformDefinitions) {
      assert.ok(platform.name && platform.description.length >= 80 && platform.description.length <= 200, platform.slug);
    }
  });
});

describe("app category definitions", () => {
  it("defines the eleven categories with 120 to 160 character descriptions", () => {
    assert.deepEqual(
      appCategoryDefinitions.map((category) => category.slug).sort(),
      ["browsers", "cloud", "communication", "design", "development", "education", "gaming", "media", "productivity", "security", "utilities"],
    );
    assert.deepEqual(duplicates(appCategoryDefinitions.map((category) => String(category.sortOrder))), []);
    assert.deepEqual(duplicates(appCategoryDefinitions.map((category) => category.description)), []);
    for (const category of appCategoryDefinitions) {
      assert.ok(category.description.length >= 120 && category.description.length <= 160, `${category.slug} (${category.description.length})`);
    }
  });
});

describe("app definitions", () => {
  it("has unique, URL-safe slugs, names, meta descriptions and sort orders", () => {
    const slugs = appDefinitions.map((app) => app.slug);
    assert.deepEqual(duplicates(slugs), []);
    for (const slug of slugs) assert.match(slug, SLUG);
    assert.deepEqual(duplicates(appDefinitions.map((app) => app.name)), []);
    assert.deepEqual(duplicates(appDefinitions.map((app) => app.metaDescription)), []);
    assert.deepEqual(duplicates(appDefinitions.map((app) => String(app.sortOrder))), []);
  });

  it("keeps every app that already exists so nothing is archived by mistake", () => {
    const slugs = new Set(appDefinitions.map((app) => app.slug));
    for (const slug of EXISTING_SLUGS) assert.ok(slugs.has(slug), slug);
  });

  it("defines all browsers, media and development apps of the first batch", () => {
    const inCategory = (category: string) => appDefinitions.filter((app) => app.categorySlug === category).length;
    assert.ok(inCategory("browsers") >= 8);
    assert.ok(inCategory("media") >= 12);
    assert.ok(inCategory("development") >= 15);
    assert.ok(appDefinitions.length >= 35);
  });

  it("gives every category at least four apps and every platform enough apps for its page", () => {
    for (const category of appCategoryDefinitions) {
      assert.ok(appDefinitions.filter((app) => app.categorySlug === category.slug).length >= 4, category.slug);
    }
    for (const platform of platformDefinitions) {
      assert.ok(appDefinitions.filter((app) => app.platforms.includes(platform.slug)).length >= 10, platform.slug);
    }
    assert.ok(appDefinitions.length >= 95);
  });

  it("has complete, bounded content", () => {
    for (const app of appDefinitions) {
      assert.ok(app.name && app.developer, `${app.slug} name/developer`);
      assert.ok(app.shortDescription.length >= 30 && app.shortDescription.length <= 120, `${app.slug} shortDescription (${app.shortDescription.length})`);
      const paragraphs = app.description.split("\n\n");
      assert.equal(paragraphs.length, 2, `${app.slug} description paragraphs`);
      for (const paragraph of paragraphs) assert.ok(paragraph.length >= 60, `${app.slug} paragraph`);
      assert.ok(app.features.length >= 3 && app.features.length <= 6, `${app.slug} features`);
      assert.ok(app.tags.length >= 2, `${app.slug} tags`);
      for (const tag of app.tags) assert.match(tag, SLUG, `${app.slug} tag`);
      assert.ok(
        app.metaDescription.length >= 120 && app.metaDescription.length <= 158,
        `${app.slug} metaDescription (${app.metaDescription.length})`,
      );
      if (app.metaTitle) assert.ok(app.metaTitle.length <= 49, `${app.slug} metaTitle`);
    }
  });

  it("points at existing categories and platforms", () => {
    const categories = new Set(appCategoryDefinitions.map((category) => category.slug));
    const platforms = new Set(platformDefinitions.map((platform) => platform.slug));
    for (const app of appDefinitions) {
      assert.ok(categories.has(app.categorySlug), `${app.slug} -> ${app.categorySlug}`);
      assert.ok(app.platforms.length > 0, `${app.slug} platforms`);
      assert.deepEqual(duplicates(app.platforms), [], `${app.slug} duplicate platforms`);
      for (const platform of app.platforms) assert.ok(platforms.has(platform), `${app.slug} -> ${platform}`);
    }
  });

  it("only lists real, other apps as alternatives, without repeats", () => {
    const slugs = new Set(appDefinitions.map((app) => app.slug));
    for (const app of appDefinitions) {
      assert.deepEqual(duplicates(app.alternatives), [], `${app.slug} duplicate alternatives`);
      for (const alternative of app.alternatives) {
        assert.ok(slugs.has(alternative), `${app.slug} -> ${alternative} is not defined`);
        assert.notEqual(alternative, app.slug, `${app.slug} lists itself`);
      }
    }
  });

  it("uses https official URLs on the publisher's own host", () => {
    for (const app of appDefinitions) {
      for (const url of [app.officialWebsite, app.officialDownloadUrl]) {
        const parsed = new URL(url);
        assert.equal(parsed.protocol, "https:", `${app.slug} ${url}`);
        assert.equal(parsed.username + parsed.password, "", `${app.slug} credentials`);
      }
      const allowed = [host(app.officialWebsite), ...(EXTRA_OFFICIAL_HOSTS[app.slug] ?? [])];
      assert.ok(allowed.includes(host(app.officialDownloadUrl)), `${app.slug} download host ${host(app.officialDownloadUrl)}`);
    }
  });

  it("does not invent versions, ratings, awards or counts", () => {
    for (const app of appDefinitions) {
      assert.ok(!("version" in app), `${app.slug} version`);
      const copy = [app.shortDescription, app.description, ...app.features, app.metaDescription].join(" ");
      assert.doesNotMatch(copy, /\b(million|billion|award|rated|rating|stars?|best|fastest|number one)\b/i, app.slug);
      assert.ok(app.requirements.every((item) => item.length > 0));
    }
  });

  it("keeps the featured set small and the verification date fixed", () => {
    assert.ok(appDefinitions.filter((app) => app.featured).length <= 8);
    assert.equal(LINKS_VERIFIED_AT, "2026-10-02");
  });

  it("looks apps up by slug", () => {
    assert.equal(getAppDefinition("vlc-media-player")?.name, "VLC Media Player");
    assert.equal(getAppDefinition("does-not-exist"), undefined);
    assert.equal(getAppDefinition("constructor"), undefined);
  });

  it("states open-source licenses only where they are well established", () => {
    assert.equal(getAppDefinition("vlc-media-player")?.license, "Free and open source (GPL-2.0)");
    assert.ok(!getAppDefinition("google-chrome")?.license?.match(/open/i));
  });
});
