import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 does not load .env files by itself; dotenv reads DATABASE_URL from `.env`.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // CLI (migrate deploy, seed) needs a direct connection. In production (Neon) DIRECT_URL is the
    // unpooled string and DATABASE_URL the "-pooler" one used by the app; locally both can be the same.
    // Not env(): that throws when unset, and `prisma generate` (postinstall, CI) must work without a database.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
