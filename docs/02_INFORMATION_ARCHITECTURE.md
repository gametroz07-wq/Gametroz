# 02 — Information Architecture

# 1. Navegación principal

Desktop:

```text
GAMETROZ | Games | Tools | Apps | Guides | Search
```

Mobile:

```text
Logo | Search | Menu
```

Menú móvil:

- Home
- Games
- Tools
- Apps
- Guides
- Categories

---

# 2. URLs principales

```text
/
 /games
 /tools
 /apps
 /guides
 /search
```

---

# 3. Arquitectura Games

```text
/games
/games/action
/games/adventure
/games/arcade
/games/casual
/games/cars
/games/multiplayer
/games/puzzle
/games/racing
/games/sports
/games/strategy

/game/[slug]
```

Ejemplo:

```text
/game/moto-x3m
```

La página de juego debe contener:

- breadcrumb;
- título;
- zona del juego;
- fullscreen;
- favorito;
- rating opcional;
- descripción única;
- controles;
- características;
- categoría;
- tags;
- juegos relacionados;
- juegos de la misma categoría;
- bloque "Play next".

---

# 4. Arquitectura Tools

```text
/tools
/tools/images
/tools/pdf
/tools/text
/tools/developer
/tools/calculators
/tools/seo
/tools/converters

/tool/[slug]
```

Ejemplos:

```text
/tool/webp-to-jpg
/tool/image-compressor
/tool/word-counter
/tool/json-formatter
/tool/percentage-calculator
```

Cada herramienta debe ser realmente funcional.

---

# 5. Arquitectura Apps

```text
/apps
/apps/windows
/apps/android
/apps/mac
/apps/linux
/apps/browser

/app/[slug]
```

Ejemplo:

```text
/app/vlc-media-player
```

Ficha:

- logo;
- nombre;
- categoría;
- descripción;
- versión;
- publisher;
- plataformas;
- licencia;
- website oficial;
- botón "Visit official download";
- screenshots;
- características;
- requisitos;
- alternativas;
- guías relacionadas.

No usar un botón que haga creer que Gametroz aloja un archivo cuando realmente redirige al proveedor.

---

# 6. Arquitectura Guides

```text
/guides
/guides/games
/guides/tools
/guides/apps

/guide/[slug]
```

Ejemplos:

```text
/guide/how-to-compress-images-without-losing-quality
/guide/best-free-video-players
```

---

# 7. Home

Orden inicial:

1. Hero.
2. Search.
3. Trending Games.
4. Play Now.
5. Popular Tools.
6. Recommended Apps.
7. New Games.
8. Game categories.
9. Useful Tools.
10. Guides.
11. Footer.

No mostrar todos los contenidos simultáneamente.

La home debe priorizar descubrimiento.

---

# 8. Search

Un único buscador global.

Debe encontrar:

- games;
- tools;
- apps;
- guides.

Formato de resultados:

```text
All | Games | Tools | Apps | Guides
```

Debe soportar:

- coincidencia por nombre;
- slug;
- tags;
- categorías;
- aliases.

---

# 9. Related Content Engine

Toda página debe terminar ofreciendo un siguiente paso.

Ejemplo:

```text
Juego
 ↓
Similar games
 ↓
Same category
 ↓
Trending
```

Tool:

```text
Tool
 ↓
Related tools
 ↓
Popular tools
```

App:

```text
App
 ↓
Alternatives
 ↓
Related guides
```

Esto es fundamental para páginas vistas por sesión.
