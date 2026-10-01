# Current phase

**Phase 4 — Game Provider Layer** (complete, awaiting approval)

Phases 0–3 approved. Phase 5 (catalog import) has not started. Full design: `docs/12_GAME_PROVIDERS.md`.

## Completed

### Provider layer (`lib/providers/`)
- Contracts: `GameProvider<TRaw>` (getGames, getGame, getId, normalize, validate), `NormalizedGame`, `ValidationResult` (VALID / NEEDS_REVIEW / REJECTED), `SyncResult`.
- GameMonetize adapter: `config`, `types`, `client`, `mapper`, `validator`, `provider`, `fixtures`.
  - Endpoint and params come from the public RSS builder. Item fields were observed once in the public feed (no API key needed).
  - The live feed stays off unless `GAMEMONETIZE_FEED_ENABLED=true`. The default source is the local mock fixtures (`fixture-*` ids).
- Normalization to Gametroz fields; imported games always start in `REVIEW`.
- Validation: ids, name, slug, duplicates (feed and slug), HTTPS + allowlisted thumbnail and embed, mapped category, size 200–4096 px, description ≥ 40 characters, instructions.
- Security:
  - Allowlist: exact host, HTTPS only (`html5.gamemonetize.co` embeds, `img.gamemonetize.com` images).
  - No `dangerouslySetInnerHTML`; provider HTML is stripped.
  - `GameEmbed` uses a sandboxed iframe behind `GAME_EMBEDS_ENABLED=false`. The recommended CSP is documented, not applied yet.
- Sync service `syncProviderGames`: ImportRecord → fetch → dedupe → validate/normalize → upsert by `(providerId, providerGameId)` → counts → close.
  - Supports `dryRun`, and the limit is hard-capped at 20.
  - Existing games only get provider-owned fields refreshed; status and editorial text are never overwritten.
- Explicit publication: `publishGame` (REVIEW → PUBLISHED) refuses fixtures, rejected games and non-allowlisted URLs. Sync never publishes.
- Scripts: `provider:dryrun:gamemonetize`, `provider:sync:gamemonetize`, `provider:review`, `provider:publish`, `test`.
- Schema: migration `20261001184228_provider_sync_fields` (validation fields on `Game`; rejected, needsReview, dryRun, requestedLimit on `ImportRecord`).
- The game page now renders `GamePlayer`. It shows the placeholder unless embeds are enabled and the URL is allowlisted.

## Validation

- prisma validate: valid. lint: PASS. typecheck: PASS. build: PASS. `npm test`: 27/27 (TDD: RED observed before every implementation).
- Dry run, limit 20 of a 22-item mock feed: 20 received, 13 would be created, 6 rejected, 1 ignored, 2 needing review. No game written.
- Fixture sync: 13 games created in REVIEW. The re-run updated 13 and created 0. Published games are still 30.
- Guardrails verified: limit 21 refused; fixture publish refused; live feed refused without its flag; the publish happy path works (tested in a rolled-back transaction).
- Public site unchanged: parity 17/17 vs Phase 3, 0 broken links, REVIEW slugs return 404, search does not return them, no iframe rendered.

## Pending

- Add to `.env.example`: `GAMEMONETIZE_FEED_ENABLED=false` and `GAME_EMBEDS_ENABLED=false` (the assistant cannot write `.env*`).
- Before the real feed: confirm GameMonetize publisher terms, run a live dry run (≤ 20) and review the category mapping.
- The 13 fixture games stay in the local database as REVIEW. They can never be published and can be deleted at any time.
- GameDistribution: architecture ready, not implemented.
- No git repository yet.

## Next

- Phase 5 — Game Catalog MVP (awaiting approval; first a live dry run with at most 20 games).
