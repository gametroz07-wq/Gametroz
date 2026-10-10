import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { localeFromPathname, resolveLocalePath, stripLocale, withLocale } from "../i18n/paths";

const off = { spanishEnabled: false };
const on = { spanishEnabled: true };

describe("resolveLocalePath: unprefixed English URLs", () => {
  it("rewrites them to the default locale segment without changing the URL", () => {
    assert.deepEqual(resolveLocalePath("/", off), { action: "rewrite", pathname: "/en" });
    assert.deepEqual(resolveLocalePath("/games", off), { action: "rewrite", pathname: "/en/games" });
    assert.deepEqual(resolveLocalePath("/game/halloween-fighters", on), { action: "rewrite", pathname: "/en/game/halloween-fighters" });
    assert.deepEqual(resolveLocalePath("/apps/category/browsers", off), { action: "rewrite", pathname: "/en/apps/category/browsers" });
  });

  it("keeps a trailing slash as received so the framework redirect still applies", () => {
    assert.deepEqual(resolveLocalePath("/games/", off), { action: "rewrite", pathname: "/en/games/" });
  });

  it("does not treat unknown first segments as locales", () => {
    assert.deepEqual(resolveLocalePath("/fr/games", on), { action: "rewrite", pathname: "/en/fr/games" });
    assert.deepEqual(resolveLocalePath("/xx", off), { action: "rewrite", pathname: "/en/xx" });
    assert.deepEqual(resolveLocalePath("/ES/games", on), { action: "rewrite", pathname: "/en/ES/games" });
    assert.deepEqual(resolveLocalePath("/espanol", on), { action: "rewrite", pathname: "/en/espanol" });
    assert.deepEqual(resolveLocalePath("/english/games", on), { action: "rewrite", pathname: "/en/english/games" });
  });
});

describe("resolveLocalePath: explicit default locale", () => {
  it("redirects /en URLs to the unprefixed URL so they never duplicate content", () => {
    assert.deepEqual(resolveLocalePath("/en", off), { action: "redirect", pathname: "/" });
    assert.deepEqual(resolveLocalePath("/en/", off), { action: "redirect", pathname: "/" });
    assert.deepEqual(resolveLocalePath("/en/games", off), { action: "redirect", pathname: "/games" });
    assert.deepEqual(resolveLocalePath("/en/game/halloween-fighters", on), { action: "redirect", pathname: "/game/halloween-fighters" });
  });

  it("keeps the trailing slash of the original request on redirect", () => {
    assert.deepEqual(resolveLocalePath("/en/games/", off), { action: "redirect", pathname: "/games/" });
  });
});

describe("resolveLocalePath: Spanish", () => {
  it("passes /es URLs through when the switch is on", () => {
    assert.deepEqual(resolveLocalePath("/es", on), { action: "next" });
    assert.deepEqual(resolveLocalePath("/es/games", on), { action: "next" });
    assert.deepEqual(resolveLocalePath("/es/game/halloween-fighters", on), { action: "next" });
  });

  it("answers not found for /es URLs when the switch is off", () => {
    assert.deepEqual(resolveLocalePath("/es", off), { action: "notFound" });
    assert.deepEqual(resolveLocalePath("/es/", off), { action: "notFound" });
    assert.deepEqual(resolveLocalePath("/es/games", off), { action: "notFound" });
    assert.deepEqual(resolveLocalePath("/es/game/halloween-fighters", off), { action: "notFound" });
  });
});

describe("withLocale", () => {
  it("leaves English paths unprefixed", () => {
    assert.equal(withLocale("/games", "en"), "/games");
    assert.equal(withLocale("/", "en"), "/");
  });

  it("prefixes other locales", () => {
    assert.equal(withLocale("/games", "es"), "/es/games");
    assert.equal(withLocale("/", "es"), "/es");
    assert.equal(withLocale("/game/x?play=1", "es"), "/es/game/x?play=1");
  });
});

describe("stripLocale", () => {
  it("removes a leading locale segment", () => {
    assert.equal(stripLocale("/es/games"), "/games");
    assert.equal(stripLocale("/es"), "/");
    assert.equal(stripLocale("/en/games"), "/games");
  });

  it("leaves unprefixed and unknown-prefix paths alone", () => {
    assert.equal(stripLocale("/games"), "/games");
    assert.equal(stripLocale("/"), "/");
    assert.equal(stripLocale("/fr/games"), "/fr/games");
    assert.equal(stripLocale("/espanol"), "/espanol");
  });
});

describe("localeFromPathname", () => {
  it("reads the locale of a public pathname, defaulting to English", () => {
    assert.equal(localeFromPathname("/es/games"), "es");
    assert.equal(localeFromPathname("/es"), "es");
    assert.equal(localeFromPathname("/games"), "en");
    assert.equal(localeFromPathname("/"), "en");
    assert.equal(localeFromPathname("/fr/games"), "en");
  });
});
