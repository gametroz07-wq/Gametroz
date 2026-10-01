import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hostname } from "@/lib/format";

/**
 * Always points to the publisher's official site. Gametroz never hosts binaries,
 * and the label states clearly that the user is leaving the site.
 */
export function OfficialDownloadButton({ url, appName }: { url: string; appName: string }) {
  return (
    <div className="space-y-1.5">
      <Button asChild variant="brand" size="lg" className="h-11 px-5 text-base">
        <a href={url} target="_blank" rel="noopener noreferrer nofollow">
          Official Download
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">for {appName} (opens {hostname(url)} in a new tab)</span>
        </a>
      </Button>
      <p className="type-muted text-xs">
        Opens {hostname(url)}. Gametroz does not host or modify any files.
      </p>
    </div>
  );
}
