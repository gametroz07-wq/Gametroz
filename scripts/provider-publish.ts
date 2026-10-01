/**
 * Explicit REVIEW → PUBLISHED for one game. Sync never publishes on its own.
 *   npm run provider:publish -- --slug <slug>
 * Published pages are static: rebuild (npm run build) to show the game on the site.
 */
import { parseArgs } from "node:util";
import { publishGame } from "@/lib/providers/publish";
import { createCliPrisma } from "./lib/cli-prisma";

const { values } = parseArgs({ options: { slug: { type: "string" } } });

async function main() {
  if (!values.slug) throw new Error("Usage: npm run provider:publish -- --slug <slug>");
  const prisma = createCliPrisma();
  try {
    const result = await publishGame(prisma, values.slug);
    if (result.ok) console.log(`Published "${result.slug}". Rebuild the site to show it.`);
    else {
      console.error(`Not published "${result.slug}": ${result.reason}`);
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
