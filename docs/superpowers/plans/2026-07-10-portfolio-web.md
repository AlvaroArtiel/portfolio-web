# alvaroartiel.com — Plan de Implementación Autónomo (ejecución nocturna)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y desplegar en `dev.alvaroartiel.com` la web personal/portfolio/CV completa (Astro + Sanity + Three.js) descrita en `docs/superpowers/specs/2026-07-10-portfolio-web-design.md`.

**Architecture:** Sitio estático Astro 5 con islas interactivas (GSAP/Lenis/Three.js/Matter.js), contenido desde Sanity (free tier) vía GROQ en build, backoffice = Sanity Studio hosteado, deploy a Hostinger vía MCP. i18n ES (raíz) + EN (`/en/`) por campos `{es,en}`.

**Tech Stack:** Astro 5, TypeScript, Sanity v4 (cliente + Studio), GSAP + ScrollTrigger, Lenis, Three.js, Matter.js, PHP (form), GitHub, Hostinger MCP.

## Global Constraints

- **Spec canónico:** `docs/superpowers/specs/2026-07-10-portfolio-web-design.md`. Ante duda, manda el spec.
- **Sanity SOLO free tier:** prohibido scheduled publishing, AI Assist, comments, roles extra. i18n por objetos `{es,en}` de schema.
- **Colores/tokens exactos del spec §3.1** — base `#0C0C0E`/`#F4F4F0`; acentos: home `#D4FF3F`, proyectos `#5B8CFF`, experiencia `#B06CFF`, personal `#FF7847`, blog `#4FD1C5`, cv neutro.
- **Tipografías:** Clash Display (Fontshare), Instrument Sans, JetBrains Mono — self-hosted woff2, `font-display: swap`.
- **Deploy SOLO a `dev.alvaroartiel.com`** (staging). PROHIBIDO tocar el site raíz `alvaroartiel.com`, `fotografia.*`, `caxo.*`, `ricoburger.*` o cualquier otro site/DNS existente.
- **Idioma del código:** inglés; contenido y comentarios de cara al usuario: español.
- **Todo efecto** define fallback móvil y `prefers-reduced-motion` (spec §5). El HTML semántico existe siempre debajo de los efectos.
- **Commits frecuentes** tras cada tarea verde. Nunca `--force`, nunca skip hooks.
- **Presupuesto rendimiento:** Lighthouse Performance ≥ 90 desktop en cada fase; islas con `client:visible`; chunks 3D lazy.

## Protocolo de ejecución autónoma

**Enrutado de modelos (obligatorio):**
- Tareas marcadas `[MECÁNICA]` → despachar a subagente **Sonnet** (o Haiku si es trivial: configs, instalaciones).
- Tareas marcadas `[CREATIVA-FABLE]` → las ejecuta **el orquestador Fable inline** (no subagente barato). Contienen un brief cerrado + criterios de aceptación; Fable tiene libertad de ejecución dentro del brief.
- Revisión de lo entregado por subagentes: siempre la hace Fable.

**Checkpoint de reflexión (al cerrar cada fase):**
1. Build verde + screenshots con chrome-devtools MCP (desktop 1440px y móvil 390px) de las páginas afectadas.
2. Fable compara contra spec y referencias. Si detecta mejora real (rendimiento, jerarquía visual, simplificación equivalente) puede variar decisiones **registrándolo** en `docs/superpowers/decisions.md`: `## [fecha] [fase] — [decisión]` con *qué decía el spec / qué se hace / por qué*.
3. Commit de fase: `feat(fase-N): ...`.

**Si una tarea bloquea >30 min:** documentar en `decisions.md`, aplicar el fallback indicado en la tarea (toda tarea de riesgo lo tiene) y seguir. Nunca parar la noche entera por una tarea.

**Al terminar (o al agotar la noche):** escribir `docs/superpowers/NIGHT-REPORT.md` con: fases completadas, decisiones variadas, pendientes, URL de staging, y qué necesita clic del usuario.

---

## FASE 0 — Cimientos

### Task 0.1: Pre-flight [MECÁNICA]

**Files:** ninguno (verificación).

- [ ] Verificar Node ≥ 20: `node --version`
- [ ] **Sanity YA CONFIGURADO (pre-flight hecho el 2026-07-10):** proyecto `1qxvh1it` ("web-portfolio"), dataset `production` (aclMode public), token Editor en `.env` raíz (`SANITY_AUTH_TOKEN`, `SANITY_PROJECT_ID`, `SANITY_DATASET`). Ciclo write/read/delete verificado por API. NO crear proyecto nuevo.
- [ ] **Hostinger YA CONFIGURADO:** site `dev.alvaroartiel.com` creado y activo (username `u706501682`, root `/home/u706501682/domains/dev.alvaroartiel.com/public_html`). NO crear otro site.
- [ ] Verificar que el token sigue vivo: `curl` de lectura GROQ a `https://1qxvh1it.api.sanity.io/v2021-06-07/data/query/production?query=*%5B0..0%5D`.
- [ ] Verificar GitHub: `gh auth status` → logged in como AlvaroArtiel.
- [ ] Verificar Hostinger MCP: cargar vía ToolSearch `hosting_listWebsitesV1` y llamarlo → responde lista de sites.
- [ ] Commit no necesario.

### Task 0.2: Scaffold monorepo [MECÁNICA]

**Files:**
- Create: `web/` (proyecto Astro), `studio/` (Sanity Studio), `api/contact.php`, `README.md`
- Modify: `.gitignore`

**Interfaces — Produces:** estructura de carpetas que usan todas las tareas siguientes.

- [ ] En la raíz del repo: `npm create astro@latest web -- --template minimal --typescript strict --no-install --no-git` y luego `cd web && npm install`
- [ ] Crear Sanity Studio apuntando al proyecto EXISTENTE:
```bash
npm create sanity@latest -- --project 1qxvh1it --dataset production --template clean --typescript --output-path studio --package-manager npm
```
  Si pide login interactivo, exportar antes `SANITY_AUTH_TOKEN` desde el `.env` raíz. Copiar a `web/.env`: `PUBLIC_SANITY_PROJECT_ID=1qxvh1it` y `PUBLIC_SANITY_DATASET=production`.
- [ ] Añadir a `.gitignore`: `web/.env`, `.astro/`, `studio/dist/`
- [ ] `api/contact.php` — crear con este contenido exacto:
```php
<?php
// Endpoint de contacto — alvaroartiel.com
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$honeypot = trim($_POST['website'] ?? ''); // campo oculto anti-bots
$lang = ($_POST['lang'] ?? 'es') === 'en' ? 'en' : 'es';
if ($honeypot !== '') { header('Location: /gracias'); exit; } // bot: fingir éxito
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422); echo json_encode(['error' => 'invalid']); exit;
}
$to = 'soy@alvaroartiel.com';
$subject = '[alvaroartiel.com] Mensaje de ' . mb_substr($name, 0, 80);
$body = "Nombre: $name\nEmail: $email\n\n" . mb_substr($message, 0, 5000);
$headers = "From: web@alvaroartiel.com\r\nReply-To: $email\r\n";
mail($to, $subject, $body, $headers);
header('Location: ' . ($lang === 'en' ? '/en/thanks' : '/gracias'));
exit;
```
- [ ] `README.md` breve: qué es, estructura, comandos (`npm run dev` en web/ y studio/), enlace al spec.
- [ ] Verificar: `cd web && npm run build` → build verde del template vacío.
- [ ] Commit: `chore: scaffold monorepo (astro web + sanity studio + api php)`

### Task 0.3: Schemas de Sanity [MECÁNICA]

**Files:**
- Create: `studio/schemaTypes/objects/locale.ts`, `studio/schemaTypes/siteSettings.ts`, `studio/schemaTypes/experience.ts`, `studio/schemaTypes/education.ts`, `studio/schemaTypes/project.ts`, `studio/schemaTypes/personalChapter.ts`, `studio/schemaTypes/personalItem.ts`, `studio/schemaTypes/blogPost.ts`
- Modify: `studio/schemaTypes/index.ts`, `studio/sanity.config.ts` (structure con singleton de siteSettings, títulos en español)

**Interfaces — Produces:** tipos de documento `siteSettings, experience, education, project, personalChapter, personalItem, blogPost` con los campos del spec §7; objetos `localeString`, `localeText`, `localeBlock` (`{es, en}`).

- [ ] `objects/locale.ts`:
```ts
import {defineType} from 'sanity'
const mk = (name: string, type: 'string' | 'text' | 'array') =>
  defineType({
    name, type: 'object', title: name,
    fields: [
      {name: 'es', title 'Español', type: type === 'array' ? 'array' : type, ...(type === 'array' ? {of: [{type: 'block'}, {type: 'image'}]} : {}), validation: (R: any) => R.required()},
      {name: 'en', title: 'English', type: type === 'array' ? 'array' : type, ...(type === 'array' ? {of: [{type: 'block'}, {type: 'image'}]} : {})},
    ],
  })
export const localeString = mk('localeString', 'string')
export const localeText = mk('localeText', 'text')
export const localeBlock = mk('localeBlock', 'array')
```
  *(Corregir la errata `title 'Español'` → `title: 'Español'`; el cuerpo de project usa bloques extendidos, ver abajo.)*
- [ ] `project.ts` — campos: `title` (localeString), `slug` (de title.es), `category` (string list: propio/cliente/formacion/personal), `featured` (boolean), `year` (string), `role` (localeString), `stack` (array string), `summary` (localeText), `heroMedia` (array de image, `validation: R => R.required().min(2).max(3)`, hotspot true), `cover` (image, para el deck), `body` (localeBlock cuyo `of` incluye: `block`, `image` con campo `layout` [full|double|grid], objeto `youtube` {url}), `externalUrl` (url), `nextProject` (reference a project), `visible` (boolean, default true), `order` (number).
- [ ] `experience.ts` — `company, role` (localeString), `type` (list: fulltime/freelance/founder), `startDate, endDate` (string "MM/YYYY", endDate opcional = Actualidad), `location, modality` (localeString), `summary` (localeText), `bullets` (array localeString), `logo` (image), `relatedProjects` (array reference project), `order`, `visible`.
- [ ] `education.ts` — `school, degree` (localeString), `startDate, endDate`, `award` (localeString, opcional), `description` (localeText), `order`, `visible`.
- [ ] `personalChapter.ts` — `title` (localeString), `emoji` (string), `description` (localeText), `order`. `personalItem.ts` — `kind` (list: photo/video), `chapter` (reference), `image` (image, hotspot), `youtubeUrl` (url), `caption` (localeString, la anotación manuscrita), `date` (string aproximado), `visible`.
- [ ] `blogPost.ts` — `title` (localeString), `slug`, `date` (date), `tags` (array string), `excerpt` (localeText), `body` (localeBlock), `cover` (image), `published` (boolean).
- [ ] `siteSettings.ts` (singleton) — `heroTitle, heroSubtitle` (localeString), `about` (localeText), `email` (string), `socials` (array {label, url, visible}), `cvPdf` (file, opcional), `seoTitle, seoDescription` (localeString).
- [ ] Registrar todo en `index.ts`; en `sanity.config.ts` configurar structure: singleton "Ajustes del sitio" + listas ordenadas por `order` con títulos en español (Experiencia, Formación, Proyectos, Personal — capítulos, Personal — recuerdos, Blog).
- [ ] Verificar: `cd studio && npm run build` → verde.
- [ ] Commit: `feat(studio): schemas completos con i18n es/en`

### Task 0.4: Seed de contenido [MECÁNICA]

**Files:**
- Create: `studio/seed/seed.mjs`, `studio/seed/content.mjs`

**Interfaces — Consumes:** schemas de Task 0.3. **Produces:** dataset `production` poblado.

- [ ] `content.mjs`: exportar arrays JS con el contenido del spec §9. Redactar los textos ES **condensando el material de LinkedIn que está en el spec §9 y en el historial** (tono spec §3.3); traducir EN en el mismo paso:
  - 7 `experience` (TenTuPlaza, Ceustack, Consultor independiente, Esperando el Render, AuraProds 11/2024–01/2026, iUrban 09/2023–10/2024, 8 Pecados 11/2018–12/2019; los que no tienen fecha de inicio conocida → `startDate: '2024'` aproximado y nota `[REVISAR FECHA]` en un bullet NO — usar campo tal cual sin nota, el usuario lo fija en Studio).
  - 6 `education` (UMA 2015-19; Máster Gauss 2022-23 con award "Premio Proyecto del Año Web Gauss"; Especialista UX/UI Gauss 2023-24; ESIC SEO&SEM 2020; freeCodeCamp 2024-25; DevTalles 2025-act.).
  - 4 `personalChapter` (🍳 Cocina, 🎭 Teatro, 🎸 Guitarra, 📷 Fotografía — este con description que enlaza fotografia.alvaroartiel.com) + 2 `personalItem` placeholder por capítulo.
  - 10 `project`: featured = Ranquea, UltraCarta, Plataforma TenTuPlaza ("en construcción" en summary), Vaultz; resto = Watcheers, BeNext, Campus AuraProds, CRM iUrban, Web de fotografía (externalUrl fotografia.alvaroartiel.com), ControlFacturación. `heroMedia`: 2 imágenes generadas (ver paso siguiente). `body`: 3-5 párrafos reales por proyecto derivados del material del spec.
  - 1 `blogPost` ("Por qué esta web es como es" — 4 párrafos sobre las decisiones del spec, meta 😉).
  - 1 `siteSettings` (heroTitle es: "Diseño productos digitales de punta a punta"; email soy@alvaroartiel.com; socials placeholder: LinkedIn/GitHub con url "#").
- [ ] Generar placeholders de imagen: script que crea PNGs 1600×1000 con arte generativo simple (canvas de node o SVG→sharp): fondo `#16161A`, formas geométricas con el acento del proyecto y el título en Clash/system font. 2 por proyecto + 1 cover + 8 personal. Guardar en `studio/seed/img/`.
- [ ] `seed.mjs`: usa `@sanity/client` con el token Editor del `.env` raíz (ya creado y verificado) — sube imágenes como assets y crea documentos con `createOrReplace` e `_id` deterministas (`experience-tentuplaza`, etc., para idempotencia).
- [ ] Ejecutar `node studio/seed/seed.mjs` → verificar con GROQ: `npx sanity documents query "count(*[_type=='project'])"` → 10.
- [ ] Commit: `feat(studio): seed de contenido inicial es/en`

### Task 0.5: Astro ↔ Sanity + deploy staging [MECÁNICA]

**Files:**
- Create: `web/src/lib/sanity.ts`, `web/src/lib/queries.ts`, `web/src/lib/i18n.ts`, `scripts/deploy.mjs`
- Modify: `web/astro.config.mjs`, `web/package.json`

**Interfaces — Produces:**
- `sanity.ts`: `sanityClient` + `urlFor(image, {w,h})` (builder de imágenes CDN).
- `queries.ts`: `getSiteSettings()`, `getExperiences()`, `getEducation()`, `getProjects()`, `getProject(slug)`, `getChaptersWithItems()`, `getPosts()`, `getPost(slug)` — todas devuelven documentos tipados (definir interfaces TS espejo de los schemas).
- `i18n.ts`: `t(localeField, lang)` con fallback en→es; `type Lang = 'es' | 'en'`; diccionario UI `ui[lang][key]`.

- [ ] Instalar en web/: `npm i @sanity/client @sanity/image-url`
- [ ] Implementar los tres módulos. `t()`: `(f, lang) => f?.[lang] ?? f?.es ?? ''`.
- [ ] Página de prueba temporal `web/src/pages/test.astro` que lista títulos de proyectos → `npm run build` verde con datos reales → borrar página.
- [ ] `scripts/deploy.mjs` NO usa FTP: documenta el flujo MCP. El orquestador despliega así: (1) cargar por ToolSearch `hosting_createWebsiteSubdomainV1` y `hosting_deployStaticWebsite`; (2) crear subdominio `dev` sobre `alvaroartiel.com` si no existe; (3) build `web/` (`npm run build`); (4) copiar `api/contact.php` a `web/dist/api/contact.php`; (5) desplegar `web/dist` al vhost `dev.alvaroartiel.com`. Escribir estos pasos como doc en `scripts/DEPLOY.md` (el .mjs solo hace build+copy: pasos 3-4).
- [ ] Ejecutar el deploy completo → **verificar con chrome-devtools MCP** que `https://dev.alvaroartiel.com` responde (aunque sea el test).
- [ ] Desplegar Studio: `cd studio && npx sanity deploy` con hostname `alvaroartiel` → verificar URL `https://alvaroartiel.sanity.studio`.
- [ ] Crear repo remoto y push: `gh repo create AlvaroArtiel/portfolio-web --private --source . --push`
- [ ] Commit: `feat(web): cliente sanity, i18n y pipeline de deploy a staging`

**CHECKPOINT F0:** staging vivo + studio vivo + seed cargado. Reflexión Fable + `decisions.md` si procede.

---

## FASE 1 — Sistema de diseño y esqueleto

### Task 1.1: Tokens, fuentes y estilos base [MECÁNICA]

**Files:**
- Create: `web/src/styles/tokens.css`, `web/src/styles/global.css`, `web/public/fonts/*.woff2`

- [ ] Descargar fuentes: Clash Display (Variable) de `https://api.fontshare.com/v2/fonts/download/clash-display` (unzip, quedarse con woff2 variable); `npm i @fontsource-variable/instrument-sans @fontsource/jetbrains-mono` o descargar woff2 y self-hostear en `public/fonts/` (preferir self-host directo para las tres: menos JS/CSS de terceros).
- [ ] `tokens.css` con los valores EXACTOS del Global Constraints (§3.1 spec) como custom properties + `[data-section="home|projects|experience|personal|blog|cv"]` que setea `--accent`. Escala tipográfica fluida: `--step-hero: clamp(3.5rem, 10vw, 9rem)` etc.
- [ ] `global.css`: reset moderno, `::selection` con acento, scrollbar fino con acento, focus-visible con acento, `@media (prefers-reduced-motion: reduce)` desactiva transiciones globales.
- [ ] Verificar build + commit: `feat(web): design tokens y tipografías self-hosted`

### Task 1.2: Layout, header, menú overlay y footer [CREATIVA-FABLE]

**Files:**
- Create: `web/src/layouts/Base.astro`, `web/src/components/Header.astro`, `web/src/components/MenuOverlay.astro` (+ isla `MenuOverlay.ts`), `web/src/components/Footer.astro`, `web/src/components/LangSwitch.astro`

**Interfaces — Produces:** `Base.astro` props: `{title, description, lang, section, accent?}`; aplica `data-section`, mete SEO tags, header/footer. Todas las páginas lo consumen.

**Brief:** Header mínimo fijo (monograma "AA" tipográfico placeholder — en F4 llegará el 3D — y botón hamburguesa con microinteracción). Menú overlay pantalla completa: items enormes Clash Display con hover con carácter (desplazamiento/relleno de acento), selector ES/EN que conserva ruta, cierre con Escape y clic. El snake-trail llega en F3 — dejar `<canvas id="menu-trail">` listo. Footer: contacto rápido, redes desde siteSettings, línea "hecho con Astro + Sanity + cariño". Accesible por teclado, `aria-expanded`, focus trap en overlay.

**Criterios de aceptación:**
- [ ] Overlay abre/cierra con animación <400ms, sin CLS, funciona sin JS (fallback: anchor a nav del footer).
- [ ] LangSwitch en `/proyectos` lleva a `/en/projects` (mapa de rutas en `i18n.ts`).
- [ ] Screenshots desktop+móvil revisados contra referencias.
- [ ] Commit: `feat(web): layout base, header, menú overlay y footer`

### Task 1.3: Routing i18n completo [MECÁNICA]

**Files:**
- Create: `web/src/pages/` estructura ES y `web/src/pages/en/` espejo (archivos stub que reexportan componentes de página parametrizados por lang desde `web/src/views/`)
- Create: `web/src/lib/routes.ts` (mapa slug ES↔EN: proyectos/projects, experiencia/experience, personal/personal, blog/blog, cv/cv, contacto/contact, gracias/thanks)

- [ ] Implementar patrón: cada vista real vive en `src/views/<name>.astro` con prop `lang`; las páginas son wrappers de 3 líneas. `hreflang` alternates en Base.astro usando `routes.ts`.
- [ ] Verificar: build genera `/` y `/en/` completos (stubs con h1 por ahora para las 8 rutas).
- [ ] Commit: `feat(web): árbol de rutas bilingüe es/en`

**CHECKPOINT F1:** deploy a staging + screenshots + reflexión.

---

## FASE 2 — Páginas completas (sin motion)

*Objetivo de fase: web publicable, sobria, con TODO el contenido real. Cada página: HTML semántico, responsive, GROQ real, ES/EN.*

### Task 2.1: Home estructural [CREATIVA-FABLE]

**Files:** Create: `web/src/views/home.astro`, `web/src/components/home/*.astro` (Hero, About, FeaturedDeck estático, CtaBand, PersonalTeaser)

**Brief:** Estructura del spec §4.1 sin efectos: hero tipográfico gigante (el titular en Clash, subtítulo keywords en mono), "quién soy" condensado, lista estática de 4 featured (tarjetas grandes apiladas visualmente en CSS, aún sin scroll-trigger), banda CTA "¿Trabajamos juntos?", teaser personal (3-4 polaroids CSS rotadas), footer. Composición tipográfica ya debe ser espectacular en estático.

- [ ] Criterio: screenshot desktop parece premium SIN nada de JS. Móvil impecable.
- [ ] Commit: `feat(web): home estructural con contenido real`

### Task 2.2: Proyectos — lista y ficha [CREATIVA-FABLE]

**Files:** Create: `web/src/views/projects.astro`, `web/src/views/project-detail.astro`, `web/src/components/projects/*` (Card, Filters estáticos, HeroMedia, BodyBlocks, NextProject), rutas dinámicas `web/src/pages/proyectos/[slug].astro` + `en/projects/[slug].astro` (getStaticPaths desde Sanity).

**Brief:** Lista: tarjetas grandes verticales (base visual del futuro deck), filtros como enlaces (`?cat=` estático por ahora, filtrado en build con JS mínimo progresivo). Ficha según spec §4.2: sección superior curada donde las 2-3 `heroMedia` se integran composicionalmente con título/metadatos (layout editorial asimétrico, no galería); cuerpo con render de Portable Text que soporta bloques image full/double/grid y youtube (componente `BodyBlocks` — usar `astro-portabletext`); pie con stack/rol/año, link externo, "siguiente proyecto" full-width.

- [ ] Criterio: ficha de Vaultz y de Ranquea revisadas una a una; funcionan igual de bien con 3 y con 30 medias (probar añadiendo bloques al seed si hace falta).
- [ ] Commit: `feat(web): proyectos lista + ficha con media en dos niveles`

### Task 2.3: Experiencia, CV, Blog [MECÁNICA]

**Files:** Create: `web/src/views/experience.astro`, `web/src/views/cv.astro`, `web/src/styles/print.css`, `web/src/views/blog.astro`, `web/src/views/blog-post.astro`, rutas `[slug]` de blog.

- [ ] Experiencia: timeline vertical semántica (`<ol>`), cada entrada con empresa/rol/fechas/bullets/logo, refs a proyectos como links.
- [ ] CV: una columna sobria (acento neutro), datos + experiencia + formación + aptitudes; `print.css` (A4, sin header/footer/nav, tinta negra sobre blanco); botón "Descargar PDF" → `window.print()`; si `siteSettings.cvPdf` existe → link directo al file.
- [ ] Blog: lista tipográfica (título grande, fecha mono, tags); entrada con medida 68ch.
- [ ] Verificar build + vista print (screenshot con emulación print de chrome-devtools). Commit: `feat(web): experiencia, cv imprimible y blog`

### Task 2.4: Personal (grid estática), Contacto y Gracias [MECÁNICA]

**Files:** Create: `web/src/views/personal.astro`, `web/src/views/contact.astro`, `web/src/views/thanks.astro`, `web/src/components/personal/PolaroidCard.astro`, `web/src/components/Lightbox.ts` (isla)

- [ ] Personal: grid de polaroids con rotaciones CSS aleatorias-deterministas (hash del _id), caption manuscrita (font: Caveat, self-hosted, SOLO aquí), filtros por capítulo, lightbox accesible (dialog nativo) con navegación; vídeos → facade con thumbnail YouTube + play que carga iframe.
- [ ] Contacto: form (name, email, message, honeypot `website` oculto, hidden `lang`) → POST `/api/contact.php`; validación nativa + mensajes.
- [ ] Gracias: página simple con acento lima y CTA de volver.
- [ ] Commit: `feat(web): personal, contacto y gracias`

**CHECKPOINT F2 (mayor):** deploy completo a staging. Fable navega TODA la web con chrome-devtools (8 rutas × 2 idiomas, screenshots), verifica contenido real, responsive, print. Reflexión + `decisions.md`. **A partir de aquí la web siempre es publicable.**

---

## FASE 3 — Capa de movimiento

### Task 3.1: Infraestructura motion [MECÁNICA]

**Files:** Create: `web/src/lib/motion.ts` (isla global)

- [ ] `npm i gsap lenis` en web/. `motion.ts`: init Lenis + GSAP ScrollTrigger sincronizados; **si `prefers-reduced-motion` → no inicializar nada**; exportar helper `onReady(cb)` y `reveal(selector, opts)` (fade+rise estándar del sitio).
- [ ] Aplicar `reveal` a secciones de todas las páginas (data-attribute `data-reveal`).
- [ ] Commit: `feat(web): lenis + gsap con respeto a reduced-motion`

### Task 3.2: Deck apilado + rebarajado de filtros [CREATIVA-FABLE]

**Files:** Modify: componentes de projects y home. Create: `web/src/components/projects/Deck.ts`

**Brief:** El patrón elegido (pxpush): tarjetas se apilan con pin/ScrollTrigger, la entrante cubre a la anterior con leve escala/parallax. En home (4 featured) y /proyectos (todas). Filtros: al cambiar categoría las cartas excluidas vuelan fuera (stagger, física fingida con GSAP) y las visibles se reapilan. Móvil: scroll nativo con snap suave, sin pin agresivo. Reduced-motion: apilado simple sin parallax, filtro con corte.

- [ ] Criterios: 60fps en scroll (medir con performance trace de chrome-devtools); sin saltos de layout; deep-link `?cat=` sigue funcionando.
- [ ] Commit: `feat(web): deck apilado con rebarajado físico de filtros`

### Task 3.3: Timeline dibujada + menú snake-trail + transiciones de acento [CREATIVA-FABLE]

**Files:** Modify: experience view, MenuOverlay. Create: `web/src/components/SnakeTrail.ts`

**Brief:** (1) Experiencia: línea SVG que se dibuja con el scroll (`stroke-dashoffset` + ScrollTrigger scrub), entradas que despliegan al entrar. (2) Menú overlay: snake-trail del cursor en el canvas — segmentos que siguen al ratón con retardo tipo serpiente, color = acento de la sección actual; muere al cerrar el menú. Móvil: no existe. (3) Transiciones de acento entre páginas: View Transitions API de Astro con crossfade del `--accent` (fallback: cambio directo).
- [ ] Criterios: trail fluido sin acumulación de memoria (probar 60s con heap snapshot); hover de items sigue funcionando encima.
- [ ] Commit: `feat(web): timeline viva, snake-trail y transiciones de acento`

**CHECKPOINT F3:** deploy + trace de rendimiento (Lighthouse ≥90) + reflexión.

---

## FASE 4 — Capa WebGL

### Task 4.1: Infra Three.js [MECÁNICA]

**Files:** Create: `web/src/lib/three-island.ts` (loader compartido: crea renderer, resize, visibility pause, detección de capacidades → expone `mountScene(el, sceneModule)`)

- [ ] `npm i three`. Detección: sin WebGL2 o `deviceMemory < 4` o reduced-motion → no montar, dejar fallback estático (las escenas definen su fallback como imagen/HTML ya presente debajo).
- [ ] Commit: `feat(web): infraestructura de islas three.js con degradación`

### Task 4.2: Hero de partículas [CREATIVA-FABLE]

**Files:** Create: `web/src/scenes/hero-particles.ts`. Modify: Hero component.

**Brief (efecto insignia):** Miles de puntos (InstancedMesh/Points + shader) forman el titular del hero (sample de un canvas 2D con el texto en Clash Display); huyen del cursor (campo de repulsión suavizado) y se reagrupan con inercia. Color: blanco roto con chispas lima. Móvil: ~40% de partículas, repulsión por touch/scroll. Fallback/reduced-motion: el titular HTML estático (que SIEMPRE está debajo para SEO/a11y — las partículas lo cubren visualmente).
- [ ] Criterios: 60fps desktop medio / 30fps móvil (trace); TTI de home no empeora >300ms (isla `client:visible` + chunk lazy); el texto real sigue seleccionable tras pulsar "saltar efecto" (botón discreto accesible).
- [ ] Commit: `feat(web): hero de partículas`

### Task 4.3: Monograma 3D → header + CTA líquido + lonas k95 [CREATIVA-FABLE]

**Files:** Create: `web/src/scenes/monogram.ts`, `web/src/scenes/liquid-text.ts`, `web/src/scenes/curtain-media.ts`. Modify: Header, CtaBand, HeroMedia de ficha.

**Brief:** (1) Monograma "AA": geometría extruida generada de la tipografía (TextGeometry con fuente convertida o SVG extrude), rota siguiendo suavemente al cursor en el hero; con ScrollTrigger se interpola (posición/escala) hasta acoplarse al hueco del header y queda como logo persistente (momento pxpush). Diseñar el monograma es parte de la tarea: simple, geométrico, reconocible en 24px. (2) CTA líquido: plano con shader de distorsión (noise + uv displacement) sobre textura del texto "¿Trabajamos juntos?" reactivo al cursor (efecto noth.in); móvil reacciona a scroll. (3) Lonas k95: las heroMedia de la ficha de proyecto como planos con curvatura vertical (vertex shader) proporcional a la velocidad de scroll.
- [ ] Fallbacks respectivos: monograma estático SVG en header; CTA texto plano con hover CSS; imágenes normales.
- [ ] Criterios: cada efecto en su chunk; ficha de proyecto Lighthouse ≥90; screenshots comparados contra referencias.
- [ ] Commit: `feat(web): monograma 3d, cta líquido y lonas de media`

**CHECKPOINT F4 (mayor):** deploy + reflexión profunda de Fable: ¿la home transmite el nivel de las referencias? Ajustes finos documentados.

---

## FASE 5 — Mesa revuelta

### Task 5.1: Física de polaroids [CREATIVA-FABLE]

**Files:** Create: `web/src/components/personal/MessyTable.ts` (isla Matter.js). Modify: personal view.

**Brief:** Desktop: las polaroids de la grid F2 se convierten en cuerpos Matter.js dentro del viewport de la sección: caen/se asientan al cargar con rotaciones naturales, se pueden agarrar y lanzar (mouse constraint), colisionan entre sí, límites = bordes de la mesa. Clic (sin arrastre) → lightbox existente. Filtros de capítulo: los items del capítulo "despiertan" (impulso) y el resto se atenúa. Móvil: NO física — flujo vertical con rotaciones + parallax sutil por giroscopio (DeviceOrientation, pedir permiso solo tras gesto en iOS; sin permiso → estático). Reduced-motion: grid F2 tal cual.
- [ ] Criterios: 30+ items sin caer de 50fps (si no, dormir cuerpos fuera de viewport); sin scroll-jacking (la física vive DENTRO de la sección); heap estable.
- [ ] Commit: `feat(web): mesa revuelta con física`

**CHECKPOINT F5:** deploy + reflexión.

---

## FASE 6 — Easter eggs

### Task 6.1: Post-footer secreto [CREATIVA-FABLE]

**Files:** Create: `web/src/components/PostFooter.astro` + escena. Modify: Footer/Base.

**Brief:** Scroll a conciencia tras el footer (overscroll intencional ~150vh extra en home) revela sección oculta: pieza 3D simple (reutilizar estética del monograma) + texto "Has llegado demasiado lejos… ¿pasas?" → puerta de entrada a la casa (`/casa`, noindex). Vibra ryanritzenthaler.
- [ ] Commit: `feat(web): secreto post-footer`

### Task 6.2: La casa jugable [CREATIVA-FABLE]

**Files:** Create: `web/src/pages/casa.astro` (+ `en/house.astro`), `web/src/scenes/house/*` (scene, character, controls, interactables)

**Brief (alcance mínimo del spec §6.2 — NO ampliar):** Una habitación low-poly (suelo, paredes, 5 muebles primitivos con materiales flat del sistema de color); personaje cápsula low-poly con **billboard de foto de Álvaro como cabeza** (si existe `assets-entrada/retrato.*` usarla; si no, placeholder monograma y anotarlo en NIGHT-REPORT); WASD/flechas + joystick táctil virtual; cámara tercera persona con lerp; 5 interactuables con prompt al acercarse (escritorio→/proyectos, estantería→/experiencia, diploma→/cv, guitarra→/personal, ordenador→/blog, puerta→/contacto — elegir 5 de estos 6); modal in-game con resumen + link real. Colisiones simples AABB (sin motor de física). Chunk 100% lazy, jamás carga fuera de /casa. `noindex`.
- [ ] Criterios: cargable <3s en 4G rápido; funciona con teclado y táctil; salir devuelve a la home.
- [ ] Commit: `feat(web): casa jugable easter egg`

**CHECKPOINT F6:** deploy + jugar la casa con chrome-devtools (teclado emulado) + reflexión.

---

## FASE 7 — Pulido y cierre

### Task 7.1: SEO/OG + JSON-LD [MECÁNICA]

- [ ] Sitemap (`@astrojs/sitemap`), robots.txt, canonical + hreflang ya en Base (verificar), JSON-LD Person en home y CreativeWork en fichas; OG images: plantilla generativa (mismo script del seed) por página con título.
- [ ] Commit: `feat(web): seo, og images y datos estructurados`

### Task 7.2: Auditoría de accesibilidad y degradaciones [MECÁNICA]

- [ ] Recorrer §5 del spec como checklist: emular reduced-motion en chrome-devtools y verificar CADA efecto degrada según tabla; navegación completa por teclado; contraste AA de acentos sobre `#0C0C0E` (lima/azul/teal OK, verificar violeta/naranja en texto pequeño → si fallan, usarlos solo en display/decorativo y aclarar tono para texto).
- [ ] Lighthouse las 8 rutas: Performance ≥90, A11y ≥95. Arreglar lo que falle.
- [ ] Commit: `fix(web): auditoría a11y + reduced-motion completa`

### Task 7.3: Pasada final EN + QA cross-device [MECÁNICA]

- [ ] Revisar todo el contenido EN en Sanity (coherencia, no literal), UI dictionaries, rutas.
- [ ] chrome-devtools: emular iPhone/Android/tablet, screenshots de las 8 rutas × 2 idiomas → guardar en `docs/superpowers/qa/` (gitignored NO — commitear, son evidencia).
- [ ] Commit: `chore: qa final`

### Task 7.4: Cierre nocturno [CREATIVA-FABLE]

- [ ] Deploy final a `dev.alvaroartiel.com`. **NO tocar el dominio raíz** — el paso a producción lo decide el usuario al validar.
- [ ] Escribir `docs/superpowers/NIGHT-REPORT.md`: resumen ejecutivo, URL staging + studio, fases completadas, decisiones variadas (link a decisions.md), pendientes/riesgos, checklist para el usuario (validar staging → orden de paso a producción; fijar fechas [20XX] en Studio; subir imágenes reales; webhook Sanity→rebuild si quiere auto-deploy al editar).
- [ ] Push final a GitHub.

---

## Self-review del plan (hecho)

- Cobertura spec: §2 stack→F0, §3 sistema→F1, §4 páginas→F2, §5 efectos→F3-F5 con tabla de degradación en Task 7.2, §6 eggs→F6, §7 schemas→T0.3, §8 i18n→T1.3+T7.3, §9 seed→T0.4, §10→T7.1-7.2, §11.1 protocolo→cabecera.
- Sin TBDs; las tareas creativas llevan brief cerrado + criterios verificables (formato intencional para el enrutado Fable/Sonnet definido por el usuario).
- Consistencia de interfaces: `t()`, `Base.astro` props, `routes.ts`, `mountScene()` usados coherentemente.
