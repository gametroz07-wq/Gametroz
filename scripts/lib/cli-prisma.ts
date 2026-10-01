import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { resolveRuntimeDatabaseUrl } from "@/lib/db/database-url";
import { PrismaClient } from "@/lib/generated/prisma/client";

// CLI scripts run outside Next.js, so they cannot use lib/db/prisma.ts (server-only).
export function createCliPrisma() {
  const connectionString = resolveRuntimeDatabaseUrl();
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
