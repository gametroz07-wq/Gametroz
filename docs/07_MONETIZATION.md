# 07 — Monetization Design

# 1. Objetivo

Monetizar principalmente mediante Adsterra, sin sacrificar usabilidad, SEO ni confianza.

La arquitectura debe estar preparada desde el inicio, pero los anuncios se activarán solo después de tener contenido y tráfico suficientes.

---

# 2. Principio

No maximizar:

> anuncios por página

Maximizar:

> páginas útiles vistas por sesión

El usuario debe querer abrir otra página.

---

# 3. Componentes de ads

Crear abstracción:

```tsx
<AdSlot
  placement="..."
  format="..."
/>
```

El componente debe poder:

- quedar desactivado;
- renderizar placeholder;
- habilitar proveedor;
- respetar responsive;
- evitar CLS.

---

# 4. Placements propuestos

## Home

- Feed después de varias cards.
- Entre secciones.

## Game detail

- Debajo del player.
- Entre relacionados.
- Sidebar desktop opcional.

## Tools

- Debajo de la herramienta funcional.
- Entre contenido explicativo y relacionados.

## Apps

- Después del resumen principal.
- Antes de alternativas.

## Guides

- Inline controlado.

---

# 5. Regla para Game iframe

Los anuncios de Gametroz NO deben:

- cubrir el juego;
- confundirse con botones Play;
- interferir con fullscreen;
- impedir controles;
- crear clicks accidentales.

---

# 6. Popunder / Social Bar

No integrar en MVP técnico.

Crear fase específica posterior para:

- comprobar políticas;
- analizar frecuencia;
- medir bounce rate;
- medir ingresos;
- experimentar A/B.

---

# 7. Métricas

Registrar por placement:

```text
impressions
revenue
eCPM
CTR si aplica
viewability
```

Relacionar con:

```text
page type
device
country
traffic source
```

---

# 8. KPI económico

Meta futura del proyecto:

```text
1,000,000+ monetized impressions / month
```

Después utilizar datos reales del dashboard publicitario para determinar cuántas pageviews y usuarios son necesarios.

No asumir un eCPM fijo en código ni documentación financiera.

---

# 9. Experimentos

Ejemplos:

```text
Ad after 8 cards vs 12 cards
sidebar ad vs no sidebar
related games before ad vs after ad
```

Nunca probar dark patterns.

---

# 10. Consentimiento y privacidad

Preparar arquitectura para:

- CMP/cookies si corresponde;
- Privacy Policy;
- Terms;
- DMCA/contact;
- ads disclosure.

El cumplimiento exacto debe revisarse según mercados y proveedores activos.
