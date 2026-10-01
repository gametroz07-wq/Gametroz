import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { ChipNav } from "@/components/shared/chip-nav";
import { PageHeader } from "@/components/shared/page-header";
import { getGuideSection, getGuideSections, getGuidesBySection } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGuideSections()).map((section) => ({ section: section.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[section]">): Promise<Metadata> {
  const section = await getGuideSection((await params).section);
  if (!section) return {};
  return pageMetadata({
    title: `${section.name} Guides`,
    description: section.description,
    path: `/guides/${section.slug}`,
  });
}

export default async function GuideSectionPage({ params }: PageProps<"/guides/[section]">) {
  const section = await getGuideSection((await params).section);
  if (!section) notFound();

  const [guides, sections] = await Promise.all([getGuidesBySection(section.slug), getGuideSections()]);

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: section.name }]} className="pt-6" />
      <PageHeader title={`${section.name} guides`} description={section.description} />

      <ChipNav
        label="Guide sections"
        className="pt-4"
        items={sections.map((other) => ({
          label: `${other.name} guides`,
          href: `/guides/${other.slug}`,
          iconKey: other.iconKey,
          active: other.slug === section.slug,
        }))}
      />

      <section aria-label={`${section.name} guides`} className="py-8">
        <CardGrid variant="guides">
          {guides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </CardGrid>
      </section>
    </Container>
  );
}
