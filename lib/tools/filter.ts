// Pure helpers for the instant filter on /tools.

type Filterable = {
  name: string;
  shortDescription: string;
  category: { name: string };
  tags: string[];
};

/** Every word of the query must appear in the name, description, category or tags. */
export function filterTools<T extends Filterable>(tools: T[], query: string): T[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return tools;
  return tools.filter((tool) => {
    const haystack = [tool.name, tool.shortDescription, tool.category.name, ...tool.tags].join(" ").toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}

export function groupToolsByCategory<C extends { slug: string }, T extends { category: { slug: string } }>(
  categories: C[],
  tools: T[],
) {
  return categories
    .map((category) => ({ category, tools: tools.filter((tool) => tool.category.slug === category.slug) }))
    .filter((group) => group.tools.length > 0);
}
