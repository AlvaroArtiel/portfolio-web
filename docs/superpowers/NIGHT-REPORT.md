# NIGHT-REPORT — alvaroartiel.com (ejecución autónoma 2026-07-10)

## Resumen ejecutivo

Las **8 fases del plan (F0–F7) están completadas** y desplegadas en staging. La web es publicable: contenido real bilingüe desde Sanity, sistema de diseño completo, capa de movimiento, los cuatro efectos WebGL insignia, la mesa revuelta con física y los dos easter eggs. Cada tarea pasó implementación + revisión independiente (spec y calidad) con sus fixes aplicados; hay una revisión final de toda la rama en curso cuyo resultado se anotará al final de este documento si arroja algo accionable.

## URLs

| Qué | URL |
|---|---|
| **Staging** | https://dev.alvaroartiel.com |
| **Backoffice (Sanity Studio)** | https://alvaroartiel.sanity.studio |
| **Repo** | https://github.com/AlvaroArtiel/portfolio-web (privado) |
| Easter egg | https://dev.alvaroartiel.com/casa/ (noindex; o scroll a fondo tras el footer de la home) |

## Fases completadas

- **F0 Cimientos** — scaffold Astro 7 + Studio Sanity 6 + api/contact.php; schemas i18n `{es,en}`; seed completo (10 proyectos, 7 experiencias, 6 formaciones, 4 capítulos + 8 recuerdos, 1 post, settings) con placeholders generativos; cliente tipado + deploy pipeline; repo GitHub.
- **F1 Sistema de diseño** — tokens exactos del spec §3.1, tres tipografías self-hosted (+ Caveat solo en personal), layout base, header con hamburguesa, menú overlay con hover de barrido de acento, footer, árbol de 16 rutas ES/EN.
- **F2 Páginas completas** — home estructural, proyectos (lista + ficha con heroMedia editorial y cuerpo Portable Text full/double/grid/youtube), experiencia (timeline semántica), CV imprimible (print.css A4), blog, personal (polaroids + lightbox), contacto y gracias. Desde aquí la web siempre fue publicable.
- **F3 Movimiento** — Lenis+GSAP con respeto estricto a reduced-motion; deck apilado con parallax y rebarajado físico de filtros; timeline que se dibuja con scroll; snake-trail en el menú; view transitions cross-document.
- **F4 WebGL** — infra de islas three.js con degradación (WebGL2/deviceMemory/reduced-motion); **partículas del hero** (forman el titular, huyen del cursor, botón "saltar efecto"); **monograma AA 3D** que viaja del hero al header; **CTA líquido**; **lonas k95** en las fichas.
- **F5 Mesa revuelta** — polaroids como cuerpos Matter.js: caen, se agarran y lanzan, colisionan; clic abre lightbox; filtros con impulso; móvil con giroscopio tras gesto; reduced-motion = grid.
- **F6 Easter eggs** — secreto post-footer (overscroll 150vh → pieza 3D + "¿pasas?") y **casa jugable**: habitación low-poly, personaje cápsula, WASD/joystick, 5 interactuables con modal y link real, salida a home.
- **F7 Pulido** — sitemap+robots+OG generativas+JSON-LD (Person/CreativeWork escapado); auditoría reduced-motion efecto a efecto contra la tabla §5; contraste AA verificado; Lighthouse staging: **A11y 96–100, BP 100, SEO 100, LCP 128–183 ms, CLS 0**; QA: 19 screenshots móvil/tablet en `docs/superpowers/qa/`.

## Decisiones variadas respecto al plan

Detalladas en [`decisions.md`](./decisions.md):
1. **Astro 7 / Sanity 6** en lugar de "Astro 5 / Sanity v4" (versiones actuales de los scaffolders; las APIs del plan son núcleo estable).
2. **Zip de deploy con `Compress-Archive`** — los zips de bsdtar provocan error 500 en Hostinger (documentado en `scripts/DEPLOY.md`).
3. **View transitions cross-document (CSS)** en lugar del ClientRouter de Astro (mismo crossfade de acento, cero riesgo para los scripts por página).
4. **CORS del CDN de Sanity** habilitado vía API de gestión (localhost, dev y dominio raíz) — requisito de las texturas de las lonas.
5. **OG por sección** (no por página) hasta que exista arte real.

## Pendientes / riesgos (necesitan al usuario)

1. **Validar staging** y, si procede, dar la orden de paso a producción (`alvaroartiel.com`). El deploy es idéntico: build + zip + `hosting_deployStaticWebsite` al vhost raíz. **No se ha tocado el dominio raíz.**
2. **Fechas aproximadas en Studio**: TenTuPlaza, Ceustack, Consultor independiente y Esperando el Render llevan `startDate: "2024"` aproximado — fijarlas en https://alvaroartiel.sanity.studio (Experiencia).
3. **Subir imágenes reales** (proyectos, personal y retrato): todo el media actual es placeholder generativo. Con el retrato en `assets-entrada/retrato.*` la cabeza del personaje de la casa puede dejar de ser el monograma (hoy es el placeholder previsto en el plan).
4. **Redes sociales reales** en Ajustes del sitio (hoy `url: "#"`; el JSON-LD `sameAs` se rellenará solo al ponerlas).
5. **Formulario de contacto**: `api/contact.php` usa `mail()` de PHP — probar un envío real en staging (no se puede verificar en local).
6. **Webhook Sanity→rebuild** si se quiere autodeploy al editar contenido (hoy el deploy es manual: `node scripts/deploy.mjs` + zip + MCP, ver `scripts/DEPLOY.md`).
7. Backlog menor (no bloqueante): singleton de siteSettings solo en desk, labels de locale.ts, popstate en filtros, OG hexes duplicados de tokens.css.

## Checklist de validación sugerido

- [ ] Home: partículas, monograma acoplándose al header, CTA líquido, teaser, secreto post-footer.
- [ ] /proyectos: deck apilado, filtros con rebarajado, ficha de Ranquea (tiene el cuerpo con todos los patrones de bloque + youtube).
- [ ] /experiencia: línea que se dibuja; /personal: lanzar polaroids; /cv: imprimir; /blog.
- [ ] Todo en EN (`/en/`), móvil y con "reducir movimiento" activado (todo debe degradar).
- [ ] /casa con teclado y con móvil.

## Revisión final de la rama (post-cierre)

Una revisión independiente de los 36 commits dio **"Ready with fixes"**; los tres hallazgos accionables quedaron corregidos y redesplegados (commit `c645cf8`):
1. **Crítico** — inyección de cabeceras de email vía `name` en `api/contact.php` (heredado del código literal del plan; ver decisions.md). Corregido.
2. **Importante** — Matter.js bloqueaba el scroll nativo sobre la mesa revuelta. Corregido y verificado en navegador.
3. **Importante** — la mesa no recalculaba sus paredes al redimensionar la ventana. Corregido (debounce + reposición).

Backlog no bloqueante que dejó la revisión: realineado de lonas/CTA en resize, listener del snake-trail tras el primer cierre, wrap de ángulo del personaje de la casa, `og:locale`/`og:site_name`, respuesta 422 del PHP como página en vez de JSON.

**Para el paso a producción** (cuando lo ordenes): cambiar `SITE_URL` en `web/astro.config.mjs` y la URL del sitemap en `web/public/robots.txt` (todo lo demás — canonical, OG, JSON-LD — deriva de `Astro.site`); el CORS de Sanity ya incluye el dominio raíz.
