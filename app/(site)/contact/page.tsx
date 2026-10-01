import { Bug, Copyright, Gamepad2, Mail, Megaphone, MessageCircleQuestion, Package } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Gametroz about content, copyright, games, software, advertising or technical issues.",
  path: "/contact",
});

const reasons = [
  { title: "General questions", icon: MessageCircleQuestion, text: "Questions, feedback or suggestions about Gametroz." },
  { title: "Content / copyright", icon: Copyright, text: "Report content you believe infringes your rights, with links and details." },
  { title: "Game developers", icon: Gamepad2, text: "Questions about a game listed on Gametroz or how it is presented." },
  { title: "Software publishers", icon: Package, text: "Corrections to an app page, official links, versions or licenses." },
  { title: "Advertising", icon: Megaphone, text: "Advertising and partnership inquiries." },
  { title: "Technical issues", icon: Bug, text: "Something broken? Tell us the page, device and browser you used." },
];

function mailto(subject: string) {
  return `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`[Gametroz] ${subject}`)}`;
}

export default function ContactPage() {
  return (
    <Container className="pb-16">
      <Breadcrumbs items={[{ label: "Contact" }]} className="pt-6" />
      <PageHeader
        title="Contact"
        description="We read every message. Pick the topic that fits best so your email reaches the right place."
      >
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button asChild variant="brand" size="lg" className="h-11 px-5 text-base">
            <a href={mailto("General question")}>
              <Mail aria-hidden="true" />
              {siteConfig.contactEmail}
            </a>
          </Button>
        </div>
      </PageHeader>

      <section aria-labelledby="reasons-heading" className="py-10">
        <h2 id="reasons-heading" className="type-h3 mb-5">
          Reasons to contact us
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ title, icon: Icon, text }) => (
            <li key={title}>
              <a
                href={mailto(title)}
                className="flex h-full items-start gap-4 rounded-2xl bg-surface p-5 transition-colors hover:bg-surface-2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary dark:text-violet-300">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="space-y-1">
                  <span className="block font-semibold">{title}</span>
                  <span className="type-muted block">{text}</span>
                  <span className="sr-only">(opens your email app)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="type-muted">
        A contact form is coming soon. For now, email is the fastest way to reach us.
      </p>
    </Container>
  );
}
