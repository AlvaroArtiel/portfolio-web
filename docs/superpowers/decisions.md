# Decisiones de ejecución — alvaroartiel.com

## 2026-07-10 F0 — Versiones de framework: Astro 7 y Sanity 6 en lugar de Astro 5 / Sanity v4
- **Qué decía el plan/spec:** "Astro 5, Sanity v4" como tech stack.
- **Qué se hace:** mantener las versiones que instalan los scaffolders oficiales hoy: Astro ^7.0 y Sanity ^6.4.
- **Por qué:** el spec se escribió nombrando las versiones vigentes en su momento como sinónimo de "Astro/Sanity actual". Forzar un downgrade de dos majors a mano crea riesgo real (templates generados para v7, árboles de dependencias antiguos) sin beneficio. Todas las APIs que el plan usa (páginas estáticas, getStaticPaths, islas client:visible, View Transitions, GROQ) son núcleo estable. Si alguna API difiere, se adapta en la tarea correspondiente y se anota aquí.
## 2026-07-10 F0 — Zip de deploy: Compress-Archive, no bsdtar
- **Qué decía el plan:** desplegar `web/dist` con `hosting_deployStaticWebsite` (sin detallar formato).
- **Qué se hace:** generar el zip con PowerShell `Compress-Archive`; los zips de `bsdtar` provocan error 500 en el extractor de Hostinger. Documentado en `scripts/DEPLOY.md`.
- **Por qué:** verificado empíricamente con dos intentos fallidos + uno exitoso.
## 2026-07-10 F3 — View transitions cross-document (CSS) en lugar de ClientRouter de Astro
- **Qué decía el plan:** "View Transitions API de Astro con crossfade del --accent (fallback: cambio directo)".
- **Qué se hace:** `@view-transition { navigation: auto }` en CSS (cross-document view transitions, MPA). Mismo efecto de crossfade del acento entre páginas.
- **Por qué:** el ClientRouter de Astro convierte la navegación en SPA y los scripts por página (deck, filtros, lightbox, overlay) dejarían de reinicializarse sin refactorizar todos a `astro:page-load`. La variante cross-document es CSS puro, cero riesgo, y el fallback (cambio directo) es exactamente el que pide el plan para navegadores sin soporte.
## 2026-07-10 F4 — CORS del CDN de Sanity para texturas WebGL
- **Qué pasaba:** `cdn.sanity.io` devolvía 403 a peticiones con cabecera `Origin` (las texturas de las lonas k95 no cargaban).
- **Qué se hace:** añadidos orígenes CORS al proyecto Sanity vía API de gestión: `http://localhost:4321`, `https://dev.alvaroartiel.com`, `https://alvaroartiel.com`; las `<img>` de heroMedia llevan `crossorigin="anonymous"`.
- **Por qué:** requisito del efecto lona (TextureLoader necesita CORS); sin ello el fallback (imágenes normales) seguía funcionando.
