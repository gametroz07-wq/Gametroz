import { GuideBody } from "@/components/guides/guide-body";
import { Container } from "@/components/layout/container";
import { formatDate } from "@/lib/format";
import type { GuideBlock } from "@/types/content";
import { Breadcrumbs } from "./breadcrumbs";

type LegalDocumentProps = {
  title: string;
  /** Canonical path, used for the BreadcrumbList JSON-LD. */
  path: string;
  intro: string;
  updatedAt: string;
  blocks: GuideBlock[];
};

/** Readable single-column layout for policy pages. Content is structured blocks, never raw HTML. */
export function LegalDocument({ title, path, intro, updatedAt, blocks }: LegalDocumentProps) {
  return (
    <Container className="pb-16">
      <Breadcrumbs items={[{ label: title }]} path={path} className="pt-6" />
      <article className="mx-auto max-w-3xl pt-6">
        <header className="space-y-4 border-b border-border/60 pb-6">
          <h1 className="type-h1">{title}</h1>
          <p className="type-body text-lg text-muted-foreground">{intro}</p>
          <p className="type-muted">
            Last updated: <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
          </p>
        </header>
        <GuideBody blocks={blocks} />
      </article>
    </Container>
  );
}
