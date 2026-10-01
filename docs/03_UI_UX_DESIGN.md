# 03 — UI / UX Design

# 1. Dirección visual

Gametroz debe utilizar una interfaz moderna de entretenimiento + tecnología.

Inspiración conceptual:

- interfaces gaming modernas;
- dashboards limpios;
- marketplaces;
- plataformas multimedia.

NO copiar diseños existentes.

---

# 2. Tema

Implementar:

- Dark mode como identidad principal.
- Light mode disponible.
- Preferencia persistente.

---

# 3. Paleta inicial

Claude puede ajustar los valores exactos, pero debe mantener una identidad basada en:

## Dark

```text
Background:    #0B0D12
Surface:       #121620
Surface 2:     #191F2C
Text:          #F7F8FA
Text muted:    #9CA3AF
```

## Marca

Gradiente sugerido:

```text
Violet → Cyan
```

Ejemplo:

```text
#7C3AED → #06B6D4
```

No abusar del gradiente.

Debe aparecer principalmente en:

- logo;
- CTAs importantes;
- estados activos;
- pequeños highlights.

---

# 4. Logo

Inicialmente puede ser tipográfico:

**GAMETROZ**

Con una "G" o símbolo abstracto independiente para favicon/app icon.

Tagline:

```text
Play · Tools · Apps
```

No colocar el tagline en todos los headers.

---

# 5. Tipografía

Preferencia:

- Geist Sans
- Inter
- Manrope

Usar máximo dos familias.

Jerarquía clara:

```text
H1  40–56 desktop / 32–40 mobile
H2  28–36
H3  20–24
Body 16
Small 13–14
```

---

# 6. Header

Desktop:

```text
┌───────────────────────────────────────────────────────┐
│ GAMETROZ   Games Tools Apps Guides      Search  Theme │
└───────────────────────────────────────────────────────┘
```

Características:

- sticky;
- blur discreto;
- máximo 72 px;
- responsive;
- búsqueda accesible.

---

# 7. Hero

No usar un hero enorme que desperdicie pantalla.

Ejemplo conceptual:

```text
┌──────────────────────────────────────────────────┐
│                                                 │
│       Play. Create. Discover.                   │
│                                                 │
│  Free games, online tools and useful apps.      │
│                                                 │
│  [ Search games, tools and apps... ]            │
│                                                 │
│  Trending: Racing · PDF · Images · Windows      │
└──────────────────────────────────────────────────┘
```

---

# 8. Cards de juegos

Desktop:

```text
┌──────────────────────┐
│                      │
│      Thumbnail       │
│                      │
├──────────────────────┤
│ Game title           │
│ Racing · ★ 4.6       │
└──────────────────────┘
```

Características:

- ratio consistente;
- border-radius 14–18px;
- hover sutil;
- lazy loading;
- título máximo 2 líneas;
- thumbnail optimizado.

Para grids muy densos, la información secundaria puede aparecer al hover.

---

# 9. Página de juego

Desktop:

```text
Breadcrumb

Game title

┌─────────────────────────────────────┬────────────┐
│                                     │            │
│                                     │ Optional   │
│             GAME                    │ sidebar    │
│                                     │            │
│                                     │            │
└─────────────────────────────────────┴────────────┘

[Fullscreen] [Favorite] [Share]

Description

How to play

Related games
```

Mobile:

- juego primero;
- controles después;
- relacionados inmediatamente debajo.

El juego debe tener suficiente espacio y ninguna publicidad debe ocultar controles.

---

# 10. Tools

Las herramientas deben parecer aplicaciones reales.

Ejemplo:

```text
┌──────────────────────────────────────────────┐
│ WebP to JPG                                 │
│ Convert images directly in your browser     │
├──────────────────────────────────────────────┤
│                                              │
│            Drag files here                   │
│                                              │
│              [Browse]                        │
│                                              │
└──────────────────────────────────────────────┘
```

La interfaz funcional tiene prioridad sobre SEO content.

---

# 11. Apps

Card:

```text
┌──────────────────────────────────────┐
│ ICON   VLC Media Player              │
│        Video                         │
│        Windows · macOS · Linux       │
└──────────────────────────────────────┘
```

Ficha:

```text
ICON   VLC Media Player
       Free multimedia player

       [Official Download ↗]

Version
Publisher
License
Platforms
```

---

# 12. Espacios publicitarios

El layout debe prever espacios publicitarios sin insertarlos inicialmente.

Componentes:

```text
<AdSlot placement="home-feed" />
<AdSlot placement="game-below-player" />
<AdSlot placement="sidebar" />
<AdSlot placement="content-inline" />
```

En desarrollo:

```text
ADVERTISEMENT
```

No cargar scripts de publicidad hasta fase de monetización.

---

# 13. Accesibilidad

Requerido:

- contraste WCAG razonable;
- focus visible;
- navegación teclado;
- aria-label;
- botones reales;
- alt text;
- no usar texto diminuto;
- evitar animaciones excesivas.

---

# 14. Responsive

Breakpoints mínimos:

```text
mobile:  < 640
tablet:  640–1024
desktop: > 1024
wide:    > 1440
```

El producto debe diseñarse primero para móvil.

---

# 15. Performance

Objetivo:

- LCP < 2.5 s
- CLS < 0.1
- INP < 200 ms cuando sea razonable

Nunca cargar:

- cientos de thumbnails upfront;
- iframes de juegos fuera del viewport;
- scripts publicitarios antes de consentimiento/configuración;
- JS innecesario.
