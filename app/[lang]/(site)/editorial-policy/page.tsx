import { LegalDocument } from "@/components/shared/legal-document";
import { pageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import type { GuideBlock } from "@/types/content";

export const metadata = pageMetadata({
  title: "Editorial Policy",
  description:
    "How Gametroz selects and checks games, where its content comes from, how external links are handled and how to report a problem or request a correction.",
  path: "/editorial-policy",
});

const blocks: GuideBlock[] = [
  { type: "h2", text: "Games: how they are selected" },
  {
    type: "p",
    text: "Games come from the catalog of a third-party provider, GameMonetize. We do not list the whole catalog. Candidates are drawn from the provider's own popularity feeds, such as most played, best, hot and editor picks, so the site starts from games people already play.",
  },
  {
    type: "p",
    text: "Every candidate goes through automated technical checks before it can be published:",
  },
  {
    type: "ul",
    items: [
      "The game and its thumbnail must load from the provider's approved HTTPS hosts.",
      "The thumbnail must be reachable and the game size must be reasonable.",
      "The title must be usable, and the description and instructions must be present and not trivially short.",
      "Duplicates of games already on the site are rejected.",
    ],
  },
  {
    type: "p",
    text: "Games that pass are stored for review, not published. A person publishes them, in small batches. Games that raise editorial flags, for example a third-party brand name in the title or tags, a spam-like title or very thin text, are published only after a manual review.",
  },
  { type: "h2", text: "Games: where the text comes from" },
  {
    type: "p",
    text: "Game titles, descriptions and instructions are supplied by the provider. We remove markup and repair obvious formatting errors, but we do not rewrite them or add claims about the game. We do not show ratings or reviews, because the site has none.",
  },
  { type: "h2", text: "Tools" },
  {
    type: "p",
    text: "Tools are written and maintained for Gametroz. Where a tool can run in your browser it does, so the text or files you use are processed on your device and are not uploaded or stored. Tool pages explain what the tool does and how to use it.",
  },
  { type: "h2", text: "Apps and external links" },
  {
    type: "p",
    text: "Each app page links to the publisher's official website, and the download button says where it leads and opens in a new tab. Gametroz does not host, repackage or modify downloads. External links on the site are marked so that Gametroz does not pass ranking signals to them, and we are not responsible for the content of other websites.",
  },
  { type: "h2", text: "Guides" },
  {
    type: "p",
    text: "Guides are published by Gametroz and show the date they were published. They link to the games, tools and apps they discuss.",
  },
  { type: "h2", text: "Corrections and removals" },
  {
    type: "p",
    text: `If a game does not work, a detail is wrong or you believe content infringes your rights, write to ${siteConfig.contactEmail} with the page address. A game can be taken offline at any time, and a corrected detail is updated on the page. Game text that comes from the provider may also need to be corrected at its source.`,
  },
];

export default function EditorialPolicyPage() {
  return (
    <LegalDocument
      title="Editorial Policy"
      path="/editorial-policy"
      intro="How Gametroz chooses what to list, where the content comes from and how mistakes are corrected."
      updatedAt="2026-10-02"
      blocks={blocks}
    />
  );
}
