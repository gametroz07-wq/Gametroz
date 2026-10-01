import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const DB_TIMEOUT_MS = 3000;

/** Liveness + database reachability. Returns no hosts, URLs, versions or error details. */
export async function GET() {
  let database: "ok" | "error" = "ok";
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), DB_TIMEOUT_MS)),
    ]);
  } catch (error) {
    database = "error";
    // Server log only: the response never carries the reason.
    console.error("[health] database check failed:", error instanceof Error ? error.message : "unknown error");
  }

  const healthy = database === "ok";
  return Response.json(
    { status: healthy ? "ok" : "degraded", database },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
