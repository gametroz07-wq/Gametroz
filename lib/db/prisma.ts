import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { resolvePoolMax, resolveRuntimeDatabaseUrl } from "@/lib/db/database-url";
import { PrismaClient } from "@/lib/generated/prisma/client";

function createPrismaClient() {
  // Fails loudly when missing (no silent fallback to mock data) or when it points to localhost on Render.
  const connectionString = resolveRuntimeDatabaseUrl();
  // Bounded pool: build workers and the server share the pooler client limit.
  return new PrismaClient({ adapter: new PrismaPg({ connectionString, max: resolvePoolMax() }) });
}

// Reuse one client across hot reloads in development to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
