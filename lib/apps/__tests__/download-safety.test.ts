import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appDownloadSteps } from "../download-safety";

const vlc = { name: "VLC Media Player", url: "https://www.videolan.org/vlc/", platforms: ["windows", "mac", "android"] as const };

describe("appDownloadSteps", () => {
  it("names the official host without www in the first step", () => {
    const steps = appDownloadSteps({ ...vlc, platforms: [...vlc.platforms] });
    assert.ok(steps[0].includes("videolan.org"));
    assert.ok(!steps[0].includes("www."));
  });

  it("mentions app stores only for the mobile platforms the app supports", () => {
    const android = appDownloadSteps({ ...vlc, platforms: ["windows", "android"] }).join(" ");
    assert.match(android, /Google Play/);
    assert.doesNotMatch(android, /App Store/);
    const ios = appDownloadSteps({ ...vlc, platforms: ["mac", "ios"] }).join(" ");
    assert.match(ios, /App Store/);
    const desktop = appDownloadSteps({ ...vlc, platforms: ["windows", "linux"] }).join(" ");
    assert.doesNotMatch(desktop, /Google Play|App Store/);
  });

  it("explains that web-only apps need no installer", () => {
    const steps = appDownloadSteps({ name: "Photopea", url: "https://www.photopea.com/", platforms: ["web"] });
    assert.match(steps.join(" "), /no installer/);
    assert.ok(steps.every((step) => !/installer to run/i.test(step)));
  });

  it("stays short and always ends with the update advice", () => {
    for (const platforms of [["windows"], ["web"], ["windows", "mac", "linux", "android", "ios", "web"]] as const) {
      const steps = appDownloadSteps({ name: "App", url: "https://app.example.com/", platforms: [...platforms] });
      assert.ok(steps.length >= 3 && steps.length <= 5, `${platforms.join(",")}: ${steps.length}`);
      assert.match(steps[steps.length - 1], /update/i);
    }
  });
});
