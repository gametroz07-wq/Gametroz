import Link from "next/link";
import { orientationFact } from "@/lib/seo/templates";
import type { Game } from "@/types/content";

type GameQuickFactsProps = {
  category: Game["category"];
  orientation: Game["orientation"];
  /** Input methods derived from the instructions; the row is hidden when empty. */
  controls: string[];
};

/** Compact definition list under the player. Every value comes from the game data or is a fixed site fact. */
export function GameQuickFacts({ category, orientation, controls }: GameQuickFactsProps) {
  const facts: { label: string; value: React.ReactNode }[] = [
    {
      label: "Category",
      value: (
        <Link href={`/games/${category.slug}`} className="underline-offset-2 hover:underline">
          {category.name}
        </Link>
      ),
    },
    ...(controls.length > 0 ? [{ label: "Controls", value: controls.join(", ") }] : []),
    { label: "Orientation", value: orientationFact(orientation) },
    { label: "Platform", value: "Web browser — no download" },
    { label: "Price", value: "Free to play (ads may appear before or during the game)" },
  ];

  return (
    <section aria-labelledby="quick-facts-heading" className="rounded-2xl bg-surface p-4 ring-1 ring-white/5 sm:p-5">
      <h2 id="quick-facts-heading" className="mb-2 text-base font-bold">
        Quick facts
      </h2>
      <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
        {facts.map((fact) => (
          <div key={fact.label} className="grid gap-x-6 sm:col-span-2 sm:grid-cols-subgrid">
            <dt className="font-medium text-muted-foreground">{fact.label}</dt>
            <dd className="text-foreground/90">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
