import { Check, Cpu } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard, platformLabels } from "@/components/apps/app-card";
import { AppIcon } from "@/components/apps/app-icon";
import { AppScreenshots } from "@/components/apps/app-screenshots";
import { OfficialDownloadButton } from "@/components/apps/official-download-button";
import { OpenSourceBadge } from "@/components/apps/platform-badges";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageSection } from "@/components/shared/page-section";
import { isOpenSourceLicense } from "@/lib/app-license";
import { getAlternatives, getAppBySlug, getApps, getGuidesFor } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";
import { softwareApplication } from "@/lib/seo/structured-data";
import { appDescription, appTitle } from "@/lib/seo/templates";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getApps()).map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: PageProps<"/app/[slug]">): Promise<Metadata> {
  const app = await getAppBySlug((await params).slug);
  if (!app) return {};
  return pageMetadata({
    title: appTitle(app.name),
    description: appDescription(app.shortDescription),
    path: `/app/${app.slug}`,
  });
}

export default async function AppPage({ params }: PageProps<"/app/[slug]">) {
  const app = await getAppBySlug((await params).slug);
  if (!app) notFound();

  const [alternatives, guides] = await Promise.all([getAlternatives(app, 4), getGuidesFor({ apps: app.slug })]);
  const facts = [
    { label: "Version", value: app.version || "—" },
    { label: "License", value: app.license || "—" },
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
    <Container className="pb-10">
      <JsonLd
        data={softwareApplication({
          name: app.name,
          description: app.description,
          path: `/app/${app.slug}`,
          platforms: app.platforms,
          categoryName: app.category.name,
          downloadUrl: app.officialWebsite,
        })}
      />
      <Breadcrumbs items={[{ label: "Apps", href: "/apps" }, { label: app.name }]} path={`/app/${app.slug}`} className="pt-3" />

      <section aria-labelledby="app-heading" className="mt-3 overflow-hidden rounded-2xl bg-surface ring-1 ring-white/5">
        <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <AppIcon app={app} size={84} className="shadow-lg shadow-black/40" />
            <div className="min-w-0 space-y-1.5">
              <h1 id="app-heading" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {app.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                by <span className="font-medium text-foreground">{app.publisher}</span> · {app.category.name}
              </p>
              <p className="type-body max-w-xl text-foreground/85">{app.shortDescription}</p>
              {isOpenSourceLicense(app.license) && <OpenSourceBadge />}
            </div>
          </div>
          <OfficialDownloadButton url={app.officialWebsite} appName={app.name} />
        </div>
        <dl className="grid grid-cols-2 border-t border-border/60 bg-surface-2/50 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0 px-4 py-3 sm:px-6">
              <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{fact.label}</dt>
              <dd className="mt-0.5 text-sm font-semibold break-words">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <PageSection id="screenshots" title="Screenshots">
        <AppScreenshots appName={app.name} />
      </PageSection>

      <div className="grid gap-3 py-3 lg:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="features-heading" className="space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-white/5 sm:p-5">
          <h2 id="features-heading" className="text-base font-bold">
            About & features
          </h2>
          <p className="type-body text-foreground/85">{app.description}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {app.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="requirements-heading" className="space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-white/5 sm:p-5">
          <h2 id="requirements-heading" className="flex items-center gap-2 text-base font-bold">
            <Cpu className="size-4 text-muted-foreground" aria-hidden="true" />
            System requirements
          </h2>
          <ul className="space-y-2">
            {app.requirements.map((requirement) => (
              <li key={requirement} className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-foreground/85">
                {requirement}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <AdSlot placement="home-feed" className="my-2" />

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
