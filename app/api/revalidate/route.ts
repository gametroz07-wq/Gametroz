import { revalidatePath } from "next/cache";
import { gameCategoryPattern, gamePathsToRevalidate, isAuthorizedRevalidation, parseRevalidateSlugs } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

/**
 * On-demand ISR for game publishing: POST { slugs: string[] } with
 * `Authorization: Bearer $REVALIDATE_SECRET`. Refreshes the home, /games, every category page and
 * each game page, so a newly published game shows up without a redeploy.
 * Returns 404 when no secret is configured, so the endpoint does not exist by default.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return new Response(null, { status: 404 });
  if (!isAuthorizedRevalidation(request.headers.get("authorization"), secret)) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const slugs = parseRevalidateSlugs(await request.json().catch(() => null));
  if (!slugs) return Response.json({ error: "body must be { slugs: string[] } with valid slugs" }, { status: 400 });

  const paths = gamePathsToRevalidate(slugs);
  for (const path of paths) revalidatePath(path);
  revalidatePath(gameCategoryPattern, "page");

  return Response.json({ revalidated: [...paths, gameCategoryPattern] }, { headers: { "Cache-Control": "no-store" } });
}
