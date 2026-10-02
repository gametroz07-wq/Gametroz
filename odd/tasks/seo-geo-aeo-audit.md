# SEO + AEO + GEO audit (executable)

## Objective
Audit gametroz.online for organic growth (English, US priority), apply safe P0/P1 fixes, document the rest.
Indexing stays OFF, no Search Console, no Adsterra, no deploy.

## Evidence collected (2026-10-02)
- Production crawl (main 1db519c): 974 URLs, 973×200, 1×404 (/cdn-cgi/l/email-protection, Cloudflare email obfuscation).
  0 duplicate titles; 1 canonical per page (query strings canonicalize to the clean URL); exactly 1 H1 per page;
  max click depth 3 (games at depth 1–2, median 14 inlinks per game).
  0 JSON-LD on the whole site; 14,454/14,454 images with alt=""; 475 pages without og:image;
  game meta descriptions: 430 under 70 chars, 170 over 160; 14 titles over 60 chars;
  403 crawlable /search?q=… URLs (tag links), all noindex + canonical /search.
- Redirects OK: www→apex 301, http→https 301, trailing slash 308; uppercase paths 404.
- robots.txt is only Cloudflare's content-signals preamble (no rules, no Sitemap line); /llms.txt 404; /about 404.
- Game content (498 published, read-only DB query): 100% provider text verbatim, 0 duplicate descriptions,
  description median 61 words (63 under 40), instructions median 12 words, 134× "Mouse click or tap to play",
  bare entity words from the feed (uarr/rarr/larr/darr) shown as text on ~24 games, 4 near-duplicate title pairs.
  Game page order: player → Play next → Related → About → How to play → empty "Controls" heading → Tags.
- Keyword research: search tool returned low-quality SERPs; all difficulty/traffic values are labeled estimates.

## Tasks
- [x] A1 (delegated, done 2026-10-02, uncommitted) Site-wide SEO infra: JSON-LD (WebSite, Organization, BreadcrumbList everywhere, VideoGame,
      SoftwareApplication, Article only when visible), alt text, default OG image, title/description templates,
      sitemap for all published content, robots.ts (gated), llms.txt, /about + /editorial-policy, decorative logo text.
- [x] A2 (delegated, done 2026-10-02, uncommitted) Game page template: quick facts (category, controls derived from instructions, orientation,
      browser/no download), content order, empty sections hidden, similar games, feed entity repair, category intros.
- [x] A3 Core Web Vitals lab audit (local production build) and obvious fixes.
- [x] A4 Internal crawl of the branch build + validations; docs/SEO-GEO-AEO-AUDIT.md.

## A1 evidence and decisions
- RED: new tests for structured-data (breadcrumbTrail, webSite, organization, softwareApplication, article, videoGame),
  templates, robots, llms, metadata and the extended sitemap failed first (TypeErrors; "Cannot find module" for
  ../templates, ../robots, ../llms; old sitemap test no longer matched). GREEN: npm test 508/508 pass, lint and typecheck clean.
- JSON-LD: Breadcrumbs takes an optional path prop and emits BreadcrumbList from the same visible items (games, game
  categories, apps, platforms, app detail, guides, sections, guide detail, privacy, terms, contact, about, editorial policy).
  Tool pages keep their own JsonLd. Home emits WebSite (+SearchAction to /search?q=) and Organization (logo /icon.svg, contact
  email shown on /contact, no sameAs). App detail: SoftwareApplication with downloadUrl (the visible official link), NO offers
  (the page never states "free", only <title> did). Guide detail: Article with headline, description, datePublished (visible date),
  publisher Organization; no author, no dateModified. videoGame() builder exists for A2; the game page was not touched.
- Alt: GameCard, GameRankCard, GameFeatureCard, GameHero and the player placeholder use "<name> online game"; AppIcon uses
  "<name> icon". App screenshots are text placeholders (no <img>) so nothing to change. LCP priority now only on the hero image
  on / and /games (cards and side feature cards no longer preload).
- Default OG image: route handler app/og/default/route.tsx (ImageResponse, force-static), referenced explicitly from
  pageMetadata and the root layout. The app/opengraph-image file convention was rejected: pageMetadata replaces the whole
  openGraph object, which drops the root layout file-based image.
- Titles/descriptions: lib/seo/templates.ts (fitTitle, appTitle, gameCategoryTitle/Description/Intro, platformIntro,
  extendDescription, limitDescription). pageMetadata no longer appends " | Gametroz" to titles that already name the site.
- Sitemap: games, game categories, tools, apps, platforms, guides, sections, /about, /editorial-policy, /contact, /privacy,
  /terms; published only, deduped, no /search, lastModified from updatedAt. Still [] while indexing is off.
  app/robots.ts allows / (no Sitemap) while off; on: Disallow /api/ and /search plus Sitemap. /llms.txt via route handler.
- Not done: tag links in ChipNav on /apps (category chips to /search?q=...) keep follow; game page JSON-LD, breadcrumb path
  and metadata remain for A2 (pass path to Breadcrumbs there).

## A2 evidence and decisions
- RED: text.test (arrow words), games/controls.test (module missing), templates.test (gameTitle, gameSummary, orientationFact,
  gameMetaDescription not exported): 13 failures. GREEN: npm test 531/531, lint and typecheck clean (build not run).
- Feed repair: toPlainText repairs bare larr/rarr/uarr/darr/harr (and decodes &larr; etc.) next to mdash/ndash. toGame (lib/db/mappers.ts)
  runs toPlainText over shortDescription, description and instructions, so published rows display correctly with no DB rewrite.
- lib/games/controls.ts: deriveControls (keyboard with detail: arrow keys, WASD, Space, press-a-letter, Shift, Enter, Ctrl, Esc; Mouse; Touch;
  empty when nothing is recognized) and instructionLines. "space" alone only counts in a control context ("outer space" is ignored).
- Metadata: gameTitle (Play X Online for Free -> X - Free Online Game -> X, 60 chars with suffix); gameMetaDescription 120-158 chars
  (drops a leading sentence that only repeats the name, word-safe cut with an ellipsis only when cut, CTA only if it fits, category
  sentences for very short text, category sentence when no description). Near-duplicate names still give near-duplicate titles (4 pairs, accepted).
- Page order: breadcrumbs (path -> BreadcrumbList) + VideoGame JSON-LD, H1, player, actions, Quick facts, About (summary sentence +
  description), How to play (hidden when empty; derived controls; stored controls only if present), Tags (hidden if none),
  Similar games (same category + shared tag, new getSimilarGames), More category games, Play next, Guides. No game repeats across lists.
- preconnect (react-dom) to the embed origin only when resolveEmbedUrl returns a URL. Sidebar column only when adsEnabled(), so no empty gap.
- LCP: player placeholder image keeps priority; list cards stay lazy. Category pages keep priority on the first row only (index < 5).
- Not done / decisions left open: click-to-play facade (changes GameMonetize preroll; business decision). getRelatedGames and
  getPlayNextGames are no longer used by the page. getSimilarGames ranking has no unit test (DB-bound, like getRelatedGames).

## Progress
- Branch: feat/seo-geo-aeo-audit (stacked on feat/tools-section 221deac).
- Engram mirror: pending (Engram MCP unavailable this session).

## A3/A4 evidence (2026-10-02)
- AdSlot hidden while ads are off (c3024ef, TDD on lib/ads/config.ts). Category pages preload 2 cards (was 5); unused getRelatedGames/getPlayNextGames removed.
- Branch build (production data, read-only) + crawl: 936 URLs all 200, 0 duplicate titles/descriptions, 0 titles > 60, 5 guide descriptions < 70 (seed), 0 pages without og:image, JSON-LD on every template (0 invalid), 0 empty alt, no orphans, max depth 3.
- Lighthouse: simulated throttling over-reports render delay on localhost; DevTools throttling: branch LCP 2.1–2.6 s, CLS 0, TBT 360–480 ms. Production game page LCP 11.9 s (ISR miss TTFB + iframe).
- robots.txt (off) = allow all; /llms.txt 200 text/plain; /og/default 200 image/png; sitemap 0 URLs while indexing is off.
- npm test 531/531, prisma validate, lint, typecheck, build OK.
- Report: docs/SEO-GEO-AEO-AUDIT.md. Nothing deployed; indexing/Search Console/Adsterra untouched.
