# 08 — Implementation Plan

Claude debe ejecutar el proyecto por fases.

---

# FASE 0 — Foundation

Objetivo:

Crear el repositorio y las bases técnicas.

Tareas:

- Next.js + TypeScript.
- Tailwind.
- shadcn/ui.
- ESLint.
- estructura de carpetas.
- variables de entorno.
- README.
- metadata base.
- layout principal.

Entrega:

- home placeholder limpia;
- build exitoso.

No implementar proveedores todavía.

---

# FASE 1 — Design System

Crear:

- Header.
- Footer.
- Container.
- typography.
- cards.
- badges.
- buttons.
- tabs.
- search field.
- theme toggle.
- skeleton loaders.
- AdSlot placeholder.

Crear página `/design-system` solo en desarrollo si resulta útil.

---

# FASE 2 — Static UX Prototype

Construir con datos mock:

- Home.
- Games listing.
- Game detail.
- Tools listing.
- Tool detail mock.
- Apps listing.
- App detail.
- Guides listing.

Objetivo:

Validar diseño antes de conectar DB/APIs.

---

# FASE 3 — Database

Configurar:

- PostgreSQL.
- Prisma.
- schema.
- migrations.
- seed.

Insertar contenido mock.

Reemplazar mocks del frontend por DB.

---

# FASE 4 — Game Provider Layer

Crear:

```text
GameProvider interface
GameMonetize adapter
```

Primero probar con:

- máximo 20 juegos.

Validar:

- API.
- normalización.
- thumbnail.
- iframe/embed.
- categorías.

NO importar cientos todavía.

---

# FASE 5 — Game Catalog MVP

Cuando fase 4 esté validada:

- importar 100;
- luego 500;
- finalmente 600+.

Agregar:

- related games;
- trending;
- new;
- categories;
- fullscreen.

---

# FASE 6 — Search

Implementar búsqueda global.

Buscar:

- games;
- tools;
- apps;
- guides.

Registrar search queries.

---

# FASE 7 — Tools Engine

Crear sistema:

```text
Tool record
+
componentKey
+
React implementation
```

Primeras herramientas:

1. Word Counter.
2. Character Counter.
3. JSON Formatter.
4. Base64 Encoder / Decoder.
5. UUID Generator.
6. Percentage Calculator.
7. Image Resizer.
8. WebP to JPG.
9. PNG to JPG.
10. Image Compressor.

Validar patrón antes de crear más.

---

# FASE 8 — Apps

Crear 20 fichas iniciales manualmente/verificadas.

No automatizar scraping todavía.

Validar:

- estructura;
- official download;
- license;
- platform;
- app cards;
- alternatives.

---

# FASE 9 — Guides

Crear sistema editorial.

Añadir 10 guías de alta calidad.

Relacionarlas con games/tools/apps.

---

# FASE 10 — SEO

Implementar:

- metadata.
- canonical.
- robots.
- sitemap.
- breadcrumbs.
- structured data.
- noindex adecuado.

Validar con build.

---

# FASE 11 — Performance

Auditar:

- LCP.
- CLS.
- lazy loading.
- dynamic iframe.
- images.
- JS bundle.

---

# FASE 12 — Analytics

Instalar:

- GA4.
- Search Console verification.
- Clarity opcional.
- eventos propios.

---

# FASE 13 — Ads

Solo después de:

- diseño validado;
- contenido suficiente;
- analytics activo.

Implementar Adsterra detrás del componente AdSlot.

Activar un placement cada vez.

---

# FASE 14 — Scale

Después de tener datos:

- segundo proveedor de juegos;
- más herramientas;
- ingestión software;
- multiidioma;
- search especializado;
- recomendaciones personalizadas.

---

# Definition of Done

Una fase está terminada solo si:

```text
lint      PASS
typecheck PASS
build     PASS
```

y se documentó:

- qué se hizo;
- archivos modificados;
- problemas;
- pendientes.
