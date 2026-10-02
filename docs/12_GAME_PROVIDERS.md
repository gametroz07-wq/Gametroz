# 12 — Game Provider Layer

How external game catalogs enter Gametroz safely. Implemented in Phase 4 (GameMonetize only).

---

# 1. Architecture

```text
Provider feed ──► Adapter (client → mapper → validator) ──► syncProviderGames ──► PostgreSQL (REVIEW)
                                                                                  │
                                              explicit publishGame (CLI) ◄────────┘
                                                                                  │
                                       lib/catalog.ts reads PUBLISHED only ──► pages
```

- `lib/catalog.ts` never imports provider code. Providers only write through the sync service.
- Every adapter implements `GameProvider<TRaw>` (`lib/providers/types.ts`).
- Adapters are registered in `lib/providers/registry.ts`.

```text
lib/providers/
├── types.ts            Contracts: GameProvider, NormalizedGame, ValidationResult, SyncResult
├── security.ts         URL checks: HTTPS + exact host allowlist
├── hosts.ts            Embed and image allowlists per provider
├── embed.ts            resolveEmbedUrl(): the single gate before an iframe
├── text.ts             Plain-text, slug, size and tag helpers
├── validation.ts       Provider-agnostic validation rules
├── sync.ts             syncProviderGames, deduplication, limit
├── publish.ts          publishGame (REVIEW → PUBLISHED)
├── registry.ts         Provider factories
├── gamemonetize/       config, types, client, mapper, validator, provider, fixtures
└── __tests__/          node:test suites (npm test)
```

# 2. GameMonetize

- Feed (documented by the public RSS builder, https://gamemonetize.com/rss-builder):
  `https://gamemonetize.com/rssfeed.php?format=json&type=html5&category=All&popularity=newest&company=All&amount=10|20`
  It redirects to `rss.gamemonetize.com` and needs no API key.
- Item fields (observed 2026-10-01): `id, title, description, instructions, url, category, tags, thumb, width, height`. All are strings, and `tags` is comma-separated.
- The live feed is **off** unless `GAMEMONETIZE_FEED_ENABLED=true`. By default the adapter uses `fixtures.ts`: clearly marked mock data whose ids start with `fixture-`.
- Category mapping lives in `gamemonetize/config.ts`. Unmapped categories (3D, AI, 2 Player, Multiplayer…) fall back to `casual` with a warning (see "Category mapping").
- **2026-10-01, first live test:** the live feed sends `Puzzles` (plural) while the RSS builder lists `Puzzle`; `puzzles → puzzle` was added. Other live categories seen (Arcade, Adventure, Shooting, Girls, Racing) were already mapped.
- Feed text quirks: double-encoded entities (`&amp;mdash;`) and bare words left by the provider sanitizer (`mdash`, `ndash`). `toPlainText` decodes entities in two passes and repairs those words. Missing line breaks (e.g. "playPlayer") are left as-is for manual editing.

# 3. Normalization

| Gametroz field | GameMonetize source |
|---|---|
| provider | `"gamemonetize"` |
| providerGameId | `id` |
| name | `title` (plain text) |
| slug | slug of `title` |
| shortDescription | first sentence of `description`, at most 160 characters |
| description, instructions | `description`, `instructions` (HTML stripped, entities decoded) |
| embedUrl | `url` |
| thumbnailUrl | `thumb` |
| heroImageUrl | `null` (not in the feed) |
| width, height | parsed `width`, `height` |
| orientation | PORTRAIT when height > width |
| language | `"en"` (not in the feed) |
| category | mapped Gametroz category slug, or `null` |
| tags | `tags` split, slugified, unique, at most 10 |
| status | always `REVIEW` |

# 4. Validation

| Rule | Code | Result |
|---|---|---|
| Provider id present | ID_MISSING | REJECTED |
| Name present | NAME_MISSING | REJECTED |
| Slug valid (`a-z0-9-`, 2–80 chars) | SLUG_INVALID | REJECTED |
| Slug not owned by another game | DUPLICATE_SLUG | REJECTED |
| Same id repeated in the feed | DUPLICATE_IN_FEED | ignored |
| Thumbnail present, HTTPS, allowlisted host | THUMBNAIL_* | REJECTED |
| Embed present, valid, HTTPS, allowlisted host | EMBED_* | REJECTED |
| Category mapped and present in the DB | CATEGORY_UNMAPPED | warning, falls back to `casual` (stays REVIEW) |
| Width/height between 200 and 4096 px | SIZE_UNREASONABLE | NEEDS_REVIEW |
| Description ≥ 40 characters | DESCRIPTION_TOO_SHORT | NEEDS_REVIEW |
| Instructions present | INSTRUCTIONS_MISSING | NEEDS_REVIEW |

- VALID and NEEDS_REVIEW games are stored as `REVIEW`, with `validationStatus` and `validationIssues`.
- REJECTED games are never stored; they are listed in the `ImportRecord` logs.

# 5. Security

- **Allowlist (exact host, HTTPS only, no credentials in the URL):**
  - GameMonetize embeds: `html5.gamemonetize.co`
  - GameMonetize images: `img.gamemonetize.com`, which `next.config.ts` → `images.remotePatterns` mirrors.
- Provider text is stripped of HTML and rendered as React text. There is no `dangerouslySetInnerHTML` and provider scripts are never executed.
- **The iframe** (`components/games/game-embed.tsx`) renders only when `resolveEmbedUrl()` returns a URL:
  - Only the allowlisted origin `https://html5.gamemonetize.co` is embedded, and only when `GAME_EMBEDS_ENABLED=true` (`lib/providers/embed.ts`).
  - `sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-popups-to-escape-sandbox"`:
    - `allow-scripts` + `allow-same-origin`: required by the game runtime and its storage. Safe here because the game origin is cross-origin to Gametroz.
    - `allow-pointer-lock`: needed by many games.
    - `allow-popups` + `allow-popups-to-escape-sandbox`: only so ad clicks inside the game open in a new tab.
    - **Not allowed:** `allow-top-navigation`, `allow-forms`, `allow-modals`, `allow-downloads`.
  - `allow="fullscreen; autoplay; gamepad"`, `title="Play <name>"`, `referrerpolicy="strict-origin-when-cross-origin"`, `loading="lazy"`.
  - Aspect ratio 16:9 (9:16 for portrait games) and Gametroz's own fullscreen button.
- **CSP** (`lib/security/headers.ts`), per directive, with no wildcards:

| Directive | Value | Why |
|---|---|---|
| `frame-src` | `https://html5.gamemonetize.co` (`'none'` when embeds are disabled) | The only embeddable origin |
| `img-src` | `'self' blob: data:` | Thumbnails from `img.gamemonetize.com` are proxied by `next/image`, so no remote host is needed |
| `script-src`, `connect-src`, `media-src` | `'self'` | The game's scripts, ads (Google IMA/DoubleClick) and media run inside the nested cross-origin frame and are governed by that frame's CSP, not ours |

  `Permissions-Policy` delegates `fullscreen`, `autoplay` and `gamepad` to `self` and `html5.gamemonetize.co` only when embeds are on.

# 6. Sync service

`syncProviderGames(provider, { prisma, limit, dryRun })`:

1. Upserts the `Provider` row (created with `enabled=false`) and starts an `ImportRecord`.
2. Fetches at most `limit` games. See "Sync batches" below for the allowed sizes.
3. Deduplicates by provider id.
4. Validates and normalizes, then checks slug collisions against the database and the current batch.
5. Upserts by `(providerId, providerGameId)`:
   - **New** games are created in `REVIEW`.
   - **Existing** games still in `REVIEW` take the full provider data again (texts, tags, category, technical fields), never the slug.
   - **Existing** published or archived games only get provider-owned technical fields refreshed (embed, thumbnail, size, orientation, validation). Name, slug, description and status are never overwritten.
   - A rejected refresh only records the problem.
6. Closes the `ImportRecord` with received, created, updated, ignored, rejected, needsReview, failed and per-item logs.

**Dry run** (`dryRun: true`): same pipeline and report, and an `ImportRecord` flagged `dryRun`, but no game is written. It is mandatory before any larger import.

## Sync batches

- `--limit` is required and must be one of `10`, `50`, `100`, `500`.
- Default safety maximum: 100. `PROVIDER_SYNC_MAX` raises it, up to an absolute maximum of 500.
- Any batch above 100 also needs `--confirm-large`.
- Above 100 the client fans out: the newest list plus one query of 100 per category, deduplicated by id. The feed ignores `page` and `amount=all` is broken, so this is the only way to get more than one page.

## Popularity feeds and the plan workflow

The feed documents `popularity` = `newest`, `mostplayed`, `hotgames`, `bestgames`, `exclusivegames`, `editorpicks`, `branding`; there is no "trending" value, so `mostplayed` stands in for Trending. `amount=All` returns the whole feed (mostplayed and editorpicks ~5000 items, bestgames ~1700, hotgames ~2200).

The initial catalog is built from a snapshot, on the operator machine only:

```bash
GAMEMONETIZE_FEED_ENABLED=true npm run provider:plan:gamemonetize -- --target 500 --out plan.json   # no DB access
npm run provider:dryrun:gamemonetize -- --source plan --plan-file plan.json --offset 0 --limit 100
npm run provider:sync:gamemonetize   -- --source plan --plan-file plan.json --offset 0 --limit 100
```

- `--target` is 1-1000 (default 500). Groups, in priority order: trending ← mostplayed (30%), best ← bestgames (30%), hot ← hotgames (20%), editors_pick ← editorpicks (20%). Each takes items in feed order, skipping ids and slugs already taken; the remainder is filled from mostplayed, bestgames, hotgames, editorpicks.
- `--source plan` syncs exactly entries [offset, offset + limit) through the normal pipeline. `--offset` is required (non-negative integer); limits, thumbnail probing and `--confirm-large` rules are unchanged.
- The snapshot prints counts per source and per provider category. The sync table adds a `source` column.

### Popularity storage (existing fields only)

| Field | Value |
|---|---|
| `trending` | the game is in the trending group |
| `featured` | never written by sync: a small editorial selection (12–24 games) set by hand |
| `popularity` | band by primary source (best 4000, hot 3000, trending 2000, editors_pick 1000) + `999 - (rank - 1)` |

A plan sync writes these for new and REVIEW games and also refreshes them on already PUBLISHED provider games (ranking is catalog metadata, not editorial content); name, slug, description and status are still never touched. Without plan metadata nothing changes.

## Technical duplicates

Slug or embed URL already owned by a different game (in the database or earlier in the same run) → `DUPLICATE_SLUG` / `DUPLICATE_EMBED`, severity error: the game is REJECTED, not written, and listed in the output.

## Thumbnail check (live sync)

- Checks HTTPS, allowed host, then a `GET` with `Range`: status 200/206, `image/*` content type and decodable dimensions.
- Unreachable thumbnail: `THUMBNAIL_UNREACHABLE` error (REJECTED). Width below 200 px: `THUMBNAIL_SMALL` warning.
- `--skip-image-check` disables it. Images still load remotely at runtime.

## Category mapping

Entries in `gamemonetize/config.ts` are either exact or approximate. An unknown category falls back to `casual` with a `CATEGORY_UNMAPPED` warning: the game stays in REVIEW and the sync never fails because of it.

## Editorial filters

`lib/providers/editorial.ts` adds `EDITORIAL_REVIEW_REQUIRED` warnings for:
- brand names in the title or tags;
- SEO-spam titles;
- instructions shorter than 25 characters;
- an approximate category;
- a description shorter than 60 characters;
- a title with unusual characters (emoji, symbols, repeated punctuation).

The brand list (`KNOWN_BRANDS`) matches whole words and avoids generic words (frozen, cars, sims).

Games are never auto-rejected by these filters. Publishing a game that carries them requires `--ack-editorial` after a human review.

# 7. Publishing

The only way a provider game becomes public:

```bash
npm run provider:review [-- --status REVIEW|PUBLISHED|ARCHIVED|DRAFT|all] [--issues] [--provider x]
npm run provider:publish -- --slug <slug> | --id <n> | --ids a,b [--ack-editorial]   # REVIEW → PUBLISHED
npm run provider:archive -- --slug <slug> | --id <n> | --ids a,b                     # take a game offline
```

- Publish accepts at most 100 games per call; there is no publish-all.
- After publish or archive the CLI calls the revalidation endpoint (see `docs/13_DEPLOYMENT.md`), so no redeploy is needed.

`publishGame` refuses a game when:
- its status is not `REVIEW`;
- the last sync rejected it;
- it is a `fixture-*` mock;
- its embed or thumbnail is outside the allowlist.

# 8. Scripts

| Script | Purpose |
|---|---|
| `npm run provider:dryrun:gamemonetize` | Dry run, fixtures, limit 20 |
| `npm run provider:sync:gamemonetize` | Sync fixtures into REVIEW (`-- --limit N`) |
| `npm run provider:plan:gamemonetize -- --target 500 --out plan.json` | Build a popularity snapshot (live feed, no DB) |
| `... -- --source plan --plan-file plan.json --offset N` | Sync a slice of the snapshot |
| `... -- --source live` | Use the real feed (requires `GAMEMONETIZE_FEED_ENABLED=true`) |
| `npm run provider:review` | Read-only review table |
| `npm run provider:publish -- --slug <slug>` | Publish reviewed games (`--slug`, `--id`, `--ids`; `--ack-editorial`) |
| `npm run provider:archive -- --slug <slug>` | Archive games (`--slug`, `--id`, `--ids`) |
| `npm test` | Mapper, validator, allowlist, embed gate and sync helper tests |

# 9. Environment

```env
GAMEMONETIZE_FEED_ENABLED=false   # allow live feed requests
GAME_EMBEDS_ENABLED=false         # render real iframes; also drives CSP/Permissions-Policy (build-time)
PROVIDER_SYNC_MAX=100             # optional, default 100, absolute max 500
```

`GAMEMONETIZE_API_KEY` from `.env.example` is not used: the documented feed needs no key.

# 10. Before connecting the real feed

1. Confirm GameMonetize publisher registration and terms for gametroz.online. A public feed is not the same as permission to publish.
2. Run `--source live --dry-run --limit 10` and compare the real items against the validation report.
3. Review the category mapping with the real categories.
4. Decide how fixture records are cleaned up. They stay in REVIEW and can never be published.
5. Approve CSP, iframe sandbox and the `GAME_EMBEDS_ENABLED` rollout plan.
6. Only then raise `MAX_SYNC_LIMIT` (Phase 5), with an explicit decision.

# 11. Adding GameDistribution later

Create `lib/providers/gamedistribution/` with the same files as `gamemonetize/`, implement `GameProvider`, add its hosts to `hosts.ts` and `next.config.ts`, and register it in `registry.ts`. The sync service, publish flow, catalog and pages stay unchanged.
