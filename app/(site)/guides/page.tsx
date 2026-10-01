import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { PageSection } from "@/components/shared/page-section";
import { getFeaturedGuides, getGuideSections, getGuidesBySection } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Guides — Games, Tools and Apps",
  description: "Step-by-step guides, rankings and how-tos for free games, online tools and useful apps.",
  path: "/guides",
});

export default async function GuidesPage() {
  const [featured, sections] = await Promise.all([getFeaturedGuides(3), getGuideSections()]);
  const groups = await Promise.all(
    sections.map(async (section) => ({ section, guides: await getGuidesBySection(section.slug, 3) })),
  );

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Guides" }]} className="pt-6" />
      <PageHeader title="Guides" description="Learn to get more out of games, tools and apps." />

      <ChipNav
        label="Guide sections"
        className="pt-4"
        items={sections.map((section) => ({
          label: `${section.name} guides`,
          href: `/guides/${section.slug}`,
          iconKey: section.iconKey,
        }))}
      />

      <PageSection id="featured" title="Featured guides">
        <CardGrid variant="guides">
          {featured.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} featured />
          ))}
        </CardGrid>
      </PageSection>

      {groups.map(({ section, guides }) => (
        <PageSection
          key={section.slug}
          id={`section-${section.slug}`}
          title={`${section.name} guides`}
          action={{ label: "View all", href: `/guides/${section.slug}` }}
        >
          <CardGrid variant="guides">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </CardGrid>
        </PageSection>
      ))}
    </Container>
  );
}
