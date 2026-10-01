import { Fragment } from "react";
import type { GuideBlock } from "@/types/content";

type GuideBodyProps = {
  blocks: GuideBlock[];
  // Rendered once after this many blocks (an inline ad slot, for example).
  insertAfter?: number;
  insert?: React.ReactNode;
};

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="type-h3 mt-10 mb-3">{block.text}</h2>;
    case "p":
      return <p className="type-body my-4 text-foreground/90">{block.text}</p>;
    case "ul":
      return (
        <ul className="type-body my-4 list-disc space-y-1.5 pl-6 text-foreground/90 marker:text-primary">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="type-body my-4 list-decimal space-y-1.5 pl-6 text-foreground/90 marker:font-semibold">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
  }
}

/** Renders structured guide content. Guides never render raw HTML. */
export function GuideBody({ blocks, insertAfter, insert }: GuideBodyProps) {
  return (
    <div>
      {blocks.map((block, index) => (
        <Fragment key={index}>
          <Block block={block} />
          {insert && insertAfter === index + 1 && <div className="my-8">{insert}</div>}
        </Fragment>
      ))}
    </div>
  );
}
