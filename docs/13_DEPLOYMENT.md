# 13 — Preview Deployment (Cloudflare → Render → Neon)

Production architecture for the first public preview of https://gametroz.online.

```text
Visitor ──HTTPS──► Cloudflare (DNS, proxy/CDN, TLS, www→apex) ──HTTPS──► Render Web Service (Next.js, Node 22)
                                                                              │ pooled TLS connection
                                                                              ▼
                                                                         Neon PostgreSQL
```

- **Local** development keeps using Docker PostgreSQL (`docker-compose.yml`, port 5436). Nothing in this document touches it.
- **Production** uses Neon only. Render's `DATABASE_URL` must never point anywhere else.
- Supabase and Vercel are out of scope.

---

# 1. Neon (production database)

1. Create a Neon project (PostgreSQL 17) named `gametroz` in the region closest to the Render service region.
2. In **Connect**, copy both connection strings for the `neondb` (or `gametroz`) database:
   - **Pooled** (hostname contains `-pooler`) → `DATABASE_URL`. The app uses it at runtime.
   - **Direct** (no `-pooler`) → `DIRECT_URL`. Only `prisma migrate deploy` uses it.
3. Keep `sslmode=require` in both strings.

Why: Prisma 7 recommends routing app traffic through Neon's pooler and running migrations over a direct connection. The app keeps using `@prisma/adapter-pg` (TCP) because Render runs a persistent Node server; the Neon serverless driver is not needed.

# 2. Render (Web Service)

`render.yaml` is a Blueprint: **New → Blueprint →** select the repository.

| Setting | Value |
|---|---|
| Type / runtime | Web Service / Node (`NODE_VERSION=22`, `.node-version`) |
| Build command | `npm ci && npm run db:deploy && npm run db:seed:deploy && npm run build` |
| Start command | `npm start` (`next start` listens on Render's `PORT`) |
| Health check | `/api/health` |
| Custom domains | `gametroz.online`, `www.gametroz.online` |

- `db:deploy` = `prisma migrate deploy`. It only applies pending migrations and never resets or deletes data. `migrate dev` is never used in production.
- `db:seed:deploy` seeds only when `SEED_ON_DEPLOY=true`. Set it for the **first** deploy, then set it back to `false`. The seed upserts and never deletes, but it would reset seeded records on every build.
- Pages are prerendered during `npm run build`, so the build needs the database. Content changes need a redeploy until revalidation is added.

## Environment variables

| Variable | Value | Secret |
|---|---|---|
| `DATABASE_URL` | Neon pooled string (`-pooler`) | yes |
| `DIRECT_URL` | **Optional.** Only when `DATABASE_URL` is a transaction-mode pooler: a direct/session URL for migrations. Leave it unset otherwise. Never localhost (the build fails fast if it is). | yes |
| `NEXT_PUBLIC_SITE_URL` | `https://gametroz.online` | no |
| `NEXT_PUBLIC_INDEXING_ENABLED` | `false` | no |
| `GAMEMONETIZE_FEED_ENABLED` | `false` | no |
| `GAME_EMBEDS_ENABLED` | `false` | no |
| `ADSTERRA_ENABLED` | `false` | no |
| `SEED_ON_DEPLOY` | `true` on the first deploy, then `false` | no |
| `GAMEMONETIZE_API_KEY` | empty | yes |
| `GAMEDISTRIBUTION_API_KEY` | empty | yes |
| `NEXT_PUBLIC_GA_ID` | empty | no |
| `NODE_VERSION` | `22` | no |
| `DATABASE_POOL_MAX` | **Optional.** Connections per process. Default: 2 during `next build` (4 workers), 5 at runtime; this keeps the total under a session-mode pooler limit (Supabase: 15 clients). | no |

Never put a secret in a `NEXT_PUBLIC_*` variable: those are inlined into browser JavaScript.

URL resolution lives in `lib/db/database-url.ts`: the Prisma CLI uses `DIRECT_URL` when it is non-empty, otherwise `DATABASE_URL`; the app uses `DATABASE_URL` only. On Render (`RENDER=true`) or CI, any URL pointing to localhost is refused with an error that names the variable, never its value. Do not ship a `.env` secret file to Render: dotenv would load it for any variable the service does not define.

# 3. Cloudflare (DNS, TLS, proxy)

1. Add `gametroz.online` to Cloudflare and switch the registrar nameservers to Cloudflare's.
2. **Remove every AAAA record** (Render does not support IPv6 origins).
3. DNS records, **DNS only (grey cloud)** until Render verifies both domains and issues certificates:

| Type | Name | Target |
|---|---|---|
| CNAME | `@` | `<service>.onrender.com` (Cloudflare flattens the apex CNAME) |
| CNAME | `www` | `<service>.onrender.com` |

4. When both domains are verified in Render, switch the records to **Proxied (orange cloud)**.
5. **SSL/TLS → Full (strict)**. The origin presents Render's valid certificate for the custom domain. Use Full only if strict fails during the switch, then move to strict. Never use Flexible: it causes redirect loops with HTTPS origins.
6. **Always Use HTTPS**: on.
7. **Redirect rule** www → apex: `http.host eq "www.gametroz.online"` → dynamic `concat("https://gametroz.online", http.request.uri.path)`, status **301**, preserve query string. The app also redirects `www` (308) as an origin-side fallback; both point to the apex, so no loop is possible.
8. **Cache**: keep the defaults. Cloudflare caches static file extensions only (images, CSS, JS, fonts); HTML and `/api/*` are not cached. **Do not add "Cache Everything" rules.** Next.js already sends `immutable` headers for `/_next/static/*`.
9. HSTS (Edge Certificates): enable only after HTTPS is verified on both hosts. Start with a short max-age and no preload.

# 4. Application security headers (all routes)

| Header | Value |
|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| X-Frame-Options | `DENY` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), fullscreen=(self)` |
| X-Robots-Tag | `noindex, nofollow` (while `NEXT_PUBLIC_INDEXING_ENABLED=false`) |

- `'unsafe-inline'` follows the Next.js "CSP without nonces" guide and keeps every page static. A nonce-based CSP would make every page dynamic.
- `frame-src` only lists provider hosts when `GAME_EMBEDS_ENABLED=true`; today it is `'none'`.

# 5. Health check

`GET /api/health` returns `{"status":"ok","database":"ok"}` (200) or `{"status":"degraded","database":"error"}` (503).

- It runs `SELECT 1` with a 3-second timeout.
- The response carries no URL, host, version or error text; the reason is logged server-side only.
- It is sent with `Cache-Control: no-store`.

# 6. Post-deploy verification

```text
/  /games  /tools  /apps  /guides  /privacy  /terms  /contact  /search?q=racing  /api/health  /does-not-exist (404)
```

- HTTPS on apex. `www` returns 301 to the apex.
- Canonical links point to `https://gametroz.online/...`.
- `<meta name="robots" content="noindex, nofollow">` and `X-Robots-Tag` are present.
- No secret appears in the page source or JavaScript bundles (search for `postgres`, `neon.tech`, `DATABASE_URL`).
- Clean browser console and 0 broken internal links (crawl).
- No `<iframe>` on game pages; no live provider requests.

# 7. Not in this phase

Indexing, sitemap submission, Adsterra, analytics, live provider feeds, cron jobs, public iframes, GameDistribution, Famobi, Supabase.
