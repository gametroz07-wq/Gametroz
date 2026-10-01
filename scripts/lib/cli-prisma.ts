import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// CLI scripts run outside Next.js, so they cannot use lib/db/prisma.ts (server-only).
export function createCliPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set. Add it to .env.");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
