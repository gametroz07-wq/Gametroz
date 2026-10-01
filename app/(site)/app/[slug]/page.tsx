import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard, platformLabels } from "@/components/apps/app-card";
import { AppIcon } from "@/components/apps/app-icon";
import { AppScreenshots } from "@/components/apps/app-screenshots";
import { OfficialDownloadButton } from "@/components/apps/official-download-button";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageSection } from "@/components/shared/page-section";
import { Badge } from "@/components/ui/badge";
import { getAlternatives, getAppBySlug, getApps, getGuidesFor } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getApps()).map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: PageProps<"/app/[slug]">): Promise<Metadata> {
  const app = await getAppBySlug((await params).slug);
  if (!app) return {};
  const platformList = app.platforms.map((platform) => platformLabels[platform]).join(", ");
  return pageMetadata({
    title: `${app.name} — Free for ${platformList}`,
    description: `${app.shortDescription} Official download link, features, requirements and alternatives.`,
    path: `/app/${app.slug}`,
  });
}

export default async function AppPage({ params }: PageProps<"/app/[slug]">) {
  const app = await getAppBySlug((await params).slug);
  if (!app) notFound();

  const [alternatives, guides] = await Promise.all([getAlternatives(app, 4), getGuidesFor({ apps: app.slug })]);
  const facts = [
    { label: "Version", value: app.version },
    { label: "Publisher", value: app.publisher },
    { label: "License", value: app.license },
    {
      label: "Platforms",
      value: app.platforms.map((platform, index) => (
        <span key={platform}>
          {index > 0 && <span aria-hidden="true"> · </span>}
          <Link href={`/apps/${platform}`} className="underline-offset-4 hover:underline">
            {platformLabels[platform]}
          </Link>
        </span>
      )),
    },
    { label: "Last verified", value: app.lastVerifiedAt ? formatDate(app.lastVerifiedAt) : "Not verified yet" },
  ];

  return (
    <Container className="pb-12">
      <Breadcrumbs items={[{ label: "Apps", href: "/apps" }, { label: app.name }]} className="pt-4 sm:pt-6" />

      <section aria-labelledby="app-heading" className="mt-4 rounded-3xl bg-surface p-5 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 sm:gap-5">
            <AppIcon app={app} size={72} />
            <div className="min-w-0 space-y-2">
              <h1 id="app-heading" className="type-h2">
                {app.name}
              </h1>
              <p className="type-body text-muted-foreground">{app.shortDescription}</p>
              <Badge variant="secondary">{app.category.name}</Badge>
            </div>
          </div>
          <OfficialDownloadButton url={app.officialWebsite} appName={app.name} />
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border/60 pt-6 sm:grid-cols-3 lg:grid-cols-5">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0">
              <dt className="type-muted text-xs">{fact.label}</dt>
              <dd className="mt-1 text-sm font-medium break-words">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <PageSection id="screenshots" title="Screenshots">
        <AppScreenshots appName={app.name} />
      </PageSection>

      <div className="grid gap-8 py-6 lg:grid-cols-3">
        <section aria-labelledby="about-app-heading" className="space-y-3 lg:col-span-1">
          <h2 id="about-app-heading" className="type-h3">
            About
          </h2>
          <p className="type-body text-foreground/90">{app.description}</p>
        </section>
        <section aria-labelledby="features-heading" className="space-y-3">
          <h2 id="features-heading" className="type-h3">
            Features
          </h2>
          <ul className="space-y-2">
            {app.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="mt-0.5 size-5 shrink-0 text-emerald-500" aria-hidden="true" />
                <span className="type-body">{feature}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="requirements-heading" className="space-y-3">
          <h2 id="requirements-heading" className="type-h3">
            Requirements
          </h2>
          <ul className="type-body list-disc space-y-2 pl-5 text-foreground/90">
            {app.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="py-4">
        <AdSlot placement="home-feed" />
      </div>

      {alternatives.length > 0 && (
        <PageSection id="alternatives" title={`Alternatives to ${app.name}`}>
          <CardGrid variant="cards">
            {alternatives.map((other) => (
              <AppCard key={other.slug} app={other} />
            ))}
          </CardGrid>
        </PageSection>
      )}

      {guides.length > 0 && (
        <PageSection id="app-guides" title="Related guides">
          <CardGrid variant="guides">
            {guides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </CardGrid>
        </PageSection>
      )}
    </Container>
  );
}
