# 09 — Claude Execution Rules

Este documento contiene reglas para la IA que implemente Gametroz.

# 1. Regla principal

NO intentes construir el proyecto completo de una sola vez.

Trabaja por fases.

---

# 2. Antes de modificar

Siempre:

1. inspecciona archivos;
2. entiende arquitectura existente;
3. lee documentación `/docs`;
4. identifica la fase actual;
5. describe brevemente lo que harás.

---

# 3. Después de modificar

Ejecutar siempre que aplique:

```bash
npm run lint
npm run typecheck
npm run build
```

Si alguno falla:

- corregir;
- volver a ejecutar;
- no declarar la fase terminada mientras exista un error.

---

# 4. No introducir dependencias innecesarias

Antes de instalar una librería:

- verificar que resuelva una necesidad real;
- preferir capacidades nativas;
- no duplicar librerías.

---

# 5. No inventar APIs

Para proveedores externos:

- consultar documentación real;
- guardar adapter separado;
- no asumir campos;
- manejar errores.

---

# 6. Seguridad

Nunca:

- exponer API keys;
- hardcodear secrets;
- renderizar HTML externo sin sanitizar;
- permitir iframe arbitrario;
- ejecutar scripts externos no autorizados.

---

# 7. SEO

No crear:

- miles de páginas placeholder;
- contenido duplicado;
- categorías vacías;
- parámetros indexables innecesarios.

---

# 8. UX

Mobile-first.

No sacrificar UX por publicidad.

No colocar:

- botones falsos;
- anuncios confundibles con descargas;
- overlays que bloqueen contenido;
- autoplay molesto.

---

# 9. Código

Preferir:

- TypeScript estricto;
- componentes pequeños;
- Server Components por defecto;
- Client Components solo cuando son necesarios;
- nombres descriptivos;
- reutilización razonable.

Evitar sobrearquitectura.

---

# 10. Commits / STATUS

Después de cada fase crear o actualizar:

```text
STATUS.md
```

Formato:

```md
# Current phase

## Completed
- ...

## Validation
- lint: PASS
- typecheck: PASS
- build: PASS

## Pending
- ...

## Next
- ...
```

---

# 11. No continuar sin aprobación cuando

Detenerse antes de:

- importar >100 juegos;
- cambiar proveedor;
- agregar monetización;
- cambiar esquema de URLs;
- cambiar stack principal;
- borrar datos;
- ejecutar una migración destructiva.

---

# 12. Prioridad

En caso de conflicto:

```text
Correctness
Security
UX
Performance
SEO
Scale
Monetization
```
