# Auditoría post-elevación — dev.alvaroartiel.com (2026-07-11, tarde)

Pasada de errores y mejoras tras la sesión 3, global y por sección. Estado técnico de partida: 0 errores de consola en home/personal/casa, 0 recursos rotos, Lighthouse home y contacto 100/100/100 (A11y/BP/SEO), LCP 331-444ms, CLS 0.

## Corregido en esta pasada

- **[personal] Agarre de polaroids raro** (reporte del usuario): al pinchar se arrastraba la imagen fantasma del navegador o se seleccionaba el texto del pie, compitiendo con el gesto de agarre. Fix en `MessyTable.ts`: `draggable=false` en las imágenes, `user-select:none` + `touch-action:none` en las polaroids de la mesa, cursor `grabbing` mientras se agarra, y muelle del agarre más directo (stiffness 0.12→0.2). Verificado: arrastre limpio, sin selección, y el clic-sin-arrastre sigue abriendo el lightbox.

## Global — errores / riesgos

| # | Hallazgo | Gravedad | Detalle |
|---|---|---|---|
| G1 | **Sin página 404 propia** | Media | Una URL inexistente sirve el 404 genérico de Hostinger (fuera de marca). Crear `web/src/pages/404.astro` con voz («Esta página no existe — de momento») + enlaces; Hostinger sirve `404.html` estático automáticamente. |
| G2 | **Canonical/hreflang apuntan a dev.alvaroartiel.com** | Alta al pasar a producción | `Astro.site` está fijado al staging. Antes del deploy a producción: cambiar `site` en `astro.config` a `https://alvaroartiel.com` (afecta canonical, hreflang, OG y sitemap). Correcto mientras se vive en staging. |
| G3 | **Arte placeholder en proyectos y personal** | Media (contenido, no código) | Sigue siendo el mayor lastre de nivel percibido: las cartas del deck, las fichas y las polaroids llevan arte generativo. Sustituir desde el Studio es lo que más elevará la web ahora. |
| G4 | Deploy manual dependiente del flujo `deploy.mjs`+zip | Baja | `npm run build` a secas pierde `api/contact.php` (documentado en decisions.md). Considerar mover la copia del PHP a un hook de build de Astro para eliminar la trampa. |
| G5 | Formulario sin JS pierde el contexto del select | Baja | El "topic" del mad-lib solo se concatena al mensaje vía JS; sin JS llega el mensaje sin esa etiqueta (el mensaje en sí llega). Aceptado en revisión final; posible mejora: campo oculto que el PHP concatene. |

## Por sección — mejoras propuestas (no aplicadas)

- **Home:** nada roto. Idea: el hint «Sigue bajando, que hay chicha ↓» podría desaparecer al empezar el scroll (ahora se va con el hero; correcto pero puede parpadear con la disolución de partículas).
- **Proyectos:** sólida. Idea menor: al filtrar, anunciar el recuento resultante en un `aria-live` (los lectores de pantalla no se enteran del re-barajado).
- **Ficha:** el «siguiente proyecto» podría precargar (`rel=prefetch`) el destino al hacer hover — transición aún más instantánea.
- **Experiencia:** el odómetro es todo-o-nada — si una etapa de Sanity quedara sin `startDate` de 4 dígitos, el efecto entero se apaga y quedan los años en flujo (degradación limpia pero silenciosa; señalado en revisión final). Idea: validar el dato en el Studio (campo requerido con patrón).
- **CV:** las aptitudes e idiomas están hardcodeados en `cv.astro` (fallback declarado); moverlos a `siteSettings` en Sanity para que Álvaro los edite sin tocar código. La formación con «Premio Proyecto del Año» podría lucir un pequeño distintivo.
- **Blog:** con una entrada está bien resuelto. Cuando haya 3+, el OG de cada post podría usar su cover en vez del OG de sección (`ogImage` ya acepta override en Base.astro — es cablearlo en blog-post).
- **Contacto:** el aro del cursor y el subrayado lima conviven bien; con reduced-motion todo degrada. Mejora fina: al fallar el clipboard (contextos sin permiso), hacer fallback a selección del texto del email.
- **/gracias:** llegar directo (sin enviar) muestra el premio igualmente — inofensivo (noindex), pero podría redirigir a /contacto si no viene de un envío (sessionStorage flag) para preservar el momento.
- **Personal:** corregido el agarre (arriba). Mejora fina pendiente de gusto: al soltar una polaroid lanzada muy fuerte contra la pared, el rebote puede sacarla momentáneamente del recorte visible hasta que se re-asienta (el viewport ya vuelve a crecer al agarrar; es raro que moleste).
- **Casa:** pasa la vara; siguiente salto de nivel real sería sombra dinámica del personaje y algún sonido opt-in — fuera de presupuesto v1.
- **Menú:** con la preview de sección quedó vendedor. Idea: mismo patrón en el LangSwitch (mostrar «ES → Español»).

## Veredicto

Sin errores funcionales abiertos. Los tres frentes con más retorno ahora: **(1)** página 404 propia, **(2)** `site` de producción cuando toque salir de staging, **(3)** sustituir el arte placeholder desde el Studio (contenido, no código).
