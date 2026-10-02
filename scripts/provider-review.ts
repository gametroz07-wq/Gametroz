/**
 * Read-only review of provider games and imports.
 *   npm run provider:review                      # REVIEW games (default)
 *   npm run provider:review -- --status all      # REVIEW, PUBLISHED, ARCHIVED, DRAFT
 *   npm run provider:review -- --issues          # include validation and editorial messages
 */
import { parseArgs } from "node:util";
import { createCliPrisma } from "./lib/cli-prisma";

type Issue = { code: string; message: string; severity: string };
const STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;

const { values } = parseArgs({
  options: {
    status: { type: "string", default: "REVIEW" },
    provider: { type: "string" },
    issues: { type: "boolean", default: false },
  },
});

async function main() {
  const status = values.status.toUpperCase();
  if (status !== "ALL" && !STATUSES.includes(status as (typeof STATUSES)[number])) {
    throw new Error(`--status must be one of ${STATUSES.join(", ")} or all.`);
  }
  const prisma = createCliPrisma();
  try {
    const games = await prisma.game.findMany({
      where: {
        providerId: { not: null },
        ...(status === "ALL" ? {} : { status: status as (typeof STATUSES)[number] }),
        ...(values.provider ? { provider: { slug: values.provider } } : {}),
      },
      orderBy: [{ status: "asc" }, { providerGameId: "desc" }],
      select: {
        slug: true,
        name: true,
        status: true,
        validationStatus: true,
        validationIssues: true,
        providerGameId: true,
        provider: { select: { slug: true } },
        category: { select: { slug: true } },
      },
    });
    console.log(`\nProvider games (${status.toLowerCase()}): ${games.length}\n`);
    console.table(
      games.map((game) => {
        const issues = (game.validationIssues as Issue[] | null) ?? [];
        return {
          id: game.providerGameId,
          slug: game.slug,
          category: game.category.slug,
          status: game.status,
          validation: game.validationStatus,
          editorial: issues.some((issue) => issue.code === "EDITORIAL_REVIEW_REQUIRED") ? "REQUIRED" : "",
          issues: [...new Set(issues.map((issue) => issue.code))].join(", "),
        };
      }),
    );

    if (values.issues) {
      for (const game of games) {
        const issues = (game.validationIssues as Issue[] | null) ?? [];
        if (!issues.length) continue;
        console.log(`\n${game.slug} (${game.providerGameId})`);
        for (const issue of issues) console.log(`  [${issue.severity}] ${issue.code}: ${issue.message}`);
      }
    }

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
