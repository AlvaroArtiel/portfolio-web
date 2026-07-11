# Mejoras post-auditoría — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolver todos los hallazgos de la auditoría post-elevación (`docs/superpowers/audit-2026-07-11-post-elevacion.md`): 404 propia, preparación de producción, robustez del deploy/formulario, contenido editable desde Sanity y mejoras finas de a11y/UX por sección.

**Architecture:** Cambios pequeños e independientes sobre el código existente (Astro 7 MPA + Sanity + PHP). Ninguna feature nueva de peso: cada task es un fix o mejora autocontenida con su verificación. Orden = retorno/urgencia (404 → producción → robustez → Sanity → finos).

**Tech Stack:** Astro 7, Sanity 6 (free tier), PHP (`api/contact.php`), deploy Hostinger vía `scripts/deploy.mjs` + `Compress-Archive`.

## Global Constraints

- Deploy SOLO a `dev.alvaroartiel.com`. Prohibido tocar el dominio raíz y los demás sites. (La Task 2 PREPARA producción; no la activa.)
- Sanity solo free tier. Zip con `Compress-Archive`; SIEMPRE `node scripts/deploy.mjs` antes de zipear.
- Paleta y movimiento: solo tokens (`tokens.css`, `web/src/lib/motion-tokens.ts`).
- Bilingüe SIEMPRE (ES + EN adaptado); voz spec original §3.3 en microcopy nuevo.
- Todo respeta `prefers-reduced-motion`; Lighthouse Performance ≥90 al cierre.
- Verificación por task: build verde + comprobación en navegador (local o staging); commits frecuentes; variaciones → `docs/superpowers/decisions.md`.

**Fuera de este plan (a propósito):** G3 (sustituir el arte placeholder) es tarea de contenido del usuario desde el Studio, no de código. El agarre de polaroids de /personal ya se corrigió en la pasada de auditoría (commit en main). Las ideas de la casa (sombras dinámicas, sonido) quedan fuera del presupuesto v1.

---

### Task 1: Página 404 propia

**Resuelve:** G1 (una URL inexistente sirve el 404 genérico de Hostinger).

**Files:**
- Create: `web/src/pages/404.astro`

**Interfaces:**
- Consumes: `Base.astro` (layout, prop `noindex`), `pathFor` de `web/src/lib/routes.ts`.
- Produces: `web/dist/404.html` — Hostinger (Apache/LiteSpeed) lo sirve automáticamente para rutas inexistentes.

Hostinger sirve un único `404.html` para todo el site, así que la página es una sola con ambos idiomas (ES dominante, línea EN debajo) — no puede saber el idioma de la URL fallida en estático puro; un mini-script opcional detecta `/en/` en `location.pathname` y reordena.

- [ ] **Step 1: Crear `web/src/pages/404.astro`**

```astro
---
import Base from '../layouts/Base.astro'
---

<Base
  title="404 — Álvaro Artiel"
  description="Esta página no existe."
  lang="es"
  section="home"
  noindex
>
  <section class="nf-page">
    <p class="nf-code" aria-hidden="true">404</p>
    <h1 data-nf-es>Esta página no existe. De momento.</h1>
    <h1 data-nf-en hidden>This page doesn’t exist. Yet.</h1>
    <nav class="nf-cta">
      <a data-nf-es href="/">← Volver al inicio</a>
      <a data-nf-es href="/proyectos/">Ver proyectos</a>
      <a data-nf-en hidden href="/en/">← Back home</a>
      <a data-nf-en hidden href="/en/projects/">See the projects</a>
    </nav>
  </section>
</Base>

<script>
  // Un único 404.html para todo el site: si la URL rota era /en/*, habla inglés.
  if (location.pathname.startsWith('/en/')) {
    document.querySelectorAll<HTMLElement>('[data-nf-es]').forEach((el) => (el.hidden = true))
    document.querySelectorAll<HTMLElement>('[data-nf-en]').forEach((el) => (el.hidden = false))
  }
</script>

<style>
  .nf-page {
    min-height: 70vh;
    display: grid;
    place-content: center;
    justify-items: start;
    gap: 1rem;
    padding: clamp(1.5rem, 6vw, 4rem);
  }
  .nf-code {
    font-family: var(--font-display);
    font-weight: 620;
    font-size: clamp(6rem, 18vw, 12rem);
    line-height: 1;
    letter-spacing: -0.03em;
    color: color-mix(in srgb, var(--accent) 26%, transparent);
    margin: 0;
  }
  .nf-page h1 {
    font-family: var(--font-display);
    font-weight: 580;
    font-size: var(--step-h2, clamp(1.6rem, 3.4vw, 2.6rem));
    letter-spacing: -0.02em;
    margin: 0;
  }
  .nf-cta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 1rem;
  }
  .nf-cta a {
    font-family: var(--font-mono);
    font-size: var(--step-small);
    color: var(--text);
    text-decoration: none;
    border-bottom: 1px solid var(--accent);
    padding-bottom: 0.2em;
    transition: color var(--dur-micro) var(--ease-out-token);
  }
  .nf-cta a:hover {
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Build y verificar el artefacto** — `cd web && npm run build`; comprobar que existe `web/dist/404.html` y contiene «Esta página no existe».
- [ ] **Step 3: Deploy a staging** (`node scripts/deploy.mjs` → zip → `hosting_deployStaticWebsite`) y verificar en navegador: `https://dev.alvaroartiel.com/no-existe/` responde 404 CON la página de marca; `https://dev.alvaroartiel.com/en/nope/` muestra la variante EN.
- [ ] **Step 4: Commit** — `feat(404): página propia con voz (ES/EN por pathname)`.

---

### Task 2: Preparar el `site` de producción (sin activarlo)

**Resuelve:** G2 (canonical/hreflang/OG/sitemap heredan dev.alvaroartiel.com).

**Files:**
- Modify: `web/astro.config.mjs:9`
- Modify: `scripts/DEPLOY.md` (sección nueva "Salida a producción")

**Interfaces:**
- Produces: `SITE_URL` gobernado por la env `PUBLIC_SITE_URL`; sin env ⇒ staging (comportamiento actual intacto).

- [ ] **Step 1: Parametrizar `SITE_URL`** en `web/astro.config.mjs`:

```js
/**
 * Canonical URL. Por defecto staging; el build de producción se hace con
 * PUBLIC_SITE_URL=https://alvaroartiel.com (ver scripts/DEPLOY.md).
 */
export const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://dev.alvaroartiel.com';
```

- [ ] **Step 2: Documentar en `scripts/DEPLOY.md`** (añadir al final):

```markdown
## Salida a producción (cuando el usuario lo apruebe)

1. Build con la URL canónica real:
   `PUBLIC_SITE_URL=https://alvaroartiel.com node scripts/deploy.mjs`
   (en PowerShell: `$env:PUBLIC_SITE_URL='https://alvaroartiel.com'; node scripts/deploy.mjs`)
2. Verificar en `web/dist/index.html` que canonical/hreflang/OG apuntan a alvaroartiel.com.
3. Deploy al vhost de producción SOLO con aprobación explícita del usuario.
```

- [ ] **Step 3: Verificar que nada cambia sin la env** — `cd web && npm run build` y grep de `dev.alvaroartiel.com` en `dist/index.html` (debe seguir). Después `PUBLIC_SITE_URL=https://alvaroartiel.com npm run build` y grep de `https://alvaroartiel.com` en canonical (debe aparecer). **Re-ejecutar el build SIN la env al terminar** para dejar `dist/` en estado staging.
- [ ] **Step 4: Commit** — `chore(config): SITE_URL parametrizado por PUBLIC_SITE_URL + guía de salida a producción`.

---

### Task 3: `contact.php` copiado por el build (fin de la trampa del deploy)

**Resuelve:** G4 (`npm run build` a secas pierde `api/contact.php`).

**Files:**
- Modify: `web/astro.config.mjs` (integración inline con hook `astro:build:done`)

**Interfaces:**
- Produces: todo build de Astro deja `web/dist/api/contact.php`; `scripts/deploy.mjs` puede seguir copiándolo (idempotente).

- [ ] **Step 1: Añadir la integración** en `web/astro.config.mjs`:

```js
import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** El endpoint PHP debe viajar en TODO build (antes solo lo copiaba deploy.mjs). */
const copyContactPhp = {
  name: 'copy-contact-php',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const outDir = fileURLToPath(dir);
      const apiDir = new URL('api/', dir);
      await mkdir(fileURLToPath(apiDir), { recursive: true });
      await copyFile(
        new URL('../api/contact.php', import.meta.url),
        fileURLToPath(new URL('contact.php', apiDir)),
      );
      console.log(`[copy-contact-php] api/contact.php → ${outDir}api/`);
    },
  },
};
```

y registrarla: `integrations: [sitemap({...}), copyContactPhp]`.

- [ ] **Step 2: Verificar** — `cd web && npm run build`; `ls web/dist/api/contact.php` existe SIN ejecutar deploy.mjs.
- [ ] **Step 3: Actualizar la nota** de `docs/superpowers/decisions.md` (la regla "siempre deploy.mjs" deja de ser crítica; deploy.mjs sigue siendo el camino recomendado) — entrada nueva, no editar la histórica.
- [ ] **Step 4: Commit** — `fix(build): api/contact.php se copia en astro:build:done — adiós a la trampa del zip`.

---

### Task 4: El "topic" del mad-lib llega también sin JS

**Resuelve:** G5 (sin JS el select `topic` se envía pero el PHP lo ignora).

**Files:**
- Modify: `api/contact.php:8-17`

**Interfaces:**
- Consumes: el form envía `topic` con valores `producto|web|idea|otra` SOLO cuando JS no corrió (con JS, el cliente concatena la etiqueta al mensaje y deshabilita el select — comportamiento actual que NO se toca).

- [ ] **Step 1: Prepend server-side en `api/contact.php`** — tras leer `$message` y `$lang` (y antes de la validación), añadir:

```php
$topics = [
  'es' => ['producto' => 'un producto', 'web' => 'una web', 'idea' => 'una idea', 'otra' => 'otra cosa'],
  'en' => ['producto' => 'a product', 'web' => 'a website', 'idea' => 'an idea', 'otra' => 'something else'],
];
$topic = trim($_POST['topic'] ?? '');
if ($topic !== '' && isset($topics[$lang][$topic])) {
  $pre = $lang === 'en' ? 'In the works: ' : 'Tengo entre manos: ';
  $message = '[' . $pre . $topics[$lang][$topic] . '] ' . $message;
}
```

Nota: `$lang` se calcula en la línea 10 actual; mover este bloque DESPUÉS de esa línea.

- [ ] **Step 2: Verificar en staging** (el PHP solo corre en Hostinger): deploy y, desde la consola del navegador en dev.alvaroartiel.com, `fetch('/api/contact.php', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:'lang=es&topic=idea&name=QA&email=qa%40test.com&message=Prueba+topic+sin+JS+123456&website=', redirect:'manual'})` → `type: 'opaqueredirect'` (302). El mail recibido debe abrir con `[Tengo entre manos: una idea]` (verificación del usuario; anotar en el report).
- [ ] **Step 3: Confirmar que el camino CON JS no duplica** — en /contacto (staging) rellenar y enviar con el select en «una idea»: el mensaje lleva UNA sola etiqueta (el JS deshabilita `topic`, así que el PHP no ve el campo).
- [ ] **Step 4: Commit** — `fix(contact): el topic del mad-lib llega también sin JS (prepend server-side)`.

---

### Task 5: Aptitudes e idiomas del CV editables desde Sanity

**Resuelve:** hallazgo CV (listas hardcodeadas en `cv.astro`).

**Files:**
- Modify: `studio/schemaTypes/siteSettings.ts` (campos nuevos)
- Modify: `studio/seed/content.mjs` (seed de los valores actuales) y re-seed
- Modify: `web/src/lib/queries.ts:39-52` (tipos `SiteSettings`)
- Modify: `web/src/views/cv.astro:24-31`

**Interfaces:**
- Produces en Sanity: `siteSettings.cvSkillGroups: {label: localeString, items: string[]}[]` y `siteSettings.cvLanguages: localeString`.
- `cv.astro` consume con fallback a los valores actuales (si el campo está vacío en Sanity, nada cambia).

- [ ] **Step 1: Schema** — en `studio/schemaTypes/siteSettings.ts`, añadir tras `cvPdf`:

```ts
defineField({
  name: 'cvSkillGroups',
  title: 'CV — aptitudes agrupadas',
  type: 'array',
  of: [
    {
      type: 'object',
      name: 'skillGroup',
      fields: [
        {name: 'label', title: 'Grupo', type: 'localeString'},
        {name: 'items', title: 'Aptitudes', type: 'array', of: [{type: 'string'}]},
      ],
    },
  ],
}),
defineField({name: 'cvLanguages', title: 'CV — idiomas', type: 'localeString'}),
```

- [ ] **Step 2: Seed** — en `studio/seed/content.mjs`, dentro de `SITE_SETTINGS`, añadir:

```js
cvSkillGroups: [
  {_type: 'skillGroup', _key: 'design', label: {es: 'Diseño', en: 'Design'}, items: ['Figma', 'UX/UI']},
  {_type: 'skillGroup', _key: 'dev', label: {es: 'Desarrollo', en: 'Development'}, items: ['React', 'Astro', 'Node.js', 'TypeScript', 'Sanity']},
  {_type: 'skillGroup', _key: 'marketing', label: {es: 'Marketing', en: 'Marketing'}, items: ['SEO']},
],
cvLanguages: {es: 'Español · Inglés', en: 'Spanish · English'},
```

y re-seedear: `cd studio/seed && node seed.mjs` (exit 0).

- [ ] **Step 3: Tipos** — en `web/src/lib/queries.ts`, dentro de `SiteSettings`:

```ts
cvSkillGroups?: {label?: LocaleField; items?: string[]; _key?: string}[]
cvLanguages?: LocaleField
```

- [ ] **Step 4: Consumo con fallback** — en `web/src/views/cv.astro` sustituir el bloque `skillGroups` actual por:

```ts
const fallbackGroups = [
  {label: dict.cv_skill_design, items: ['Figma', 'UX/UI']},
  {label: dict.cv_skill_dev, items: ['React', 'Astro', 'Node.js', 'TypeScript', 'Sanity']},
  {label: dict.cv_skill_marketing, items: ['SEO']},
]
const skillGroups =
  settings?.cvSkillGroups?.length
    ? settings.cvSkillGroups.map((g) => ({label: t(g.label, lang), items: g.items ?? []}))
    : fallbackGroups
const languagesLine = t(settings?.cvLanguages, lang) || dict.cv_languages_value
```

y usar `languagesLine` donde hoy va `dict.cv_languages_value`.

- [ ] **Step 5: Verificar** — build verde; /cv y /en/cv en local muestran los mismos grupos que antes (vienen de Sanity ahora); Studio (`alvaroartiel.sanity.studio`) muestra los campos nuevos editables.
- [ ] **Step 6: Commit** — `feat(cv): aptitudes e idiomas editables desde Sanity (con fallback)`.

---

### Task 6: OG por entrada de blog (cover como imagen social)

**Files:**
- Modify: `web/src/views/blog-post.astro` (prop `ogImage` a Base)

**Interfaces:**
- Consumes: `Base.astro` ya acepta `ogImage?: string` (override); `urlFor` de `../lib/sanity`.

- [ ] **Step 1:** en el frontmatter de `blog-post.astro` añadir:

```ts
const ogImage = post.cover ? urlFor(post.cover, {w: 1200, h: 630}).url() : undefined
```

y en el componente: `<Base ... ogImage={ogImage}>`.

- [ ] **Step 2: Verificar** — build; en `dist/blog/por-que-esta-web-es-como-es/index.html`, `og:image` apunta al CDN de Sanity si el post tiene cover (si no, sigue el OG de sección — fallback intacto).
- [ ] **Step 3: Commit** — `feat(blog): og:image por entrada usando su cover`.

---

### Task 7: Anuncio `aria-live` del recuento al filtrar proyectos

**Files:**
- Modify: `web/src/components/projects/Filters.astro`

**Interfaces:**
- Consumes: el script existente del componente que filtra `[data-category]` (cartas) — ver `Filters.astro:34-49`.

- [ ] **Step 1: Región viva** — añadir tras el `<nav>` del componente:

```astro
<p class="sr-only" data-filter-status aria-live="polite"></p>
```

(si el componente no tiene clase `.sr-only` propia, incluirla en su `<style>`: mismo bloque clip-rect que usa `contact.astro`).

- [ ] **Step 2: Anunciar al filtrar** — dentro del handler de click existente que aplica el filtro, tras actualizar las cartas:

```ts
const visible = document.querySelectorAll('[data-category]:not([hidden])').length
const status = document.querySelector<HTMLElement>('[data-filter-status]')
const isEn = document.documentElement.lang === 'en'
if (status) status.textContent = isEn ? `${visible} projects shown` : `${visible} proyectos mostrados`
```

**Atención:** comprobar en el código real cómo se ocultan las cartas excluidas (si es clase en vez de `hidden`, ajustar el selector al mecanismo real).

- [ ] **Step 3: Verificar** — en /proyectos, filtrar y comprobar en el inspector que `[data-filter-status]` cambia de texto; sin filtro activo, texto vacío o recuento total.
- [ ] **Step 4: Commit** — `feat(a11y): recuento aria-live al filtrar proyectos`.

---

### Task 8: Prefetch del «siguiente proyecto» al hover

**Files:**
- Modify: `web/src/components/projects/NextProject.astro`

- [ ] **Step 1:** añadir al final del componente:

```astro
<script>
  // Precarga el HTML del siguiente proyecto al pasar el ratón: la navegación
  // se siente instantánea. Un <link rel="prefetch"> por URL, una sola vez.
  document.querySelectorAll<HTMLAnchorElement>('.next-project').forEach((a) => {
    a.addEventListener(
      'mouseenter',
      () => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = a.href
        document.head.appendChild(link)
      },
      {once: true},
    )
  })
</script>
```

- [ ] **Step 2: Verificar** — en una ficha, hover sobre «siguiente proyecto» y comprobar en la pestaña Network una petición `prefetch` del HTML destino (una sola aunque se repita el hover).
- [ ] **Step 3: Commit** — `perf(ficha): prefetch del siguiente proyecto al hover`.

---

### Task 9: /gracias solo tras enviar (guard con sessionStorage)

**Files:**
- Modify: `web/src/views/contact.astro` (marcar el envío)
- Modify: `web/src/views/thanks.astro` (guard + redirect)

**Interfaces:**
- Produces: flag `sessionStorage['aa-sent'] = '1'` puesto en el submit del mad-lib; /gracias lo consume y lo borra.

- [ ] **Step 1: Marcar el envío** — en el handler `submit` existente de `contact.astro` (junto al cambio de estado del botón):

```ts
try {
  sessionStorage.setItem('aa-sent', '1')
} catch {}
```

- [ ] **Step 2: Guard en `thanks.astro`** — al principio del `<script>` existente:

```ts
// El premio es para quien envía: llegar directo redirige al formulario.
let sent = false
try {
  sent = sessionStorage.getItem('aa-sent') === '1'
  sessionStorage.removeItem('aa-sent')
} catch {}
if (!sent) {
  location.replace(document.documentElement.lang === 'en' ? '/en/contact/' : '/contacto/')
}
```

y condicionar el confeti y el `mountScene` a `sent === true` (envolver ambos en `if (sent) {...}`).

- [ ] **Step 3: Verificar** — staging: entrar directo a /gracias → redirige a /contacto; enviar el formulario real → /gracias muestra premio; recargar /gracias tras verla → redirige (el flag se consumió).
- [ ] **Step 4: Commit** — `fix(gracias): el premio solo tras enviar (guard sessionStorage)`.

---

### Task 10: Validación del `startDate` en el Studio

**Resuelve:** fragilidad del odómetro (una etapa sin año de 4 dígitos apaga el efecto entero).

**Files:**
- Modify: `studio/schemaTypes/experience.ts` (campo `startDate`, y el `endDate` análogo)

- [ ] **Step 1:** localizar `defineField({name: 'startDate', ...})` y añadir validación:

```ts
validation: (rule) =>
  rule.required().regex(/^(\d{2}\/)?\d{4}$/, {name: 'fecha', invert: false})
    .error('Formato: "2024" o "11/2024" — el año gigante de /experiencia lo necesita'),
```

y al `endDate` la misma regex SIN `required()` (vacío = "Actualidad"):

```ts
validation: (rule) =>
  rule.regex(/^(\d{2}\/)?\d{4}$/, {name: 'fecha', invert: false})
    .error('Formato: "2024" o "11/2024" (vacío = Actualidad)'),
```

- [ ] **Step 2: Verificar** — `cd studio && npx sanity schema validate` (o build del Studio) sin errores; en el Studio local (`npx sanity dev`) el campo rechaza «abril 2024».
- [ ] **Step 3: Re-deploy del Studio** — `cd studio && npx sanity deploy` (mismo hostname `alvaroartiel`).
- [ ] **Step 4: Commit** — `fix(studio): startDate/endDate validados — protege el odómetro de /experiencia`.

---

### Task 11: Fallback del botón «copiar email» sin Clipboard API

**Files:**
- Modify: `web/src/views/contact.astro` (handler `data-copy-email`)

- [ ] **Step 1:** sustituir el `catch { return }` del handler actual por selección del texto:

```ts
try {
  await navigator.clipboard.writeText(text.textContent?.trim() ?? '')
} catch {
  // Sin permiso de clipboard: seleccionamos el email para copiar manual (Ctrl+C)
  const range = document.createRange()
  range.selectNodeContents(text)
  const sel = getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
  return
}
```

- [ ] **Step 2: Verificar** — en /contacto local, click en el email copia (toast «Copiado ✓» + partículas); simulando fallo (DevTools → bloquear permiso clipboard-write) el click deja el email seleccionado.
- [ ] **Step 3: Commit** — `fix(contacto): fallback de selección cuando el clipboard no está disponible`.

---

### Task 12 (opcional, presupuesto restante): retoques de gusto

Cada uno con su mini-verificación y commit; se ejecutan en orden hasta agotar presupuesto.

- [ ] **12a — Hint del hero desaparece al scrollear:** en `web/src/components/home/Hero.astro`, script: al primer `scroll` con `window.scrollY > 40`, `heroScrollHint.style.opacity = '0'` con `transition: opacity var(--dur-element) var(--ease-out-token)` (CSS). Evita que el hint conviva con la disolución de partículas. Commit: `feat(hero): el hint se retira al empezar el viaje`.
- [ ] **12b — LangSwitch con contexto:** en `web/src/components/LangSwitch.astro`, `title="Español"` / `title="English"` en cada enlace y `aria-label` equivalente. (La preview visual estilo menú queda descartada: el switch vive en footer/menú y no necesita más peso.) Commit: `feat(a11y): títulos descriptivos en el selector de idioma`.

---

### Task 13: Cierre

- [ ] **Step 1:** recorrido de humo en staging: home, /proyectos (filtro + aria-live), ficha (prefetch), /cv (grupos desde Sanity), /contacto (copiar + enviar), /gracias (guard), 404, /en/ spot-check.
- [ ] **Step 2:** Lighthouse en home y una ficha ≥90 Performance (el prefetch y el guard no deben moverlo).
- [ ] **Step 3:** addendum en `docs/superpowers/NIGHT-REPORT-3.md` («Post-auditoría aplicada») con la lista de fixes + push a `main`.
