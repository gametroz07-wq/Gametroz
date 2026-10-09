import { LegalDocument } from "@/components/shared/legal-document";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import type { GuideBlock } from "@/types/content";

export const metadata = pageMetadata({
  title: "About Gametroz",
  description:
    "What Gametroz is: free browser games from a third-party provider, online tools that run on your device, and a directory of apps linked to official downloads.",
  path: "/about",
});

const blocks: GuideBlock[] = [
  { type: "h2", text: "What Gametroz offers" },
  {
    type: "p",
    text: "Gametroz is a free website with four sections: browser games, online tools, a directory of useful apps and written guides. Nothing requires an account or a download.",
  },
  {
    type: "ul",
    items: [
      "Games: HTML5 games you play in your browser, grouped by category.",
      "Tools: small utilities such as word counters, converters, calculators and generators.",
      "Apps: free software listed by platform, each linked to the publisher's official site.",
      "Guides: articles and how-tos about the games, tools and apps on the site.",
    ],
  },
  { type: "h2", text: "Where the games come from" },
  {
    type: "p",
    text: "Gametroz does not develop the games. They are HTML5 games supplied by a third-party provider, GameMonetize, and they are embedded from the provider's servers rather than hosted by Gametroz. Game titles, descriptions and instructions come from the provider, with formatting cleaned up. Gameplay is governed by the provider's own terms and privacy policy.",
  },
  {
    type: "p",
    text: "Not every game from the provider is listed. Our editorial policy explains how games are chosen and checked before they appear on the site.",
  },
  { type: "h2", text: "How the tools work" },
  {
    type: "p",
    text: "Where a tool can run in your browser, it does. The text or files you use with it are processed on your device and are not uploaded to or stored on our servers. A tool that needs anything different says so on its own page.",
  },
  { type: "h2", text: "How the apps directory works" },
  {
    type: "p",
    text: "App pages summarize what a program does, which platforms it supports and its license, and they link to the publisher's official website. Gametroz does not host, repackage or modify any downloads.",
  },
  { type: "h2", text: "Who is behind Gametroz" },
  {
    type: "p",
    text: "Gametroz is an independent website. We do not publish personal profiles, user ratings or reviews, and we do not claim expertise we cannot show: pages describe what a game, tool or app is and does, based on the provider's information and the publisher's own site.",
  },
  { type: "h2", text: "Report a problem" },
  {
    type: "p",
    text: `Found a broken game, a wrong detail or content that should not be here? Write to ${siteConfig.contactEmail} with the page address and a short description. See the Contact page for the topics we handle, and the editorial policy for how corrections are made.`,
  },
];

export default function AboutPage() {
  return (
    <LegalDocument
      title="About Gametroz"
      path="/about"
      intro="Gametroz brings free browser games, online tools and a directory of useful apps together in one place."
      updatedAt="2026-10-02"
      blocks={blocks}
    />
  );
}
