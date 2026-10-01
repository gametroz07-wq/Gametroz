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
- Category mapping lives in `gamemonetize/config.ts`. Unmapped categories (3D, AI, 2 Player, Multiplayer…) are rejected until a mapping is added.

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
| Category mapped and present in the DB | CATEGORY_UNMAPPED | REJECTED |
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
  - `GAME_EMBEDS_ENABLED=true` **and** the URL passes the provider allowlist.
  - `sandbox="allow-scripts allow-same-origin allow-pointer-lock"`. The game runs on its own origin, never Gametroz's, and gets no popups, top navigation, forms or downloads.
  - `allow="fullscreen; gamepad; autoplay"`, `referrerpolicy="strict-origin-when-cross-origin"`, `loading="lazy"`.
- **Recommended CSP** for the phase that enables embeds (not applied yet):

```text
frame-src https://html5.gamemonetize.co;
img-src 'self' data: https://img.gamemonetize.com;
```

  Before enabling it, test that the CSP does not break `next/script`, the theme script or the ads phase.

# 6. Sync service

`syncProviderGames(provider, { prisma, limit, dryRun })`:

1. Upserts the `Provider` row (created with `enabled=false`) and starts an `ImportRecord`.
2. Fetches at most `limit` games. **The limit is capped at 20 during Phase 4**; anything above throws.
3. Deduplicates by provider id.
4. Validates and normalizes, then checks slug collisions against the database and the current batch.
5. Upserts by `(providerId, providerGameId)`:
   - **New** games are created in `REVIEW`.
   - **Existing** games only get provider-owned fields refreshed (embed, thumbnail, size, orientation, validation). Name, slug, description and status are never overwritten. A rejected refresh only records the problem.
6. Closes the `ImportRecord` with received, created, updated, ignored, rejected, needsReview, failed and per-item logs.

**Dry run** (`dryRun: true`): same pipeline and report, and an `ImportRecord` flagged `dryRun`, but no game is written. It is mandatory before any larger import.

# 7. Publishing

The only way a provider game becomes public:

```bash
npm run provider:review                      # list provider games, validation and recent imports
npm run provider:publish -- --slug <slug>    # REVIEW → PUBLISHED
npm run build                                # pages are static: rebuild to show it
```

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
| `... -- --source live` | Use the real feed (requires `GAMEMONETIZE_FEED_ENABLED=true`) |
| `npm run provider:review` | Read-only review table |
| `npm run provider:publish -- --slug <slug>` | Publish one reviewed game |
| `npm test` | Mapper, validator, allowlist, embed gate and sync helper tests |

# 9. Environment

```env
GAMEMONETIZE_FEED_ENABLED=false   # allow live feed requests
GAME_EMBEDS_ENABLED=false         # render real iframes (build-time for static pages)
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
