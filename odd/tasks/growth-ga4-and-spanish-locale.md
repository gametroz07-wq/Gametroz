# Growth: GA4 analytics and Spanish locale

## Objective

Give Gametroz measurable traffic data and a Spanish-language version so it can rank in a less competitive market.

## Problem

- The live site is indexable (698 sitemap URLs, `index, follow`) but Search Console shows 14 impressions per week at average position 44.
- There is no analytics: `NEXT_PUBLIC_GA_ID` is declared in `render.yaml` and `.env.example` but no code reads it.
- The site is English only (`lang="en"`, no locale routes, no `hreflang`), competing against the largest game portals.

## Why

Without analytics every later growth decision is blind. Spanish search has far less competition for browser-game queries and matches the audience that already monetizes for the owner.

## Scope

- T1: GA4 page-view tracking, gated by `NEXT_PUBLIC_GA_ID`.
- T2: Spanish locale with `hreflang` alternates. Sliced after the content-scope decision.

Out of scope: tag landing pages, per-game editorial content, PWA, favorites persistence.

## Constraints

- Next.js 16.3.8 with breaking changes: read `node_modules/next/dist/docs/` before using any Next API.
- Strict TDD (source: user global configuration). Runner: `npm test` (`tsx --test "lib/**/*.test.ts"`).
- Checks: `npm test`, `npm run lint`, `npm run typecheck`.
- Conventional commits, no AI attribution lines.
- Receipt-driven development: off (decided by global), so no native review runs.
- Existing English URLs must not change.

## Tasks

- [x] T1 GA4 page-view tracking gated by `NEXT_PUBLIC_GA_ID` (commits `8a05b96`, `2979ebc`)
  - Route: delegated direct (writer trigger: config module, CSP headers, layout, docs, tests).
  - Acceptance: no GA script and unchanged CSP when the ID is unset or malformed; with a valid `G-` ID the gtag script loads after interactive and the CSP allows only the Google Analytics origins it needs; privacy page discloses Google Analytics; deployment doc updated.
  - Checks: `npm test`, `npm run lint`, `npm run typecheck`.
- [ ] T2 Spanish locale with `hreflang`
  - Blocked on a product decision: how far provider game descriptions get translated.
  - To be split into slices (routing, UI dictionary, metadata and sitemap alternates, content) once decided.

## Delivery

- Strategy: `ask-on-risk`.
- T1 forecast: about 200 authored changed lines, one pull request from `feat/ga4-analytics`.
- T2 forecast: well above 400 lines; chain strategy to be chosen before its first commit.

## Progress

- 2026-10-09: feature document created, branch `feat/ga4-analytics` cut from `a647cc4`.
- 2026-10-09: T1 done. `8a05b96` adds the feature (9 files, +151/-13); `2979ebc` switches the GA4 scripts from `lazyOnload` to `afterInteractive` so short visits are counted.

## Verification evidence

T1:

- Writer: observed RED then GREEN for the config and CSP tests; `npm test` 651 pass, `npm run lint` clean, `npm run typecheck` clean.
- Parent spot check: `npm test` 651 pass, 0 fail; `npm run lint` clean after `2979ebc`.
- Risk tier: unassessable (untracked `.atl/` and `.env.example` need an explicit declaration), treated as high. Receipt-driven development is off, so no native review ran.
- Independent verifier: pass with notes. `npm run build` succeeds with and without `NEXT_PUBLIC_GA_ID`; the CSP is byte-identical to `a647cc4` when analytics is off across all flag combinations; with a valid ID the built HTML contains the gtag script and the disclosure.
- Not verified: live GA4 delivery, and page views on client-side navigation, which rely on the GA4 enhanced-measurement history setting staying enabled.

Open notes from T1:

- No consent mechanism exists; none was built. EU visitors are not asked for consent.
- The CSP wildcards do not match the bare apex hosts `google-analytics.com` and `analytics.google.com`; this follows Google's own CSP guidance.
- `render.yaml` now declares `NEXT_PUBLIC_GA_ID` with `sync: false`; the value must be set in the Render dashboard, followed by a redeploy.

## Next step

Owner sets `NEXT_PUBLIC_GA_ID` in Render and redeploys. T2 waits for the content-scope decision.
