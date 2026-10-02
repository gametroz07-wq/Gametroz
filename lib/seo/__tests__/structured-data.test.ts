import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { siteConfig } from "../../site";
import { absoluteUrl, breadcrumbList, faqPage, serializeJsonLd, webApplication } from "../structured-data";

describe("absoluteUrl", () => {
  it("joins the site URL and a path exactly once", () => {
    assert.equal(absoluteUrl("/tools"), `${siteConfig.url}/tools`);
    assert.equal(absoluteUrl("tools"), `${siteConfig.url}/tools`);
    assert.equal(absoluteUrl("/", "https://example.com/"), "https://example.com/");
    assert.equal(absoluteUrl("/a", "https://example.com/"), "https://example.com/a");
  });
});

describe("breadcrumbList", () => {
  it("numbers items from 1 and uses absolute URLs", () => {
    const data = breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: "Word Counter", path: "/tool/word-counter" },
    ]);
    assert.equal(data["@context"], "https://schema.org");
    assert.equal(data["@type"], "BreadcrumbList");
    assert.deepEqual(
      data.itemListElement.map((item) => [item.position, item.name, item.item]),
      [
        [1, "Home", `${siteConfig.url}/`],
        [2, "Tools", `${siteConfig.url}/tools`],
        [3, "Word Counter", `${siteConfig.url}/tool/word-counter`],
      ],
    );
    assert.ok(data.itemListElement.every((item) => item["@type"] === "ListItem"));
  });
});

describe("webApplication", () => {
  const data = webApplication({ name: "Word Counter", description: "Count words.", path: "/tool/word-counter" });

  it("describes a free utility app", () => {
    assert.equal(data["@type"], "WebApplication");
    assert.equal(data.name, "Word Counter");
    assert.equal(data.description, "Count words.");
    assert.equal(data.url, `${siteConfig.url}/tool/word-counter`);
    assert.equal(data.applicationCategory, "UtilitiesApplication");
    assert.equal(data.operatingSystem, "Any");
    assert.equal(data.isAccessibleForFree, true);
    assert.deepEqual(data.offers, { "@type": "Offer", price: "0", priceCurrency: "USD" });
  });

  it("never includes ratings or reviews", () => {
    const keys = Object.keys(data);
    assert.ok(!keys.includes("aggregateRating"));
    assert.ok(!keys.includes("review"));
  });
});

describe("faqPage", () => {
  it("returns null when there are no questions", () => {
    assert.equal(faqPage([]), null);
  });

  it("maps questions to Question/Answer entities", () => {
    const data = faqPage([{ question: "Is it free?", answer: "Yes." }]);
    assert.deepEqual(data, {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: "Is it free?", acceptedAnswer: { "@type": "Answer", text: "Yes." } }],
    });
  });
});

describe("serializeJsonLd", () => {
  it("escapes characters that could close the script tag", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)</script>", note: "a b" });
    assert.ok(!json.includes("<"));
    assert.ok(!json.includes(" "));
    assert.deepEqual(JSON.parse(json), { name: "</script><script>alert(1)</script>", note: "a b" });
  });
});
