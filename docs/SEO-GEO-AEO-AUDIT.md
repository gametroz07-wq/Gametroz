# Gametroz SEO + AEO + GEO audit

Date: 2026-10-02 · Branch: `feat/seo-geo-aeo-audit` (stacked on `feat/tools-section`) · Not deployed.
Indexing stays OFF (`NEXT_PUBLIC_INDEXING_ENABLED=false`), no Search Console, `ADSTERRA_ENABLED=false`, `GAME_EMBEDS_ENABLED=true`.

Scope: English site, organic growth with priority on the United States. No rankings or traffic are promised.
No black-hat tactics, bought links, keyword stuffing or mass-generated pages.

## How the evidence was collected

| Source | What | Notes |
|---|---|---|
| Production crawl | 974 URLs of https://gametroz.online (main `1db519c`), BFS from `/` | Script records status, redirects, title, description, canonical, robots, H1/H2, JSON-LD (parsed), images/alt, words, links, click depth |
| Branch crawl | 936 URLs of a local production build of this branch, reading production data (read-only) | Same script. Tools show the 16 production DB rows because the new tools are not synced to production yet |
| Content analysis | Read-only query over the 498 published games | Word counts, duplicates, instruction patterns, entity artifacts |
| Lighthouse 12 (mobile) | Production and branch, simulated and DevTools throttling | Local numbers have near-zero TTFB; see CWV section for caveats |
| Keyword research | Web search for representative US queries | The search tool returned low-quality, scraper-heavy result pages. **All volumes, difficulty and traffic values are estimates (VERY HIGH/HIGH/MEDIUM/LOW), not measured.** |

## 1. Technical SEO health score (before → after)

A transparent 100-point rubric (10 checks × 10). Indexability is excluded because noindex is intentional until launch.

| Check | Before (production) | After (branch) |
|---|---|---|
| Status codes / redirects | 9 — 1 link to Cloudflare `/cdn-cgi/l/email-protection` (404 without JS) | 10 |
| Canonical (present, self-referencing, query strings collapse) | 10 | 10 |
| Titles & descriptions (unique, length) | 4 — 14 titles > 60 chars; 600 descriptions outside 70–160; 403 search URLs share one description | 9 — 0 duplicates, 0 titles > 60, 5 guide descriptions < 70 |
| Headings (one H1) | 10 | 10 |
| Structured data (valid, matches visible content) | 0 — none on the site | 10 — every template, 0 invalid |
| Image alt text | 0 — 14,454/14,454 images with `alt=""` | 10 — 0 empty |
| Sitemap | 0 — `/sitemap.xml` 404 | 9 — complete builder, gated (empty while indexing is off) |
| robots.txt | 5 — only Cloudflare's preamble, no rules, no Sitemap | 9 — `app/robots.ts` prepared for launch |
| Internal linking (depth, orphans, crawl waste) | 8 — depth ≤ 3, no orphans, 403 crawlable search URLs from tag links | 9 — tag→search links are `nofollow` |
| Core Web Vitals (lab, mobile) | 4 — game page LCP 11.9–68 s (iframe bandwidth, lazy LCP card); CLS 0 | 7 — LCP 2.1–2.6 s (DevTools throttling, local); production game LCP still depends on the iframe |
| **Total** | **50 / 100** | **93 / 100** |

## 2. P0 — blocks SEO/indexing

| # | Finding | Status |
|---|---|---|
| P0-1 | Site-wide noindex (root metadata, `pageMetadata`, `X-Robots-Tag`) | **Intentional.** Kept. It is the launch switch. |
| P0-2 | No sitemap | Fixed: `app/sitemap.ts` lists every published, canonical URL; returns no URLs while indexing is off |
| P0-3 | robots.txt has no rules and no Sitemap reference | Fixed: `app/robots.ts` (off: allow all, same behaviour as today; on: allow, `Disallow: /api/ /search`, `Sitemap:`). Cloudflare still prepends its content-signals preamble |

Nothing else blocks indexing once the switch is turned on.

## 3. P1 — high impact (all fixed in this branch)

| # | Finding | Fix |
|---|---|---|
| P1-1 | No JSON-LD anywhere | WebSite (+SearchAction) and Organization on home; BreadcrumbList on every page with breadcrumbs (built from the visible trail); VideoGame on games; WebApplication (+FAQPage only where the FAQ is visible) on tools; SoftwareApplication on apps (no offers: the page never states the price); Article on guides (visible date, Gametroz publisher, no author) |
| P1-2 | 14,454 images with empty alt | Game thumbnails: `{Name} online game`; app icons: `{Name} icon`; decorative SVG icons stay aria-hidden |
| P1-3 | Game meta descriptions broken or out of range ("SPLATCHA! Play Splatcha! free in your browser…") | `gameMetaDescription`: provider description cut at a word boundary to 120–158 chars, no name-only lead sentence, CTA only if it fits |
| P1-4 | 14 titles > 60 chars (apps, long game names) | `fitTitle`, `gameTitle`, `appTitle` templates with fallbacks; 0 over 60 |
| P1-5 | 475 pages without og:image | Branded 1200×630 default card (`/og/default`) referenced by every page without its own image; games keep their thumbnail |
| P1-6 | Game pages thin and badly ordered (player → lists → text → empty "Controls") | Quick facts (category, controls derived from the instructions, orientation, "Web browser — no download", "Free to play (ads may appear…)"), one-sentence answer, About, How to play, then Similar games / More {category} / Play next; empty sections hidden; duplicate games across lists removed |
| P1-7 | Feed sends bare entity words (`uarr`, `rarr`, `larr`, `darr`, `mdash`) shown as text on ~24 games | Repaired in `toPlainText` and applied at render time in the mapper (no production data rewrite) |
| P1-8 | Game category descriptions ~55 chars, no intro | Unique, factual 120–155-char descriptions and a short visible intro per category and per app platform |
| P1-9 | No About / Editorial policy (trust, GEO) | `/about` and `/editorial-policy`: what the site offers, games come from GameMonetize and are embedded from their servers, how games are selected and reviewed, tools run locally, apps link to official sources, how to report problems. No invented people |
| P1-10 | Empty "Advertisement" boxes shown to visitors while ads are off | `AdSlot` renders nothing unless `ADSTERRA_ENABLED=true`; the game page drops the sidebar column so the player gets the width |
| P1-11 | LCP on game pages was a lazy "Play next" card loaded after the 12.9 MB iframe | Text content moved above the lists (LCP becomes text); `preconnect` to `html5.gamemonetize.co` on game pages; only the first hero image is high priority |
| P1-12 | Logo SVG exposed "GAMETROZ" 13 times to text extraction and screen readers | One `<text>` in `<defs>` reused by `<use>`, single accessible name |

## 4. P2 — pending (documented, not applied)

| # | Finding | Recommendation |
|---|---|---|
| P2-1 | Game pages still use provider text verbatim (100%; median 61-word description) | Editorial enrichment system (section 10). Do not mass-rewrite |
| P2-2 | Instructions arrive as one line ("Movement W ↑ — forward S ↓ — …") | Split heuristically on key labels once a rule proves reliable on the catalog |
| P2-3 | Production game LCP depends on the auto-loading iframe (12.9 MB of game/ad assets) | A click-to-play facade would fix LCP and data use but changes when GameMonetize prerolls show. **Business decision**: test on a sample before rolling out |
| P2-4 | Apps and guides are still seed content (16 apps, 10 guides; 5 guide descriptions < 70 chars) | Covered by the Apps and Guides phases |
| P2-5 | `/search?q=` URLs (364–403) remain discoverable from app category chips (`ChipNav`) | Point chips to real platform/category pages or add `nofollow` there too |
| P2-6 | 4 near-duplicate game title pairs (e.g. "Police Car Parking" variants) | Editorial review; distinguish titles or archive one |
| P2-7 | TBT 360–480 ms under 4× CPU throttling (INP risk on low-end phones) | Profile hydration of long card lists; keep lists server-rendered, defer non-critical client components |
| P2-8 | Third-party cookies flagged on game pages (provider ads) | Inherent to embedded ads; mention in the privacy policy (already covers third-party services) |
| P2-9 | Cloudflare email obfuscation link `/cdn-cgi/l/email-protection` | Cloudflare setting; leave or show the address as plain text |

## 5. Final information architecture

```
/                         Games-first home (hero, trending, popular, racing, puzzle, action, new) + tools/apps/guides teasers
├── /games                7 categories (all with 22–95 games, none thin)
│   ├── /games/action  /games/arcade  /games/adventure  /games/puzzle
│   ├── /games/racing  /games/sports  /games/casual
│   └── /game/[slug]      498 published games
├── /tools                6 categories, 30 tools (after the Tools release)
│   ├── /tools/text (7)  /tools/developer (5)  /tools/generators (4)
│   ├── /tools/calculators (6)  /tools/converters (4)  /tools/images (4)
│   └── /tool/[slug]
├── /apps                 platforms: windows, mac, linux, android, browser (iOS planned in the Apps phase)
│   └── /app/[slug]
├── /guides               sections: games, tools, apps
│   └── /guide/[slug]
└── /about  /editorial-policy  /contact  /privacy  /terms  (/search is noindex)
```

Decisions: "Generators" and "Images" stay as tool categories instead of a single "Utilities" (4 tools each, clearer intent).
The requested Apps tree (Windows, macOS, Android, iOS, Web) maps to the existing `windows`, `mac`, `android`, `browser` platforms; `ios` is added in the Apps phase only when there are enough real iOS apps, and `linux` stays because real apps exist for it.
Categories with very few pages are avoided (empty tool categories `pdf` and `seo` now return 404 and are out of the sitemap).
Programmatic collections are only justified with enough real items and distinct intent (see section 9).

## 6. Keyword clusters (estimates)

Legend: Diff = estimated difficulty for a new domain; Opp = estimated opportunity. No volumes were available.

| Cluster | Representative queries | Intent | Diff | Opp | Target |
|---|---|---|---|---|---|
| Game hubs (head terms) | free online games, browser games, play online games | Browse | VERY HIGH | LOW short term | `/games` (long-term) |
| Game categories | racing games online free, puzzle games online, arcade games online, action/sports/casual games | Browse | HIGH | MEDIUM | `/games/{category}` |
| No-download / device | free games no download, games that require no download, browser games for low-end PC, Chromebook games | Info/browse | MEDIUM | HIGH | New guides + `/games` |
| Game collections | 2 player games, car parking games, obby games, io games, shooting games, kids games | Browse | MEDIUM–HIGH | MEDIUM | Possible collection pages (section 9) |
| "Best of" game guides | best free browser games, best racing games online, best puzzle browser games | Investigation | MEDIUM–HIGH | HIGH | New guides linking real games |
| Developer tools | json formatter/validator, base64 decode, url encode, uuid generator, unix timestamp converter | Tool | MEDIUM–HIGH | HIGH | `/tool/json-formatter`, `/tool/base64-encoder-decoder`, `/tool/url-encoder-decoder`, `/tool/uuid-generator`, `/tool/timestamp-converter` |
| Image tools | webp to jpg, png to jpg, image compressor, image resizer | Tool | MEDIUM–VERY HIGH | HIGH | `/tool/webp-to-jpg` etc. |
| Text tools | word counter, character counter, case converter, remove duplicate lines | Tool | HIGH | MEDIUM | `/tool/*` |
| Money calculators (US) | discount calculator, sales tax after discount, tip calculator, split the bill | Tool | HIGH | MEDIUM–HIGH | `/tool/discount-calculator`, `/tool/tip-calculator` |
| Converters (US units) | feet to meters, lbs to kg, fahrenheit to celsius | Tool | VERY HIGH (Google widget likely) | LOW head / MEDIUM long-tail | converters + long-tail copy ("5 ft 9 in in cm") |
| Software alternatives | vlc alternatives, free photoshop alternatives, microsoft office alternatives | Investigation | HIGH–VERY HIGH | MEDIUM | Apps phase |
| Software by platform | best free windows apps, free productivity apps | Investigation | HIGH | MEDIUM | `/apps/windows` + guides |
| How-to guides | how to format json, what is a unix timestamp, what is base64, how to calculate a discount, how much to tip | Info | MEDIUM | MEDIUM | New guides linking tools |

Avoid: "unblocked games" and school-filter-bypass intent (policy and brand risk with ad networks).

## 7. Top 30 opportunities for US traffic (estimates)

| # | Topic | Intent | Section | Target URL | Why it matters | Diff | Opp | Action |
|---|---|---|---|---|---|---|---|---|
| 1 | webp to jpg | Tool | Tools | /tool/webp-to-jpg | Steady demand; page 1 has many small tool sites | M-H | HIGH | Ship tools; FAQ on transparency/quality |
| 2 | json formatter / validator | Tool | Tools | /tool/json-formatter | Large developer demand; line/column errors are a differentiator | M-H | HIGH | Ship; add "JSON validator" wording in copy |
| 3 | unix timestamp converter | Tool | Tools | /tool/timestamp-converter | Small-site SERP (seen) | M | MED | Ship; "current epoch" is already live |
| 4 | base64 decode/encode | Tool | Tools | /tool/base64-encoder-decoder | Developer utility | M | HIGH | Ship |
| 5 | url encode/decode | Tool | Tools | /tool/url-encoder-decoder | Developer utility | M | MED | Ship |
| 6 | uuid generator | Tool | Tools | /tool/uuid-generator | Developer utility | M | MED | Ship (bulk + validator) |
| 7 | discount calculator + sales tax | Tool | Tools | /tool/discount-calculator | US shopping seasons (Black Friday) | M-H | HIGH | Ship (USD, stacked discounts, tax after discount) |
| 8 | tip calculator / split the bill | Tool | Tools | /tool/tip-calculator | US tipping culture | H | MED | Ship (15–25% presets, split) |
| 9 | best free browser games | Investigation | Guides | /guide/best-free-browser-games | Mid-size sites rank; freshness matters | M-H | HIGH | Write; link 20–25 real games |
| 10 | games that need no download | Info | Guides | /guide/games-no-download | Weak SERP observed | M | MED | Write (HTML5 explainer) |
| 11 | browser games for low-end PCs | Info | Guides | /guide/browser-games-low-end-pc | Weak SERP observed | M | MED | Write with real picks |
| 12 | Chromebook games (no "unblocked") | Info | Guides | /guide/chromebook-games | US schools/homes use Chromebooks | M-H | HIGH | Write; avoid bypass language |
| 13 | 2 player games online | Browse | Games | collection (section 9) | Spammy SERP observed | M-H | HIGH | Only if ≥ 20 real titles |
| 14 | car parking games | Browse | Games | collection | Clear niche, many titles in catalog | M | MED | Only if ≥ 20 real titles |
| 15 | obby games | Browse | Games | collection | Niche with many catalog titles | M | MED | Only if ≥ 20 real titles |
| 16 | best racing games online | Investigation | Guides | /guide/best-racing-games-online (exists, seed) | Supports /games/racing | M | MED | Rewrite with real games |
| 17 | best puzzle games in the browser | Investigation | Guides | new guide | Supports /games/puzzle | M | MED | Write |
| 18 | how to format JSON | Info | Guides | /guide/how-to-format-json (exists, seed) | Supports #2 | M | MED | Rewrite with real examples |
| 19 | what is a unix timestamp | Info | Guides | new guide | Supports #3 | M | MED | Write |
| 20 | what is Base64 | Info | Guides | new guide | Supports #4 | M | MED | Write |
| 21 | how to convert WebP to JPG on any device | Info | Guides | new guide | Supports #1 | M | MED | Write (Windows/Mac/iPhone/Android) |
| 22 | how to calculate a discount | Info | Guides | new guide | Supports #7 | M | MED | Write |
| 23 | how much to tip in the US | Info | Guides | new guide | US-specific, recurring | H | MED | Write (scenario table) |
| 24 | strong password generator | Tool | Tools | /tool/password-generator | Security intent; local generation is a trust point | H | MED | Ship |
| 25 | image compressor (e.g. "compress to 100 KB") | Tool | Tools | /tool/image-compressor | Big demand, brand competition | H | MED | Ship; long-tail copy |
| 26 | arcade/puzzle/racing category hubs | Browse | Games | /games/{category} | Category hubs aggregate long-tail | H | MED | Done: intros + metadata |
| 27 | free Microsoft Office alternatives | Investigation | Apps | /guide/best-free-office-suites (exists, seed) | Large US demand | H | HIGH | Apps/Guides phase |
| 28 | VLC alternatives / best free video players | Investigation | Apps | /app/vlc-media-player + guide | AlternativeTo dominates | H | MED | Apps phase, real comparison |
| 29 | free Photoshop alternatives (Photopea, GIMP, Krita) | Investigation | Apps | /app/gimp + guide | Media/vendor blogs rank | VH | MED | Apps phase |
| 30 | best free Windows apps | Investigation | Apps | /apps/windows + guide | Largest desktop platform in the US | H | MED | Apps phase |

## 8. Thin content and duplicates

- Thin: game pages are provider text only (description median 61 words, 63 under 40 words; 134 games share the instruction "Mouse click or tap to play"). Mitigated by the new template (quick facts, controls, similar games) without inventing content; deeper enrichment in section 10.
- Duplicate pages: 0 duplicate titles/descriptions after the fix. 4 near-duplicate game title pairs (P2-6). Search result URLs are noindex and canonical to `/search`.
- Seed content: apps and guides are still seed data (Apps and Guides phases).

## 9. Programmatic pages (justified or not)

| Candidate | Verdict |
|---|---|
| `/games/{category}` (7) | Justified: 22–95 real games each, distinct intent, now with unique intros |
| `/tools/{category}` (6) | Justified: 4–7 real tools each |
| `/apps/{platform}` | Justified once each platform has enough real apps (Apps phase) |
| Tag-based game collections (2-player, parking, obby, io, shooting, kids) | Only when a tag has ≥ 20 published games, a unique intro and a real search intent. Propose after checking tag counts; needs an architecture decision (new route) |
| Keyword combinations ("free racing games for kids on chromebook") | Rejected: no distinct value |

## 10. Strategy by section

### Games (main traffic driver)
- Editorial enrichment system, data-first: quick facts (done), controls from instructions (done), orientation (done). Next: a small "Tips" field filled by humans for the top 50 games by popularity, and screenshots/video only if the provider supplies them. Never auto-generate prose.
- Prioritize the top 100 games (by `popularity`) for manual review: title cleanup, category check, tips.
- Collections from tags (section 9) once counts justify them.
- Freshness: weekly "new games" from the existing pipeline (manual publish), surfaced on the home and in `/games`.

### Tools
- Ship the 30 tools (Tools release). Long-tail copy around US cases (tax after discount, tipping, imperial units).
- Each tool links to its category, related tools and the supporting guide (how-to/explainer).

### Apps / Software
- Replace seed data with real, verified apps per platform; official download links only; "alternatives" blocks with honest comparisons; SoftwareApplication without invented prices or ratings.

### Guides
- 20–30 guides from section 7 (#9–#23 first), each linking real games/tools/apps. Visible date and "Gametroz editorial team" only if a real editorial process stands behind it.

## 11. Internal linking

- Game → category, Similar games (same category + shared tags), More {category} games, Play next (trending); no duplicates across lists.
- Tool → category, related tools in the same category, complementary tools (e.g. JSON formatter ↔ Base64 ↔ URL encoder), supporting guides.
- App → platform, alternatives, related guides. Guide → contextual links to games/tools/apps.
- Crawl results: no orphans; strategic pages at depth ≤ 2 (games mostly depth 2, categories depth 1).
- Tag links to `/search` are `nofollow` (they target a noindex page).

## 12. Structured data (applied)

| Template | Types | Not used, on purpose |
|---|---|---|
| Home | WebSite (+SearchAction `/search?q=`), Organization (name, url, logo) | sameAs (no verified profiles) |
| Listings (games, tools, apps, guides, categories, legal, about) | BreadcrumbList | ItemList (not needed yet) |
| Game | VideoGame (name, description, url, image, genre, gamePlatform "Web browser", isAccessibleForFree) + BreadcrumbList | ratings, reviews, FAQPage |
| Tool | WebApplication (free offer, UtilitiesApplication) + FAQPage only where the FAQ is visible + BreadcrumbList | ratings |
| App | SoftwareApplication (operatingSystem, downloadUrl when visible) + BreadcrumbList | offers/price (not stated on page), ratings |
| Guide | Article (headline, description, datePublished as shown, publisher Gametroz) + BreadcrumbList | author (no named author is shown) |

All JSON-LD is serialized safely (`<` escaped) and parses on every crawled page (0 invalid).

## 13. Sitemap

- `app/sitemap.ts` → games, game categories, tools, tool categories, apps, platforms, guides, sections, home, about, editorial policy, contact, privacy, terms. Published and canonical only; no REVIEW/ARCHIVED, no `/search`, no duplicates; `lastModified` from `updatedAt`.
- Returns no URLs while indexing is off. Total today ≈ 600 URLs: a single sitemap is enough (limit 50,000). Switch to `generateSitemaps` / a sitemap index (games/tools/apps/guides) past ~40,000 URLs.

## 14. robots.txt

- Today (off): `User-agent: * / Allow: /` — same effective behaviour as before; noindex is enforced by meta and header (blocking would hide it).
- At launch (on): `Allow: /`, `Disallow: /api/`, `Disallow: /search`, `Sitemap: https://gametroz.online/sitemap.xml`. Cloudflare keeps prepending its content-signals preamble (review those signals in the Cloudflare dashboard before launch).

## 15. Canonical and duplicates

www → apex (301), http → https (301), trailing slash → no slash (308), query strings canonicalize to the clean URL, uppercase paths 404, search results noindex with canonical `/search`. Canonical host: `https://gametroz.online`.

## 16. Core Web Vitals (lab)

| Page | Production (simulated) | Branch, local (DevTools throttling) |
|---|---|---|
| `/` | LCP 5.0 s (hero image), CLS 0, TBT 140 ms | LCP 2.6 s, CLS 0, TBT 390 ms |
| `/games/racing` | LCP 3.1 s (DevTools) | LCP 2.3 s |
| `/game/octopus-run` | LCP 11.9 s (DevTools; TTFB 5.4 s on an ISR miss) to 68 s (simulated; lazy card behind 12.9 MB iframe) | LCP 2.1 s (text) |
| `/tools` | LCP 2.4 s | LCP 4.1 s simulated / text element |

Caveats: local runs have near-zero TTFB and no CDN; Lighthouse's simulated throttling over-reports render delay on localhost, so DevTools throttling was used for the branch. Real-user INP needs field data (CrUX/Search Console) after launch. Main risks: game iframe bandwidth (P2-3), ISR cold renders on Render (first visit after revalidation), TBT on low-end phones (P2-7). CLS is 0 everywhere; ad slots reserve fixed space when enabled.

## 17. AEO (answer-ready content)

- Game pages answer: what is it ("{Name} is a free {category} game you can play in your web browser"), is it free (yes, ads may appear), does it need a download (no), controls (derived), orientation (phone-friendly portrait games).
- Tools: intro answers what/does/free/mobile; numbered "How to use"; worked examples; FAQs only where genuinely useful (and FAQPage only when visible).
- Guides (next phase): short definition first, steps, tables only when they help.

## 18. GEO (generative search)

Done: clear entity (Gametroz Organization + WebSite), factual About and Editorial policy (provider attribution, selection process, local tool processing), consistent facts across pages and JSON-LD, stable URLs, descriptive headings, citable one-sentence answers, `/llms.txt` with a factual site map.
Not assumed: `llms.txt` does not produce rankings; it only documents the site for tools that read it.

## 19. Homepage (SEO + CRO)

H1 "Gametroz — free games, online tools and apps" communicates the offer; games dominate (hero, trending, popular, racing, puzzle, action, new ≈ 70%), then tools (~20%) and apps/guides teasers. Added WebSite/Organization JSON-LD and removed empty ad boxes. No SEO text blocks added (kept clean).

## 20. Monetization readiness (Adsterra stays off)

| Placement | Desktop | Mobile | Rules |
|---|---|---|---|
| Game sidebar (300×600, sticky) | Yes, only when ads are on | No | Never over the player or its controls |
| Below player (728×90 / 320×100) | Yes | Yes | Below Fullscreen/Share buttons, not between title and player |
| Between sections (home/listings) | Yes | Yes | After the first two sections |
| Tool pages (336×280) | After the result | After the result | Never between input and output |
| Guides (inline 336×280) | After paragraph 3 | Same | Max one per screen |

`AdSlot` reserves fixed sizes (no CLS) and renders nothing until `ADSTERRA_ENABLED=true`. Never style ads like Play buttons.

## 21. Plan 30 / 60 / 90 / 180 days

| Window | Technical | Content | Off-site (legitimate) | Retention |
|---|---|---|---|---|
| 0–30 | Release Tools + this branch; enable indexing; submit sitemap in Search Console; verify Rich Results; watch coverage | 8 guides (#9–#12, #18–#21 in section 7) | List tools in reputable free-tool directories; share on relevant communities (r/webdev for dev tools, only where self-promotion is allowed) | Favorites/recently played (local) |
| 31–60 | Fix P2-5/P2-7; decide click-to-play test (P2-3); collection pages if tag counts justify | 8 more guides; top-50 game tips; Apps phase starts | Outreach to small gaming blogs/newsletters with curated lists; Product Hunt/IndieHackers for the tools set | Weekly "new games" section |
| 61–90 | Field CWV review (CrUX); image/hero tuning | Apps with real alternatives; 4–6 software guides | Software directories and alternatives sites (honest listings) | Email-free return paths: "continue playing", related lists |
| 91–180 | Sitemap index if needed; ISR/caching review | Expand to 30 guides; refresh "best of" lists quarterly | Content partnerships (guest guides on tool/gaming sites) | Measure pages/session; adjust internal links |

Never buy links, never use "unblocked" bypass intent, never auto-generate prose for the 498 games.

## 22. Changes applied (commits on this branch)

- `ed7d708` feat(seo): structured data, alt text, OG image, sitemap, robots, llms.txt and trust pages
- `c3024ef` fix(ads): hide ad placeholders while ads are disabled
- `6d54079` feat(seo): richer game pages with quick facts, controls and better metadata (+ category preload limit, unused helpers removed)

## 23–26. Validation

- `npm test`: 531 / 531 pass · `npx prisma validate`: valid · `npm run lint`: clean · `npm run typecheck`: clean · `npm run build`: OK.
- Branch crawl: 936 URLs, all 200; 0 duplicate titles/descriptions; one H1 everywhere; JSON-LD on every template, 0 invalid; 0 empty alt; no orphans; max depth 3.
