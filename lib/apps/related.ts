type RelatedSubject = { slug: string; platforms: string[]; tags: string[]; alternatives: string[] };
type RelatedCandidate = { slug: string; platforms: string[]; tags: string[] };

const shared = (a: string[], b: string[]) => a.filter((value) => b.includes(value)).length;

/**
 * "Related apps" for an app page. Candidates come from the same category (the caller filters that, in
 * the database). The app itself and its editorial alternatives are excluded, because those have their own
 * section. At least one shared platform is required, then more shared platforms and tags rank higher;
 * ties keep the incoming (editorial) order. The list is never padded with unrelated apps.
 */
export function rankRelatedApps<T extends RelatedCandidate>(app: RelatedSubject, candidates: T[], limit: number): T[] {
  const excluded = new Set([app.slug, ...app.alternatives]);
  return candidates
    .filter((candidate) => !excluded.has(candidate.slug))
    .map((candidate, index) => ({
      candidate,
      index,
      platforms: shared(app.platforms, candidate.platforms),
      tags: shared(app.tags, candidate.tags),
    }))
    .filter((entry) => entry.platforms > 0)
    .sort((a, b) => b.platforms - a.platforms || b.tags - a.tags || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}
