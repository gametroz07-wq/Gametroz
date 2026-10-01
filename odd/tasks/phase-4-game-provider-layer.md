# Phase 4 — Game Provider Layer

**Objective:** a safe, provider-agnostic integration layer (adapter, normalization, validation, controlled import, review, publication) with GameMonetize as the first provider, without scaling the catalog or enabling public iframes.
**Scope:** Phase 4 only. No GameDistribution, Famobi, ads, analytics, cron jobs, production, public iframes or mass imports.
**TDD:** enabled (session configuration). Runner: `node:test` via `tsx --test` (`npm test`); no new dependency.
**Route:** direct inline. The writer trigger fired; the work stayed inline to keep the security model in one context. Recorded so the deviation is visible.

## Tasks

- [x] T1 Check the GameMonetize feed docs: endpoint and params from the public RSS builder; item fields observed once from the public feed (read-only)
- [x] T2 Schema: `ValidationStatus`, `Game.validationStatus / validationIssues / lastSyncedAt`, `ImportRecord.rejected / needsReview / dryRun / requestedLimit` (migration `20261001184228_provider_sync_fields`)
- [x] T3 Contracts (`lib/providers/types.ts`) and mock fixtures
- [x] T4 RED: security, mapper, validator and sync-helper tests failing (modules missing)
- [x] T5 GREEN: security, text, validation, GameMonetize config/mapper/validator/client/provider, sync → 24/24
- [x] T6 REFACTOR: dedicated `WRITE_FAILED` code; tests still green
- [x] T7 Registry, `publishGame`, CLI scripts (sync, dry run, review, publish)
- [x] T8 RED → GREEN: `resolveEmbedUrl` embed gate (`lib/providers/embed.ts`) → 27/27; `GameEmbed` + `GamePlayer` behind `GAME_EMBEDS_ENABLED`
- [x] T9 Dry run, fixture sync, re-sync, guardrails, publish happy path (rolled back), site checks
- [x] T10 Docs: `docs/12_GAME_PROVIDERS.md`, STATUS.md

## Verification

- prisma validate: valid; format: clean. lint, typecheck, build: PASS. npm test: 27/27.
- Dry run (limit 20 of a 22-item mock feed): received 20, would create 13, rejected 6, ignored 1, needs review 2; 0 games written.
- Fixture sync: 13 created, all REVIEW (11 VALID, 2 NEEDS_REVIEW). The re-run updated 13 and created 0. Published games stay at 30.
- Guardrails: limit 21 refused; fixture publish refused; live feed refused without the flag.
- Publish happy path inside a rolled-back transaction: REVIEW → PUBLISHED with publishedAt, second publish refused, nothing left behind.
- Site: 17/17 parity pages identical to Phase 3, crawl 0 broken, fixture slugs 404, search does not find fixtures, no `<iframe>` rendered, no overflow, clean console.

## Notes

- Prisma 7 does not regenerate the client after `migrate dev`; `npm run db:generate` is needed after schema changes.
- The user must add `GAMEMONETIZE_FEED_ENABLED=false` and `GAME_EMBEDS_ENABLED=false` to `.env.example` (the assistant cannot write `.env*`).
- No git repository, so no work-unit commits. Engram mirror pending (server unavailable).

## Next step

Await user approval for Phase 5 — Game Catalog MVP. A live dry run and the publisher terms come first.
