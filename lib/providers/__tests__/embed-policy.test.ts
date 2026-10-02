import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { embedFrameOrigins, GAME_IFRAME_ALLOW, GAME_IFRAME_SANDBOX } from "../embed";

describe("game iframe policy", () => {
  const tokens = GAME_IFRAME_SANDBOX.split(" ");

  it("never lets the game navigate the Gametroz page", () => {
    assert.ok(!tokens.some((token) => token.startsWith("allow-top-navigation")));
  });

  it("allows what HTML5 games and their ad SDK need", () => {
    for (const token of ["allow-scripts", "allow-same-origin", "allow-pointer-lock", "allow-popups", "allow-popups-to-escape-sandbox"]) {
      assert.ok(tokens.includes(token), token);
    }
  });

  it("does not grant forms, downloads or modals", () => {
    for (const token of ["allow-forms", "allow-downloads", "allow-modals"]) assert.ok(!tokens.includes(token), token);
  });

  it("delegates only fullscreen, autoplay and gamepad", () => {
    assert.equal(GAME_IFRAME_ALLOW, "fullscreen; autoplay; gamepad");
  });

  it("derives frame origins from the provider host allowlist", () => {
    assert.deepEqual(embedFrameOrigins(), ["https://html5.gamemonetize.co"]);
  });
});
