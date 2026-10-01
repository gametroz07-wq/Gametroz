# Phase 3 — Database

**Objective:** replace the mock data layer with PostgreSQL and Prisma while keeping the `lib/catalog.ts` public API and every page unchanged.
**Scope:** Phase 3 only. No game providers, ads, analytics, scraping, cron jobs, downloads, iframes or i18n.
**TDD:** not configured (no test runner). Functional checks: prisma validate/format, lint, typecheck, build, a parity diff against the Phase 2 build, a link crawl and browser checks.
**Route:** direct inline. The writer trigger fired; the work stayed inline to keep one data-model context. Recorded so the deviation is visible.
**Database:** Docker `postgres:17-alpine` on port 5436 (chosen by the user over the local PostgreSQL 17 service on port 5435).

## Tasks

- [x] T1 Install Prisma 7.10.0, `@prisma/adapter-pg` and `pg`; approve the `@prisma/engines`, `prisma` and `esbuild` install scripts (npm 11 blocks them by default)
- [x] T2 `prisma/schema.prisma` + `prisma.config.ts`; validate, format and generate
- [x] T3 `lib/db/prisma.ts` singleton with a loud error when `DATABASE_URL` is missing
- [x] T4 Move the mocks to `prisma/seed-data/`; write the idempotent `prisma/seed.ts`
- [x] T5 Rewrite `lib/catalog.ts` on Prisma (same signatures) with `lib/db/mappers.ts`
- [x] T6 `docker-compose.yml`; apply migration `20261001182350_init`; seed twice
- [x] T7 Parity diff, crawl, browser checks and failure-mode checks
- [x] T8 STATUS.md and README

## Verification

- prisma validate: valid. prisma format --check: formatted.
- lint, typecheck, build: PASS (exit 0).
- Seed run twice: identical counts (30 games, 16 tools, 16 apps, 10 guides, 162 tags, ...).
- Parity: a baseline was captured from the Phase 2 mock build before the switch; after the switch 15/17 pages are identical and 2 differ only in tag order.
- Crawl: 224 URLs, 0 broken. Unknown slugs: 404. Overflow: none. Console: clean.
- No `DATABASE_URL`: the build fails with the explicit message. Database stopped: `/search` returns 500 with the error logged.

## Notes

- Bug found by the parity test: the home "Useful tools" section filtered by object identity, so with database rows it listed every tool. Fixed to compare by slug.
- Tag order is now alphabetical (many-to-many without a position). Accepted and documented.
- `.env` files cannot be written by the assistant (permission rule), so every command received `DATABASE_URL` as an environment variable.
- No git repository, so no work-unit commits. Engram mirror pending (server unavailable).

## Next step

Await user approval for Phase 4 — Game Provider Layer.
