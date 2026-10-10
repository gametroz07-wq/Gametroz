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
- T2 Spanish locale with `hreflang`, delivered as slices. Decisions (owner, 2026-10-09): provider game descriptions are translated too; slices are stacked pull requests to `main`, with `/es` hidden behind a build-time switch until complete.
  - Design: all pages move under `app/[lang]`. `proxy.ts` rewrites unprefixed paths to the `en` segment internally so English URLs stay unchanged, redirects an explicit `/en/...` to the unprefixed URL, and serves `/es/...` only when `NEXT_PUBLIC_SPANISH_ENABLED` is exactly `true` (otherwise 404).
  - [x] T2.1 Locale routing foundation (`feat/es-locale-routing`, commits `a194304`, `468c78c`): locale config and path helpers with tests, `proxy.ts`, pages under `app/[lang]`, `<html lang>` per locale, switch documented. No copy translated.
    - Evidence (writer): observed RED then GREEN; `npm test` 673 pass, lint and typecheck clean; 36-URL before/after comparison with the switch off, 31 identical including a byte-identical 698-URL sitemap; the 5 differences are 404 pages that keep status 404 but lose `<html lang>` (and `<title>` for `/api/nope` and `/foo.js`); switch-on build serves `/es/...` with `lang="es"` and `noindex, nofollow`; on-demand revalidation checked on a running server with the `/en/...` destination paths.
    - Evidence (parent, production build with the switch off): `npm test` 673 pass; 13 English pages return 200 with `lang="en"`, `index, follow` and unprefixed canonicals; no `/en/` in hrefs, canonicals, JSON-LD or flight payloads; `/en...` returns 308 to the unprefixed URL with the query kept; `/es`, `/es/games`, `/fr/games`, `/ES/games`, `/esports` and unknown URLs return 404; navigation data requests resolve to a 200 `text/x-component` response; security headers present on pages, proxy redirects and 404s; sitemap has 698 URLs and none under `/en/` or `/es`.
    - Risk tier: unassessable, treated as high. The independent verifier stalled without a verdict, so the parent ran the runtime checks above instead. Not re-verified by the parent: the switch-on build and the revalidation endpoint.
    - Decisions: no `dynamicParams = false` on the layout (it made non-prerendered games 404); a catch-all `app/[lang]/[...rest]` keeps the branded 404; the proxy matcher skips any path whose last segment has a dot (no sitemap URL has one). `/es` pages canonicalize to the English URL until T2.4.
    - Rollback: reverting `468c78c` restores the previous `app/` tree and removes `proxy.ts`; `a194304` is inert alone.
    - Route: delegated direct (writer trigger: routing tree, proxy, config, docs, tests).
    - Acceptance: with the switch off, every English URL returns the same status, title and canonical as before and `/es/...` returns 404; with it on, `/es/...` renders with `lang="es"`.
    - Checks: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, before/after comparison of a sample of English URLs.
  - [ ] T2.2 Locale-aware internal links and navigation (central href helper, nav, breadcrumbs, search form, `usePathname` checks).
  - [ ] T2.3 UI dictionary: shared chrome, page-level copy, not-found.
  - [ ] T2.4 SEO: localized templates, metadata `alternates.languages`, sitemap alternates, robots rule for `/es/search`, JSON-LD `inLanguage`, `llms.txt`.
  - [ ] T2.5 Legal and static pages in Spanish.
  - [ ] T2.6 Tools in Spanish (30 definitions and workspace labels); may need more than one pull request.
  - [ ] T2.7 Apps in Spanish (105 definitions); may need more than one pull request.
  - [ ] T2.8 Guides in Spanish (29 guides); may need more than one pull request.
  - [ ] T2.9 Game translations: schema migration, one-off translation script, localized reads and search. Open decision: translation service and credentials.
  - [ ] T2.10 Enable the switch, revalidation paths for `/es`, live verification.

## Delivery

- Strategy: `ask-on-risk`. Chain strategy: `stacked-to-main` (owner, 2026-10-09).
- T1: one pull request from `feat/ga4-analytics`, merged as #1 (`975b5dc`). Commits `8a05b96`, `2979ebc`, `bac6a08`.
- T2: one pull request per slice, each branched from updated `main`. Content slices (T2.6 to T2.8) are mostly translated text and will exceed 400 lines; they are split by content group and any remaining overage is reported as a `size:exception`.

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

- 2026-10-09: T1 live. Pull request #1 merged; the production home page loads gtag with the owner's measurement ID and `/privacy` shows the Google Analytics disclosure. Data arrival in the GA4 property is the owner's to confirm.

## Next step

Owner opens and merges the T2.1 pull request, then T2.2 starts from updated `main`.
