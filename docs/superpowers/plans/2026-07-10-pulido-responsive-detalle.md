# Pulido responsive y detalle de referencia — Plan de implementación (Sesión 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar los hallazgos de la revisión post-remediación (monograma sobre el menú overlay, banda tablet 721–1100 sin dirección, mesa de /personal con aire de sobra) y añadir el último 10% de detalle que acerca la web a las referencias (reveals por líneas, hover craft del deck, segunda voz tipográfica).

**Architecture:** Sin features nuevas ni cambios de stack. Ajustes sobre los módulos existentes (monogram.ts, tokens.css, About/FeaturedDeck/Card, MessyTable, motion.ts). Protocolo idéntico a la sesión 2: orquesta Fable, tareas mecánicas → subagentes Sonnet, tareas creativas → Fable inline, **doble puerta Fable en cada tarea** (pre: re-especificación contra la vara; post: verificación de recorrido, ahora incluyendo 768/1024 y el estado menú-abierto), variaciones → decisions.md.

**Tech Stack:** Astro 7, GSAP/ScrollTrigger + motion-tokens.ts, Three.js, Matter.js, deploy Hostinger vía zip `Compress-Archive` + MCP.

## Global Constraints

- Deploy SOLO a `dev.alvaroartiel.com`. Prohibido tocar el dominio raíz y los demás sites.
- Paleta y movimiento: SOLO tokens (`tokens.css` / `motion-tokens.ts`). Cero valores sueltos.
- Vara §2 del spec de remediación vigente, con recorrido ampliado: **1440, 1024, 768 y 390** + estado menú-abierto en cada breakpoint.
- Nada tapa contenido ni UI en NINGÚN estado (incluidos overlay abierto y tablet portrait).
- Veracidad intacta: ninguna tarea toca contenido/seed.
- Commits frecuentes; verificación por tarea = build verde + recorrido local (dev server `npx astro dev --background` en `web/`); deploy + QA en `docs/superpowers/qa/pulido/` al cierre.
- Reduced-motion: todo efecto nuevo degrada a estático (los reveals por líneas no-op; el hover no depende de motion).
- Lighthouse Performance ≥90 al cierre (LCP/CLS por traza en staging).
- Si una tarea bloquea >30 min → fallback documentado y seguir.
- **Fuera de alcance:** media real (proyectos, personal — la sube el usuario desde el Studio), producción, features nuevas, sonido.

---

### Task 1: El monograma 3D nunca tapa el menú overlay (bug)

**Resuelve:** hallazgo #1 de la revisión — con el menú abierto en la home (scroll <110vh), la pieza 3D (capa fija z-index 101) queda sobre el overlay tapando items y mostrando dos marcas.

**Files:**
- Modify: `web/src/styles/global.css`

**Interfaces:**
- Consume: la capa `#monogram-layer` (creada por `Hero.astro`) y el atributo `html[data-menu-open]` (puesto por `MenuOverlay.ts`).
- Produce: regla CSS global; no cambia ningún contrato JS.

- [ ] **Step 1:** añadir al final de la sección "Accent-aware chrome" de `web/src/styles/global.css`:

```css
/* El monograma 3D (capa fija de la home) cede SIEMPRE ante el menú overlay:
   con el menú abierto no puede haber pieza flotante sobre los items ni dos
   marcas a la vez. visibility (no display) para no desmontar el bucle ni
   pelear con el display inline que gestiona scenes/monogram.ts. */
html[data-menu-open] #monogram-layer {
  visibility: hidden;
}
```

- [ ] **Step 2:** verificar en local (1440 y 390): abrir el menú con scroll 0 → la pieza desaparece, el overlay se lee limpio; cerrar → la pieza vuelve; abrir el menú tras 110vh → sin cambios (ya estaba muerta). Screenshot de menú abierto en home.
- [ ] **Step 3:** `cd web && npm run build` exit 0.
- [ ] **Step 4:** commit — `fix(brand): el monograma cede ante el menú overlay`.

### Task 2: Dirección para la banda tablet 721–1100 — **Fable inline**

**Resuelve:** hallazgo #2 — a 768 portrait el monograma usa anclas/escala desktop (enorme y recortado), la columna de metadatos del about queda estrangulada bajo el toggle, y el ritmo vertical abre huecos.

**Files:**
- Modify: `web/src/scenes/monogram.ts` (anclas/escala conscientes de aspect-ratio)
- Modify: `web/src/components/home/About.astro` (quiebre del grid antes)
- Modify: `web/src/styles/tokens.css` (escala de espaciado fluida)
- Verify: `web/src/views/experience.astro`, `FeaturedDeck.astro`, `PersonalTeaser.astro`, `projects.astro` a 768 y 1024 (solo tocar si el recorrido lo exige)

**Prescripción:**
- **Monograma:** la decisión vuelo-completo vs match-cut deja de depender solo del ancho. Regla: `const compact = window.matchMedia('(max-width: 720px)').matches || (window.innerWidth < 1000 && window.innerHeight > window.innerWidth)` → match-cut (el camino móvil actual). Para el vuelo completo, la escala deja de ser proporcional solo a `vh`: `basePx = 0.22 * Math.min(window.innerHeight, window.innerWidth * 0.62)`; y el ancla X se acota para que la pieza nunca recorte: con `halfW ≈ basePx * 0.92`, `x = Math.min(window.innerWidth * 0.83, window.innerWidth * 0.97 - halfW)`. `isMobile`/`compact` se evalúa en cada frame o en resize (hoy se congela en init — corregirlo al hacer este cambio).
- **About:** el grid texto+metadatos pasa a una columna con metadatos en fila de 3 **por debajo de 1000px** (hoy 720). La fila de metadatos nunca queda bajo la franja del header.
- **Espaciado:** los tokens pasan a fluidos SIN cambiar su valor a 1440: `--space-s: clamp(4.5rem, 5vw + 2rem, 6rem); --space-m: clamp(6.5rem, 8vw + 3rem, 10rem); --space-l: clamp(9rem, 12vw + 4rem, 15rem);` (a 1440: 5vw+2rem=6.5rem→clamp 6rem ✓, 8vw+3rem=10.2→10 ✓, 12vw+4=14.8→14.8 ≈15 — ajustar los coeficientes en la puerta de salida si algún valor no clava el actual a 1440).
- **Puerta de salida:** recorrido completo de la home a **768×1024 y 1024×768** (+ re-verificación rápida 1440/390): monograma sin recortes ni solapes, metadatos legibles, sin vacíos >25% viewport sin propósito; /experiencia y /proyectos revisados en ambos tamaños.

- [ ] **Step 1 (puerta de entrada):** recorrido del estado actual a 768 y 1024, anotando cada rotura.
- [ ] **Step 2:** implementar las tres prescripciones.
- [ ] **Step 3:** recorrido de salida (4 breakpoints × home + experiencia + proyectos) con screenshots.
- [ ] **Step 4:** build verde + commit — `fix(responsive): dirección para la banda tablet 721–1100 (monograma, about, espaciado fluido)`.

### Task 3: Mesa de /personal compacta + hover craft del deck

**Resuelve:** hallazgo #3 (aire de sobra sobre el montón asentado en desktop) + microdetalle pxpush del deck.

**Files:**
- Modify: `web/src/components/personal/MessyTable.ts` y/o el contenedor en `web/src/views/personal.astro`
- Modify: `web/src/components/projects/Card.astro`, `web/src/components/home/FeaturedDeck.astro`

**Prescripción mesa:** investigar dónde fija MessyTable la altura del área física (leer el módulo antes de tocar). Objetivo: en desktop el área de física ≈ altura del montón asentado + ~25% de margen de juego (las polaroids deben poder lanzarse sin salir), nunca >70vh. El fallback estático (grid) no cambia.

**Prescripción hover deck (solo CSS, tokens):**

```css
/* Card.astro — dentro de .pc-media */
.pc-media {
  overflow: hidden;
}
.pc-media img {
  transition: transform var(--dur-element) var(--ease-out-token);
}
.project-card a:hover .pc-media img {
  transform: scale(1.03);
}
```

y el equivalente en `FeaturedDeck.astro` (`.card-media`/`.card a:hover`). Bajo `prefers-reduced-motion: reduce`, `transform: none`.

- [ ] **Step 1:** leer MessyTable.ts; medir altura actual del área y del montón (evaluate en dev server); aplicar el cap.
- [ ] **Step 2:** hover del deck en ambos componentes + reduced-motion.
- [ ] **Step 3:** verificación: /personal desktop sin más de ~25% de aire sobre el montón; drag/throw sigue funcionando; hover de cartas suave y contenido, imagen nunca desborda la carta.
- [ ] **Step 4:** build verde + commit — `feat(polish): mesa compacta y hover craft del deck`.

### Task 4: Reveal por líneas del "quién soy" (patrón cinetica)

**Resuelve:** el about entra como bloque; las referencias revelan el texto línea a línea con el scroll.

**Files:**
- Create: `web/src/lib/line-reveal.ts`
- Modify: `web/src/components/home/About.astro` (marcado + init)
- Modify: `web/src/lib/motion.ts` (nada — consumir `onReady`/`getMotion` existentes)

**Interfaces:**
- Consume: `onReady`, `getMotion` de `../lib/motion`; `DURATION`, `REVEAL`, `EASE_GSAP` de `../lib/motion-tokens`.
- Produce: `export function initLineReveal(selector: string): void`.

**Algoritmo (sin SplitText, que es de pago):**
1. Para cada elemento que case `selector`: envolver cada palabra en `<span class="lr-word">` conservando los `<em class="hl">` (las palabras dentro del em mantienen su envoltorio: `em.hl > span.lr-word`). Hacerlo solo si motion está activo (dentro de `onReady`) — sin JS/reduced-motion el párrafo queda intacto.
2. Agrupar palabras por línea renderizada comparando `offsetTop` (tolerancia 4px).
3. Animar por GRUPOS de línea: `gsap.set(words, {opacity: 0, y: REVEAL.rise})` y `gsap.to` con `duration: DURATION.element`, `ease: EASE_GSAP.out`, `stagger: REVEAL.stagger` ENTRE líneas (las palabras de una línea entran juntas), `scrollTrigger: {trigger: el, start: 'top 80%', once: true}`.
4. En `resize` (debounce 200ms) antes de que la animación haya disparado: reagrupar líneas. Después de disparada: no-op.
5. El elemento pierde su `data-reveal` genérico (quitar el atributo en About.astro) para no animar dos veces.

- [ ] **Step 1:** implementar `line-reveal.ts` + init en About (`initLineReveal('.about-text')`).
- [ ] **Step 2:** verificación local: el párrafo entra línea a línea al hacer scroll (1440 y 390); los destacados en acento se conservan; con `prefers-reduced-motion` el texto está visible sin animación; sin CLS (comparar `document.body.scrollHeight` antes/después del split).
- [ ] **Step 3:** build verde + commit — `feat(motion): reveal por líneas en quién soy`.

### Task 5: Segunda voz tipográfica — índices de sección — **Fable inline**

**Resuelve:** el kicker mono es el único recurso de rotulación; las referencias usan una segunda voz (índices, numeración) que da estructura.

**Files:**
- Modify: `web/src/components/home/About.astro`, `FeaturedDeck.astro`, `PersonalTeaser.astro`, `CtaBand.astro` (kickers de la home)
- Modify: `web/src/views/projects.astro`, `experience.astro`, `personal.astro`, `blog.astro` (headers de página)

**Prescripción (afinable por Fable en la puerta de entrada):**
- Home: los kickers pasan a patrón `[índice] [rótulo]` — `01 · Quién soy`, `02 · Proyectos destacados`, `03 · Fuera del horario laboral`, `04 · ¿Hablamos?` (el índice en `--text-muted`, el rótulo en acento — o viceversa, lo que gane en el recorrido). Mismo componente/clase `.section-kicker`, sin duplicar estilos: extraer a un parcial `SectionKicker.astro` si el marcado se repite ≥3 veces.
- Páginas: bajo el h1, línea mono muted con el recuento real (`10 proyectos · 4 categorías`, `7 etapas · 2018—hoy`, `4 capítulos`) — SOLO datos derivados de los arrays ya cargados en cada vista (veracidad garantizada por construcción).
- Puerta de salida: el recurso se percibe como sistema (mismo cuerpo, mismo ritmo) y no compite con los kickers; recorrido 1440 + 390.

- [ ] **Step 1 (puerta de entrada):** maquetar el patrón en el about y decidir índice-muted vs rótulo-muted mirándolo en el navegador.
- [ ] **Step 2:** aplicar a las 4 secciones de la home + 4 headers de página.
- [ ] **Step 3:** recorrido de salida + build verde + commit — `feat(type): segunda voz tipográfica — índices y recuentos de sección`.

### Task 6: Cierre — deploy, QA ampliado, métricas, informe, push

- [ ] Deploy a staging (build + `Compress-Archive` + `hosting_deployStaticWebsite`).
- [ ] QA en `docs/superpowers/qa/pulido/`: home a 1440/1024/768/390 (fullpage con pre-scroll) + screenshot de menú abierto en 1440 y 768 + /personal desktop + una carta en hover.
- [ ] Traza de rendimiento en staging: LCP y CLS dentro de presupuesto (≥90).
- [ ] Actualizar `NIGHT-REPORT-2.md` (sección "Sesión 3 — pulido") y `decisions.md` si hubo variaciones.
- [ ] Commit + push a `main`.
