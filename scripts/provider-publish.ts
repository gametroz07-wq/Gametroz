/**
 * Explicit REVIEW → PUBLISHED. Sync never publishes on its own.
 *   npm run provider:publish -- --slug halloween-fighters
 *   npm run provider:publish -- --id 38133
 *   npm run provider:publish -- --ids 38133,38124 [--ack-editorial]
 * Then asks the site to revalidate (REVALIDATE_ENDPOINT + REVALIDATE_SECRET), so the game appears
 * without a redeploy. Without those variables, pages refresh on their ISR timer (≤ 1 hour).
 */
import { parseArgs } from "node:util";
import { requestRevalidation } from "@/lib/providers/notify-revalidate";
import { publishGames } from "@/lib/providers/publish";
import { createCliPrisma } from "./lib/cli-prisma";
import { parseGameRefs } from "./lib/game-refs";

const { values } = parseArgs({
  options: {
    slug: { type: "string" },
    id: { type: "string" },
    ids: { type: "string" },
    provider: { type: "string" },
    "ack-editorial": { type: "boolean", default: false },
  },
});

async function main() {
  const refs = parseGameRefs(values);
  const prisma = createCliPrisma();
  try {
    const results = await publishGames(prisma, refs, { ackEditorial: values["ack-editorial"] });
    for (const result of results) {
      if (result.ok) console.log(`Published "${result.slug}".`);
      else console.error(`Not published "${result.slug}": ${result.reason}`);
    }
    const published = results.filter((result) => result.ok).map((result) => result.slug);
    if (published.length) {
      const revalidation = await requestRevalidation(published);
      console.log(
        revalidation.status === "ok"
          ? "Site revalidated: the games are live now."
          : `Revalidation ${revalidation.status}: ${"reason" in revalidation ? revalidation.reason : ""}. Pages refresh on their ISR timer.`,
      );
    }
    if (results.some((result) => !result.ok)) process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
