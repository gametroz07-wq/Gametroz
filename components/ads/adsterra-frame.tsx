"use client";

import { useSyncExternalStore } from "react";
import { ADSTERRA_FRAME_SANDBOX } from "@/lib/ads/adsterra";

export type AdsterraFrameCandidate = { media: string; width: number; height: number; srcDoc: string };

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

/**
 * Loads the first candidate whose media query matches the viewport. Nothing is rendered on the
 * server or before hydration, so only the size that is actually visible requests an ad.
 */
export function AdsterraFrame({ candidates }: { candidates: AdsterraFrameCandidate[] }) {
  const index = useSyncExternalStore(
    subscribe,
    () => candidates.findIndex(({ media }) => window.matchMedia(media).matches),
    () => -1,
  );
  const candidate = candidates[index];
  if (!candidate) return null;
  return (
    <iframe
      key={index}
      title="Advertisement"
      srcDoc={candidate.srcDoc}
      width={candidate.width}
      height={candidate.height}
      sandbox={ADSTERRA_FRAME_SANDBOX}
      loading="lazy"
      className="max-w-full border-0"
    />
  );
}
