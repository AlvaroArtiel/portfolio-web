# Remediación de acabado premium — Plan de implementación (Sesión autónoma 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar, corregir y pulir dev.alvaroartiel.com hasta que cada estado de scroll sea una composición intencional al nivel de las referencias (pxpush, cinetica, noth.in…), resolviendo TODOS los defectos A1-A6 / B1-B13 de la auditoría.

**Architecture:** Sin features nuevas. Cuatro sprints sobre el código existente (Astro 7 + Sanity + GSAP/Lenis + Three.js): (1) seed veraz, (2) sistema visual (monograma, elevación, composición por sección), (3) coreografía (tokens de movimiento, camaleón intra-página, deck, CTA líquido), (4) dirección de arte de la casa. Doble puerta Fable en cada tarea; verificación = recorrido de scroll (§1.3 del spec), no capturas sueltas.

**Tech Stack:** Astro 7, Sanity 6 (free tier), GSAP + ScrollTrigger, Lenis, Three.js, Matter.js, sharp (placeholders), deploy Hostinger vía `scripts/deploy.mjs`.

## Global Constraints

- Deploy SOLO a `dev.alvaroartiel.com`. Prohibido tocar el dominio raíz y los demás sites.
- Sanity solo free tier. Zip de deploy con `Compress-Archive` (nunca bsdtar) — ver `scripts/DEPLOY.md`.
- Paleta estricta: solo tokens (`#0C0C0E`, `#F4F4F0`, `#8A8A93`, acentos `#D4FF3F/#5B8CFF/#B06CFF/#FF7847/#4FD1C5` y superficies nuevas §Task 4). Nada fuera de paleta.
- Movimiento: SOLO tokens de `web/src/lib/motion-tokens.ts` (Task 10). Cero easings/duraciones ad-hoc al cierre.
- Veracidad: prohibido inventar hechos, roles, fechas o relatos. Fuente única disponible: spec original §9 + correcciones del spec de remediación §3. Lo no respaldado → frase neutral u omisión (limitación documentada en decisions.md: el volcado completo de LinkedIn no está en el repo).
- Commits frecuentes; toda variación → `docs/superpowers/decisions.md`; al cierre `docs/superpowers/NIGHT-REPORT-2.md`.
- Lighthouse Performance ≥85 durante la remediación; ≥90 al cierre.
- Si una tarea bloquea >30 min → fallback documentado y seguir.
- Verificación por tarea: build verde (`npm run build` en `web/`) + recorrido en dev server local (chrome-devtools, screenshots cada ~600px, 1440px Y 390px). Deploy a staging + recorrido guardado en `docs/superpowers/qa/sprint-N/` al cierre de cada sprint.
- Puerta de entrada y de salida de CADA tarea las ejecuta Fable (orquestador) contra la vara §2 del spec de remediación; hasta 3 iteraciones dentro de la tarea antes de documentar limitación.

---

## SPRINT 1 — Contenido veraz

### Task 1: Reescritura veraz del seed + placeholders sin título + re-seed + deploy

**Resuelve:** B8 (crítico) y B4 (placeholders con título duplicado — se pliega aquí para re-seedear una sola vez; anotar en decisions.md).

**Files:**
- Modify: `studio/seed/content.mjs`
- Modify: `studio/seed/generate-images.mjs` (dejar de pintar el título en el arte)
- Run: `studio/seed/seed.mjs` (idempotente), `scripts/deploy.mjs`

**Interfaces:**
- Produce: mismo shape de datos (EXPERIENCE/EDUCATION/PROJECTS/PERSONAL_*/BLOG_POST/SITE_SETTINGS) — el resto del sitio no cambia.

**Hechos respaldados (única base admisible; todo lo demás en los textos actuales se elimina o neutraliza):**

| Entrada | Hechos respaldados por spec §9 / remediación §3 |
|---|---|
| TenTuPlaza | Product & Digital Lead. Fecha neutra "2024 — Actualidad". Proyecto vinculado: Plataforma TenTuPlaza (cliente, "en construcción"). |
| Ceustack | Co-founder & Product Lead. Ranquea, UltraCarta y Vaultz son productos propios (categoría `propio` en §9) asociados a Ceustack. |
| Consultor independiente | +40 proyectos; BoxDigital, Okawa y Lalalastudio citados dentro. |
| **Esperando el Render** | **CLIENTE** (academia de formación online para profesionales creativos). Álvaro es **consultor web & producto e-learning**: mantenimiento, optimización, páginas comerciales, lanzamientos de cursos. `type: 'freelance'`. NO fundador, NO creador de contenido, NO proyecto propio. |
| AuraProds | nov 2024 – ene 2026. Campus e-learning (proyecto Campus AuraProds). |
| iUrban | sept 2023 – oct 2024. CRM interno + design system (proyecto CRM iUrban). |
| 8 Pecados | nov 2018 – dic 2019. |
| Formación (6) | Grado UMA 2015-19 · Máster UX-UI y Programación Web Gauss 2022-23 (Premio Proyecto del Año) · Especialista UX/UI Gauss 2023-24 · ESIC SEO&SEM 2020 · freeCodeCamp 2024-25 · DevTalles 2025-act. |
| Proyectos (10) | Los del §9, mismas categorías. Web de fotografía → fotografia.alvaroartiel.com. |
| Identidad | Hero "Diseño productos digitales de punta a punta"; keywords Product Lead · UX/UI · E-learning · SaaS · IA aplicada; soy@alvaroartiel.com. |

**Regla de reescritura:** roles/fechas/nombres exactos de la tabla. Summaries y bullets = descripción neutral del rol ("qué hace", sin métricas ni anécdotas inventadas: fuera "en tiempo récord", "redujo el tiempo", "primeros equipos piloto", "usuarios reales", relatos de origen de producto). Bodies de proyecto = qué es el producto + rol + estado, en el tono §3.3 (cercano, directo) aplicado a la REDACCIÓN, nunca a los HECHOS. Captions de polaroids: son placeholders declarados, se mantienen genéricos sin afirmar eventos concretos no fechables (p.ej. "Placeholder — foto de cocina" NO; mantener captions ambientales tipo "Domingo de masa madre" está bien porque el material es placeholder visual — criterio: nada que afirme un logro o hecho biográfico).

- [ ] **Step 1 (puerta de entrada Fable):** revisar cada entrada actual de `content.mjs` contra la tabla; listar por escrito qué afirmaciones caen (base para el subagente).
- [ ] **Step 2:** reescribir `content.mjs` completo según la regla. `experience-esperando-render`: `role: {es: 'Consultor web & producto e-learning', en: 'Web & e-learning product consultant'}`, `type: 'freelance'`, summary/bullets sobre mantenimiento, optimización, páginas comerciales y lanzamientos de cursos PARA la academia (cliente).
- [ ] **Step 3:** en `generate-images.mjs`, dejar `title` fuera del arte: en `buildSvg` ignorar `label` (composición abstracta pura) y subir la densidad/intención de las formas (2-3 formas grandes ancladas + resto pequeñas, siempre con el acento pasado).
- [ ] **Step 4:** regenerar imágenes + re-seed: `cd studio/seed && node generate-images.mjs && node seed.mjs`. Esperado: exit 0, documentos actualizados (idempotente).
- [ ] **Step 5:** build + deploy a staging: `cd web && npm run build` (exit 0) y `node scripts/deploy.mjs` (según DEPLOY.md).
- [ ] **Step 6 (puerta de salida Fable):** releer en staging CADA entrada de /experiencia, las 10 fichas de /proyectos, /cv, /personal y la home contra la tabla. Ninguna afirmación sin respaldo. Cartas sin título duplicado (B4).
- [ ] **Step 7:** commit (`content.mjs`, `generate-images.mjs`) — `fix(seed): contenido veraz contra material fuente + placeholders sin título (B8, B4)`.

---

## SPRINT 2 — Sistema visual

### Task 2: Tokens de elevación + aplicación global

**Resuelve:** A5, parte de la vara §2.5.

**Files:**
- Modify: `web/src/styles/tokens.css`
- Modify: `web/src/components/projects/Card.astro`, `web/src/components/home/FeaturedDeck.astro`, `web/src/views/contact.astro`, `web/src/views/blog.astro`, `web/src/views/house.astro` (modal), `web/src/components/Header.astro` (menu-toggle)

**Interfaces:**
- Produce: custom properties `--surface-0`, `--surface-1`, `--surface-2`, `--border-soft`, `--shadow-2` disponibles globalmente. `--bg-elevated` queda como alias de `--surface-1` (no romper usos existentes).

- [ ] **Step 1:** añadir a `:root` en `tokens.css`:

```css
  /* -- Elevación (remediación A5) ---------------------------------------- */
  --surface-0: #0c0c0e;
  --surface-1: #141419;
  --surface-2: #1a1a21;
  --border-soft: 1px solid rgba(244, 244, 240, 0.07);
  --shadow-2: 0 24px 60px rgba(0, 0, 0, 0.5);
```

y cambiar `--bg-elevated: #16161a;` por `--bg-elevated: var(--surface-1);` y `--bg: var(--surface-0);` (mismo valor computado del fondo, una sola fuente).

- [ ] **Step 2:** aplicar el sistema: toda superficie interactiva sobre fondo lleva `background: var(--surface-1); border: var(--border-soft);` y los elementos activos/elevados (carta del deck en hover, modal de la casa, dialog lightbox, formulario de contacto) `background: var(--surface-2); box-shadow: var(--shadow-2);`. Polaroids mantienen su blanco.
- [ ] **Step 3:** build verde + recorrido local rápido (home + /proyectos + /contacto, 1440px): las cartas se leen como objeto sobre el fondo en TODOS los estados de scroll.
- [ ] **Step 4:** commit — `feat(ui): sistema de elevación surface-0/1/2 (A5)`.

### Task 3: Monograma — rediseño + coreografía única acotada

**Resuelve:** A1, B2 (parte), B12. Decisión cerrada del spec §4.1. **Tarea creativa: Fable inline.**

**Files:**
- Modify: `web/src/scenes/monogram.ts` (geometría nueva + coreografía muerte a 100vh)
- Modify: `web/src/components/Header.astro` (versión SVG estática definitiva del monograma)
- Modify: `web/src/components/home/Hero.astro` (montaje/capa)
- Modify: `web/src/scenes/post-footer.ts` y `web/src/scenes/house/character.ts` (heredan la nueva marca; el fantasma muere)

**Prescripción (del spec, no negociable):**
- Monograma AA nuevo: geometría limpia, extrusión fina, material marfil `#F4F4F0` mate, rim-light del acento de la sección. Reconocible en 24px. La misma silueta genera el SVG estático del header (una sola fuente de forma: exportar la shape 2D a path SVG).
- El 3D vive SOLO entre scroll 0 y ~100vh de la home: interpola con scrub (ease-in-out de trayecto) desde su posición de hero (arriba-dcha, diagonal compositiva con el titular, SIN tocar texto) hasta el hueco exacto del header; al llegar (p≥1) **se desmonta** (unmount real, no opacity) y aparece el SVG del header. Al volver a scroll <100vh se re-monta. A partir de 100vh NUNCA hay pieza 3D flotante.
- Móvil 390px: posición inicial que jamás solape el titular (bajo el subtítulo o esquina sup-dcha reducida), mismo acople.
- El dock debe calcularse contra el rect real de `#monogram-slot` en píxeles y convertirse a mundo con el mismo helper `screenToWorld`, verificado visualmente (el bug actual: acopla a ~470px del borde, no al slot).

- [ ] **Step 1 (puerta de entrada):** Fable revisa la pieza actual y define la silueta nueva (sketch de la shape en comentario del código).
- [ ] **Step 2:** implementar geometría + materiales + SVG del header derivado de la misma silueta.
- [ ] **Step 3:** implementar coreografía (scrub 0→100vh, desmontaje al acoplar, re-montaje al volver, resize recalcula anclas). Eliminar TODA otra aparición del 3D flotante (grep de `monogram-layer`).
- [ ] **Step 4:** recorrido local home completo 1440px Y 390px: el monograma nunca tapa nada; a >100vh no existe pieza flotante; header muestra SVG en todas las páginas; se reconoce a 24px.
- [ ] **Step 5:** commit — `feat(brand): monograma AA nuevo + coreografía acotada al primer viewport (A1, B2, B12)`.

### Task 4: Composición por sección de la home + escala de espaciado

**Resuelve:** A2, A6, B2 (resto), B6 (en home). **Tarea creativa: Fable inline.**

**Files:**
- Modify: `web/src/components/home/Hero.astro`, `About.astro`, `FeaturedDeck.astro`, `CtaBand.astro` (solo layout), `PersonalTeaser.astro`
- Modify: `web/src/styles/tokens.css` (escala de espaciado)

**Prescripción por sección (spec §4.3):**
- Tokens de espaciado en `tokens.css`: `--space-s: 6rem; --space-m: 10rem; --space-l: 15rem;` (≈96/160/240px) — TODOS los paddings verticales de sección de la home salen de aquí. La home pierde ~15-20% de altura.
- **Hero:** titular centrado ópticamente como masa dominante (~80% ancho con partículas); "Álvaro Artiel" arriba-izq y keywords abajo-izq como marco perimetral mono; monograma arriba-dcha (Task 3). Sin mitades vacías.
- **Quién soy:** texto a ~60-70% centrado-izquierda con 2-3 palabras clave destacadas en acento (`<em>` estilizado, no cursiva); a la derecha columna estrecha de metadatos mono (años de experiencia, nº proyectos, stack) — datos REALES del seed, no inventados (+40 proyectos, 7 etapas, stack del CV).
- **Deck destacados:** cartas a ~88% de ancho centradas.
- **CTA:** full-bleed centrado.
- **Teaser personal:** masa diagonal de polaroids + claim corto grande ("Fuera del horario laboral también pasan cosas") + link; equilibrio de viewport, no isla-izquierda.

- [ ] **Step 1 (puerta de entrada):** recorrido local del estado actual; anotar por sección qué zona muere.
- [ ] **Step 2:** tokens de espaciado + refactor de paddings de las 5 secciones.
- [ ] **Step 3:** re-componer sección a sección según prescripción.
- [ ] **Step 4:** recorrido local completo (1440 + 390): cada frame es composición intencional; ninguna zona muerta >25% sin propósito; altura total de la home reducida ~15-20% (medir `document.body.scrollHeight` antes/después y anotar).
- [ ] **Step 5:** commit — `feat(home): composición por sección + escala de espaciado (A2, A6, B2, B6)`.

### Task 5: Ritmo de /experiencia + fixes de maquetación (B9, B10, B13)

**Files:**
- Modify: `web/src/views/experience.astro` (B9)
- Modify: `web/src/views/personal.astro`, `web/src/views/projects.astro` (B10: filtros bajo el título, verificado contra el header)
- Modify: `web/src/styles/global.css` y/o componente culpable (B13)

**Prescripción:**
- **B9:** timeline con fechas y logos al lado IZQUIERDO de la línea (columna izquierda deja de estar vacía), contenido a la derecha; densidad alternante (entradas con bullets colapsados visualmente vs. destacadas). Mantener fallback sin JS.
- **B10:** los filtros de capítulos quedan integrados bajo el título de la página con aire suficiente para no tocar la franja del header fijo en 390px; misma verificación en /proyectos.
- **B13:** diagnosticar por qué 390px renderiza a 500px (buscar el elemento que fuerza ancho: canvas fijo, `.hero-title` con `max-width` en ch, tabla…) con `document.documentElement.scrollWidth` vs `innerWidth` en el recorrido; arreglar la causa raíz y añadir `overflow-x: clip` en `body` como cinturón.

- [ ] **Step 1:** B13 primero (diagnóstico + fix + verificación a 390px real).
- [ ] **Step 2:** B9 re-composición de timeline; recorrido local /experiencia 1440+390.
- [ ] **Step 3:** B10 en /personal y /proyectos; verificar a 390px que nada colisiona con el header.
- [ ] **Step 4:** commit — `fix(layout): timeline con ritmo, filtros bajo título, viewport móvil (B9, B10, B13)`.

### Task 6: Secreto post-footer digno (B3)

**Files:**
- Modify: `web/src/components/PostFooter.astro`, `web/src/scenes/post-footer.ts`

**Prescripción (spec §4.4-B3):** z-order texto SIEMPRE sobre la pieza (`.pf-content { z-index }` real + canvas detrás); pieza en marfil `#F4F4F0` con rim-light lima `#D4FF3F` (muere el verde oliva — el color actual resulta de lima con luces oscuras: usar material marfil y el lima solo como luz de canto); sin monograma fantasma (resuelto en Task 3, verificar); composición del momento cuidada (pieza descentrada componiendo con el texto, no detrás de él).

- [ ] **Step 1:** implementar materiales/luces nuevos + z-order + composición.
- [ ] **Step 2:** recorrido local del tramo footer→secreto (1440+390): texto 100% legible en todo frame, pieza en paleta.
- [ ] **Step 3:** commit — `fix(secret): pieza marfil+rim lima, z-order y composición (B3)`.

### Cierre Sprint 2

- [ ] Deploy a staging (`npm run build` + `node scripts/deploy.mjs`).
- [ ] Recorrido completo home + experiencia + proyectos + personal (1440 y 390), screenshots cada ~600px revisados UNO A UNO por Fable → guardar en `docs/superpowers/qa/sprint-2/`.
- [ ] Commit de QA + anotar en decisions.md cualquier variación.

---

## SPRINT 3 — Coreografía

### Task 7: `motion-tokens.ts` + re-tempo de todos los módulos

**Resuelve:** A4 (+re-tempo global §5.2).

**Files:**
- Create: `web/src/lib/motion-tokens.ts`
- Modify: `web/src/lib/motion.ts` (reveals usan tokens), `web/src/scenes/hero-particles.ts` (inercia mayor, reagrupado más lento), `web/src/components/projects/Deck.ts`, `web/src/scenes/liquid-text.ts` (solo tempos; el rehecho es Task 9), `web/src/components/MenuOverlay.ts`, `web/src/components/personal/MessyTable.ts`, `web/src/views/experience.astro` (scrub), `web/src/styles/tokens.css` (variables CSS espejo para transiciones CSS)

**Interfaces:**
- Produce (fuente única, importable):

```ts
/** Un solo lenguaje de movimiento (spec remediación §5.1). Prohibido valor suelto. */
export const EASE = {
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',   // entradas
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)', // trayectos/scrub
} as const
/** Versiones GSAP de las mismas curvas. */
export const EASE_GSAP = {
  out: 'expo.out2', // se registra con CustomEase equivalente; si no, usar 'power3.out' documentándolo
  inOut: 'power2.inOut',
} as const
export const DURATION = {micro: 0.2, element: 0.5, section: 0.9} as const // segundos
export const SCRUB = 1 as const            // rango admisible 0.8–1.2
export const REVEAL = {rise: 32, stagger: 0.07} as const
export const PARALLAX_MAX = 0.08 as const  // fracción del alto del elemento
```

(Nota de implementación: GSAP no acepta cubic-bezier strings sin CustomEase — plugin de pago NO, es Club. Usar los equivalentes core más próximos: `expo.out` para entradas y `power2.inOut` para trayectos, y documentar en el propio archivo que son la materialización GSAP de las dos curvas CSS.)

- [ ] **Step 1:** crear `motion-tokens.ts` (+ espejo CSS `--ease-out-token`, `--ease-inout-token`, `--dur-micro/element/section` en `tokens.css`; migrar `--ease-standard`/`--transition-*` a alias de estos).
- [ ] **Step 2:** `motion.ts`: reveal = rise 32px, `DURATION.element`, stagger 0.07, ease out.
- [ ] **Step 3:** pasar módulo a módulo (lista de Files) sustituyendo cada easing/duración/amplitud por tokens. Partículas: aumentar inercia y bajar velocidad de reagrupado hasta que respiren con el resto (juicio de Fable en recorrido).
- [ ] **Step 4:** `grep -rn "power\|ease\|duration" web/src` — todo valor de movimiento restante o es token o está justificado en comentario con referencia al token.
- [ ] **Step 5:** recorrido local home+proyectos+experiencia: el sitio entero "respira igual".
- [ ] **Step 6:** commit — `feat(motion): tokens únicos de movimiento + re-tempo global (A4)`.

### Task 8: Camaleón intra-página (A3) + costuras fundidas

**Files:**
- Create: `web/src/lib/chameleon.ts` (ScrollTrigger que interpola `--accent` y tinte de fondo en `:root` con scrub)
- Modify: `web/src/views/home.astro` (marcas de sección + init), `web/src/views/project-detail.astro`, `web/src/views/personal.astro` (mismo patrón suave), CSS de bandas (fuera líneas de costura duras: `CtaBand` pierde su `border-block` si delata corte)

**Prescripción (spec §5.3):** en la home `--accent` interpola durante el scroll: hero lima `#D4FF3F` → deck azul `#5B8CFF` → teaser naranja `#FF7847` → CTA/contacto lima `#D4FF3F`. Fondo con tinte ±3% de luminancia acompañando. Scrub suave (token SCRUB). Implementación: un ScrollTrigger por transición entre secciones adyacentes (start 'top bottom' / end 'top center' de la sección entrante) que interpola con `gsap.utils.interpolate` los hex y escribe `document.documentElement.style.setProperty('--accent', …)`. Reduced-motion: acentos fijos por sección sin interpolar (cambio en snap).

- [ ] **Step 1:** implementar `chameleon.ts` + instrumentar home.
- [ ] **Step 2:** fundir costuras (revisar cada borde/band de sección en el recorrido).
- [ ] **Step 3:** aplicar patrón a ficha de proyecto y personal (sutil).
- [ ] **Step 4:** recorrido local home 1440+390: el acento muta perceptible y continuamente; sin bandas duras.
- [ ] **Step 5:** commit — `feat(motion): camaleón intra-página con scrub (A3)`.

### Task 9: Estados intermedios del deck (B5) + CTA líquido rehecho (B1)

**Files:**
- Modify: `web/src/components/projects/Card.astro` + `web/src/views/projects.astro` + `web/src/components/home/FeaturedDeck.astro` (franja de identidad)
- Modify: `web/src/scenes/liquid-text.ts` + `web/src/components/home/CtaBand.astro`

**Prescripción deck (spec §5.4):** la identidad de la carta vive en una franja superior de ~72px (título + año + categoría) al TOP; imagen y resumen debajo. El offset sticky de cada carta se escalona ~72px por índice (`top: calc(base + índice*72px)` vía `--card-index`) para que al cubrirse quede visible la pestaña de la tapada — patrón fichero pxpush. En TODO momento del recorrido se sabe qué proyecto se ve y cuál viene. Móvil: franja igual, sin sticky.

**Prescripción CTA (spec §5.5):** reposo = texto perfectamente legible (distorsión 0 o ≤2px de ondulación lenta). Distorsión SOLO por proximidad/velocidad del cursor, radial y local (radio ~150px alrededor del puntero — en UV: 150/anchoBanda), amplitud máx ~8% del cuerpo de letra. Al salir el cursor → reposo en `DURATION.element` (500ms). Móvil: micro-ondulación con el scroll, siempre legible. Sin colisión con el header (padding-top del band).

- [ ] **Step 1:** rediseñar carta con franja de identidad + offsets escalonados; en /proyectos las cartas pasan a ~88% del ancho centradas (mata la columna derecha muerta también ahí — B6); recorrido /proyectos completo (10 cartas) y home deck, 1440+390.
- [ ] **Step 2:** reescribir uniforms/shader del liquid: `uMouse` en px reales, radio 150px, amplitud limitada, decay a reposo 500ms, ondulación de reposo ≤2px; scroll móvil alimenta micro-intensidad.
- [ ] **Step 3:** verificación específica B1: screenshot en reposo → el texto se lee perfecto; con cursor encima → distorsión local elegante; al salir → vuelve en ~500ms.
- [ ] **Step 4:** commit — `feat(deck+cta): franjas de identidad en deck y líquido reactivo legible (B5, B1)`.

### Cierre Sprint 3

- [ ] Deploy a staging + recorrido completo (todas las páginas afectadas × 1440/390) revisado por Fable → `docs/superpowers/qa/sprint-3/`.
- [ ] Auditar interactivamente el rebarajado de filtros de /proyectos (B7 pendiente de la auditoría): filtrar por cada categoría y verificar que la animación cumple los tokens y no rompe el apilado.
- [ ] Lighthouse Performance en staging ≥85 (si <85, optimizar antes de cerrar el sprint).
- [ ] Commit QA + decisions.md.

---

## SPRINT 4 — La casa (dirección de arte)

### Task 10: Diorama con encanto (B11) — **Tarea creativa: Fable inline**

**Files:**
- Modify: `web/src/scenes/house/scene.ts`, `character.ts`, `interactables.ts` (posiciones si cambian)
- Add asset: copiar `assets-entrada/retrato.png` → `web/public/house/retrato.png` (cabeza billboard; EXISTE — usarlo)

**Prescripción (spec §6):**
- **Luz:** ambiente cálida tenue + direccional principal; blob shadows (planos circulares oscuros semitransparentes) bajo personaje y muebles.
- **Materiales:** suelo `--surface-1` con retícula sutil (textura canvas o líneas), paredes `--surface-0` con zócalo; CADA interactuable con el acento de su sección (escritorio azul, estantería violeta, guitarra naranja, ordenador teal, puerta lima).
- **Props legibles** (primitivas compuestas): escritorio = tablero+patas+monitor emisivo; estantería con libros de lomos de colores (acentos); guitarra = extrude de silueta real; puerta con marco y pomo. Micro-animación idle por prop (monitor parpadea, etc.).
- **Personaje:** cápsula bicolor vestida mínima; cabeza billboard con `retrato.png`; bob al andar + rotación suave.
- **Encuadre:** cámara más baja, leve fog para profundidad, viñeta sutil (CSS overlay en el stage).

- [ ] **Step 1 (puerta de entrada):** screenshot del estado actual + moodboard mental contra low-poly de calidad.
- [ ] **Step 2:** luz + suelo/paredes + blob shadows.
- [ ] **Step 3:** props legibles + micro-idles + acentos por sección.
- [ ] **Step 4:** personaje (retrato + bob) + cámara/fog/viñeta.
- [ ] **Step 5 (puerta de salida):** screenshot de la casa; pregunta de la vara: "¿esto tiene dirección de arte?" — WASD y prompts siguen funcionando.
- [ ] **Step 6:** commit — `feat(house): dirección de arte del diorama (B11)`.

---

## Cierre de sesión

### Task 11: QA final, Lighthouse, NIGHT-REPORT-2, push

- [ ] Deploy final a staging.
- [ ] Recorridos finales completos: TODAS las páginas (home, proyectos, ficha, experiencia, personal, blog, entrada, cv, contacto, gracias, casa) × 1440px y 390px, screenshots cada ~600px → `docs/superpowers/qa/final/`, revisados uno a uno.
- [ ] Lighthouse Performance ≥90 en staging (mcp lighthouse_audit); si <90, optimizar hasta recuperarlo.
- [ ] Vara final: "¿el recorrido de la home podría confundirse con una referencia?" — respuesta razonada en el report.
- [ ] Escribir `docs/superpowers/NIGHT-REPORT-2.md` (mismo formato que NIGHT-REPORT.md: qué se hizo, decisiones, limitaciones —incl. material LinkedIn no disponible—, pendientes).
- [ ] Commit + push a `main`.
