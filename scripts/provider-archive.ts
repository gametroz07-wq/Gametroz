/**
 * Archive games (REVIEW or PUBLISHED → ARCHIVED). Archived games leave every public page.
 *   npm run provider:archive -- --slug resident-evil-2-beat-em-up
 *   npm run provider:archive -- --ids 38132,38129
 */
import { parseArgs } from "node:util";
import { requestRevalidation } from "@/lib/providers/notify-revalidate";
import { archiveGames } from "@/lib/providers/publish";
import { createCliPrisma } from "./lib/cli-prisma";
import { parseGameRefs } from "./lib/game-refs";

const { values } = parseArgs({
  options: {
    slug: { type: "string" },
    id: { type: "string" },
    ids: { type: "string" },
    provider: { type: "string" },
  },
});

async function main() {
  const refs = parseGameRefs(values);
  const prisma = createCliPrisma();
  try {
    const results = await archiveGames(prisma, refs);
    for (const result of results) {
      if (result.ok) console.log(`Archived "${result.slug}".`);
      else console.error(`Not archived "${result.slug}": ${result.reason}`);
    }
    const archived = results.filter((result) => result.ok).map((result) => result.slug);
    if (archived.length) {
      const revalidation = await requestRevalidation(archived);
      console.log(revalidation.status === "ok" ? "Site revalidated." : `Revalidation ${revalidation.status}. Pages refresh on their ISR timer.`);
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
