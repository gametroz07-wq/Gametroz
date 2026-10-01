# 10 — Initial Prompt for Claude

Copia este prompt en Claude dentro del editor cuando vayas a iniciar el proyecto.

---

Quiero que construyamos un nuevo proyecto llamado **Gametroz**, cuyo dominio será `gametroz.online`.

Gametroz será un ecosistema de:

- juegos HTML5;
- herramientas online;
- aplicaciones/software;
- guías.

La marca utilizará el tagline:

**Gametroz — Play · Tools · Apps**

Antes de escribir código debes leer todos los documentos `.md` incluidos en la carpeta `/docs`, especialmente:

- PRODUCT_VISION
- INFORMATION_ARCHITECTURE
- UI_UX_DESIGN
- TECHNICAL_ARCHITECTURE
- DATA_MODEL
- SEO_AND_CONTENT
- MONETIZATION
- IMPLEMENTATION_PLAN
- CLAUDE_EXECUTION_RULES

## IMPORTANTE

No construyas todo el proyecto inmediatamente.

Quiero comenzar exclusivamente por:

### FASE 0 — Foundation

Tu trabajo en esta primera fase será:

1. inspeccionar el directorio;
2. crear el proyecto Next.js con TypeScript si todavía no existe;
3. configurar Tailwind;
4. instalar/configurar shadcn/ui solo si corresponde;
5. preparar la estructura base;
6. crear layout principal;
7. configurar metadata general de Gametroz;
8. preparar `.env.example`;
9. configurar scripts `lint`, `typecheck` y `build`;
10. crear `STATUS.md`;
11. crear una home mínima/placeholder visualmente limpia.

No conectes todavía:

- GameMonetize;
- GameDistribution;
- Famobi;
- Adsterra;
- PostgreSQL;
- Prisma;
- Analytics.

No importes juegos.

No construyas aún las páginas finales.

## Validación obligatoria

Antes de entregar la FASE 0 ejecuta:

```bash
npm run lint
npm run typecheck
npm run build
```

Los tres deben finalizar correctamente.

Después entrega un informe con:

- estructura creada;
- dependencias instaladas;
- archivos principales;
- resultado de validaciones;
- riesgos o decisiones;
- siguiente fase propuesta.

No pases a la FASE 1 sin mi aprobación.
