type Env = Record<string, string | undefined>;

export type RevalidationOutcome =
  | { status: "skipped"; reason: string }
  | { status: "ok" }
  | { status: "failed"; reason: string };

/**
 * Asks the running site to refresh game pages (POST /api/revalidate). Used by the publish and
 * archive CLIs. Needs REVALIDATE_ENDPOINT (e.g. https://gametroz.online/api/revalidate) and
 * REVALIDATE_SECRET; without them the change still applies and pages refresh on their ISR timer.
 */
export async function requestRevalidation(slugs: string[], env: Env = process.env): Promise<RevalidationOutcome> {
  const endpoint = env.REVALIDATE_ENDPOINT?.trim();
  const secret = env.REVALIDATE_SECRET?.trim();
  if (!endpoint || !secret) return { status: "skipped", reason: "REVALIDATE_ENDPOINT or REVALIDATE_SECRET is not set" };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
      body: JSON.stringify({ slugs }),
      signal: AbortSignal.timeout(15_000),
    });
    return response.ok ? { status: "ok" } : { status: "failed", reason: `HTTP ${response.status}` };
  } catch (error) {
    return { status: "failed", reason: error instanceof Error ? error.message : "network error" };
  }
}
