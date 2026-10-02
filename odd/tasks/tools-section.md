# Tools section: 30 real browser tools

## Objective
Turn /tools into a real, useful, SEO-ready section: 30 working tools, no mocks, indexing still OFF.

## Problem (audit 2026-10-01)
- 16 published tools; only 3 working components (word-counter, json-formatter, percentage-calculator).
  Image tools use a fake dropzone ("Preview mode"); 7 tools render an "is being built" placeholder.
- Generic templated metadata, no og:image, no JSON-LD anywhere, no examples/FAQ, no app/sitemap.ts.
- Tool routes are fully static (`dynamicParams = false`, no revalidate).
- Search matches tool name/slug/shortDescription/category/tags, not description.

## Decisions
- No Prisma schema change. Code is the source of truth for tools: `lib/tools/definitions.ts` holds every tool
  (catalog fields + long-form content: intro, examples, FAQ, meta title/description). A `tools:sync` script
  (dry run by default) upserts Tool/ToolCategory rows from it and ARCHIVES published tools not defined (never deletes).
  The seed derives tool data from the same definitions.
- componentKey = tool slug; a client registry maps it to the tool component.
- Tool logic lives in pure functions under `lib/tools/` with node:test unit tests (strict TDD); components are thin.
- Everything runs client-side ("Processed locally in your browser."); nothing is stored or sent.
- Sitemap: `app/sitemap.ts` includes tools but returns no URLs while NEXT_PUBLIC_INDEXING_ENABLED=false.
- JSON-LD: BreadcrumbList + WebApplication on tool pages; FAQPage only when the FAQ is rendered.
- Archived (not deleted): merge-pdf, pdf-to-jpg (heavy libs), meta-title-preview, unit-converter (split into 4).
- Not built: HTML/CSS/JS minifiers (need large libraries to be correct), separate JSON Validator (merged).
- Production data sync + push happen only after user approval.

## Final catalog (30)
- Text (7): word-counter, character-counter, case-converter, remove-duplicate-lines, remove-extra-spaces, text-sorter, slug-generator
- Developer (5): json-formatter, base64-encoder-decoder, url-encoder-decoder, timestamp-converter, hash-generator
- Generators (4): uuid-generator, password-generator, random-number-generator, qr-code-generator
- Calculators (6): percentage-calculator, discount-calculator, age-calculator, date-difference-calculator, bmi-calculator, tip-calculator
- Converters (4): length-converter, weight-converter, temperature-converter, data-storage-converter
- Images (4): image-compressor, image-resizer, png-to-jpg, webp-to-jpg

## Tasks
- [x] T1 Foundation: definitions + sync script + seed, routes ISR, registry, shared UI, JSON-LD, content blocks, /tools page, sitemap, search.
- [x] T2 Text tools (7): character-counter, case-converter, remove-duplicate-lines, remove-extra-spaces, text-sorter, slug-generator (word-counter from T1).
- [x] T3 Developer (5) + Generators (4): base64-encoder-decoder, url-encoder-decoder, timestamp-converter, hash-generator, uuid-generator, password-generator, random-number-generator, qr-code-generator (json-formatter from T1).
- [ ] T4 Calculators (6) + Converters (4).
- [ ] T5 Image tools (4).
- [ ] T6 Local data sync (Docker), full checks, responsive 375/768/1440, report. Production sync + push after approval.

## Checks
TDD: strict (session config), runner `npm test`. Per task: npm test, lint, typecheck. Final: + prisma validate, build.

## Progress
- Branch: feat/tools-section (from main 1db519c).
- Engram mirror: pending (Engram MCP unavailable this session).

### T1 evidence
- RED: `npm test` failed with 9 test files (missing modules) before implementation; GREEN: 195 tests pass after.
- Verified: npm test, npx prisma validate, npm run lint, npm run typecheck. `tools:sync` dry run against local Docker DB only:
  1 category create, 5 update; 3 tool updates; 13 published tools would be ARCHIVED (needs --confirm-archive).
- Not applied anywhere; apply only at T6 once the full catalog is defined (the 13 archives shrink as T2-T5 land).
- Seed note: guides reference tools not yet defined (image-compressor, image-resizer, webp-to-jpg, base64-encoder-decoder,
  discount-calculator), so a seed on an empty DB fails until T3-T5 define them.
- Engram mirror: still pending.

### T2 evidence
- RED: `npm test` showed 6 failing test files (missing modules character-count, case-convert, duplicate-lines, extra-spaces, text-sorter, slug) with 195 passing; GREEN: 250 tests pass (adds example-vs-logic tests and definitions invariants for the 7 text tools).
- Verified: npm test (250 pass), npm run lint (clean), npm run typecheck (clean).
- Route: delegated direct, single writer. Not committed (left for the orchestrator).
- Decisions: Intl.Segmenter graphemes with code point fallback; "Ignore empty lines" in dedupe leaves blank lines untouched; slug drops non-Latin text and says so; shuffle uses crypto.getRandomValues (unbiased) and re-draws only on request.
- Engram mirror: still pending.

### T3 evidence
- RED: `npm test` showed 9 failing test files (missing modules base64, url-codec, timestamp, hash, random, uuid, password, random-number, qr) with 250 passing; after the logic, the examples/definitions tests failed (10 failures) until the definitions existed, and the toDateTimeInputValue tests failed until it was added. GREEN: 351 tests pass.
- Verified: npm test (351 pass), npm run lint (clean), npm run typecheck (clean). qrcode toDataURL/toString smoke-checked in node.
- Dependency: qrcode ^1.5.4 (MIT), @types/qrcode (dev). Loaded with a dynamic import inside the QR workspace only.
- Route: delegated direct, single writer. Not committed (left for the orchestrator).
- Decisions: shared unbiased RNG in lib/tools/random.ts (rejection sampling) used by password, random numbers, shuffle; hash tool states MD5 is not offered and SHA-1 is not for security; passphrase mode skipped; password-generator set featured (4 featured total; the explorer shows at most 4); new ToolSegmented control in ui/tool-options.tsx; timestamp zone read via useSyncExternalStore to avoid hydration mismatch.
- Engram mirror: still pending.
