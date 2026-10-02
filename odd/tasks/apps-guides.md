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
- [ ] A2 Remaining app definitions (target 95–100 total).
- [ ] B1 Guides infra + game guides.
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

## Checks
TDD strict, `npm test`; per task lint + typecheck; final prisma validate, build, npm audit.

## Progress
- Branch: feat/apps-guides (stacked on feat/seo-geo-aeo-audit 870ad92).
- Engram mirror: pending (Engram MCP unavailable this session).
