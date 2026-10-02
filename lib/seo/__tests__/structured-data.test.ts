import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { siteConfig } from "../../site";
import {
  absoluteUrl,
  article,
  breadcrumbList,
  breadcrumbTrail,
  faqPage,
  organization,
  serializeJsonLd,
  softwareApplication,
  videoGame,
  webApplication,
  webSite,
} from "../structured-data";

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

describe("breadcrumbTrail", () => {
  it("mirrors the visible trail: Home first, the last item uses the current path", () => {
    const data = breadcrumbTrail([{ label: "Games", href: "/games" }, { label: "Racing" }], "/games/racing");
    assert.deepEqual(
      data.itemListElement.map((item) => [item.position, item.name, item.item]),
      [
        [1, "Home", `${siteConfig.url}/`],
        [2, "Games", `${siteConfig.url}/games`],
        [3, "Racing", `${siteConfig.url}/games/racing`],
      ],
    );
  });

  it("handles a single-item trail", () => {
    const data = breadcrumbTrail([{ label: "Contact" }], "/contact");
    assert.equal(data.itemListElement.length, 2);
    assert.equal(data.itemListElement[1].item, `${siteConfig.url}/contact`);
  });
});

describe("webSite", () => {
  const data = webSite();

  it("describes the site with a sitelinks search box that targets /search?q=", () => {
    assert.equal(data["@type"], "WebSite");
    assert.equal(data.name, siteConfig.name);
    assert.equal(data.url, `${siteConfig.url}/`);
    assert.equal(data.potentialAction["@type"], "SearchAction");
    assert.equal(data.potentialAction.target.urlTemplate, `${siteConfig.url}/search?q={search_term_string}`);
    assert.equal(data.potentialAction["query-input"], "required name=search_term_string");
  });
});

describe("organization", () => {
  const data = organization();

  it("only states facts the site publishes", () => {
    assert.equal(data["@type"], "Organization");
    assert.equal(data.name, siteConfig.name);
    assert.equal(data.url, `${siteConfig.url}/`);
    assert.equal(data.logo, `${siteConfig.url}/icon.svg`);
    assert.equal(data.email, siteConfig.contactEmail);
    assert.ok(!("sameAs" in data));
  });
});

describe("softwareApplication", () => {
  const base = {
    name: "VLC Media Player",
    description: "Plays almost any media file.",
    path: "/app/vlc-media-player",
    platforms: ["windows", "mac", "android"] as const,
    categoryName: "Media players",
  };

  it("uses only visible facts and no offers, ratings or reviews by default", () => {
    const data = softwareApplication({ ...base, platforms: [...base.platforms] });
    assert.equal(data["@type"], "SoftwareApplication");
    assert.equal(data.url, `${siteConfig.url}/app/vlc-media-player`);
    assert.equal(data.operatingSystem, "Windows, macOS, Android");
    assert.equal(data.applicationCategory, "MultimediaApplication");
    for (const key of ["offers", "aggregateRating", "review", "downloadUrl"]) assert.ok(!(key in data), key);
  });

  it("adds a free offer and download URL only when asked to", () => {
    const data = softwareApplication({
      ...base,
      platforms: [...base.platforms],
      free: true,
      downloadUrl: "https://www.videolan.org/vlc/",
    });
    assert.deepEqual(data.offers, { "@type": "Offer", price: "0", priceCurrency: "USD" });
    assert.equal(data.downloadUrl, "https://www.videolan.org/vlc/");
  });

  it("maps categories sensibly and falls back to UtilitiesApplication", () => {
    const category = (categoryName: string) =>
      softwareApplication({ ...base, platforms: ["windows"], categoryName }).applicationCategory;
    assert.equal(category("Web browsers"), "BrowserApplication");
    assert.equal(category("Image editors"), "DesignApplication");
    assert.equal(category("Media"), "MultimediaApplication");
    assert.equal(category("Office suites"), "BusinessApplication");
    assert.equal(category("Security"), "SecurityApplication");
    assert.equal(category("Developer tools"), "DeveloperApplication");
    assert.equal(category("Communication"), "CommunicationApplication");
    assert.equal(category("Education"), "EducationalApplication");
    assert.equal(category("Gaming"), "GameApplication");
    assert.equal(category("Productivity"), "BusinessApplication");
    assert.equal(category("Cloud"), "UtilitiesApplication");
    assert.equal(category("Something else"), "UtilitiesApplication");
  });

  it("treats web apps as browser-based and names iOS", () => {
    const data = softwareApplication({ ...base, platforms: ["web", "android", "ios"] });
    assert.equal(data.operatingSystem, "Web browser, Android, iOS");
  });
});

describe("article", () => {
  it("includes only visible fields and the Gametroz publisher", () => {
    const data = article({
      headline: "How to play",
      description: "A guide.",
      path: "/guide/how-to-play",
      datePublished: "2026-09-01",
    });
    assert.equal(data["@type"], "Article");
    assert.equal(data.headline, "How to play");
    assert.equal(data.datePublished, "2026-09-01");
    assert.equal(data.mainEntityOfPage, `${siteConfig.url}/guide/how-to-play`);
    assert.deepEqual(data.publisher, { "@type": "Organization", name: siteConfig.name, url: `${siteConfig.url}/` });
    for (const key of ["author", "dateModified", "aggregateRating"]) assert.ok(!(key in data), key);
  });

  it("omits dates that are not provided", () => {
    const data = article({ headline: "h", description: "d", path: "/guide/x" });
    assert.ok(!("datePublished" in data));
  });
});

describe("videoGame", () => {
  const data = videoGame({
    name: "Neon Drift",
    description: "Drift through neon-lit city circuits.",
    path: "/game/neon-drift",
    image: "https://img.example.com/neon.jpg",
    categoryName: "Racing",
  });

  it("describes a free browser game", () => {
    assert.equal(data["@type"], "VideoGame");
    assert.equal(data.name, "Neon Drift");
    assert.equal(data.url, `${siteConfig.url}/game/neon-drift`);
    assert.equal(data.image, "https://img.example.com/neon.jpg");
    assert.equal(data.genre, "Racing");
    assert.equal(data.gamePlatform, "Web browser");
    assert.equal(data.applicationCategory, "Game");
    assert.equal(data.operatingSystem, "Any");
    assert.equal(data.isAccessibleForFree, true);
  });

  it("never includes ratings or reviews", () => {
    for (const key of ["aggregateRating", "review", "author"]) assert.ok(!(key in data), key);
  });
});
