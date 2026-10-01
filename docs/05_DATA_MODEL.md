# 05 — Data Model

Modelo conceptual. Claude puede ajustar nombres técnicos conservando esta estructura lógica.

---

# Game

```text
Game
- id
- provider
- providerGameId
- name
- slug
- shortDescription
- description
- instructions
- embedUrl
- thumbnailUrl
- heroImageUrl
- orientation
- width
- height
- language
- status
- featured
- trending
- publishedAt
- createdAt
- updatedAt
```

Relaciones:

```text
Game -> Category
Game -> Tags
Game -> Provider
```

---

# GameCategory

```text
GameCategory
- id
- name
- slug
- description
- image
- featured
```

---

# Tag

```text
Tag
- id
- name
- slug
```

---

# Tool

```text
Tool
- id
- name
- slug
- categoryId
- shortDescription
- description
- status
- featured
- componentKey
- publishedAt
- createdAt
- updatedAt
```

`componentKey` identifica qué implementación funcional renderizar.

Ejemplo:

```text
image-compressor
webp-to-jpg
json-formatter
```

---

# ToolCategory

```text
ToolCategory
- id
- name
- slug
- description
```

---

# App

```text
App
- id
- name
- slug
- publisher
- shortDescription
- description
- version
- license
- officialWebsite
- officialDownloadUrl
- iconUrl
- status
- featured
- lastVerifiedAt
- createdAt
- updatedAt
```

---

# Platform

```text
Platform
- id
- name
- slug

Examples:
windows
android
macos
linux
browser
```

Relación many-to-many:

```text
AppPlatform
```

---

# Guide

```text
Guide
- id
- title
- slug
- excerpt
- content
- status
- publishedAt
- updatedAt
```

Puede relacionarse con:

```text
Game
Tool
App
```

---

# Provider

```text
Provider
- id
- name
- slug
- baseUrl
- enabled
- termsUrl
- lastSyncAt
```

---

# ImportRecord

Registrar cada importación:

```text
ImportRecord
- id
- providerId
- startedAt
- completedAt
- totalReceived
- created
- updated
- ignored
- failed
- logs
```

---

# Redirect

Para SEO:

```text
Redirect
- id
- oldPath
- newPath
- type
```

---

# SearchAlias

Permite que:

```text
"gta"
"car games"
"juegos carros"
```

encuentren contenido relacionado.

```text
SearchAlias
- id
- query
- targetType
- targetId
```

---

# Analytics Events

No almacenar analytics completos en PostgreSQL inicialmente.

Eventos propios mínimos:

```text
game_play
game_fullscreen
related_click
tool_execute
app_official_download_click
search
favorite
```
