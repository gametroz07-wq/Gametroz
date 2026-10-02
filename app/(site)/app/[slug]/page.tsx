import { Check, Cpu } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { AppCard, platformLabels } from "@/components/apps/app-card";
import { AppIcon } from "@/components/apps/app-icon";
import { OfficialDownloadButton } from "@/components/apps/official-download-button";
import { OpenSourceBadge } from "@/components/apps/platform-badges";
import { GuideCard } from "@/components/guides/guide-card";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CardGrid } from "@/components/shared/card-grid";
import { PageSection } from "@/components/shared/page-section";
import { getAppDefinition } from "@/lib/apps/definitions";
import { appDownloadSteps } from "@/lib/apps/download-safety";
import { isFreeLicense, isOpenSourceLicense } from "@/lib/app-license";
import { getAlternatives, getAppBySlug, getApps, getGuidesFor, getRelatedApps } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";
import { softwareApplication } from "@/lib/seo/structured-data";
import { appDescription, appTitle } from "@/lib/seo/templates";

// ISR: apps added or changed by `npm run apps:sync` appear on first request or within the hour.
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getApps()).map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: PageProps<"/app/[slug]">): Promise<Metadata> {
  const app = await getAppBySlug((await params).slug);
  if (!app) return {};
  const definition = getAppDefinition(app.slug);
  return pageMetadata({
    title: definition?.metaTitle ?? appTitle(app.name, app.platforms),
    description: definition?.metaDescription ?? appDescription(app.shortDescription),
    path: `/app/${app.slug}`,
  });
}

export default async function AppPage({ params }: PageProps<"/app/[slug]">) {
  const app = await getAppBySlug((await params).slug);
  if (!app) notFound();

  const [alternatives, related, guides] = await Promise.all([
    getAlternatives(app, 6),
    getRelatedApps(app, 4),
    getGuidesFor({ apps: app.slug }),
  ]);
  const downloadUrl = app.officialDownloadUrl ?? app.officialWebsite;
  const overview = app.description.split(/\n{2,}/).filter(Boolean);
  const steps = appDownloadSteps({ name: app.name, url: downloadUrl, platforms: app.platforms });
  const facts = [
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
    {
      label: "Category",
      value: (
        <Link href={`/apps/category/${app.category.slug}`} className="underline-offset-4 hover:underline">
          {app.category.name}
        </Link>
      ),
    },
    { label: "Developer", value: app.publisher },
    ...(app.license ? [{ label: "License / pricing", value: app.license }] : []),
    ...(app.lastVerifiedAt ? [{ label: "Links checked", value: formatDate(app.lastVerifiedAt) }] : []),
  ];

  return (
    <Container className="pb-10">
      <JsonLd
        data={softwareApplication({
          name: app.name,
          description: overview[0] ?? app.shortDescription,
          path: `/app/${app.slug}`,
          platforms: app.platforms,
          categoryName: app.category.name,
          free: isFreeLicense(app.license),
          downloadUrl,
        })}
      />
      <Breadcrumbs
        items={[
          { label: "Apps", href: "/apps" },
          { label: app.category.name, href: `/apps/category/${app.category.slug}` },
          { label: app.name },
        ]}
        path={`/app/${app.slug}`}
        className="pt-3"
      />

      <section aria-labelledby="app-heading" className="mt-3 overflow-hidden rounded-2xl bg-surface ring-1 ring-white/5">
        <div className="flex flex-col gap-5 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <AppIcon app={app} size={84} className="shadow-lg shadow-black/40" />
            <div className="min-w-0 space-y-1.5">
              <h1 id="app-heading" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {app.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                by <span className="font-medium text-foreground">{app.publisher}</span>
              </p>
              <p className="type-body max-w-xl text-foreground/85">{app.shortDescription}</p>
              {isOpenSourceLicense(app.license) && <OpenSourceBadge />}
            </div>
          </div>
          <OfficialDownloadButton url={downloadUrl} appName={app.name} />
        </div>
        <dl className="grid grid-cols-2 border-t border-border/60 bg-surface-2/50 md:grid-cols-3 lg:grid-cols-5">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0 px-4 py-3 sm:px-6">
              <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{fact.label}</dt>
              <dd className="mt-0.5 text-sm font-semibold break-words">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-3 py-3 lg:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="overview-heading" className="space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-white/5 sm:p-5">
          <h2 id="overview-heading" className="text-base font-bold">
            Overview
          </h2>
          {overview.map((paragraph) => (
            <p key={paragraph} className="type-body text-foreground/85">
              {paragraph}
            </p>
          ))}
        </section>
        <section aria-labelledby="features-heading" className="space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-white/5 sm:p-5">
          <h2 id="features-heading" className="text-base font-bold">
            Main features
          </h2>
          <ul className="space-y-2">
            {app.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {app.requirements.length > 0 && (
        <section aria-labelledby="requirements-heading" className="mb-3 space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-white/5 sm:p-5">
          <h2 id="requirements-heading" className="flex items-center gap-2 text-base font-bold">
            <Cpu className="size-4 text-muted-foreground" aria-hidden="true" />
            System requirements
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {app.requirements.map((requirement) => (
              <li key={requirement} className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-foreground/85">
                {requirement}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="safe-download-heading" className="space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-white/5 sm:p-5">
        <h2 id="safe-download-heading" className="text-base font-bold">
          How to download {app.name} safely
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground/85">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

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

      {related.length > 0 && (
        <PageSection id="related-apps" title="Related apps">
          <CardGrid variant="cards">
            {related.map((other) => (
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

      <p className="type-muted pt-3 text-xs">Gametroz is not affiliated with the software publisher unless explicitly stated.</p>
    </Container>
  );
}
