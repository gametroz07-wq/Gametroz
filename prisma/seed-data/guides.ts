import { guideDefinitions } from "../../lib/guides/definitions";
import { toGuideRow } from "../../lib/guides/sync-plan";

// Seed source data, derived from lib/guides/definitions.ts (the single source of truth) so the seed and
// `npm run guides:sync` can never diverge. Rows carry the body, the derived reading time and the related
// game, tool and app slugs. Only prisma/seed.ts imports this file.

export const guides = [...guideDefinitions].sort((a, b) => a.sortOrder - b.sortOrder).map(toGuideRow);
