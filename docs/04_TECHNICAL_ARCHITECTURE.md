# 04 — Technical Architecture

# 1. Arquitectura inicial

```text
Browser
   │
   ↓
Next.js
   │
   ├── Server Components
   ├── Client Components
   ├── Route Handlers
   │
   ↓
Prisma
   │
   ↓
PostgreSQL
```

Servicios externos:

```text
Game Providers
Analytics
Ad network
Object storage
Search
```

---

# 2. Estructura sugerida

```text
gametroz/
├── app/
│   ├── (site)/
│   │   ├── page.tsx
│   │   ├── games/
│   │   ├── game/[slug]/
│   │   ├── tools/
│   │   ├── tool/[slug]/
│   │   ├── apps/
│   │   ├── app/[slug]/
│   │   ├── guides/
│   │   ├── guide/[slug]/
│   │   └── search/
│   │
│   ├── api/
│   │   ├── games/
│   │   ├── search/
│   │   └── sync/
│   │
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
│
├── components/
│   ├── layout/
│   ├── games/
│   ├── tools/
│   ├── apps/
│   ├── guides/
│   ├── search/
│   ├── ads/
│   └── ui/
│
├── lib/
│   ├── db/
│   ├── providers/
│   ├── seo/
│   ├── search/
│   ├── analytics/
│   └── utils/
│
├── prisma/
│   └── schema.prisma
│
├── public/
├── scripts/
├── types/
└── docs/
```

---

# 3. Game Provider Adapter

No acoplar el proyecto directamente a un proveedor.

Crear interfaz:

```ts
interface GameProvider {
  getGames(): Promise<ProviderGame[]>
  getGame(id: string): Promise<ProviderGame | null>
  normalize(game: ProviderGame): NormalizedGame
}
```

Implementaciones futuras:

```text
GameMonetizeProvider
GameDistributionProvider
FamobiProvider
```

Así un proveedor puede cambiar sin romper Gametroz.

---

# 4. Normalización

Los proveedores pueden entregar campos diferentes.

Gametroz debe almacenar un modelo normalizado:

```text
provider
providerGameId
name
slug
description
instructions
category
tags
thumbnail
embedUrl
orientation
width
height
languages
status
```

Nunca depender del JSON bruto del proveedor para renderizar páginas.

---

# 5. Sincronización

Crear un proceso separado.

```text
Provider API
    ↓
Fetch
    ↓
Validate
    ↓
Normalize
    ↓
Deduplicate
    ↓
Database
    ↓
Publish
```

Estados:

```text
DRAFT
REVIEW
PUBLISHED
ARCHIVED
```

No publicar automáticamente cualquier contenido recibido.

---

# 6. Software/App Sources

Cada software debe tener:

- website oficial;
- publisher;
- download page oficial;
- license;
- verified timestamp.

No descargar/redistribuir binarios en MVP.

---

# 7. Tools

Preferir herramientas client-side cuando sea posible.

Ejemplos:

- JSON formatter;
- Base64;
- word counter;
- image resize;
- WebP/JPG;
- calculators.

Beneficios:

- menor coste backend;
- privacidad;
- velocidad.

Procesamiento pesado:

```text
Browser → API → worker → output
```

solo cuando sea necesario.

---

# 8. Search

MVP:

PostgreSQL full-text / trigram.

Escalado posterior:

- Meilisearch;
- Typesense;
- Algolia.

No introducir una tecnología adicional hasta demostrar necesidad.

---

# 9. Cache

Usar:

- Next.js caching;
- CDN;
- ISR cuando sea apropiado;
- cache de proveedores.

Las páginas públicas no deben consultar APIs de proveedores en cada request.

---

# 10. Security

Requerido:

- sanitización de datos externos;
- CSP;
- protección contra XSS;
- validar URLs de embeds;
- allowlist de dominios proveedores;
- rate limiting APIs;
- no ejecutar HTML arbitrario;
- no aceptar iframes de dominios desconocidos.

---

# 11. Environment variables

Ejemplo:

```env
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=https://gametroz.online

GAMEMONETIZE_API_KEY=
GAMEDISTRIBUTION_API_KEY=

NEXT_PUBLIC_GA_ID=

ADSTERRA_ENABLED=false
```

Nunca hardcodear secretos.

---

# 12. Deployment environments

```text
local
preview
production
```

Producción:

```text
gametroz.online
```

Preview no indexable.

---

# 13. Quality gates

Antes de aceptar cada fase:

```bash
npm run lint
npm run typecheck
npm run build
```

Todos deben terminar sin errores.
