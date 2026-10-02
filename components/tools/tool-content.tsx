import type { ToolDefinition } from "@/lib/tools/definitions";

type ToolContentProps = {
  name: string;
  definition: Pick<ToolDefinition, "intro" | "howTo" | "examples" | "faq">;
};

/** Explanatory content under the workspace: intro, how to use, worked examples and FAQ. */
export function ToolContent({ name, definition }: ToolContentProps) {
  const { intro, howTo, examples, faq } = definition;
  return (
    <div className="grid gap-6 py-6 lg:grid-cols-2">
      <section aria-labelledby="about-tool-heading" className="space-y-3">
        <h2 id="about-tool-heading" className="type-h3">
          About {name}
        </h2>
        {intro.map((paragraph) => (
          <p key={paragraph} className="type-body text-foreground/90">
            {paragraph}
          </p>
        ))}
      </section>

      <section aria-labelledby="how-tool-heading" className="space-y-3">
        <h2 id="how-tool-heading" className="type-h3">
          How to use {name}
        </h2>
        <ol className="space-y-2">
          {howTo.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-semibold">
                {index + 1}
              </span>
              <span className="type-body pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {examples.length > 0 && (
        <section aria-labelledby="examples-heading" className="space-y-3 lg:col-span-2">
          <h2 id="examples-heading" className="type-h3">
            Examples
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {examples.map((example) => (
              <figure key={example.input} className="space-y-2 rounded-2xl bg-surface p-4 ring-1 ring-white/5">
                <div>
                  <p className="type-muted text-xs font-semibold uppercase">Input</p>
                  <pre className="mt-1 overflow-x-auto font-mono text-sm whitespace-pre-wrap break-words">{example.input}</pre>
                </div>
                <div>
                  <p className="type-muted text-xs font-semibold uppercase">Result</p>
                  <pre className="mt-1 overflow-x-auto font-mono text-sm whitespace-pre-wrap break-words">{example.output}</pre>
                </div>
                {example.note && <figcaption className="type-muted text-xs">{example.note}</figcaption>}
              </figure>
            ))}
          </div>
        </section>
      )}

      {faq.length > 0 && (
        <section aria-labelledby="faq-heading" className="space-y-3 lg:col-span-2">
          <h2 id="faq-heading" className="type-h3">
            Frequently asked questions
          </h2>
          <div className="space-y-2">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-xl bg-surface p-4 ring-1 ring-white/5">
                <summary className="cursor-pointer rounded-md font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                  {item.question}
                </summary>
                <p className="type-body mt-2 text-foreground/90">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
