# Phase 4.5 — Preview Deployment

**Objective:** publish a working, non-indexed preview at https://gametroz.online using Cloudflare → Render → Neon, so the site can be registered with GameMonetize.
**Scope:** deployment only. No indexing, ads, analytics, live feeds, iframes, cron jobs or mass imports. No Vercel, no Supabase.
**Remote model (user decision):** the user creates Neon, the Render Blueprint and the Cloudflare zone in their dashboards and enters secrets there; the assistant handles Git and production verification. No secret goes through the chat.
**TDD:** enabled; no new pure logic in this phase (config, route handler, docs). Checks: tests, prisma validate, lint, typecheck, build, local production checks.

## Tasks

- [x] T1 Neon strategy: pooled `DATABASE_URL` (runtime, `@prisma/adapter-pg`) + direct `DIRECT_URL` (migrations); `prisma.config.ts` prefers `DIRECT_URL`
- [x] T2 `/api/health` (200 ok / 503 degraded, `SELECT 1` with a 3 s timeout, no secrets, no-store)
- [x] T3 Security headers (CSP without nonces, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, frame-ancestors, X-Robots-Tag while not indexed); `frame-src 'none'` while embeds are off
- [x] T4 www → apex redirect at the origin (Cloudflare redirect rule documented as primary)
- [x] T5 `render.yaml` Blueprint, `.node-version` (22), build with `db:deploy` + guarded `db:seed:deploy` (`SEED_ON_DEPLOY`)
- [x] T6 Runbook `docs/13_DEPLOYMENT.md` (Neon, Render, Cloudflare, variables, cache, TLS, verification)
- [x] T7 Local validation: tests 27/27, prisma validate, lint, typecheck, build; local prod: headers, health ok/503/recovery, www 308, CSP with clean console, crawl 0 broken, parity 17/17
- [x] T8 Git: `git init`, `.gitattributes` (LF), initial commit `e111e14` (`.env.example` excluded: the assistant cannot read it, so it cannot verify it holds no secrets)
- [ ] T9 Push to GitHub — **blocked**: the local `gh` session fails to authenticate (account `preoperacionaseguridadvial-crypto`)
- [ ] T10 Neon project + connection strings (user, dashboard)
- [ ] T11 Render Blueprint deploy with secrets and `SEED_ON_DEPLOY=true` on the first deploy (user, dashboard)
- [ ] T12 Cloudflare zone, DNS only → verify in Render → proxied, Full (strict), redirect rule (user, dashboard)
- [ ] T13 Production verification (assistant)

## Next step

The user re-authenticates `gh` with the intended GitHub account and creates an empty private repository; then the assistant pushes `main`.
