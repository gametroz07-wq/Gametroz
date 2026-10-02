import type { GuideBlock, GuideSection } from "@/types/content";
import { appGuides } from "./content/apps";
import { gameGuides } from "./content/games";
import { toolGuides } from "./content/tools";

/**
 * Source of truth for the Guides section. Every guide the site lists is defined here (content lives in
 * ./content/*). `npm run guides:sync` writes the definitions to the database and ARCHIVES guides that are
 * no longer defined; the seed derives from the same data.
 *
 * Editorial rules: original US English; every recommendation links a real published game, a working tool or a
 * real app; games are described only with facts from the catalog (description, category, controls,
 * orientation, tags); no invented testing claims, ratings, player counts or release dates.
 * Relations to games, tools and apps are derived from the references in the body, never listed by hand.
 */

export type GuideDefinition = {
  slug: string;
  title: string;
  section: GuideSection;
  /** Meta description and card summary: 120 to 158 characters, unique per guide. */
  excerpt: string;
  /** Full page title including " | Gametroz", 60 characters at most. */
  metaTitle: string;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
  /** ISO date; shown on the page as "Updated ...". */
  updatedAt: string;
  body: GuideBlock[];
  featured: boolean;
  /** Global display order (lower first). */
  sortOrder: number;
  tags: string[];
};

export const guideDefinitions: GuideDefinition[] = [...gameGuides, ...toolGuides, ...appGuides];

export function getGuideDefinition(slug: string) {
  return guideDefinitions.find((guide) => guide.slug === slug);
}
