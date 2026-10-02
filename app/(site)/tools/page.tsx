import { AdSlot } from "@/components/ads/ad-slot";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { ToolsExplorer } from "@/components/tools/tools-explorer";
import { getToolCategories, getTools } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbList } from "@/lib/seo/structured-data";

// ISR: the tool list refreshes every 10 minutes (and after `npm run tools:sync` once the timer elapses).
export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Free Online Tools for Text, Developers, Images and More",
  description:
    "Free online tools that run in your browser: count words, format JSON, calculate percentages and more. No sign-up, and your data stays on your device.",
  path: "/tools",
});

export default async function ToolsPage() {
  const [categories, tools] = await Promise.all([getToolCategories(), getTools()]);

  return (
    <Container className="pb-10">
      <JsonLd
        data={breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
        ])}
      />
      <Breadcrumbs items={[{ label: "Tools" }]} className="pt-3" />
      <PageHeader
        title="Online tools"
        description={`${tools.length} free ${tools.length === 1 ? "tool" : "tools"} that run in your browser. Nothing to install, and your data stays on your device.`}
      />

      <ToolsExplorer
        tools={tools.map(({ slug, name, shortDescription, category, iconKey, tags, featured }) => ({
          slug,
          name,
          shortDescription,
          category,
          iconKey,
          tags,
          featured,
        }))}
        categories={categories.map(({ slug, name, iconKey }) => ({ slug, name, iconKey }))}
      />

      <div className="py-2">
        <AdSlot placement="home-feed" />
      </div>
    </Container>
  );
}
