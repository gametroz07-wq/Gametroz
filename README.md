# Gametroz — Play · Tools · Apps

Free HTML5 games, online tools, apps and guides. Production domain: https://gametroz.online

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS 4 + shadcn/ui (Radix base) + Lucide icons
- PostgreSQL 17 + Prisma ORM 7 (`@prisma/adapter-pg`)

## Getting started

```bash
npm install                 # also runs `prisma generate`
docker compose up -d        # local PostgreSQL on port 5436
# .env → DATABASE_URL=postgresql://gametroz:gametroz_dev@localhost:5436/gametroz?schema=public
npm run db:migrate          # apply migrations
npm run db:seed             # load the seed catalog (idempotent)
npm run dev
```

The database is required for `dev` and `build`: pages read the catalog through `lib/catalog.ts`.

## Scripts

| Script              | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the dev server                     |
| `npm run lint`      | ESLint (flat config, Next.js rules)      |
| `npm run typecheck` | Generate route types and run `tsc`       |
| `npm run build`     | Production build (needs the database)    |
| `npm run db:migrate`| Create/apply migrations (development)    |
| `npm run db:deploy` | Apply migrations (production)            |
| `npm run db:seed`   | Seed the catalog from `prisma/seed-data` |
| `npm run db:studio` | Open Prisma Studio                       |

Every phase must pass `lint`, `typecheck` and `build` before it is accepted.

## Project layout

```text
app/             Routes (App Router). Pages live in app/[lang]/(site); proxy.ts maps public URLs to the locale segment.
components/      UI by domain: layout, games, tools, apps, guides, search, ads, ui
lib/             Site config, data access (catalog.ts, db/) and domain libraries
prisma/          Schema, migrations, seed and seed data
types/           Shared TypeScript types
scripts/         Maintenance and sync scripts
docs/            Product, design, technical and implementation documentation
```

## Documentation

Start with [`docs/00_README.md`](docs/00_README.md). Current progress lives in [`STATUS.md`](STATUS.md).
