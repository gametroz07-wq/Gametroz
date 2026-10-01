import "dotenv/config";
import { defineConfig } from "prisma/config";
import { resolveCliDatabaseUrl } from "./lib/db/database-url";

// Prisma 7 does not load .env files by itself: dotenv loads `.env` locally and never overrides
// variables already set by the host (Render). See lib/db/database-url.ts for the resolution rules.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // DIRECT_URL (optional, unpooled) → DATABASE_URL. Refuses localhost on Render/CI.
    url: resolveCliDatabaseUrl(),
  },
});
