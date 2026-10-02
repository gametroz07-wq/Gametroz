# GameMonetize initial catalog (500 real games)

## Objective
Replace the 30 seed/mock games with an initial catalog of ~500 real GameMonetize games selected by
popularity, quality and variety, using the existing sync → review → publish → revalidate pipeline.

## Constraints
- Production DB (Supabase) through `scratchpad/prod-env.mjs`. No schema change. No Tools/Apps/Guides,
  Adsterra, Analytics, indexing, cron, GameDistribution, Famobi, infra changes. Seed games are archived, never deleted.
- Batches of 100 (dry run → sync → verify). Publish only explicit `--ids`, max 100 per command.
- TDD: strict (session config), runner `npm test` (`tsx --test "lib/**/*.test.ts"`).

## Feed facts (verified 2026-10-01 against https://gamemonetize.com/rss-builder)
- Endpoint: `https://gamemonetize.com/rssfeed.php?format=json&category=All&type=html5&popularity=<p>&company=All&amount=<n>`.
- Documented `popularity`: newest, mostplayed, hotgames, bestgames, exclusivegames, editorpicks, branding.
  There is NO "trending" value: `mostplayed` (the only real popularity ranking) is used as Trending.
- Documented `amount`: 10, 20, 30, 40, 100, All. `All` (capital A) works: mostplayed 5001, bestgames 1659,
  hotgames 2166, editorpicks 5001 items. `bestgames`, `hotgames`, `editorpicks` are curated sets sorted newest first.

## Popularity storage (existing fields only)
- `trending = true` when the game is in the Trending (mostplayed) group.
- `featured = true` when the game is in Editors' Picks.
- `popularity` band by primary source: best 4000+, hot 3000+, trending 2000+, editors_pick 1000+ (plus rank inside the band).
  Popular Games (by popularity) therefore surfaces Best/Hot; Trending Now uses the trending flag.
- New Games: `publishedAt`; publish batches in ascending provider id so newer games get later timestamps.

## Tasks
- [ ] T1 (delegated writer) Plan builder + snapshot script, plan-based sync with popularity metadata,
      Fighting mapping, expanded brand/editorial checks, technical duplicate rejection. Tests first.
- [ ] T2 (delegated writer) Home Action section; bound build-time prerender of game pages.
- [ ] T3 Build snapshot plan (500), 5 batches of dry run + sync, verify counts.
- [ ] T4 Classify (PUBLISHABLE / EDITORIAL_REVIEW_REQUIRED / REJECTED), top up if < 450 publishable.
- [ ] T5 Publish PUBLISHABLE in ≤100 batches (ascending ids).
- [ ] T6 Archive the 30 seed games once ≥ 400 real games are PUBLISHED (Halloween Fighters excluded).
- [ ] T7 Verify home, categories, search, 20 playable games, thumbnails; run full checks.

## Progress
- Pre-change audit (prod): 40 games, 31 PUBLISHED (30 seed + halloween-fighters), 9 REVIEW, 0 ARCHIVED.
- A 50-game sync (newest) ran before this plan: 40 created + 10 updated, all REVIEW, 0 rejected.
- Engram mirror: pending (Engram MCP unavailable this session).
