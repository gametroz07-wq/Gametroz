import Link from "next/link";
import { Fragment } from "react";
import { AppCard } from "@/components/apps/app-card";
import { GameCard } from "@/components/games/game-card";
import { CardGrid } from "@/components/shared/card-grid";
import { ToolCard } from "@/components/tools/tool-card";
import { parseInlineLinks } from "@/lib/guides/blocks";
import type { App, Game, GuideBlock, Tool } from "@/types/content";

/** Published games, tools and apps a guide may show as cards, by slug. Anything missing here renders nothing. */
export type GuideItems = {
  games: Map<string, Game>;
  tools: Map<string, Tool>;
  apps: Map<string, App>;
};

type GuideBodyProps = {
  blocks: GuideBlock[];
  items?: GuideItems;
  // Rendered once after this many blocks (an inline ad slot, for example).
  insertAfter?: number;
  insert?: React.ReactNode;
};

/** Text with `[label](/path)` internal links. Validation guarantees every target is an internal catalog path. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInlineLinks(text).segments.map((segment, index) =>
        segment.type === "link" ? (
          <Link
            key={index}
            href={segment.href}
            className="rounded-sm font-medium text-primary underline underline-offset-2 hover:no-underline focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:outline-none"
          >
            {segment.label}
          </Link>
        ) : (
          <Fragment key={index}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}

function ItemCards({ block, items }: { block: Extract<GuideBlock, { type: "items" }>; items?: GuideItems }) {
  const games = block.refs.flatMap((ref) => (ref.kind === "game" ? [items?.games.get(ref.slug)] : [])).filter((item) => item !== undefined);
  const tools = block.refs.flatMap((ref) => (ref.kind === "tool" ? [items?.tools.get(ref.slug)] : [])).filter((item) => item !== undefined);
  const apps = block.refs.flatMap((ref) => (ref.kind === "app" ? [items?.apps.get(ref.slug)] : [])).filter((item) => item !== undefined);
  if (games.length + tools.length + apps.length === 0) return null;

  return (
    <section aria-label={block.title ?? "Related items"} className="my-8 space-y-4">
      {block.title && <h3 className="text-lg font-semibold">{block.title}</h3>}
      {games.length > 0 && (
        <CardGrid variant="games">
          {games.map((item) => (
            <GameCard key={item.slug} game={item} />
          ))}
        </CardGrid>
      )}
      {tools.length > 0 && (
        <CardGrid variant="cards">
          {tools.map((item) => (
            <ToolCard key={item.slug} tool={item} />
          ))}
        </CardGrid>
      )}
      {apps.length > 0 && (
        <CardGrid variant="cards">
          {apps.map((item) => (
            <AppCard key={item.slug} app={item} />
          ))}
        </CardGrid>
      )}
    </section>
  );
}

function Block({ block, items }: { block: GuideBlock; items?: GuideItems }) {
  switch (block.type) {
    case "answer":
      return (
        <div className="my-6 rounded-2xl border border-primary/30 bg-surface p-5">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Short answer</p>
          <p className="type-body mt-1.5 font-medium text-foreground">
            <Inline text={block.text} />
          </p>
        </div>
      );
    case "h2":
      return <h2 className="type-h3 mt-10 mb-3">{block.text}</h2>;
    case "h3":
      return <h3 className="mt-6 mb-2 text-lg font-semibold">{block.text}</h3>;
    case "p":
      return (
        <p className="type-body my-4 text-foreground/90">
          <Inline text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="type-body my-4 list-disc space-y-1.5 pl-6 text-foreground/90 marker:text-primary">
          {block.items.map((item, index) => (
            <li key={index}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="type-body my-4 list-decimal space-y-1.5 pl-6 text-foreground/90 marker:font-semibold">
          {block.items.map((item, index) => (
            <li key={index}>
              <Inline text={item} />
            </li>
          ))}
        </ol>
      );
    case "steps":
      return (
        <ol role="list" className="type-body my-5 space-y-3 text-foreground/90">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              >
                {index + 1}
              </span>
              <span className="min-w-0 pt-0.5">
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div
          role="region"
          aria-label={block.caption}
          tabIndex={0}
          className="my-6 overflow-x-auto rounded-xl border border-border/60 focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:outline-none"
        >
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-surface-2 text-xs tracking-wide uppercase">
              <tr>
                {block.header.map((cell, index) => (
                  <th key={index} scope="col" className="px-3 py-2.5 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-border/60 align-top">
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th key={cellIndex} scope="row" className="px-3 py-2.5 font-medium">
                        <Inline text={cell} />
                      </th>
                    ) : (
                      <td key={cellIndex} className="px-3 py-2.5 text-foreground/90">
                        <Inline text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "items":
      return <ItemCards block={block} items={items} />;
    case "note":
      return (
        <div role="note" className="my-6 rounded-xl border border-border bg-surface-2/60 p-4">
          {block.title && <p className="mb-1 text-sm font-semibold">{block.title}</p>}
          <p className="type-body text-foreground/90">
            <Inline text={block.text} />
          </p>
        </div>
      );
  }
}

/** Renders structured guide content. Guides never render raw HTML. */
export function GuideBody({ blocks, items, insertAfter, insert }: GuideBodyProps) {
  return (
    <div>
      {blocks.map((block, index) => (
        <Fragment key={index}>
          <Block block={block} items={items} />
          {insert && insertAfter === index + 1 && <div className="my-8">{insert}</div>}
        </Fragment>
      ))}
    </div>
  );
}
