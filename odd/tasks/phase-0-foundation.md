# Phase 0 — Foundation

**Objective:** project base for Gametroz (Next.js + TS + Tailwind + shadcn/ui), layout, metadata, scripts, placeholder home.
**Scope:** Phase 0 only. No providers, DB, analytics, ads, or final section pages.
**TDD:** not configured for this project (no test runner yet); functional checks = lint, typecheck, build.
**Route:** direct inline (scaffold is generated; hand-written files are small and mechanical).

## Tasks

- [x] T1 Read docs and move them to `docs/`
- [x] T2 Scaffold Next.js 16 + TS + Tailwind 4 + ESLint
- [x] T3 Initialize shadcn/ui (Radix base)
- [x] T4 Folder structure, scripts (`lint`, `typecheck`, `build`)
- [x] T5 Global metadata, palette tokens, layout, header, footer, home placeholder
- [ ] T6 `.env.example` — blocked by local permission deny on `.env*`
- [x] T7 README + STATUS.md

## Verification

- lint: PASS (exit 0)
- typecheck: PASS (exit 0)
- build: PASS
- Smoke test: served HTML has `class="dark"`, `noindex, nofollow`, canonical, SVG icon; no `X-Powered-By`.

## Notes

- No git repo, so no work-unit commits were made. Engram mirror pending (server unavailable this session).

## Next step

Await user approval for Phase 1 — Design System.
