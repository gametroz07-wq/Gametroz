import { LegalDocument } from "@/components/shared/legal-document";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import type { GuideBlock } from "@/types/content";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Gametroz handles browsing data, cookies, analytics, advertising and third-party services.",
  path: "/privacy",
});

const blocks: GuideBlock[] = [
  { type: "h2", text: "Features that are not active yet" },
  {
    type: "p",
    text: "Gametroz is under active development. Some features described in this policy, such as analytics, advertising and embedded games from third-party providers, may not be active yet. We will update this page before or when they are enabled.",
  },
  { type: "h2", text: "Browsing data" },
  {
    type: "p",
    text: "Like most websites, our hosting infrastructure may automatically process technical information when you visit, such as your IP address, browser type, device type, pages requested and the date and time of the request. This information is used to deliver the site, keep it secure and fix technical problems.",
  },
  {
    type: "p",
    text: "Gametroz does not require an account. We do not ask for your name, address or payment details to use the site.",
  },
  { type: "h2", text: "Online tools and your files" },
  {
    type: "p",
    text: "Where possible, our online tools run directly in your browser. When a tool works this way, the text or files you use with it are processed on your device and are not uploaded to our servers. If a future tool needs server-side processing, its page will say so clearly.",
  },
  { type: "h2", text: "Analytics (future)" },
  {
    type: "p",
    text: "We may use analytics services in the future to understand how the site is used, for example which pages are visited and how people find them. These services may set cookies or use similar technologies and process data such as approximate location, device information and pages viewed. We will describe the services we use on this page once they are active.",
  },
  { type: "h2", text: "Advertising (future)" },
  {
    type: "p",
    text: "Gametroz is free to use and may show advertising in the future. Advertising partners may use cookies or similar technologies to show ads, limit how often you see them and measure their performance. Where the law requires it, we will ask for your consent before such technologies are used.",
  },
  { type: "h2", text: "Cookies and local storage" },
  {
    type: "p",
    text: "We use your browser's local storage to remember preferences such as your light or dark theme. This information stays on your device. Additional cookies may be used in the future by analytics or advertising services, as described above.",
  },
  {
    type: "p",
    text: "You can delete cookies and local storage at any time from your browser settings. Blocking them may affect some features, such as remembering your theme.",
  },
  { type: "h2", text: "Third-party services" },
  {
    type: "p",
    text: "Some content may be provided by third parties, for example HTML5 games embedded from game distribution providers. When you interact with that content, the provider may collect data according to its own privacy policy. We encourage you to review the policies of those providers.",
  },
  { type: "h2", text: "External links" },
  {
    type: "p",
    text: "Gametroz links to external websites, including official download pages of software publishers. We are not responsible for the content or privacy practices of those websites. Their own policies apply once you leave Gametroz.",
  },
  { type: "h2", text: "Children" },
  {
    type: "p",
    text: "Gametroz is intended for a general audience. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can remove it.",
  },
  { type: "h2", text: "Changes to this policy" },
  {
    type: "p",
    text: "We may update this policy as the site evolves and new features are enabled. The date at the top of this page shows when it was last changed.",
  },
  { type: "h2", text: "Contact" },
  {
    type: "p",
    text: `If you have questions about this policy or your data, write to ${siteConfig.contactEmail} or visit our Contact page.`,
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro="This policy explains, in plain language, what information Gametroz processes when you use the site and how third-party services may be involved."
      updatedAt="2026-10-01"
      blocks={blocks}
    />
  );
}
