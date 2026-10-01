/**
 * Read-only review of provider imports (development tool, not part of the site).
 *   npm run provider:review
 */
import { createCliPrisma } from "./lib/cli-prisma";

type Issue = { code: string };

async function main() {
  const prisma = createCliPrisma();
  try {
    const games = await prisma.game.findMany({
      where: { providerId: { not: null } },
      orderBy: [{ status: "asc" }, { slug: "asc" }],
      select: {
        slug: true,
        status: true,
        validationStatus: true,
        validationIssues: true,
        providerGameId: true,
        lastSyncedAt: true,
        provider: { select: { slug: true } },
        category: { select: { slug: true } },
      },
    });
    console.log(`\nProvider games: ${games.length}\n`);
    console.table(
      games.map((game) => ({
        provider: game.provider?.slug,
        id: game.providerGameId,
        slug: game.slug,
        category: game.category.slug,
        status: game.status,
        validation: game.validationStatus,
        issues: ((game.validationIssues as Issue[] | null) ?? []).map((issue) => issue.code).join(", "),
      })),
    );

    const imports = await prisma.importRecord.findMany({
      orderBy: { startedAt: "desc" },
      take: 5,
      include: { provider: { select: { slug: true } } },
    });
    console.log("\nLatest imports:\n");
    console.table(
      imports.map((record) => ({
        provider: record.provider.slug,
        startedAt: record.startedAt.toISOString(),
        dryRun: record.dryRun,
        limit: record.requestedLimit,
        received: record.totalReceived,
        created: record.created,
        updated: record.updated,
        ignored: record.ignored,
        rejected: record.rejected,
        needsReview: record.needsReview,
        failed: record.failed,
      })),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
