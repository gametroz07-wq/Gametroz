# Phase 2 — Static UX Prototype

**Objective:** build every main page with mock data to validate navigation and UX before connecting PostgreSQL, Prisma or providers.
**Scope:** Phase 2 only. No DB, providers, ads, analytics, external APIs, real iframes, real downloads or i18n.
**TDD:** not configured (no test runner). Functional checks: lint, typecheck, build, a production link crawl and headless browser checks.
**Route:** direct inline. The writer trigger fired (many non-trivial files); the work stayed inline to keep one consistent design context. Recorded so the deviation is visible.

## Tasks

- [x] T1 Content types, mock data (30 games, 16 tools, 16 apps, 10 guides) and the `lib/catalog.ts` data layer
- [x] T2 Mock SVG assets: one thumbnail per game, one icon per app
- [x] T3 Shared components: Breadcrumbs, PageHeader, PageSection, CardGrid, Rail, ChipNav, LoadMore, TagList, metadata helper
- [x] T4 Home
- [x] T5 Games: listing, category, detail (GamePlayerPlaceholder, GameActions, GameControls)
- [x] T6 Tools: listing, category, detail (4 workspaces plus a fallback)
- [x] T7 Apps: listing, platform, detail (icon, facts, screenshots, official download, alternatives)
- [x] T8 Guides: listing, section, detail (structured body, related content)
- [x] T9 Search page with tabs and the 404 with useful links
- [x] T10 Validation: crawl, overflow, console, end-to-end, responsive
- [x] T11 STATUS.md
- [x] T12 Closing pass: `/privacy`, `/terms` and `/contact` pages, centralized `siteConfig.contactEmail`, shared `LegalDocument` layout

## Verification

- lint: PASS (exit 0). typecheck: PASS (exit 0). build: PASS (exit 0).
- Crawl of 224 internal URLs: 0 broken links (after T12).
- Legal pages: title, description and canonical present; global noindex kept; footer navigation verified; no overflow; clean console.
- Overflow: none on 22 routes × 4 widths. Console: clean.
- `/design-system`: 404 in production.

## Notes

- Fixed during the phase: the trending grid ended on a ragged row (it now tops up with popular games); titles baked into the mock thumbnails clashed with the feature-card overlays (removed); the placeholder icon wrapped badly on narrow portrait players.
- Environment: on Windows, TaskStop did not kill the `next start`/`next dev` child processes; stale servers kept ports busy and served an old build (false 500s). They were killed by PID before the final run.
- No git repository, so no work-unit commits. Engram mirror pending (server unavailable).

## Next step

Phase 2 approved and closed. Do not start Phase 3 — Database until the user gives explicit approval.
