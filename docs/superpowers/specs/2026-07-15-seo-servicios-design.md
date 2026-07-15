# SEO por keywords: sección de Servicios + estrategia de contenido

**Fecha:** 2026-07-15
**Estado:** Aprobado (diseño validado en conversación)

## Objetivo

Posicionar la web en el mercado español para keywords comerciales de consultoría:

- **consultoría de diseño de producto** (secundarias: consultor UX/UI, product designer freelance)
- **consultoría de gamificación** (secundarias: gamificación e-learning, experto en gamificación)
- **gestión de proyectos digitales** (secundarias: project manager digital freelance)
- Hub: **consultoría de producto digital** (secundaria: consultor de producto freelance)

Finalidad: captar clientes de consultoría. Mercado: España, en español; las versiones en inglés
existen solo para mantener la paridad hreflang del sitio y son más ligeras.

## Contexto actual

La base técnica ya existe y no se toca: canonical, hreflang es/en, sitemap
(`@astrojs/sitemap`), robots.txt dinámico, OG por sección, JSON-LD `Person` en la home
(`web/src/views/home.astro`) y `CreativeWork` en proyectos. Lo que falta es contenido que
ataque las keywords: no hay ninguna página de servicios.

## Sección 1 — Modelo de contenido en Sanity

Nuevo documento `service` en `studio/schemaTypes/service.ts` (registrado en `index.ts`),
siguiendo el patrón de `project`:

| Campo | Tipo | Notas |
|---|---|---|
| `title` | `localeString` | Nombre visible del servicio |
| `slug` | `slug` | Compartido entre idiomas: `diseno-de-producto`, `gamificacion`, `gestion-de-proyectos` |
| `seoTitle` | `localeString` | `<title>` orientado a keyword, iterable sin tocar código |
| `seoDescription` | `localeText` | Meta description |
| `intro` | `localeText` | Propuesta de valor: H1 + párrafo de apertura |
| `body` | objeto `{es, en}` de bloques (como `project.body`) | Para quién es, cómo trabajo, qué entrego |
| `faqs` | array de `{question: localeString, answer: localeText}` | Alimenta bloque FAQ visible y JSON-LD `FAQPage` |
| `relatedProjects` | array de `reference → project` | Casos reales; también genera el enlace inverso desde la ficha de proyecto |
| `order` | `number` | Orden en hub y menú |
| `visible` | `boolean` (default `true`) | Como en el resto de documentos |

Seed: script con el contenido inicial de los tres servicios (ES completo redactado a
keyword, EN más ligero), siguiendo el flujo de seed existente del proyecto.

## Sección 2 — Rutas y páginas en Astro

- Rutas: `/servicios/` (hub) y `/servicios/[slug]/`, espejo `/en/services/` y
  `/en/services/[slug]/`. Añadir `servicios: 'services'` al `routeMap` de
  `web/src/lib/routes.ts`.
- Vistas nuevas reutilizando `Base.astro` y `BodyBlocks`:
  - `web/src/views/services.astro` — hub: intro corta + tres cartas de servicio.
  - `web/src/views/service-detail.astro` — landing: intro (H1), body, casos relacionados,
    FAQ, CTA a contacto.
- `Base.astro`: nueva sección `services` en el tipo `Section` con su imagen OG
  (`/og/servicios.png`, añadir a `web/scripts/generate-og.mjs`).
- Navegación: "Servicios" entra en Header/MenuOverlay y en el Footer.
- Enlazado interno:
  - Ficha de proyecto → su servicio: si un `service` referencia el proyecto en
    `relatedProjects`, la ficha muestra un enlace tipo "Este proyecto es un caso de
    [servicio]".
  - Home → hub de servicios desde el `CtaBand`.
  - Cada landing → contacto (CTA) y → sus proyectos relacionados.
- Queries GROQ nuevas en `web/src/lib/queries.ts` (lista de servicios visibles ordenados;
  detalle por slug con proyectos expandidos; servicio que referencia un proyecto dado).

## Sección 3 — SEO on-page y datos estructurados

- JSON-LD por landing: `Service` (con `provider` → Person de Álvaro) + `FAQPage`.
- Home: ampliar `knowsAbout` del `Person` con "Consultoría de diseño de producto",
  "Gestión de proyectos digitales" y "Product Management".
- Retitular la home ES incorporando "consultoría" (vía `seoTitle` de siteSettings en
  Sanity, que ya manda sobre el fallback; actualizar también el fallback en código).
- Sitemap y hreflang: automáticos al ser páginas normales del árbol de rutas.

## Sección 4 — Estrategia de blog (sin código)

Calendario editorial inicial: artículos informacionales que enlazan cada uno a su landing
de servicio. Se redactan con el flujo normal de `blogPost`; la redacción queda fuera de
este trabajo.

| Artículo (título orientativo) | Keyword | Enlaza a |
|---|---|---|
| Gamificación en e-learning: qué funciona y qué no | gamificación e-learning | /servicios/gamificacion |
| Cómo gamificar una app sin convertirla en un casino | gamificar una app | /servicios/gamificacion |
| Cómo validar un producto digital antes de desarrollarlo | validar producto digital | /servicios/diseno-de-producto |
| Qué hace un consultor de diseño de producto (y cuándo contratarlo) | consultor diseño de producto | /servicios/diseno-de-producto |
| Cuánto cuesta diseñar un producto digital en 2026 | cuánto cuesta diseñar una app | /servicios/diseno-de-producto |
| Cómo gestionar un proyecto digital con un equipo externo | gestión de proyectos digitales | /servicios/gestion-de-proyectos |
| Errores típicos al externalizar el desarrollo de tu producto | externalizar desarrollo | /servicios/gestion-de-proyectos |
| Sistemas de puntos, niveles y recompensas: guía práctica | sistemas de gamificación | /servicios/gamificacion |

## Fuera de alcance

- Keyword research con herramientas de pago (volúmenes exactos de búsqueda).
- SEO local (Google Business Profile).
- Link building externo.
- Redacción de los artículos del blog.

## Criterios de éxito

- Las 8 páginas nuevas (hub + 3 landings × 2 idiomas) se publican, entran en el sitemap
  y validan su JSON-LD (`Service` + `FAQPage`) en el validador de schema.org.
- Cada landing tiene title/description únicos orientados a su keyword, H1 con la keyword,
  FAQs y al menos un proyecto relacionado enlazado.
- "Servicios" es accesible desde el menú y el footer en ambos idiomas.
- La ficha de un proyecto referenciado por un servicio enlaza de vuelta a la landing.
