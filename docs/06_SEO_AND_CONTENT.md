# 06 — SEO and Content Strategy

# 1. Principio

Gametroz debe escalar mediante **SEO programático con contenido útil**, no mediante generación masiva de páginas vacías.

Cada URL indexable debe tener:

- propósito claro;
- contenido principal real;
- metadata única;
- internal links;
- canonical correcto;
- valor suficiente para el usuario.

---

# 2. Indexación

Indexar:

- juegos publicados;
- herramientas funcionales;
- apps verificadas;
- guías;
- categorías con contenido suficiente.

No indexar:

- búsquedas internas;
- filtros arbitrarios;
- paginaciones sin valor;
- draft;
- preview;
- parámetros;
- páginas sin contenido.

---

# 3. Metadata

Cada página:

```text
title
description
canonical
openGraph
twitter
```

Ejemplo game:

```text
Play {Game Name} Online Free | Gametroz
```

No repetir exactamente el mismo patrón si produce títulos artificiales.

---

# 4. Structured Data

Usar solo schemas que realmente correspondan.

Posibles:

- WebSite.
- BreadcrumbList.
- SoftwareApplication para software cuando aplique.
- Article para guías.

No inventar ratings/reviews.

---

# 5. Sitemaps

Generar sitemaps separados si el volumen crece:

```text
/sitemap.xml

/sitemaps/games-1.xml
/sitemaps/tools.xml
/sitemaps/apps.xml
/sitemaps/guides.xml
```

## Implementation status (Tools section)

- `app/sitemap.ts` is live and returns `[]` while `NEXT_PUBLIC_INDEXING_ENABLED` is not `true`. Once enabled it lists home, `/games`, `/tools`, `/tools/<category>`, `/tool/<slug>`, `/apps` and `/guides` (built by `lib/seo/sitemap.ts`). Game, app and guide detail pages are not in the sitemap yet.
- JSON-LD (`components/seo/json-ld.tsx`, builders in `lib/seo/structured-data.ts`): `BreadcrumbList` on `/tools`, `/tools/<category>` and tool pages; `WebApplication` on tool pages; `FAQPage` only when the FAQ is visible on the page. No ratings or reviews.
- Tool content (meta title/description, intro, examples, FAQ) lives in `lib/tools/definitions.ts`. `npm run tools:sync` (dry run by default, `--apply` to write) syncs it to the database and archives published tools that are no longer defined.

---

# 6. Internal Linking

Games:

```text
game
→ category
→ related games
→ tags
→ trending
```

Tools:

```text
tool
→ category
→ related tools
→ guides
```

Apps:

```text
app
→ platform
→ category
→ alternatives
→ guides
```

---

# 7. Content uniqueness

Las descripciones importadas de proveedores NO deben constituir todo el valor SEO.

Agregar progresivamente:

- resumen editorial;
- instrucciones;
- características;
- controles;
- recomendaciones;
- relaciones;
- datos propios.

No reescribir automáticamente texto solo para aparentar originalidad.

---

# 8. Internationalization

Fase 1:

```text
/en
```

o idioma principal único.

Antes de implementar multiidioma, definir estrategia definitiva.

Opción futura:

```text
/en/
/es/
/pt/
```

Con hreflang real.

No traducir automáticamente 10.000 URLs sin validación.

---

# 9. Programmatic SEO

Páginas programáticas válidas:

```text
/games/racing
/games/puzzle
/apps/windows
/tools/images
```

Posible futuro:

```text
/games/multiplayer/racing
```

solo si existe demanda y contenido suficientemente diferente.

Evitar combinaciones infinitas.

---

# 10. Content score interno

Antes de publicar una ficha automáticamente se puede calcular:

```text
thumbnail valid
description >= threshold
category available
provider approved
embed URL valid
title valid
not duplicate
```

Resultado:

```text
PUBLISHABLE
NEEDS_REVIEW
REJECTED
```

---

# 11. SEO metrics

Medir:

- indexed URLs;
- non-indexed URLs;
- clicks;
- impressions;
- CTR;
- average position;
- organic landing pages;
- pages receiving 0 impressions;
- pages losing traffic.

Contenido sin impresiones durante largos periodos debe revisarse, combinarse o archivarse.
