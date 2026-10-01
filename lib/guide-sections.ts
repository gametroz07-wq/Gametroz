import type { Category, GuideSection } from "@/types/content";

// Guide sections map 1:1 to the GuideSection enum, so their labels live in code, not the database.
export const guideSections: (Category & { slug: GuideSection })[] = [
  { slug: "games", name: "Games", iconKey: "gamepad", description: "Tips, rankings and how-tos for the games on Gametroz." },
  { slug: "tools", name: "Tools", iconKey: "wrench", description: "Step-by-step guides for everyday tasks with free online tools." },
  { slug: "apps", name: "Apps", iconKey: "laptop", description: "Install guides, comparisons and the best free software picks." },
];
