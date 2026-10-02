// Visual accent per tool category (UI only). Muted tints, readable in dark and light themes.
type ToolAccent = { icon: string; text: string; glow: string };

const accents: Record<string, ToolAccent> = {
  images: { icon: "bg-sky-500/15 text-sky-600 dark:text-sky-300", text: "text-sky-600 dark:text-sky-300", glow: "from-sky-500/15" },
  pdf: { icon: "bg-rose-500/15 text-rose-600 dark:text-rose-300", text: "text-rose-600 dark:text-rose-300", glow: "from-rose-500/15" },
  text: { icon: "bg-amber-500/15 text-amber-700 dark:text-amber-300", text: "text-amber-700 dark:text-amber-300", glow: "from-amber-500/15" },
  developer: { icon: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", text: "text-emerald-700 dark:text-emerald-300", glow: "from-emerald-500/15" },
  calculators: { icon: "bg-violet-500/15 text-violet-600 dark:text-violet-300", text: "text-violet-600 dark:text-violet-300", glow: "from-violet-500/15" },
  generators: { icon: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300", text: "text-fuchsia-600 dark:text-fuchsia-300", glow: "from-fuchsia-500/15" },
  seo: { icon: "bg-lime-500/15 text-lime-700 dark:text-lime-300", text: "text-lime-700 dark:text-lime-300", glow: "from-lime-500/15" },
  converters: { icon: "bg-orange-500/15 text-orange-700 dark:text-orange-300", text: "text-orange-700 dark:text-orange-300", glow: "from-orange-500/15" },
};

const fallback: ToolAccent = { icon: "bg-primary/15 text-primary dark:text-violet-300", text: "text-muted-foreground", glow: "from-primary/15" };

export function toolAccent(categorySlug: string) {
  return accents[categorySlug] ?? fallback;
}
