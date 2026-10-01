# GAMETROZ — Play · Tools · Apps

## Propósito del proyecto

Gametroz será un ecosistema web internacional orientado a tres tipos de contenido gratuito:

1. **Games** — Juegos HTML5 jugables directamente en el navegador.
2. **Tools** — Herramientas online gratuitas.
3. **Apps / Software** — Fichas de software y aplicaciones con información útil y enlaces de descarga oficiales.
4. **Guides** — Guías, tutoriales, comparaciones y contenido de apoyo.

Dominio principal previsto:

`https://gametroz.online`

Tagline de marca:

> **Gametroz — Play · Tools · Apps**

El objetivo de negocio es construir un portal escalable, orientado a SEO, navegación recurrente y monetización publicitaria. El sitio debe poder crecer desde cientos hasta miles de URLs sin convertirse en contenido duplicado o de baja calidad.

---

# Objetivos iniciales

## MVP

Lanzar una primera versión sólida con:

- Home.
- Sección de juegos.
- Sección de herramientas.
- Sección de software/apps.
- Sección de guías.
- Buscador global.
- Categorías.
- Páginas de detalle.
- Sistema de relacionados.
- SEO técnico.
- Analytics.
- Espacios publicitarios preparados pero no agresivos.
- Arquitectura preparada para importar contenido mediante APIs.

## Objetivo de contenido inicial

- 500–600 juegos.
- 50–100 herramientas.
- 200–300 fichas de software.
- 30–50 guías útiles.

No publicar miles de páginas vacías solo por cantidad.

---

# Principios del producto

Gametroz debe ser:

- Rápido.
- Mobile-first.
- Visual.
- Fácil de navegar.
- Internacionalizable.
- Indexable.
- Escalable.
- Seguro.
- Legal respecto al contenido distribuido.
- Diseñado para maximizar páginas vistas sin perjudicar la experiencia.

---

# Stack sugerido

## Frontend

- Next.js 15+ App Router.
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- Lucide Icons.

## Backend

Primera fase:

- Next.js Server Actions / Route Handlers para operaciones simples.

Escalado:

- NestJS API independiente cuando sea necesario.

## Base de datos

- PostgreSQL.
- Prisma ORM.

## Infraestructura

- Frontend: Vercel o Cloudflare.
- API/backend: Render, Railway o infraestructura equivalente.
- Base de datos: Neon / Supabase / PostgreSQL gestionado.
- Assets: Cloudflare R2.

## Observabilidad

- Google Search Console.
- Google Analytics 4.
- Microsoft Clarity.
- Logs de errores.
- Web Vitals.

---

# Documentación

Leer los documentos en este orden:

1. `01_PRODUCT_VISION.md`
2. `02_INFORMATION_ARCHITECTURE.md`
3. `03_UI_UX_DESIGN.md`
4. `04_TECHNICAL_ARCHITECTURE.md`
5. `05_DATA_MODEL.md`
6. `06_SEO_AND_CONTENT.md`
7. `07_MONETIZATION.md`
8. `08_IMPLEMENTATION_PLAN.md`
9. `09_CLAUDE_EXECUTION_RULES.md`
10. `10_INITIAL_PROMPT_FOR_CLAUDE.md`

---

# Regla principal de implementación

**No construir todo al mismo tiempo.**

Claude debe trabajar por fases verificables. Cada fase debe:

1. Crear o modificar solo lo necesario.
2. Ejecutar lint.
3. Ejecutar typecheck.
4. Ejecutar build.
5. Documentar cambios.
6. Esperar aprobación antes de continuar a una fase importante siguiente.
