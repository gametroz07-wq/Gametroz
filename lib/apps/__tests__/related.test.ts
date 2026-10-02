import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { rankRelatedApps } from "../related";

type Candidate = { slug: string; platforms: string[]; tags: string[] };
const app = (slug: string, platforms: string[], tags: string[] = []): Candidate => ({ slug, platforms, tags });

const subject = { slug: "vlc", platforms: ["windows", "mac", "linux"], tags: ["video", "player"], alternatives: ["mpc-hc"] };

describe("rankRelatedApps", () => {
  it("excludes the app itself and its editorial alternatives", () => {
    const result = rankRelatedApps(subject, [app("vlc", ["windows"]), app("mpc-hc", ["windows"]), app("kodi", ["windows"])], 4);
    assert.deepEqual(result.map((item) => item.slug), ["kodi"]);
  });

  it("requires at least one shared platform", () => {
    const result = rankRelatedApps(subject, [app("iina-ios", ["ios"]), app("kodi", ["linux"])], 4);
    assert.deepEqual(result.map((item) => item.slug), ["kodi"]);
  });

  it("ranks by shared platforms, then shared tags, then the incoming order", () => {
    const result = rankRelatedApps(
      subject,
      [
        app("one-platform", ["windows"]),
        app("two-platforms-b", ["windows", "mac"]),
        app("one-platform-tagged", ["windows"], ["video"]),
        app("two-platforms-a", ["windows", "mac"]),
      ],
      4,
    );
    assert.deepEqual(result.map((item) => item.slug), ["two-platforms-b", "two-platforms-a", "one-platform-tagged", "one-platform"]);
  });

  it("caps the list and never pads with unrelated apps", () => {
    const many = Array.from({ length: 8 }, (_, index) => app(`app-${index}`, ["windows"]));
    assert.equal(rankRelatedApps(subject, many, 3).length, 3);
    assert.deepEqual(rankRelatedApps(subject, [], 3), []);
  });
});
