# Apps / Software + Guides (real catalog)

## Objective
Real software directory (~100 verified apps, official links only) and 20–30 original guides that connect
Games, Tools and Apps. Local only: no push, no deploy, no production DB writes.

## Audit (2026-10-02)
- Apps: 16 seed apps with unverified versions/licenses/requirements ("sample values"), mock icons
  (/mock/apps/*.svg), a placeholder screenshots block, `officialDownloadUrl` never used, alternatives partly
  wrong or pointing to missing apps. Platforms are a table (not an enum): windows, mac, linux, android, browser.
  No iOS. No category pages (chips link to /search). Routes are static (dynamicParams=false, no revalidate).
  Search matches name/slug/publisher/category/platform/tags, not description.
- Guides: 10 seed guides of ~70–110 words, invented reading times, game guides about fictional mock games,
  body blocks limited to h2/p/ul/ol (no links, tables or item embeds). Static routes.
- Dependencies: 4 high advisories, all inside the prisma CLI (mysql2, deepmerge-ts). Fixed with npm overrides
  (931e7d1): 0 vulnerabilities; prisma validate/generate/migrate status, tests and typecheck pass.

## Decisions
- Same pattern as Tools: code definitions (`lib/apps/definitions.ts`, `lib/guides/definitions.ts`) are the source
  of truth; `apps:sync` / `guides:sync` (dry run by default) upsert rows and ARCHIVE what is no longer defined.
  Seed data derives from the definitions.
- Platforms: windows, mac, linux, android, ios (new row), web (rename of `browser` in place + 308 redirect
  /apps/browser → /apps/web). No schema change needed (Platform is a table).
- App categories: browsers, productivity, media, communication, development, security, utilities, design,
  cloud, education, gaming. New category route `/apps/category/[slug]`.
- Facts policy: no versions, ratings, download counts, awards or prices. License/pricing only when well established.
  Requirements only when verifiable (otherwise omitted). Icons: letter tiles (no third-party logos).
  Mock screenshots removed. Official URLs verified 2026-10-02 (97/103 HTTP 200 by script; WhatsApp, Android Studio,
  PuTTY 200 in a real browser; Kodi, Canva, Epic Games behind a Cloudflare bot challenge — official domains).
- Disclaimer on every app page: "Gametroz is not affiliated with the software publisher unless explicitly stated."
- Guides: new block types (links, steps, tables, item cards, short answer); every recommendation links a real
  published game, a working tool or a real app. No invented testing claims.

## Tasks
- [x] G0 Dependency overrides (931e7d1).
- [x] A1 Apps infra + first batch of app definitions (45 apps; uncommitted, awaiting review/commit).
- [x] A2 Remaining app definitions (105 total; uncommitted, awaiting review/commit).
- [x] B1 Guides infra + game guides (uncommitted, awaiting review/commit).
- [ ] B2 Tool guides.
- [ ] B3 Software guides.
- [ ] E  Local integration: Docker DB with games copied read-only from production + tools/apps/guides sync; crawl, responsive, console/CSP, validations; report.

## A1 evidence (2026-10-02)
- Defined (45): browsers 8 (firefox, google-chrome, brave, opera, microsoft-edge, vivaldi, tor-browser, duckduckgo-browser);
  media 12 (vlc-media-player, spotify, audacity, handbrake, obs-studio, kodi, shotcut, davinci-resolve, mpc-hc, foobar2000, iina, plex);
  development 15 (visual-studio-code, git, github-desktop, notepad-plus-plus, docker-desktop, postman, nodejs, python, sublime-text,
  android-studio, filezilla, winscp, putty, dbeaver, windows-terminal); existing apps of other categories kept so nothing is archived:
  7zip (utilities), libreoffice (productivity), gimp/blender/inkscape (design), keepassxc/bitwarden/ublock-origin (security),
  thunderbird/signal (communication). A2 adds the remaining ~50 (cloud, education, gaming, productivity, utilities, etc.).
- Decisions: `description` stores two paragraphs separated by a blank line; `license` stores a plain licensing/pricing statement
  (open-source badge only when the text names an OSI license or says "open source"; schema.org free offer only when it plainly says
  "Free"). Version is always null; requirements empty for all 45 apps; iconUrl null (letter tiles); lastVerifiedAt 2026-10-02.
  Alternatives are editorial only (no category fallback); many apps have none until A2 defines more peers. Related apps = same
  category + at least one shared platform, alternatives excluded. Title template: "{App} Download for Windows, Mac & More".
  metaDescription/metaTitle live in definitions (not the DB) and the app page reads them via getAppDefinition.
- Platform `browser` is renamed to `web` in place by `apps:sync` (and by the seed); `/apps/browser` redirects 308 to `/apps/web`
  (lib/apps/redirects.ts, spread into next.config redirects). New IconKey `cloud`.
- Mock icons (public/mock/apps) and the screenshots block were removed.
- Dry run against local Docker: platforms 1 create (ios) / 1 rename (browser -> web) / 4 update; categories 5 create / 6 update;
  apps 29 create / 16 update / 0 archive. Nothing applied.

## A2 evidence (2026-10-02)
- Added 60 apps (58 candidate rows + 2 gaming additions to reach 4+ per category): productivity 9, communication 6, security 6,
  utilities 13, design 6, cloud 7, education 8, gaming 5 (steam, epic-games-launcher, gog-galaxy plus heroic-games-launcher and
  playnite; both home pages return HTTP 200, verified 2026-10-02 by curl, not in the original TSV).
- Totals: 105 apps. Categories: browsers 8, productivity 10, media 12, communication 8, development 15, security 9, utilities 14,
  design 9, cloud 7, education 8, gaming 5. Platforms: windows 93, mac 79, linux 60, android 53, ios 48, web 33.
- Featured (8): firefox, vlc-media-player, obs-studio, visual-studio-code, 7zip, libreoffice, discord, steam.
- Alternatives revisited across the catalog (2-5 where genuine peers exist; none editorial filler). Apps with no genuine peer in the
  catalog keep none. Tests: featured cap raised 6 -> 8; new invariant (>= 4 apps per category, >= 10 per platform, >= 95 apps);
  extra official hosts allowed for zoom (zoom.us), powertoys (github.com), google-docs, microsoft-to-do, icloud-for-windows.
- Dry run against local Docker: apps 89 create / 16 update / 0 archive; platforms 1 create / 1 rename / 4 update; categories 5 create / 6 update. Nothing applied.

## B1 evidence (2026-10-02)
- Infra: block model in types/content.ts (answer, h2, h3, p, ul, ol, steps, table, items, note) with pure helpers in lib/guides/blocks.ts
  (internal-link parsing and validation, reference extraction, word count, reading minutes at 230 wpm, min 1). Source of truth:
  lib/guides/definitions.ts (+ content/*.ts); lib/guides/sync-plan.ts; scripts/guides-sync.ts; npm run guides:sync (dry run by default,
  --apply, --confirm-archive above 10). Seed derives from the definitions. Guide relations to games/tools/apps are derived from every
  reference in the body; `--apply` refuses when a game is missing/unpublished, a tool/app is undefined or not yet in the DB, a guide
  link is unknown or a listing page does not exist. updatedAt comes from the definition (written explicitly to Guide.updatedAt, no
  schema change) and is shown as "Updated ..." with dateModified in the Article JSON-LD; no byline. ISR: guide pages 3600 s, /guides and
  /guides/[section] 600 s, dynamicParams=false removed.
- Games guides (10, all 2026-10-02, 619-763 words, 6-14 game links each, every linked game also shown as a card): best-free-browser-games,
  best-racing-games-online (rewrite), best-puzzle-games-online, best-action-games-online, best-arcade-games-online, best-sports-games-online,
  best-casual-browser-games, browser-games-for-low-end-pcs, games-you-can-play-without-downloading, how-to-play-games-in-fullscreen (rewrite).
  Selection wording (true per docs/12): picked from the top of each category by the provider popularity rankings, brand titles excluded,
  "not a test result". 74 distinct published games referenced. Tools/apps guides ported as-is (7) with a closing items block so relations survive.
- Dry run against local Docker: guides 8 create / 9 update / 0 unchanged / 1 archive (puzzle-games-for-beginners); references 74 games,
  7 tools, 6 apps, 0 problems. Nothing applied.

## Checks
TDD strict, `npm test`; per task lint + typecheck; final prisma validate, build, npm audit.

## Progress
- Branch: feat/apps-guides (stacked on feat/seo-geo-aeo-audit 870ad92).
- Engram mirror: pending (Engram MCP unavailable this session).
