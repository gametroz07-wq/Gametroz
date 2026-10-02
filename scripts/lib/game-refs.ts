import type { GameRef } from "@/lib/providers/publish";

/** Builds an explicit list of games from --slug, --id or --ids. Never "all". */
export function parseGameRefs(values: { slug?: string; id?: string; ids?: string; provider?: string }): GameRef[] {
  const provider = values.provider;
  const refs: GameRef[] = [];
  if (values.slug) refs.push({ slug: values.slug.trim() });
  if (values.id) refs.push({ providerGameId: values.id.trim(), provider });
  if (values.ids) {
    for (const id of values.ids.split(",").map((value) => value.trim()).filter(Boolean)) refs.push({ providerGameId: id, provider });
  }
  if (!refs.length) throw new Error("Pass --slug <slug>, --id <providerGameId> or --ids <id1,id2,...>.");
  if (refs.length > 100) throw new Error("At most 100 games per command.");
  return refs;
}
