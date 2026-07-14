# Diseño — Posicionar la especialidad en gamificación

**Fecha:** 2026-07-14
**Objetivo:** que la faceta de "especialista en gamificación" de Álvaro se venda
en el portfolio y sea buscable (SEO / clientes que buscan ese perfil), en vez de
quedar enterrada dentro de las fichas. Peso acordado: **co-protagonista** —el
paraguas sigue siendo "diseño de producto de punta a punta", con gamificación
como hilo destacado con nombre propio.

## Alcance

Cuatro frentes, todos desplegados junto al resto del trabajo pendiente:

### 1. Bloque en la home ("Especialidad: gamificación")
- Ubicación: en la home, **después del deck de proyectos destacados**.
- Banda a ancho completo con el acento **lima** de la home.
- Contenido:
  - Antetítulo: **ESPECIALIDAD** / **SPECIALTY**
  - Titular ES: *"Diseño sistemas que enganchan y hacen volver."*
    EN: *"I design systems people come back to."*
  - Cuerpo ES: *"Puntos, rangos, retos, rachas y rankings que convierten una
    tarea en algo que apetece repetir. Lo aplico en e-learning, SaaS y
    comunidades."* / EN equivalente.
  - Chips que enlazan a los casos gamificados: **Ranquea · AuraProds ·
    TenTuPlaza · BeNext** (ver §4: se obtienen filtrando proyectos con la
    etiqueta "Gamificación", no hardcodeados).

### 2. Interacción "colecciona puntos" (escena WebGL)
- Tokens 3D (guiño a los Lúmenes de AuraProds) flotando en la banda.
  Microcopy: *"Recoge los puntos 👆"*.
- Hover / tap recoge un token con un "pop"; sube un **contador** y una **barra
  de progreso**. Al 100% se **desbloquea un badge** con un estallido breve y se
  resaltan los chips ("nivel completado").
- Tokens en lima; destello cálido en el desbloqueo.
- **Fallback obligatorio** (sin WebGL2 / `prefers-reduced-motion` / deviceMemory
  bajo): la misma banda estática con badge + una stat ("4 productos con
  gamificación real") + los chips. Todo el contenido y los enlaces viven en el
  DOM desde el render (la escena solo *mejora*); accesible por teclado y con
  `aria`. Se reutiliza `web/src/lib/three-island.ts` (`mountScene`) que ya
  gestiona capability-gate, lazy-mount near-viewport, pausa por visibilidad y
  dispose. Escena nueva: `web/src/scenes/gamification.ts`.

### 3. Copy de posicionamiento + SEO (siteSettings + Base.astro)
- **heroSubtitle**: `Product Lead · Gamificación · UX/UI · E-learning · SaaS · IA aplicada`.
- **about**: añadir frase — *"Una de mis obsesiones es la gamificación: puntos,
  rangos y retos que hacen que la gente quiera volver."* (EN equivalente).
- **seoTitle**: `Álvaro Artiel — Diseño de producto y gamificación` / EN.
- **seoDescription**: incluir "especializado en gamificación (puntos, rangos,
  retos, rankings) para e-learning, SaaS y comunidades".
- **JSON-LD Person** (en la home / Base): añadir `knowsAbout` con gamificación y
  términos afines + meta `keywords`, para asociación en buscadores.
- **cvSkillGroups**: nuevo grupo "Gamificación".

### 4. Etiquetas en proyectos (fuente única)
- Añadir **"Gamificación"** al `stack` de `project-ranquea`,
  `project-campus-auraprods`, `project-tentuplaza-plataforma`, `project-benext`.
- El bloque de la home saca sus chips filtrando `getProjects()` por los que
  tengan "Gamificación" en `stack` → una sola fuente de verdad.

## Dónde vive cada cosa
- **Repo (git):** el componente del bloque, la escena `gamification.ts`, el
  cableado en la home, y el copy/tags en `studio/seed/content.mjs`
  (heroSubtitle, about, seo, cvSkillGroups, stacks). La copy del bloque se
  hardcodea bilingüe en el componente (vía dict i18n), no en Sanity.
- **Sanity (en vivo):** patch de `siteSettings` (heroSubtitle, about, seoTitle,
  seoDescription, cvSkillGroups) y del `stack` de los 4 proyectos, para que el
  build estático lo recoja.

## No incluido (YAGNI)
- No se crea un nuevo tipo de documento ni campos nuevos en el esquema de Sanity
  para la copy del bloque.
- No se toca la casa jugable ni otras escenas existentes.
- No se convierte en un mini-juego completo: es una microinteracción con inicio,
  progreso y recompensa, no un nivel jugable.

## Verificación
- `astro check` en verde.
- Home renderiza el bloque con la escena activa (WebGL) y, forzando
  reduced-motion, con el fallback estático — ambos con los 4 chips enlazando.
- SEO: `web/dist` home incluye el título/description/JSON-LD nuevos.
