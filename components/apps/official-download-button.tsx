import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hostname } from "@/lib/format";

/**
 * Always points to the publisher's official site or store. Gametroz never hosts binaries, and the
 * caption names the exact host so the visitor knows where the link leads.
 */
export function OfficialDownloadButton({ url, appName }: { url: string; appName: string }) {
  const host = hostname(url);
  return (
    <div className="space-y-1.5">
      <Button asChild variant="brand" size="lg" className="h-11 px-5 text-base">
        <a href={url} target="_blank" rel="noopener noreferrer nofollow">
          Download from official website
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">
            for {appName} (opens {host} in a new tab)
          </span>
        </a>
      </Button>
      <p className="type-muted text-xs">Opens {host} · Gametroz does not host or modify files</p>
    </div>
  );
}
