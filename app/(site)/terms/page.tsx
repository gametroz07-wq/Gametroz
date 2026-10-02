import { LegalDocument } from "@/components/shared/legal-document";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import type { GuideBlock } from "@/types/content";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms that apply when you use Gametroz, including third-party games, software links and online tools.",
  path: "/terms",
});

const blocks: GuideBlock[] = [
  { type: "h2", text: "Using Gametroz" },
  {
    type: "p",
    text: "You may use Gametroz for personal, non-commercial purposes. By using the site you agree to these terms. If you do not agree, please do not use the site.",
  },
  { type: "ul", items: [
    "Do not try to disrupt, overload or gain unauthorized access to the site or its infrastructure.",
    "Do not scrape or copy the site in bulk, or reuse its content in a way that breaks these terms or the law.",
    "Do not use the site or its tools for unlawful purposes.",
  ] },
  { type: "h2", text: "Third-party content" },
  {
    type: "p",
    text: "Much of the content on Gametroz is created and owned by third parties. Gametroz does not claim ownership of third-party games, software, trademarks or logos. All rights belong to their respective owners.",
  },
  { type: "h2", text: "Embedded games" },
  {
    type: "p",
    text: "Games on Gametroz are provided by third-party developers and game distribution providers and are embedded in our pages. They are not developed or owned by Gametroz. Their availability, content and behavior are controlled by those providers and may change or be removed at any time.",
  },
  { type: "h2", text: "Links to third-party software" },
  {
    type: "p",
    text: "App and software pages contain information and links to the publishers' official websites. Gametroz does not host, modify or distribute software files. Downloads happen on the publisher's site and are subject to the publisher's own license and terms. Always review a program's license before installing it.",
  },
  {
    type: "p",
    text: "We try to keep software information accurate, but details such as versions, licenses and requirements can change. Check the official publisher's website for the latest information.",
  },
  { type: "h2", text: "Online tools" },
  {
    type: "p",
    text: "Our online tools are provided for convenience and as is. Results may not always be accurate or suitable for your purpose, so please review them before relying on them, and keep a copy of important files before processing them.",
  },
  { type: "h2", text: "Intellectual property" },
  {
    type: "p",
    text: "The Gametroz name, design, original text and original site features are protected by intellectual property laws. Third-party names, games, software and trademarks remain the property of their owners.",
  },
  {
    type: "p",
    text: "If you believe content on Gametroz infringes your rights, contact us with the details and we will review your request promptly.",
  },
  { type: "h2", text: "Limitation of liability" },
  {
    type: "p",
    text: "Gametroz is provided as is and as available, without warranties of any kind. To the extent permitted by law, Gametroz is not liable for any damages resulting from the use of the site, its tools, third-party content or external websites.",
  },
  { type: "h2", text: "Service availability" },
  {
    type: "p",
    text: "We aim to keep Gametroz available, but we do not guarantee uninterrupted access. Features, content and providers may be added, changed or removed at any time, and some features may not be active yet.",
  },
  { type: "h2", text: "Changes to these terms" },
  {
    type: "p",
    text: "We may update these terms as the site evolves. The date at the top of this page shows when they were last changed. Continuing to use the site after a change means you accept the updated terms.",
  },
  { type: "h2", text: "Contact" },
  {
    type: "p",
    text: `Questions about these terms? Write to ${siteConfig.contactEmail} or visit our Contact page.`,
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Terms of Use"
      path="/terms"
      intro="These terms explain how you may use Gametroz and how third-party games, software links and online tools fit in."
      updatedAt="2026-10-01"
      blocks={blocks}
    />
  );
}
