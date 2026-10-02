import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildFeedUrl } from "../gamemonetize/client";

describe("buildFeedUrl", () => {
  it("builds the documented popularity feed query over HTTPS", () => {
    const url = buildFeedUrl({ popularity: "mostplayed", amount: "All" });
    assert.equal(url.protocol, "https:");
    assert.equal(url.origin + url.pathname, "https://gamemonetize.com/rssfeed.php");
    assert.deepEqual(Object.fromEntries(url.searchParams), {
      format: "json",
      category: "All",
      type: "html5",
      popularity: "mostplayed",
      company: "All",
      amount: "All",
    });
  });

  it("keeps the newest/10 defaults used by the regular sync", () => {
    const params = Object.fromEntries(buildFeedUrl({}).searchParams);
    assert.equal(params.popularity, "newest");
    assert.equal(params.amount, "10");
  });
});
