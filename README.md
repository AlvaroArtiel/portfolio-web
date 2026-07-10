# portfolio-web

Portfolio/CV de Álvaro Artiel (alvaroartiel.com), construido como monorepo:

- `web/` — sitio Astro (TypeScript strict) que consume contenido desde Sanity.
- `studio/` — Sanity Studio, apuntando al proyecto existente `1qxvh1it` (dataset `production`).
- `api/contact.php` — endpoint PHP para el formulario de contacto (hosting Hostinger).

## Comandos

En `web/`:

```bash
npm run dev     # servidor de desarrollo de Astro
npm run build   # build de producción
```

En `studio/`:

```bash
npm run dev     # servidor de desarrollo de Sanity Studio
```

## Documentación

Ver el spec de diseño en `docs/superpowers/specs/2026-07-10-portfolio-web-design.md`.
