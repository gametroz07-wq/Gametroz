import { serializeJsonLd } from "@/lib/seo/structured-data";

/**
 * Renders schema.org structured data. A JSON-LD script is data, not executable code, so the
 * site's CSP does not need to allow it; "<" is escaped so content can never close the tag.
 */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
