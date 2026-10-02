import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveControls, instructionLines } from "../controls";

describe("deriveControls", () => {
  it("detects arrow keys, mouse and touch", () => {
    assert.deepEqual(deriveControls("Use the arrow keys to move. Mouse click or tap to shoot."), [
      "Keyboard (arrow keys)",
      "Mouse",
      "Touch",
    ]);
  });

  it("detects WASD, arrows and Spacebar from the real feed text", () => {
    assert.deepEqual(deriveControls("Move A D or ← → Jump W ↑ or Spacebar"), ["Keyboard (arrow keys, WASD, Space)"]);
    assert.deepEqual(deriveControls("Movement W ↑ — forward S ↓ — backward"), ["Keyboard (arrow keys, WASD)"]);
  });

  it("detects click-only games", () => {
    assert.deepEqual(deriveControls("Mouse click or tap to play"), ["Mouse", "Touch"]);
  });

  it("detects named keys and press-a-letter instructions", () => {
    assert.deepEqual(deriveControls("Press E to interact, hold Shift to sprint, Enter to confirm."), [
      "Keyboard (E, Shift, Enter)",
    ]);
  });

  it("detects a plain keyboard mention and drag/swipe", () => {
    assert.deepEqual(deriveControls("Use your keyboard."), ["Keyboard"]);
    assert.deepEqual(deriveControls("Drag the blocks or swipe to rotate."), ["Mouse", "Touch"]);
  });

  it("does not guess from unrelated text", () => {
    assert.deepEqual(deriveControls("Explore outer space and collect stars. A great game for everyone."), []);
    assert.deepEqual(deriveControls(""), []);
  });

  it("detects Space only in a control context", () => {
    assert.deepEqual(deriveControls("Press Space to jump"), ["Keyboard (Space)"]);
    assert.deepEqual(deriveControls("Left/Right to move, Space to jump"), ["Keyboard (arrow keys, Space)"]);
  });
});

describe("instructionLines", () => {
  it("splits sentences and newlines into readable lines", () => {
    assert.deepEqual(instructionLines("Use arrows to move. Press Space to jump! Avoid enemies."), [
      "Use arrows to move.",
      "Press Space to jump!",
      "Avoid enemies.",
    ]);
    assert.deepEqual(instructionLines("Step one\n\nStep two"), ["Step one", "Step two"]);
  });

  it("keeps a feed line without punctuation intact and ignores empty input", () => {
    assert.deepEqual(instructionLines("Move A D or ← → Jump W ↑ or Spacebar"), ["Move A D or ← → Jump W ↑ or Spacebar"]);
    assert.deepEqual(instructionLines("  "), []);
  });

  it("does not split on decimals or abbreviations followed by lowercase", () => {
    assert.deepEqual(instructionLines("Score 1.5x points e.g. by combos."), ["Score 1.5x points e.g. by combos."]);
  });
});
