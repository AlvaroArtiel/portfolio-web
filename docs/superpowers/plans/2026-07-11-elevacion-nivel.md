# Elevación de nivel — Plan de implementación (Sesión autónoma 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Subir dev.alvaroartiel.com de "sin fallos" a "nivel referencia": cada página con su concepto memorable (experiencia=viaje temporal, CV=documento suizo, contacto=mad-lib, blog=revista, hero=capas) y una capa global de marca (cursor, loader, manifiesto, microcopy con voz).

**Architecture:** Sobre el código existente (Astro 7 MPA + Sanity + GSAP/ScrollTrigger + Lenis + Three.js). Las direcciones creativas están validadas por el usuario (spec §0) — no se re-decide el QUÉ; el CÓMO fino es de Fable en cada puerta. Nuevos módulos reutilizables: `hover-preview.ts` (experiencia + blog), `cursor.ts`, `reading-time.ts`, componentes `Loader.astro` y `home/Manifesto.astro`. Doble puerta Fable en cada tarea con verificación de recorrido (screenshots cada ~600px, 1440 Y 390).

**Tech Stack:** Astro 7, Sanity 6 (free tier), GSAP + ScrollTrigger, Lenis, Three.js, deploy Hostinger vía `scripts/deploy.mjs` (`Compress-Archive`, ver `scripts/DEPLOY.md`).

## Global Constraints

- Deploy SOLO a `dev.alvaroartiel.com`. Prohibido tocar el dominio raíz y los demás sites.
- Sanity solo free tier. Zip de deploy con `Compress-Archive` (nunca bsdtar).
- Paleta estricta: solo tokens de `web/src/styles/tokens.css` (`--surface-0/1/2`, `--text`, `--text-muted`, acentos `#D4FF3F/#5B8CFF/#B06CFF/#FF7847/#4FD1C5`, cv neutro).
- Movimiento: SOLO tokens de `web/src/lib/motion-tokens.ts` (`EASE`, `EASE_GSAP`, `DURATION`, `SCRUB`, `REVEAL`, `PARALLAX_MAX`). Cero easings/duraciones ad-hoc.
- **Vara de calidad = §2 del spec de remediación ÍNTEGRA + punto 11 nuevo: Memorabilidad** — cada página responde "¿qué UNA cosa recordará quien la vea?"; si la respuesta es "nada", la tarea no cierra.
- **Regla de contenido:** ningún subagente redacta hechos. Copy factual = material fuente del spec original §9 + correcciones (remediación §3, elevación §2). Copy creativo (microcopy, manifiesto, claims) lo redacta Fable. Verificación factual entrada a entrada en la puerta de salida.
- Doble puerta Fable en CADA tarea: pre (re-especificar si no alcanzaría la vara) y post (verificación de recorrido: screenshots cada ~600px, desktop 1440 Y móvil 390, frame a frame; iterar hasta cumplir, máx. 3 iteraciones; a la 3ª documentar limitación en decisions.md).
- Todo lo nuevo respeta `prefers-reduced-motion` y el presupuesto FPS existente (detección de capacidades de `three-island.ts`).
- Commits frecuentes; toda variación → `docs/superpowers/decisions.md`; al cierre `docs/superpowers/NIGHT-REPORT-3.md`.
- Lighthouse Performance ≥85 durante la sesión; ≥90 al cierre en todas las rutas.
- Bloqueo >30 min → fallback documentado y seguir.
- Bilingüe SIEMPRE: todo texto nuevo en ES y EN (EN adaptado con voz, no traducción literal). Nada hueco en `/en/`.
- La cortina de acento entre páginas está DESCARTADA (se mantiene el crossfade actual). La línea de estado vivo está descartada como marco del hero (opcionalmente discreta en footer si suma).

---

## TAREA 0 (Task 1) — Crítico de contenido: TenTuPlaza veraz + auditoría total del CV

**Mecánica (Sonnet).** Diagnóstico calibrado en staging: el copy falso vive en el SEED (`studio/seed/content.mjs`) y aparece en /experiencia Y /cv (ambas ya beben de los mismos documentos `experience` de Sanity vía `getExperiences()` — la "unificación" que pide el spec ya existe estructuralmente; anotar en decisions.md). La condensación visual del CV se hace en Task 3.

**Files:**
- Modify: `studio/seed/content.mjs` (experience-tentuplaza + project-tentuplaza-plataforma, ES y EN)
- Run: `cd studio/seed && node seed.mjs` · `cd web && npm run build` · `node scripts/deploy.mjs`

**Interfaces:**
- Produce: mismos shapes de documento; solo cambian textos.

**Hechos respaldados para TenTuPlaza (spec elevación §2 — única base admisible):** academia online de oposiciones ferroviarias · +5.000 alumnos · +770 reseñas 5★ · Álvaro lidera estrategia digital y de producto: nueva plataforma e-learning a medida, UX/UI, coordinación de equipos, marketing. El proyecto "Plataforma TenTuPlaza" = nueva plataforma e-learning a medida (en construcción), NO "comercio local y experiencias de ciudad".

- [ ] **Step 1 (puerta de entrada Fable):** listar todas las apariciones de TenTuPlaza en `content.mjs` (experiencia, proyecto, cuerpo del proyecto) y las afirmaciones que caen.
- [ ] **Step 2:** reescribir `experience-tentuplaza` (summary + bullets ES/EN) y `project-tentuplaza-plataforma` (summary + body ES/EN) con los hechos respaldados. Tono §3.3 aplicado a la redacción, nunca a los hechos.
- [ ] **Step 3:** auditar el RESTO de entradas que el CV renderiza (7 experiencias, 6 formaciones, skills fallback de `cv.astro:18`) contra la tabla de hechos del plan de la sesión 2 (Task 1). Corregir cualquier otra desviación encontrada.
- [ ] **Step 4:** re-seed idempotente + build + deploy: `node seed.mjs` (exit 0) → `cd web && npm run build` (exit 0) → `node scripts/deploy.mjs`.
- [ ] **Step 5 (puerta de salida Fable):** releer en staging /cv, /en/cv, /experiencia, /en/experience y la ficha de proyecto TenTuPlaza entrada a entrada contra los hechos. Ninguna afirmación sin respaldo.
- [ ] **Step 6:** commit — `fix(content): TenTuPlaza veraz (academia oposiciones ferroviarias) en experiencia y proyecto`.

---

## Task 2: Experiencia — concepto "viaje temporal" (LA obra grande)

**Creativa (Fable inline).** Resuelve spec §3.1.

**Files:**
- Modify: `web/src/views/experience.astro` (reescritura de layout y escenas)
- Create: `web/src/lib/hover-preview.ts` (preview flotante que sigue al cursor — REUTILIZABLE: blog Task 5 la consume)
- Create: `web/src/lib/journey-year.ts` (año gigante sticky con rodillo)
- Modify: `web/src/lib/queries.ts` (si hace falta exponer logo/imagen de proyectos relacionados para la preview)
- Modify: `web/src/styles/print.css` solo si algo se filtra a print (no debería: print es del CV)

**Interfaces:**
- Produces: `initHoverPreview(root?: HTMLElement)` — busca anclas `[data-preview-src]` (attrs: `data-preview-src`, `data-preview-alt`); crea UNA capa flotante reutilizada que sigue al cursor con lag (EASE.inOut, DURATION.micro), aparece/desaparece con DURATION.element. Desactivada con puntero grueso o reduced-motion.
- Produces: `initJourneyYear(opts: {stages: HTMLElement[]; display: HTMLElement})` — observa qué etapa cruza el centro del viewport y muta la cifra con rodillo (dígitos que ruedan verticalmente, EASE_GSAP.inOut, DURATION.element). Reduced-motion: cambio por corte.

**Prescripción (validada, no re-decidir el QUÉ):**
- **Orden cronológico ascendente** (2018 → 2026): el viaje temporal exige empezar en 2018 (8 Pecados) y acabar en la actualidad. El CV (Task 3) mantiene orden inverso (convención RRHH). Anotar en decisions.md.
- **Año gigante sticky:** cifra display (Clash Display) violeta translúcido ~25-30vw, `position: sticky` en un lateral (izquierda, donde hoy viven fechas), detrás del contenido (z-index bajo, `pointer-events: none`), opacidad tal que el texto encima siempre cumpla AA. Muta con el rodillo al cruzar etapas.
- **Cada etapa = mini-escena:** logo/marca presente (campo `logo` de Sanity si existe; si no, wordmark tipográfico), rol como titular display grande, **una métrica protagonista tipográficamente enorme**, resumen corto, bullets colapsados bajo "ver detalle" (disclosure accesible: `<details>/<summary>` o botón con `aria-expanded`, animado con motion-tokens).
- **Métricas admisibles (verificación factual estricta):** TenTuPlaza → «+5.000 alumnos» · Consultor independiente → «+40 proyectos» · Ceustack → «3 productos propios» (Ranquea · UltraCarta · Vaultz, §9). Resto de etapas SIN métrica numérica inventada: protagonista tipográfico = el entregable respaldado (AuraProds → «Campus e-learning» · iUrban → «CRM + design system» · Esperando el Render → «Consultoría e-learning» · 8 Pecados → rol). Nada numérico sin fuente.
- **Sorpresa de hover:** los enlaces de "Proyectos relacionados" muestran preview flotante (cover del proyecto desde Sanity CDN, `?w=480&fm=webp`) que sigue al cursor.
- **Móvil 390:** el año gigante pasa a cabecera de etapa (grande, en flujo, no sticky); preview flotante desactivada; todo lo demás degrada según sistema.
- **Reduced-motion:** año por corte, disclosures sin animación, sin preview-follow.

- [ ] **Step 1 (puerta de entrada):** Fable revisa el layout actual (343 líneas) y boceta la retícula de la escena (posición año/logo/rol/métrica) antes de tocar código.
- [ ] **Step 2:** implementar `hover-preview.ts` y `journey-year.ts` según Interfaces.
- [ ] **Step 3:** reescribir `experience.astro`: orden cronológico, escenas, disclosure, métricas de la tabla, integración de ambos módulos como script de página.
- [ ] **Step 4:** build verde + recorrido local (dev server) 1440 Y 390, frame a frame: el año nunca compromete legibilidad, el rodillo usa la coreografía del sistema, la preview jamás tapa el enlace que la origina, disclosures accesibles por teclado.
- [ ] **Step 5:** deploy + recorrido en staging (ES y EN) + puerta de salida Fable contra la vara (incl. punto 11: lo memorable = el tiempo se SIENTE).
- [ ] **Step 6:** commit — `feat(experiencia): concepto viaje temporal — año sticky con rodillo, mini-escenas, preview flotante`.

---

## Task 3: CV — documento suizo (el divorcio)

**Creativa (Fable inline) con base mecánica.** Resuelve spec §3.2.

**Files:**
- Modify: `web/src/views/cv.astro` (reescritura completa del layout)
- Modify: `web/src/styles/print.css` (revisión con la nueva estructura)
- Modify: `web/src/lib/i18n.ts` (claves nuevas del encabezado/sidebar)

**Interfaces:**
- Consumes: los MISMOS `getExperiences()`/`getEducation()`/`getSiteSettings()` — versión condensada (mismo dato, distinta densidad). Prohibido copy paralelo.

**Prescripción:**
- **Dos columnas** (desktop; una columna apilada en móvil): sidebar = retrato pequeño en b/n (`/retrato.png` ya en `web/public/`, `filter: grayscale(1)`, recorte cuidado), datos de contacto (email de Sanity), aptitudes agrupadas (la lista `skills` existente en `cv.astro:18`, agrupada por familias: Diseño / Desarrollo / Producto), idiomas («Español · Inglés» sin niveles — no hay fuente para niveles; anotar en decisions.md), botón imprimir/descargar. Main = experiencia condensada y densa (rol — empresa, fechas, summary de una línea; SIN bullets: la densidad del detalle vive en /experiencia) + formación completa.
- **Encabezado propio:** «CV — versión para leer con prisa» (ES) / «CV — the version you read in a hurry» (EN). Voz medida, sin chiste extenso: el CV es sobrio.
- **Tipografía/retícula suiza:** columnas alineadas a una retícula estricta, jerarquía por peso y tamaño (no por color), acento neutro `--text`, hairlines `--border-soft`. CERO efectos de scroll (quitar `data-reveal` de esta página: su concepto ES la quietud diseñada).
- **Print CSS:** dos columnas colapsan a flujo imprimible A4, retrato opcionalmente oculto, sin fondos oscuros (ya existe print.css — revisarlo entero con la nueva estructura, incluida paginación de secciones).
- **Vara específica:** ¿parece el CV de un director de arte suizo? (composición, no pobreza).

- [ ] **Step 1 (puerta de entrada):** Fable define la retícula (proporción sidebar/main, escala tipográfica del documento) sobre el estado actual.
- [ ] **Step 2:** reescribir `cv.astro` con la estructura de dos columnas y el encabezado nuevo; añadir claves i18n (`cv_tagline`, `cv_skills_design`, `cv_languages`, …) en ES y EN.
- [ ] **Step 3:** revisar `print.css` contra la nueva estructura; probar con el diálogo de impresión del navegador (vista previa).
- [ ] **Step 4:** build + recorrido local 1440 Y 390 + vista de impresión. Verificación factual: cada línea del CV contra los hechos (ya corregidos en Task 1).
- [ ] **Step 5:** deploy + puerta de salida en staging (/cv y /en/cv). Memorabilidad: "la quietud diseñada — parece un documento suizo".
- [ ] **Step 6:** commit — `feat(cv): documento suizo de dos columnas — divorcio total de /experiencia`.

---

## Task 4: Contacto — mad-lib conversacional + /gracias con premio

**Creativa (Fable inline).** Resuelve spec §3.3.

**Files:**
- Modify: `web/src/views/contact.astro` (reescritura)
- Modify: `web/src/views/thanks.astro` (premio + "mientras respondo…")
- Modify: `web/src/lib/i18n.ts` (claves del mad-lib, estados del botón, panel)
- (No tocar `api/contact.php`: el POST sigue igual; el mapeo se hace en el cliente/form.)

**Interfaces:**
- Consumes: `POST /api/contact.php` con campos `name`, `email`, `message` (+ honeypot + `lang` existentes). El select del mad-lib se concatena al principio de `message` (p.ej. «[Tengo entre manos: una idea] …mensaje…») — sin cambios de backend.

**Prescripción:**
- **Frase display con inputs inline** subrayados en lima: «Hola, soy **[nombre]**. Tengo entre manos **[un producto / una web / una idea / otra cosa]** (select estilizado) y quiero contártelo: **[mensaje]**. Respóndeme en **[email]**.» Inputs que crecen con el contenido (`field-sizing` o mirror span), subrayado 2px `--accent`. EN adaptado con la misma gracia.
- **Accesibilidad no negociable:** cada input con `<label>` real (sr-only), orden de foco natural (nombre → select → mensaje → email → enviar), validación inline con voz (mensajes bajo el campo, `aria-describedby`, `aria-invalid`), select nativo estilizado (no listbox casero).
- **Panel lateral vivo:** email gigante clicable (copia al portapapeles) con «Copiado ✓» + microexplosión de partículas lima (canvas pequeño o spans animados, DURATION.element); redes desde Sanity; «Respondo en <48h».
- **Botón enviar con viaje de estados:** reposo («Lanzar al buzón →») → lanzando (avión/trayectoria, EASE_GSAP.inOut) → «En el buzón ✓». El submit real espera al fetch/redirect existente; si el envío es redirect clásico, el estado "lanzando" cubre el tránsito.
- **/gracias con premio:** mini-momento — pieza 3D celebrando (REUTILIZAR la pieza del post-footer o el monograma con animación de celebración vía `three-island.ts`; presupuesto: nada nuevo pesado) + «mientras respondo…» con enlaces a /personal y /blog. Reduced-motion: composición estática con el mismo copy.
- **Móvil 390:** el mad-lib fluye en columna, panel debajo; inputs táctiles cómodos (≥44px alto).

- [ ] **Step 1 (puerta de entrada):** Fable redacta el mad-lib definitivo ES/EN y el viaje de estados del botón (microcopy propio) — va a i18n, no hardcodeado.
- [ ] **Step 2:** implementar el formulario mad-lib accesible + panel lateral + botón con estados.
- [ ] **Step 3:** implementar /gracias con el premio y los enlaces.
- [ ] **Step 4:** build + prueba funcional real: rellenar y enviar el formulario en staging → verificar redirect a /gracias (y que el mapeo de campos llega bien: revisar el mail o al menos el POST 302). Teclado: completar todo el form solo con Tab/Enter.
- [ ] **Step 5:** recorrido 1440 Y 390 ES/EN + puerta de salida. Memorabilidad: "el formulario ERA una conversación".
- [ ] **Step 6:** commit — `feat(contacto): formulario mad-lib conversacional + gracias con premio`.

---

## Task 5: Blog — de lista muerta a revista

**Creativa (Fable inline).** Resuelve spec §3.4. Diseñado para verse BIEN con 1 entrada y escalar.

**Files:**
- Modify: `web/src/views/blog.astro` (destacada + filas)
- Modify: `web/src/views/blog-post.astro` (interior)
- Create: `web/src/lib/reading-time.ts`
- Modify: `web/src/lib/queries.ts` (traer cover/extracto/body para cálculo y previews)
- Modify: `web/src/lib/i18n.ts` (claves: "leer", "min", contador con voz, "siguiente entrada")

**Interfaces:**
- Consumes: `initHoverPreview` de `web/src/lib/hover-preview.ts` (Task 2).
- Produces: `readingTime(body: PortableTextBlock[]): number` — minutos (200 wpm, mínimo 1), usado en lista e interior.

**Prescripción:**
- **Lista:** entrada más reciente = tarjeta grande (cover si existe; si no, arte generativo del sistema con acento teal), extracto, «leer · X min». Resto (cuando exista) en filas tipográficas con preview flotante al cursor y meta enriquecida (tiempo de lectura, tags-chip teal `--surface-1` + borde). Contador con voz: «1 entrada — de momento» / «1 post — for now» (pluralización correcta).
- **Interior:** barra de progreso de lectura teal fija (top, 2-3px, scrub), pull-quotes display (estilo para `blockquote` del Portable Text), imágenes full-bleed, bloque autor al pie (retrato pequeño + una línea + CTA a contacto), «siguiente entrada» reutilizando la entidad visual de `NextProject.astro` (mismo lenguaje; si solo hay 1 entrada, el bloque enlaza a /contacto o /proyectos con copy de voz — decidir en puerta de entrada).
- Con 1 sola entrada: la destacada ES la página; sin filas fantasma ni huecos.

- [ ] **Step 1 (puerta de entrada):** Fable decide la composición exacta con 1 entrada (estado actual) y el comportamiento del bloque "siguiente entrada" sin siguiente.
- [ ] **Step 2:** implementar `reading-time.ts` + query enriquecida.
- [ ] **Step 3:** reescribir lista e interior según prescripción.
- [ ] **Step 4:** build + recorrido local (lista + entrada, 1440 Y 390, ES/EN).
- [ ] **Step 5:** deploy + puerta de salida. Memorabilidad: "el blog abre con contenido, no con lista".
- [ ] **Step 6:** commit — `feat(blog): revista — destacada, tiempo de lectura, progreso e interior editorial`.

---

## Task 6: Hero por capas

**Creativa (Fable inline).** Resuelve spec §3.5. La página más sensible al rendimiento: presupuesto FPS y Lighthouse vigilados.

**Files:**
- Modify: `web/src/components/home/Hero.astro`
- Modify: `web/src/scenes/hero-particles.ts` (salida en partículas con scrub)
- Create: `web/src/scenes/hero-floaters.ts` (objetos flotantes reactivos)
- Copy: `assets-entrada/retrato.png` ya está en `web/public/retrato.png` (recorte cuidado si hace falta variante)

**Prescripción:**
- **Objetos flotantes (noth.in):** 4-6 piezas pequeñas del mundo de Álvaro — un cursor (flecha), un componente UI (botón/toggle), una pieza de puzzle, una púa/guitarra mini, una nota — orbitando el titular con parallax al ratón (PARALLAX_MAX) y micro-rotación idle. Al hover directo: huyen/giran (EASE_GSAP.out, DURATION.element). Materiales del sistema: marfil `--text` + acentos; pueden ser 2.5D (SVG/CSS 3D transform) o dentro de la escena Three existente — decidir en puerta de entrada por presupuesto. **Nunca tapan texto** (vara §2.3): órbitas definidas fuera de la caja del titular en 1440 Y 390.
- **Retrato al hover del nombre:** hover sobre «Álvaro Artiel» (header del hero, esquina) revela el retrato real con efecto del sistema (clip-path o máscara, DURATION.element, EASE.out). En móvil: aparición sutil al cargar (sin tap requerido).
- **Salida en partículas:** al iniciar scroll, el titular se disuelve en sus propias partículas (ascendiendo/dispersando con scrub, SCRUB) en lugar del fade — extender `hero-particles.ts`, que ya posee las partículas del titular.
- **Degradaciones:** móvil = flotantes estáticos o eliminados si FPS sufre (decidir con medición); reduced-motion = sin flotantes animados, titular estático, sin disolución (fade simple); sin WebGL = fallback existente.

- [ ] **Step 1 (puerta de entrada):** Fable decide técnica de flotantes (DOM 2.5D vs WebGL) midiendo FPS actual del hero, y define las 4-6 piezas y sus órbitas exactas (sketch en comentario).
- [ ] **Step 2:** implementar `hero-floaters.ts` + integración en `Hero.astro`.
- [ ] **Step 3:** implementar retrato al hover del nombre (y variante móvil).
- [ ] **Step 4:** implementar la salida en partículas con scrub en `hero-particles.ts`.
- [ ] **Step 5:** medir: FPS del hero (trace de chrome-devtools) y Lighthouse Performance local ≥85. Si cae: reducir piezas/partículas hasta cumplir.
- [ ] **Step 6:** deploy + recorrido home completa 1440 Y 390 + reduced-motion + puerta de salida. Memorabilidad: "el titular se deshizo en partículas".
- [ ] **Step 7:** commit — `feat(hero): capas — flotantes reactivos, retrato al hover, salida en partículas`.

---

## Task 7: Cursor propio con estados

**Mixta (base mecánica Sonnet + tuning Fable).** Resuelve spec §3.6-cursor.

**Files:**
- Create: `web/src/lib/cursor.ts`
- Modify: `web/src/layouts/Base.astro` (montaje global)
- Modify: `web/src/styles/global.css` (ocultar cursor nativo solo cuando aplica)
- Modify: `web/src/components/projects/Card.astro`, `web/src/components/personal/PolaroidCard.astro`, `web/src/components/projects/Filters.astro` (atributos `data-cursor`)

**Interfaces:**
- Produces: montaje automático en `Base.astro`. API declarativa por atributos: `data-cursor="view"` («VER →»), `data-cursor="drag"` («ARRASTRA»), `data-cursor-label="Texto"` (etiqueta arbitraria, p.ej. filtros). Enlaces/botones sin atributo → estado "crece" automático (delegación sobre `a, button, [role=button], summary, input, select, textarea, label`).

**Prescripción:**
- Punto (6-8px, `--accent`) + aro (~36px, borde 1px `--text` al 40%) con lag suave (el aro persigue con lerp ~0.15 en rAF; el punto va 1:1). `mix-blend-mode: difference` para legibilidad sobre cualquier fondo.
- Estados: enlace → aro crece (1.6x); `view` → el aro se vuelve píldora con «VER →» (texto mono, i18n); `drag` → «ARRASTRA»; `data-cursor-label` → etiqueta.
- **Solo puntero fino:** montar únicamente si `matchMedia('(pointer: fine)')`. En reduced-motion: sin lag animado (aro 1:1) — el cursor existe pero sin persecución. `cursor: none` SOLO en `html` bajo `@media (pointer: fine)` y nunca dentro de `forced-colors` / cuando el usuario fuerce cursor del sistema; los elementos interactivos conservan sus estilos de foco.
- Textos de estado en i18n (ES «VER →»/«ARRASTRA», EN «VIEW →»/«DRAG»).

- [ ] **Step 1:** implementar `cursor.ts` + estilos + montaje en Base.
- [ ] **Step 2:** añadir `data-cursor` a cartas de proyecto/blog (view), polaroids (drag), filtros (label).
- [ ] **Step 3:** build + prueba manual en local: estados en home, /proyectos, /personal, /blog; verificar que con reduced-motion no hay lag y que en emulación táctil no se monta.
- [ ] **Step 4:** deploy + puerta de salida Fable (¿el cursor se siente actor principal sin estorbar?).
- [ ] **Step 5:** commit — `feat(brand): cursor propio con estados (view/drag/label)`.

---

## Task 8: Experiencia de carga

**Creativa (Fable inline).** Resuelve spec §3.6-loader.

**Files:**
- Create: `web/src/components/Loader.astro` (telón + monograma + palabra rotante + lógica)
- Modify: `web/src/layouts/Base.astro` (incluirlo; solo se activa en primera visita de sesión)

**Prescripción:**
- 1-1.5s SOLO primera visita por sesión (`sessionStorage.getItem('aa-loaded')`); visitas siguientes: sin telón (ni flash: decidir server-side es imposible en estático → el telón se pinta por CSS inline ANTES del primer paint y se quita instantáneamente si sessionStorage ya existe, con script inline en `<head>` para evitar FOUC inverso).
- Telón `--surface-0` a pantalla completa; monograma SVG (el del header) dibujándose (`stroke-dasharray` scrub temporal, EASE.out) + una palabra que rota: diseño → código → producto (ES) / design → code → product (EN).
- Sale con la coreografía del sistema (DURATION.section, EASE.inOut) revelando el hero YA estable (fuentes con `document.fonts.ready` y señal de la escena WebGL si está lista; techo duro 1.5s — no se espera más).
- **Skippable** con click o cualquier tecla. **Reduced-motion:** fade simple corto. Accesible: `aria-hidden="true"` en el telón, foco no atrapado, sin bloqueo de lectura de pantalla.
- Lighthouse: el contenido real permanece en el DOM (el telón es overlay); verificar que LCP no se degrada por debajo de la vara.

- [ ] **Step 1 (puerta de entrada):** Fable define la coreografía exacta de entrada/salida (timing del trazo, rotación de palabras, curva de salida).
- [ ] **Step 2:** implementar Loader + guard de sessionStorage + skip + reduced-motion.
- [ ] **Step 3:** build + probar: primera visita (sesión limpia), recarga (sin telón), skip con tecla, reduced-motion, EN.
- [ ] **Step 4:** Lighthouse local en / ≥85. Deploy + puerta de salida.
- [ ] **Step 5:** commit — `feat(brand): experiencia de carga — telón con monograma y palabra rotante (1ª visita por sesión)`.

---

## Task 9: Manifiesto palabra a palabra (home)

**Creativa (Fable inline).** Resuelve spec §3.6-manifiesto.

**Files:**
- Create: `web/src/components/home/Manifesto.astro`
- Modify: `web/src/views/home.astro` (insertarlo entre `FeaturedDeck` y `PersonalTeaser`)
- Modify: `web/src/lib/chameleon.ts` (añadir la parada de acento de la sección si el mapa de secciones lo requiere)

**Prescripción:**
- Frase-manifiesto revelándose palabra a palabra con scrub (cinetica): cada palabra pasa de `--text-muted`/al 25% a `--text` pleno conforme el scroll avanza (ScrollTrigger + SCRUB; sin pin largo que rompa el ritmo de la home — decidir pin corto vs progreso en flujo en puerta de entrada).
- **Redacción de Fable:** 2-3 opciones en `decisions.md`, elegir la mejor. Tono §3.3: seria PERO con remate gamberro. Referencia del análisis (punto de partida, no obligación): «Lo técnico es el medio. Lo que sientes al usarlo es el fin.» EN adaptado con la misma fuerza.
- Tipografía display grande (rango 4-6vw), acento de 1-2 palabras clave mutando con el camaleón de la zona (la home interpola acentos durante el scroll — la palabra acentuada hereda `--accent` vivo).
- Reduced-motion: frase completa visible, sin scrub.

- [ ] **Step 1 (puerta de entrada):** Fable redacta 2-3 opciones ES/EN en decisions.md y elige; define pin vs flujo.
- [ ] **Step 2:** implementar el componente + integración en home + parada del camaleón.
- [ ] **Step 3:** build + recorrido de la home completa (el manifiesto no rompe el ritmo deck→teaser) 1440 Y 390.
- [ ] **Step 4:** deploy + puerta de salida. Memorabilidad: "la frase que se enciende al bajar".
- [ ] **Step 5:** commit — `feat(home): manifiesto palabra a palabra entre deck y teaser`.

---

## Task 10: Pasada de microcopy con voz en TODO el sitio

**Mixta: inventario mecánico (Sonnet) + redacción SOLO Fable.** Resuelve spec §3.6-microcopy (G5).

**Files:**
- Modify: `web/src/lib/i18n.ts` (la mayoría del microcopy vive aquí)
- Modify: cualquier vista/componente con texto utilitario hardcodeado que el inventario destape (hints, contadores, estados vacíos, footer, 404 si existe)

**Prescripción:**
- **Paso 1 mecánico:** inventario exhaustivo — todas las claves de `i18n.ts` + grep de strings visibles hardcodeados en `web/src/views/` y `web/src/components/` (excluir CV: su voz es medida por concepto). Entregar tabla clave → texto actual ES/EN.
- **Paso 2 Fable:** reescritura con la voz (§3.3: cercano, directo, humor medido; el gamberro vive en los detalles). Ejemplos de dirección del análisis: «Baja para ver más» → «Sigue bajando, que hay chicha ↓»; «1 entrada» → «1 entrada — de momento»; «Enviar» → «Lanzar al buzón →». EN adaptado (voz, no traducción literal). El CV y los datos factuales NO se tocan.
- Los textos ya redactados en Tasks 4/5/7 se respetan (esta pasada cubre el resto).

- [ ] **Step 1 (mecánico):** inventario completo → tabla en el scratchpad.
- [ ] **Step 2 (Fable):** reescritura ES+EN de cada clave que lo merezca; actualizar i18n.ts y hardcodeados.
- [ ] **Step 3:** build + barrido visual de todas las páginas en ambos idiomas (ninguna clave rota, ningún texto desbordando).
- [ ] **Step 4:** deploy + puerta de salida (verificación factual: la voz no introdujo afirmaciones nuevas).
- [ ] **Step 5:** commit — `feat(voice): microcopy con voz en todo el sitio (ES+EN)`.

---

## Task 11: Retoques menores (si el presupuesto lo permite, EN ESTE ORDEN)

**Mixta.** Resuelve spec §3.7. Cada retoque es independiente: se ejecutan en orden hasta agotar presupuesto; cada uno con su mini-puerta y su commit.

- [ ] **11a — Cartas de proyecto:** tilt sutil al hover (rotateX/Y ≤4°, EASE.out) + zoom de imagen 1.04 + índice «01/04» mono en la pestaña + `data-cursor="view"` (ya de Task 7). Files: `web/src/components/projects/Card.astro`, `web/src/components/projects/Deck.ts`. Commit: `feat(proyectos): tilt + zoom + índice en cartas`.
- [ ] **11b — Ficha de proyecto:** barra de progreso sticky del caso (secciones) + «siguiente proyecto» con preview más rica (cover grande + hover del sistema). Files: `web/src/views/project-detail.astro`, `web/src/components/projects/NextProject.astro`. Commit: `feat(ficha): progreso del caso + siguiente proyecto enriquecido`.
- [ ] **11c — Menú overlay:** mini-preview al hover de cada item (palabra clave + color de sección; el overlay vende cada mundo). Files: `web/src/components/MenuOverlay.astro`, `web/src/components/MenuOverlay.ts`. Commit: `feat(menu): preview de sección al hover`.
- [ ] **11d — Personal:** cinta manuscrita de contexto al filtrar capítulo (frase por capítulo, redacta Fable). Files: `web/src/views/personal.astro`, `web/src/lib/i18n.ts`. Commit: `feat(personal): cinta manuscrita por capítulo`.
- [ ] **11e — Casa:** re-auditar contra la vara nueva (punto 11). Si no pasa, mejorar dentro del presupuesto restante; si pasa, anotar veredicto en decisions.md sin tocar código.

---

## Task 12: Cierre de sesión

**Files:**
- Create: `docs/superpowers/qa/sesion-3/` (recorridos finales)
- Create: `docs/superpowers/NIGHT-REPORT-3.md`

- [ ] **Step 1:** recorridos finales completos: TODAS las páginas × 1440 Y 390 × ES e EN, screenshots cada ~600px, guardados en `docs/superpowers/qa/sesion-3/`. Revisión frame a frame de Fable.
- [ ] **Step 2:** verificación reduced-motion de TODO lo nuevo (cursor, loader, manifiesto, hero capas, año sticky, previews) — emulación `prefers-reduced-motion` y recorrido de home/experiencia/contacto.
- [ ] **Step 3:** Lighthouse ≥90 Performance en todas las rutas (/, /proyectos, ficha, /experiencia, /personal, /blog, entrada, /cv, /contacto — y spot-check /en/). Si alguna baja: optimizar hasta cumplir.
- [ ] **Step 4:** `NIGHT-REPORT-3.md`: lo hecho, decisiones, limitaciones, y la pregunta final respondida página a página: **"¿Qué UNA cosa memorable tiene ahora cada página?"**
- [ ] **Step 5:** commit final + push a `main`.
