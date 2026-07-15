# Sección Especialidades + SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear la sección "Especialidades" (hub + 3 landings bilingües orientadas a keywords de consultoría) con contenido en Sanity, JSON-LD `Service`/`FAQPage`, navegación y enlazado interno.

**Architecture:** Nuevo documento `service` en Sanity (seed standalone que NO toca otros documentos), rutas estáticas Astro `/especialidades/` y `/especialidades/[slug]/` con espejo `/en/expertise/`, siguiendo exactamente los patrones existentes de `project` (schema, queries GROQ, views, getStaticPaths).

**Tech Stack:** Astro 7 (static), Sanity (content), @astrojs/sitemap, sharp (OG images).

**Spec:** `docs/superpowers/specs/2026-07-15-seo-servicios-design.md`

## Global Constraints

- La sección se llama **"Especialidades"** (ES) / **"Expertise"** (EN) — nunca "Servicios" en URLs, menú ni textos visibles. Internamente (Sanity, JSON-LD) el tipo se llama `service`.
- Rutas ES en raíz, EN bajo `/en/`: `/especialidades/` ↔ `/en/expertise/`. Slugs de landing compartidos entre idiomas: `diseno-de-producto`, `gamificacion`, `gestion-de-proyectos`.
- El seed de servicios debe ser **standalone** (`studio/seed/seed-services.mjs`) y solo escribir documentos `service-*` + un `patch` de siteSettings. **NUNCA ejecutar `studio/seed/seed.mjs`** — haría createOrReplace de proyectos ya enriquecidos con capturas reales.
- No referenciar proyectos ocultos (`project-crm-iurban`, `project-fotografia`, `project-controlfacturacion` tienen `visible:false` a propósito).
- Contenido ES completo y obligatorio; EN más ligero pero presente (paridad hreflang).
- No hay framework de tests en el repo: la verificación de cada tarea es `npx astro check` / `npx astro build` + inspección del HTML generado en `web/dist/`.
- Acento de la sección: `#ffc53d` (ámbar), coherente con el sistema camaleón.

---

### Task 1: Schema `service` en Sanity

**Files:**
- Create: `studio/schemaTypes/service.ts`
- Modify: `studio/schemaTypes/index.ts`

**Interfaces:**
- Produces: documento Sanity `service` con campos `title` (localeString), `slug`, `seoTitle` (localeString), `seoDescription` (localeText), `intro` (localeText), `body` ({es, en} de bloques), `faqs` (array de objetos `faq` con `question` localeString y `answer` localeText), `relatedProjects` (referencias a project), `order` (number), `visible` (boolean).

- [ ] **Step 1: Crear el schema**

`studio/schemaTypes/service.ts`:

```typescript
import {defineField, defineType} from 'sanity'

const bodyOf = [{type: 'block'}, {type: 'image'}]

export const service = defineType({
  name: 'service',
  title: 'Especialidad',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Título', type: 'localeString'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.es'},
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO (<title>)',
      type: 'localeString',
      description: 'Orientado a la keyword; se itera desde aquí sin tocar código.',
    }),
    defineField({name: 'seoDescription', title: 'Meta description', type: 'localeText'}),
    defineField({
      name: 'intro',
      title: 'Intro (propuesta de valor)',
      type: 'localeText',
      description: 'Párrafo de apertura bajo el H1.',
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'object',
      fields: [
        {name: 'es', title: 'Español', type: 'array', of: bodyOf, validation: (R: any) => R.required()},
        {name: 'en', title: 'English', type: 'array', of: bodyOf},
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faq',
          title: 'FAQ',
          fields: [
            {name: 'question', title: 'Pregunta', type: 'localeString'},
            {name: 'answer', title: 'Respuesta', type: 'localeText'},
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Proyectos relacionados',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
    defineField({name: 'order', title: 'Orden', type: 'number'}),
    defineField({name: 'visible', title: 'Visible', type: 'boolean', initialValue: true}),
  ],
})
```

- [ ] **Step 2: Registrarlo en el índice de schemas**

En `studio/schemaTypes/index.ts`:

```typescript
import {localeString, localeText, localeBlock} from './objects/locale'
import {siteSettings} from './siteSettings'
import {experience} from './experience'
import {education} from './education'
import {project} from './project'
import {service} from './service'
import {personalChapter} from './personalChapter'
import {personalItem} from './personalItem'
import {blogPost} from './blogPost'

export const schemaTypes = [
  localeString,
  localeText,
  localeBlock,
  siteSettings,
  experience,
  education,
  project,
  service,
  personalChapter,
  personalItem,
  blogPost,
]
```

- [ ] **Step 3: Verificar que el Studio compila**

Run: `cd studio && npx tsc --noEmit`
Expected: sin errores (exit 0).

- [ ] **Step 4: Commit**

```bash
git add studio/schemaTypes/service.ts studio/schemaTypes/index.ts
git commit -m "feat(sanity): documento service para las especialidades"
```

---

### Task 2: Seed standalone de las tres especialidades

**Files:**
- Create: `studio/seed/seed-services.mjs`

**Interfaces:**
- Consumes: schema `service` (Task 1). IDs de proyectos existentes: `project-vaultz`, `project-ultracarta`, `project-watcheers`, `project-ranquea`, `project-tentuplaza-plataforma`, `project-campus-auraprods`, `project-benext`.
- Produces: documentos `service-diseno-de-producto`, `service-gamificacion`, `service-gestion-de-proyectos` en el dataset, y `seoTitle`/`seoDescription` ES de siteSettings actualizados vía patch.

⚠️ Este script es deliberadamente independiente de `seed.mjs`: ese script haría createOrReplace de TODOS los documentos y machacaría los proyectos ya enriquecidos.

- [ ] **Step 1: Escribir el script**

`studio/seed/seed-services.mjs`:

```javascript
// Seeds ONLY the `service` documents (Especialidades) plus a patch of the
// siteSettings SEO title. Standalone on purpose: running seed.mjs would
// createOrReplace enriched projects. Idempotent via deterministic _ids.
//
// Usage: node studio/seed/seed-services.mjs

import {createClient} from '@sanity/client'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_ENV_PATH = path.join(__dirname, '..', '..', '.env')

async function loadRootEnv() {
  const raw = await readFile(ROOT_ENV_PATH, 'utf8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

// --- Portable Text helpers (deterministic keys for idempotency) -----------
let keyCounter = 0
const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: `svc-b${keyCounter++}`,
  style,
  markDefs: [],
  children: [{_type: 'span', _key: `svc-s${keyCounter++}`, text, marks: []}],
})

const faq = (id, i, question, answer) => ({
  _type: 'faq',
  _key: `${id}-faq-${i}`,
  question: {es: question.es, en: question.en},
  answer: {es: answer.es, en: answer.en},
})

const refs = (id, ids) =>
  ids.map((r, i) => ({_type: 'reference', _ref: r, _key: `${id}-rel-${i}`}))

// --- Content ---------------------------------------------------------------

const SERVICES = [
  {
    _id: 'service-diseno-de-producto',
    slug: 'diseno-de-producto',
    order: 1,
    title: {es: 'Diseño de producto digital', en: 'Digital product design'},
    seoTitle: {
      es: 'Consultoría de diseño de producto digital — Álvaro Artiel',
      en: 'Digital product design consulting — Álvaro Artiel',
    },
    seoDescription: {
      es: 'Consultor de diseño de producto digital: de la idea al producto lanzado. UX/UI, validación y diseño end-to-end para SaaS, plataformas y apps. Trabajo en remoto con equipos de toda España.',
      en: 'Digital product design consultant: from idea to shipped product. End-to-end UX/UI and validation for SaaS and platforms, working remotely from Spain.',
    },
    intro: {
      es: 'Diseño productos digitales de punta a punta: entiendo el problema de negocio, valido con usuarios y entrego interfaces listas para construir. Sin humo — con proceso, criterio y los casos para demostrarlo.',
      en: 'I design digital products end to end: I understand the business problem, validate with users and deliver build-ready interfaces.',
    },
    body: {
      es: [
        block('Para quién es', 'h2'),
        block(
          'Para equipos que tienen un producto (o la idea de uno) y necesitan a alguien que convierta requisitos difusos en un producto usable: startups que van a lanzar, empresas con un SaaS que ha crecido sin diseño, o negocios que quieren digitalizar un proceso.',
        ),
        block('Cómo trabajo', 'h2'),
        block(
          'Empiezo por el problema, no por las pantallas: research ligero, mapa del flujo y prioridades. Después prototipo en Figma, valido rápido y entrego un sistema de diseño que el equipo de desarrollo puede construir sin fricción. Si hace falta, también desarrollo: conozco las dos orillas.',
        ),
        block('Qué entrego', 'h2'),
        block(
          'Prototipos navegables, UI final con su sistema de diseño, especificaciones para desarrollo y acompañamiento durante la construcción. El alcance se pacta por fases cortas con entregables claros — nada de proyectos eternos.',
        ),
      ],
      en: [
        block(
          'For teams with a product (or the idea of one) that need someone to turn fuzzy requirements into something usable. I start from the business problem, prototype in Figma, validate fast and deliver a design system ready to build. Scope is agreed in short phases with clear deliverables.',
        ),
      ],
    },
    faqs: [
      {
        q: {
          es: '¿Qué incluye una consultoría de diseño de producto?',
          en: 'What does a product design engagement include?',
        },
        a: {
          es: 'Depende de la fase: puede ir desde una auditoría de UX de un producto existente hasta el diseño completo de un producto nuevo — research, flujos, prototipos, UI final y sistema de diseño. Siempre se pacta el alcance por fases con entregables concretos.',
          en: 'From a UX audit of an existing product to full product design: research, flows, prototypes, final UI and a design system, agreed in phases.',
        },
      },
      {
        q: {
          es: '¿Trabajas con startups en fase temprana?',
          en: 'Do you work with early-stage startups?',
        },
        a: {
          es: 'Sí, es donde más aporto: cuando aún hay decisiones de producto por tomar, el diseño ahorra meses de desarrollo en la dirección equivocada. He lanzado producto propio y sé lo que duele cada sprint desperdiciado.',
          en: "Yes — that's where design saves the most: months of development in the wrong direction. I've shipped my own products too.",
        },
      },
      {
        q: {
          es: '¿Cuánto cuesta diseñar un producto digital?',
          en: 'How much does designing a digital product cost?',
        },
        a: {
          es: 'No hay tarifa única: un MVP bien acotado no cuesta lo mismo que rediseñar un SaaS en producción. Tras una primera llamada te doy una propuesta cerrada por fases, para que sepas qué cuesta cada paso antes de comprometerte con el siguiente.',
          en: "There is no single rate — after a first call you get a fixed, phased proposal so you know each step's cost before committing to the next.",
        },
      },
    ],
    relatedProjects: ['project-vaultz', 'project-ultracarta', 'project-watcheers'],
  },
  {
    _id: 'service-gamificacion',
    slug: 'gamificacion',
    order: 2,
    title: {es: 'Gamificación', en: 'Gamification'},
    seoTitle: {
      es: 'Consultoría de gamificación para productos digitales y e-learning — Álvaro Artiel',
      en: 'Gamification consulting for digital products and e-learning — Álvaro Artiel',
    },
    seoDescription: {
      es: 'Consultor de gamificación: sistemas de puntos, niveles, retos y recompensas que enganchan sin convertir tu producto en un casino. Especializado en e-learning, SaaS y comunidades. España, en remoto.',
      en: 'Gamification consultant: points, levels, challenges and rewards that drive engagement without turning your product into a casino. E-learning, SaaS and communities.',
    },
    intro: {
      es: 'Diseño mecánicas de juego que hacen que la gente vuelva: puntos, niveles, retos, recompensas y narrativa aplicados a productos reales. La gamificación no es poner insignias — es diseñar motivación.',
      en: 'I design game mechanics that make people come back: points, levels, challenges and narrative applied to real products. Gamification is not badges — it is designing motivation.',
    },
    body: {
      es: [
        block('Para quién es', 'h2'),
        block(
          'Para plataformas de e-learning que pelean contra el abandono, productos SaaS que necesitan activar usuarios, y comunidades o programas de fidelización que quieren premiar la participación de forma que signifique algo.',
        ),
        block('Cómo trabajo', 'h2'),
        block(
          'Parto de la motivación del usuario, no del catálogo de mecánicas: qué le mueve, qué comportamiento queremos reforzar y qué recompensa lo sostiene en el tiempo. Con eso diseño el sistema — economía de puntos, progresión, retos — y lo prototipo para probarlo antes de construir nada.',
        ),
        block('Qué entrego', 'h2'),
        block(
          'El diseño completo del sistema de gamificación: reglas, economía, progresión, casos límite y las pantallas que lo hacen visible. Documentado para que el equipo de desarrollo lo implemente sin ambigüedad, y con métricas definidas para saber si funciona.',
        ),
      ],
      en: [
        block(
          'For e-learning platforms fighting churn, SaaS products that need activation, and communities that want participation to mean something. I start from user motivation, design the system — point economy, progression, challenges — and deliver it documented with success metrics.',
        ),
      ],
    },
    faqs: [
      {
        q: {
          es: '¿Funciona la gamificación en e-learning?',
          en: 'Does gamification work in e-learning?',
        },
        a: {
          es: 'Cuando refuerza el progreso real del alumno, sí: reduce el abandono y aumenta la finalización de cursos. Cuando es decorativa (insignias porque sí), no mueve nada. La diferencia está en diseñar el sistema sobre la motivación del alumno, no sobre el catálogo de mecánicas.',
          en: 'Yes — when it reinforces real learner progress. Decorative badges move nothing; systems designed around learner motivation reduce drop-off.',
        },
      },
      {
        q: {
          es: '¿Qué mecánicas de gamificación existen más allá de puntos e insignias?',
          en: 'Which mechanics exist beyond points and badges?',
        },
        a: {
          es: 'Progresión y niveles, retos temporales, rachas, economías internas con tienda, rankings por ligas, narrativa y desbloqueo de contenido, azar controlado… La cuestión no es cuántas usar, sino cuáles encajan con la motivación de tus usuarios. Menos suele ser más.',
          en: 'Progression, timed challenges, streaks, internal economies, league rankings, narrative unlocks… The question is which ones fit your users, not how many.',
        },
      },
      {
        q: {
          es: '¿Puedes gamificar un producto que ya está en producción?',
          en: 'Can you gamify a product already in production?',
        },
        a: {
          es: 'Sí, y suele ser el mejor escenario: hay datos reales de uso para decidir qué comportamientos reforzar. Se diseña el sistema, se prioriza una primera versión pequeña y se mide su efecto antes de ampliar.',
          en: 'Yes — often the best scenario, since real usage data tells us which behaviours to reinforce. We ship a small first version and measure.',
        },
      },
    ],
    relatedProjects: [
      'project-ranquea',
      'project-tentuplaza-plataforma',
      'project-campus-auraprods',
      'project-benext',
    ],
  },
  {
    _id: 'service-gestion-de-proyectos',
    slug: 'gestion-de-proyectos',
    order: 3,
    title: {es: 'Gestión de proyectos digitales', en: 'Digital project management'},
    seoTitle: {
      es: 'Gestión de proyectos digitales — consultor y project manager freelance — Álvaro Artiel',
      en: 'Digital project management — freelance consultant — Álvaro Artiel',
    },
    seoDescription: {
      es: 'Gestión de proyectos digitales de punta a punta: alcance, equipo, plazos y calidad. Project manager freelance con perfil técnico y de producto — hablo el idioma de diseño y de desarrollo. España, en remoto.',
      en: 'End-to-end digital project management: scope, team, deadlines and quality. Freelance PM with a technical and product background, based in Spain.',
    },
    intro: {
      es: 'Llevo proyectos digitales de la idea al lanzamiento: defino el alcance, coordino al equipo y protejo el plazo y la calidad. Con perfil técnico y de producto — hablo el idioma de diseño y el de desarrollo, y traduzco entre ambos.',
      en: 'I run digital projects from idea to launch: scope, team coordination, deadlines and quality — speaking both design and development.',
    },
    body: {
      es: [
        block('Para quién es', 'h2'),
        block(
          'Para empresas que externalizan el desarrollo de un producto y necesitan a alguien de su lado que lo dirija, para equipos sin un perfil de producto que priorice y decida, y para proyectos que se han atascado y necesitan que alguien los desatasque.',
        ),
        block('Cómo trabajo', 'h2'),
        block(
          'Primero el alcance: qué se construye, qué se deja fuera y en qué orden. Después el ritmo — ciclos cortos, entregas visibles y decisiones documentadas. Como también diseño y desarrollo, detecto los problemas antes de que cuesten un sprint: una estimación irreal, una integración subestimada, un diseño imposible de construir.',
        ),
        block('Qué entrego', 'h2'),
        block(
          'Un proyecto que avanza y se ve avanzar: roadmap priorizado, seguimiento honesto (lo que va bien y lo que no), gestión de proveedores y un producto lanzado. Mi trabajo termina cuando el tuyo está en producción.',
        ),
      ],
      en: [
        block(
          'For companies outsourcing product development that need someone on their side to run it. Scope first, then rhythm: short cycles, visible deliveries, documented decisions. My work ends when your product is in production.',
        ),
      ],
    },
    faqs: [
      {
        q: {
          es: '¿Qué hace un project manager de proyectos digitales?',
          en: 'What does a digital project manager do?',
        },
        a: {
          es: 'Convierte un objetivo de negocio en un plan ejecutable: define alcance y prioridades, coordina a diseño y desarrollo, gestiona riesgos y comunica el estado real del proyecto. En mi caso, con la ventaja de haber estado en los tres lados: producto, diseño y código.',
          en: 'Turns a business goal into an executable plan: scope, priorities, coordination and honest status. I have been on all three sides: product, design and code.',
        },
      },
      {
        q: {
          es: 'Externalizo el desarrollo, ¿por qué necesito un PM propio?',
          en: 'I outsource development — why do I need my own PM?',
        },
        a: {
          es: 'Porque la agencia optimiza sus horas, no tu producto. Alguien de tu lado que revise estimaciones, priorice con criterio de negocio y valide calidad evita el clásico proyecto que se entrega tarde, incompleto y sin que nadie sepa muy bien por qué.',
          en: 'Because the agency optimises its hours, not your product. Someone on your side reviewing estimates and validating quality prevents the classic late, incomplete delivery.',
        },
      },
      {
        q: {
          es: '¿Puedes incorporarte a un proyecto ya empezado?',
          en: 'Can you join a project already underway?',
        },
        a: {
          es: 'Sí. Empiezo con una auditoría corta — estado real, riesgos, deuda — y un plan de estabilización. Los proyectos atascados suelen sufrir de alcance difuso más que de mal equipo; se arregla antes de lo que parece.',
          en: 'Yes. I start with a short audit — real status, risks — and a stabilisation plan. Stuck projects usually suffer from fuzzy scope, not bad teams.',
        },
      },
    ],
    relatedProjects: ['project-tentuplaza-plataforma', 'project-ultracarta', 'project-campus-auraprods'],
  },
]

// --- Main --------------------------------------------------------------------

async function main() {
  const env = await loadRootEnv()
  const projectId = env.SANITY_PROJECT_ID
  const dataset = env.SANITY_DATASET
  const token = env.SANITY_AUTH_TOKEN
  if (!projectId || !dataset || !token) {
    throw new Error('Missing SANITY_PROJECT_ID / SANITY_DATASET / SANITY_AUTH_TOKEN in root .env')
  }

  const client = createClient({projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false})
  console.log(`Seeding services into ${projectId} / ${dataset}...`)

  const tx = client.transaction()
  for (const s of SERVICES) {
    tx.createOrReplace({
      _id: s._id,
      _type: 'service',
      title: s.title,
      slug: {_type: 'slug', current: s.slug},
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
      intro: s.intro,
      body: s.body,
      faqs: s.faqs.map((f, i) => faq(s._id, i, f.q, f.a)),
      relatedProjects: refs(s._id, s.relatedProjects),
      order: s.order,
      visible: true,
    })
  }
  await tx.commit()
  console.log(`Wrote ${SERVICES.length} service documents.`)

  // Retitulado SEO de la home (patch, no replace: siteSettings tiene más campos).
  const settings = await client.fetch(`*[_type == 'siteSettings'][0]{_id}`)
  if (settings?._id) {
    await client
      .patch(settings._id)
      .set({
        'seoTitle.es': 'Álvaro Artiel — Consultoría de diseño de producto, gamificación y gestión de proyectos digitales',
        'seoDescription.es':
          'Consultor de producto digital: diseño de producto, gamificación y gestión de proyectos digitales de punta a punta. De la idea al lanzamiento, con casos reales.',
      })
      .commit()
    console.log('Patched siteSettings seoTitle/seoDescription (es).')
  }

  const count = await client.fetch(`count(*[_type == 'service'])`)
  console.log(`Done. service documents in dataset: ${count}`)
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
```

- [ ] **Step 2: Ejecutar el seed**

Run: `node studio/seed/seed-services.mjs`
Expected:

```
Seeding services into <projectId> / <dataset>...
Wrote 3 service documents.
Patched siteSettings seoTitle/seoDescription (es).
Done. service documents in dataset: 3
```

- [ ] **Step 3: Commit**

```bash
git add studio/seed/seed-services.mjs
git commit -m "feat(sanity): seed standalone de las tres especialidades"
```

---

### Task 3: Tipos y queries en la web

**Files:**
- Modify: `web/src/lib/queries.ts`

**Interfaces:**
- Consumes: documentos `service` (Task 2).
- Produces (usado por Tasks 5, 6 y 8):
  - `interface ServiceFaq {question?: LocaleField; answer?: LocaleField; _key?: string}`
  - `interface Service {_id; _type: 'service'; title?: LocaleField; slug: SanitySlug; seoTitle?: LocaleField; seoDescription?: LocaleField; intro?: LocaleField; body?: {es?: BodyBlock[]; en?: BodyBlock[]}; faqs?: ServiceFaq[]; relatedProjects?: Project[]; order?: number; visible?: boolean}`
  - `getServices(): Promise<Service[]>` — lista visible ordenada, con `relatedProjects` expandidos (solo visibles).
  - `getService(slug: string): Promise<Service | null>` — detalle con proyectos expandidos.
  - `getServiceForProject(projectId: string): Promise<Pick<Service, 'title' | 'slug'> | null>` — la especialidad que referencia un proyecto.

- [ ] **Step 1: Añadir tipos y queries**

En `web/src/lib/queries.ts`, tras la interface `Project`:

```typescript
export interface ServiceFaq {
  question?: LocaleField
  answer?: LocaleField
  _key?: string
}

export interface Service {
  _id: string
  _type: 'service'
  title?: LocaleField
  slug: SanitySlug
  seoTitle?: LocaleField
  seoDescription?: LocaleField
  intro?: LocaleField
  body?: {es?: BodyBlock[]; en?: BodyBlock[]}
  faqs?: ServiceFaq[]
  /** Dereferenced in list and detail queries; only visible projects. */
  relatedProjects?: Project[]
  order?: number
  visible?: boolean
}
```

Tras `projectBySlugQuery`, las queries (los proyectos referenciados se expanden filtrando ocultos):

```typescript
const servicesQuery = /* groq */ `
  *[_type == 'service' && visible != false] | order(order asc) {
    ...,
    "relatedProjects": relatedProjects[]->{_id, title, slug, cover, summary, visible}[visible != false]
  }
`

const serviceBySlugQuery = /* groq */ `
  *[_type == 'service' && slug.current == $slug && visible != false][0]{
    ...,
    "relatedProjects": relatedProjects[]->{_id, title, slug, cover, summary, visible}[visible != false]
  }
`

const serviceForProjectQuery = /* groq */ `
  *[_type == 'service' && visible != false && references($projectId)][0]{title, slug}
`
```

Y junto al resto de fetchers:

```typescript
export function getServices(): Promise<Service[]> {
  return sanityClient.fetch(servicesQuery)
}

export function getService(slug: string): Promise<Service | null> {
  return sanityClient.fetch(serviceBySlugQuery, {slug})
}

export function getServiceForProject(
  projectId: string,
): Promise<Pick<Service, 'title' | 'slug'> | null> {
  return sanityClient.fetch(serviceForProjectQuery, {projectId})
}
```

- [ ] **Step 2: Verificar tipos**

Run: `cd web && npx astro check`
Expected: 0 errors (los warnings preexistentes no cuentan).

- [ ] **Step 3: Commit**

```bash
git add web/src/lib/queries.ts
git commit -m "feat(web): tipos y queries GROQ de especialidades"
```

---

### Task 4: Rutas, i18n, acento de sección y OG

**Files:**
- Modify: `web/src/lib/routes.ts`
- Modify: `web/src/lib/i18n.ts`
- Modify: `web/src/styles/tokens.css`
- Modify: `web/src/layouts/Base.astro`
- Modify: `web/scripts/generate-og.mjs`

**Interfaces:**
- Produces (usado por Tasks 5–8): clave de ruta `especialidades` (→ `/especialidades/` y `/en/expertise/` vía `pathFor('especialidades', lang)`); claves de diccionario `nav_expertise`, `expertise_cases`, `expertise_faq`, `expertise_cta`, `expertise_case_of`, `expertise_count`; sección `expertise` en `Base.astro` (tipo `Section` y OG `/og/especialidades.png`); acento `#ffc53d`.

- [ ] **Step 1: routeMap**

En `web/src/lib/routes.ts`, dentro de `routeMap` (tras `proyectos`):

```typescript
export const routeMap: Record<string, string> = {
  especialidades: 'expertise',
  proyectos: 'projects',
  experiencia: 'experience',
  personal: 'personal',
  blog: 'blog',
  cv: 'cv',
  contacto: 'contact',
  gracias: 'thanks',
  casa: 'house',
}
```

- [ ] **Step 2: Diccionario i18n**

En `web/src/lib/i18n.ts`, añadir al bloque `es` (tras `nav_projects`):

```typescript
    nav_expertise: 'Especialidades',
    expertise_cases: 'Casos reales',
    expertise_faq: 'Preguntas frecuentes',
    expertise_cta: 'Cuéntame tu proyecto →',
    expertise_case_of: 'Este proyecto es un caso de',
    expertise_count: '3 formas de ayudarte',
```

Y al bloque `en` (tras `nav_projects`):

```typescript
    nav_expertise: 'Expertise',
    expertise_cases: 'Real cases',
    expertise_faq: 'FAQ',
    expertise_cta: 'Tell me about your project →',
    expertise_case_of: 'This project is a case of',
    expertise_count: '3 ways I can help',
```

- [ ] **Step 3: Acento de sección**

En `web/src/styles/tokens.css`, tras el bloque `[data-section='projects']`:

```css
[data-section='expertise'] {
  --accent: #ffc53d;
}
```

- [ ] **Step 4: Sección en Base.astro**

En `web/src/layouts/Base.astro`:

```typescript
export type Section = 'home' | 'expertise' | 'projects' | 'experience' | 'personal' | 'blog' | 'cv'
```

y en `OG_IMAGE_BY_SECTION`:

```typescript
const OG_IMAGE_BY_SECTION: Record<Section, string> = {
  home: '/og/home.png',
  expertise: '/og/especialidades.png',
  projects: '/og/proyectos.png',
  experience: '/og/experiencia.png',
  personal: '/og/personal.png',
  blog: '/og/blog.png',
  cv: '/og/cv.png',
}
```

- [ ] **Step 5: Imagen OG**

En `web/scripts/generate-og.mjs`, añadir a `PAGES` (tras `home`):

```javascript
  { filename: 'especialidades', title: 'Especialidades', accent: '#FFC53D' },
```

Run: `cd web && npm run og`
Expected: `Done. 8 images written to ...` y existe `web/public/og/especialidades.png`.

- [ ] **Step 6: Verificar tipos**

Run: `cd web && npx astro check`
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add web/src/lib/routes.ts web/src/lib/i18n.ts web/src/styles/tokens.css web/src/layouts/Base.astro web/scripts/generate-og.mjs web/public/og/especialidades.png
git commit -m "feat(web): ruta, i18n, acento y OG de la seccion especialidades"
```

---

### Task 5: Hub de especialidades

**Files:**
- Create: `web/src/views/expertise.astro`
- Create: `web/src/pages/especialidades/index.astro`
- Create: `web/src/pages/en/expertise/index.astro`

**Interfaces:**
- Consumes: `getServices()` (Task 3); `pathFor('especialidades', lang)`, dict `nav_expertise`/`expertise_count` (Task 4); `Base` con `section="expertise"`.
- Produces: páginas `/especialidades/` y `/en/expertise/`.

- [ ] **Step 1: Vista del hub**

`web/src/views/expertise.astro`:

```astro
---
import Base from '../layouts/Base.astro'
import type {Lang} from '../lib/i18n'
import {t, ui} from '../lib/i18n'
import {getServices} from '../lib/queries'
import {pathFor} from '../lib/routes'

interface Props {
  lang: Lang
}
const {lang} = Astro.props
const dict = ui[lang]

const services = await getServices()
const heading = dict.nav_expertise
const basePath = pathFor('especialidades', lang)

const title =
  lang === 'en'
    ? 'Expertise: product design, gamification & project management — Álvaro Artiel'
    : 'Especialidades: diseño de producto, gamificación y gestión de proyectos — Álvaro Artiel'
const description =
  lang === 'en'
    ? 'Three ways I can help: digital product design consulting, gamification and digital project management. Real cases included.'
    : 'Tres formas de ayudarte: consultoría de diseño de producto digital, gamificación y gestión de proyectos digitales. Con casos reales.'
---

<Base title={title} description={description} lang={lang} section="expertise">
  <section class="expertise-page">
    <header class="expertise-header" data-reveal>
      <h1>{heading}</h1>
      <p class="page-count">{dict.expertise_count}</p>
    </header>

    <ol class="expertise-list">
      {
        services.map((service, i) => (
          <li class="expertise-item" data-reveal>
            <a href={`${basePath}${service.slug.current}/`} data-cursor="view">
              <span class="expertise-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span class="expertise-body">
                <h2 class="expertise-title">{t(service.title, lang)}</h2>
                {t(service.intro, lang) && <p class="expertise-intro">{t(service.intro, lang)}</p>}
              </span>
              <span class="expertise-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        ))
      }
    </ol>
  </section>
</Base>

<style>
  .expertise-page {
    padding: clamp(6rem, 16vh, 9rem) clamp(1.5rem, 6vw, 4rem) clamp(3rem, 8vh, 5rem);
    max-width: 70rem;
    margin-inline: auto;
  }

  .expertise-header h1 {
    font-family: var(--font-display);
    font-weight: 580;
    font-size: clamp(2.75rem, 8vw, 6rem);
    letter-spacing: -0.035em;
    line-height: 0.98;
    margin: 0 0 0.75rem;
  }
  .page-count {
    font-family: var(--font-mono);
    font-size: var(--step-mono-label);
    color: var(--accent);
    margin: 0 0 clamp(2rem, 6vh, 4rem);
  }

  .expertise-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .expertise-item + .expertise-item {
    border-top: 1px solid color-mix(in srgb, var(--text-muted) 20%, transparent);
  }
  .expertise-item a {
    display: flex;
    align-items: baseline;
    gap: clamp(1rem, 3vw, 2rem);
    padding-block: clamp(1.5rem, 4vh, 2.5rem);
    text-decoration: none;
    color: var(--text);
  }
  .expertise-index {
    font-family: var(--font-mono);
    font-size: var(--step-mono-label);
    color: var(--accent);
  }
  .expertise-title {
    font-family: var(--font-display);
    font-weight: 560;
    font-size: clamp(1.6rem, 4vw, 2.75rem);
    letter-spacing: -0.02em;
    margin: 0 0 0.5rem;
    transition: color var(--transition-fast);
  }
  .expertise-item a:hover .expertise-title {
    color: var(--accent);
  }
  .expertise-intro {
    color: var(--text-muted);
    line-height: 1.55;
    max-width: 58ch;
    margin: 0;
  }
  .expertise-arrow {
    margin-left: auto;
    font-size: 1.5rem;
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Páginas de ruta**

`web/src/pages/especialidades/index.astro`:

```astro
---
import Expertise from '../../views/expertise.astro'
---

<Expertise lang="es" />
```

`web/src/pages/en/expertise/index.astro`:

```astro
---
import Expertise from '../../../views/expertise.astro'
---

<Expertise lang="en" />
```

- [ ] **Step 3: Verificar**

Run: `cd web && npx astro check && npx astro build`
Expected: build OK; existen `web/dist/especialidades/index.html` y `web/dist/en/expertise/index.html`.

Run: `grep -c 'hreflang' web/dist/especialidades/index.html`
Expected: `3` (es, en, x-default).

- [ ] **Step 4: Commit**

```bash
git add web/src/views/expertise.astro web/src/pages/especialidades/index.astro web/src/pages/en/expertise/index.astro
git commit -m "feat(especialidades): hub /especialidades con espejo /en/expertise"
```

---

### Task 6: Landing de especialidad con JSON-LD Service + FAQPage

**Files:**
- Create: `web/src/views/expertise-detail.astro`
- Create: `web/src/pages/especialidades/[slug].astro`
- Create: `web/src/pages/en/expertise/[slug].astro`

**Interfaces:**
- Consumes: `getServices()`, `getService(slug)`, tipo `Service` (Task 3); dict `expertise_cases`/`expertise_faq`/`expertise_cta`/`nav_expertise` (Task 4); `BodyBlocks` (existente); `urlFor` de `web/src/lib/sanity.ts`.
- Produces: páginas `/especialidades/[slug]/` y `/en/expertise/[slug]/` con JSON-LD `Service` y `FAQPage`.

- [ ] **Step 1: Vista de detalle**

`web/src/views/expertise-detail.astro`:

```astro
---
import Base from '../layouts/Base.astro'
import BodyBlocks from '../components/projects/BodyBlocks.astro'
import type {Lang} from '../lib/i18n'
import {t, ui} from '../lib/i18n'
import type {Service} from '../lib/queries'
import {pathFor} from '../lib/routes'
import {urlFor} from '../lib/sanity'

interface Props {
  lang: Lang
  service: Service
}
const {lang, service} = Astro.props
const dict = ui[lang]

const title = t(service.title, lang)
const intro = t(service.intro, lang)
const seoTitle = t(service.seoTitle, lang) || `${title} — Álvaro Artiel`
const seoDescription = t(service.seoDescription, lang) || intro
const body = service.body?.[lang] ?? service.body?.es ?? []
const faqs = (service.faqs ?? []).filter((f) => t(f.question, lang) && t(f.answer, lang))
const related = service.relatedProjects ?? []

const siteUrl = Astro.site ?? new URL('https://dev.alvaroartiel.com')

// JSON-LD Service (schema.org): la landing declara el servicio con Álvaro como provider.
const serviceLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: title,
  serviceType: title,
  description: seoDescription,
  areaServed: 'ES',
  provider: {
    '@type': 'Person',
    name: 'Álvaro Artiel',
    url: siteUrl.toString(),
  },
}

const faqLd =
  faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: t(f.question, lang),
          acceptedAnswer: {'@type': 'Answer', text: t(f.answer, lang)},
        })),
      }
    : null

const jsonLdService = JSON.stringify(serviceLd).replace(/</g, '\\u003c')
const jsonLdFaq = faqLd ? JSON.stringify(faqLd).replace(/</g, '\\u003c') : null
---

<Base title={seoTitle} description={seoDescription} lang={lang} section="expertise">
  <script type="application/ld+json" slot="head" is:inline set:html={jsonLdService} />
  {jsonLdFaq && <script type="application/ld+json" slot="head" is:inline set:html={jsonLdFaq} />}

  <article class="svc-detail">
    <header class="svc-hero" data-reveal>
      <p class="svc-breadcrumb">
        <a href={pathFor('especialidades', lang)}>← {dict.nav_expertise}</a>
      </p>
      <h1>{title}</h1>
      {intro && <p class="svc-intro">{intro}</p>}
    </header>

    <section class="svc-body">
      <BodyBlocks blocks={body} />
    </section>

    {
      related.length > 0 && (
        <section class="svc-cases" data-reveal>
          <h2>{dict.expertise_cases}</h2>
          <ul class="svc-case-list">
            {related.map((project) => (
              <li>
                <a href={`${pathFor('proyectos', lang)}${project.slug.current}/`} data-cursor="view">
                  {project.cover && (
                    <img src={urlFor(project.cover, {w: 640, h: 400}).url()} alt="" width="640" height="400" loading="lazy" />
                  )}
                  <span class="svc-case-title">{t(project.title, lang)}</span>
                  {t(project.summary, lang) && <span class="svc-case-summary">{t(project.summary, lang)}</span>}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )
    }

    {
      faqs.length > 0 && (
        <section class="svc-faq" data-reveal>
          <h2>{dict.expertise_faq}</h2>
          {faqs.map((f) => (
            <details>
              <summary>{t(f.question, lang)}</summary>
              <p>{t(f.answer, lang)}</p>
            </details>
          ))}
        </section>
      )
    }

    <footer class="svc-cta" data-reveal>
      <a href={pathFor('contacto', lang)}>{dict.expertise_cta}</a>
    </footer>
  </article>
</Base>

<style>
  .svc-detail {
    padding: clamp(6rem, 16vh, 9rem) clamp(1.5rem, 6vw, 4rem) clamp(3rem, 8vh, 5rem);
    max-width: 70rem;
    margin-inline: auto;
  }

  .svc-breadcrumb {
    margin: 0 0 1.5rem;
  }
  .svc-breadcrumb a {
    font-family: var(--font-mono);
    font-size: var(--step-mono-label);
    color: var(--text-muted);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  .svc-breadcrumb a:hover {
    color: var(--accent);
  }

  .svc-hero h1 {
    font-family: var(--font-display);
    font-weight: 580;
    font-size: clamp(2.5rem, 7vw, 5.5rem);
    letter-spacing: -0.035em;
    line-height: 0.98;
    margin: 0 0 1.5rem;
    max-width: 16ch;
  }
  .svc-intro {
    font-size: clamp(1.1rem, 2vw, 1.4rem);
    line-height: 1.5;
    color: var(--text-muted);
    max-width: 52ch;
    margin: 0 0 clamp(2.5rem, 8vh, 4rem);
  }

  .svc-body {
    margin-bottom: clamp(3rem, 10vh, 5rem);
  }

  .svc-cases h2,
  .svc-faq h2 {
    font-family: var(--font-mono);
    font-size: var(--step-mono-label);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
    margin: 0 0 1.5rem;
  }

  .svc-case-list {
    list-style: none;
    margin: 0 0 clamp(3rem, 8vh, 5rem);
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    gap: 1.5rem;
  }
  .svc-case-list a {
    display: grid;
    gap: 0.6rem;
    text-decoration: none;
    color: var(--text);
  }
  .svc-case-list img {
    width: 100%;
    height: auto;
    border-radius: 6px;
  }
  .svc-case-title {
    font-family: var(--font-display);
    font-weight: 560;
    font-size: 1.15rem;
  }
  .svc-case-list a:hover .svc-case-title {
    color: var(--accent);
  }
  .svc-case-summary {
    color: var(--text-muted);
    font-size: var(--step-small);
    line-height: 1.5;
  }

  .svc-faq details {
    border-top: 1px solid color-mix(in srgb, var(--text-muted) 20%, transparent);
    padding-block: 1rem;
  }
  .svc-faq summary {
    cursor: pointer;
    font-weight: 600;
    font-size: 1.05rem;
  }
  .svc-faq details p {
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 65ch;
    margin: 0.75rem 0 0;
  }

  .svc-cta {
    margin-top: clamp(3rem, 8vh, 5rem);
    border-top: 1px solid color-mix(in srgb, var(--text-muted) 20%, transparent);
    padding-top: 2rem;
  }
  .svc-cta a {
    font-family: var(--font-display);
    font-weight: 580;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    letter-spacing: -0.02em;
    color: var(--text);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  .svc-cta a:hover {
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Páginas de ruta con getStaticPaths**

`web/src/pages/especialidades/[slug].astro`:

```astro
---
import ExpertiseDetail from '../../views/expertise-detail.astro'
import {getServices, getService} from '../../lib/queries'

export async function getStaticPaths() {
  const services = await getServices()
  return services.map((service) => ({params: {slug: service.slug.current}}))
}

const {slug} = Astro.params
const service = await getService(slug!)
if (!service) return Astro.redirect('/especialidades/')
---

<ExpertiseDetail lang="es" service={service} />
```

`web/src/pages/en/expertise/[slug].astro`:

```astro
---
import ExpertiseDetail from '../../../views/expertise-detail.astro'
import {getServices, getService} from '../../../lib/queries'

export async function getStaticPaths() {
  const services = await getServices()
  return services.map((service) => ({params: {slug: service.slug.current}}))
}

const {slug} = Astro.params
const service = await getService(slug!)
if (!service) return Astro.redirect('/en/expertise/')
---

<ExpertiseDetail lang="en" service={service} />
```

- [ ] **Step 3: Verificar build y JSON-LD**

Run: `cd web && npx astro check && npx astro build`
Expected: build OK con 6 páginas nuevas de detalle (3 slugs × 2 idiomas).

Run: `grep -o '"@type":"Service"' web/dist/especialidades/gamificacion/index.html && grep -o '"@type":"FAQPage"' web/dist/especialidades/gamificacion/index.html`
Expected: ambas cadenas presentes.

Run: `grep -c 'especialidades' web/dist/sitemap-0.xml`
Expected: ≥ 4 (hub + 3 landings ES).

- [ ] **Step 4: Commit**

```bash
git add web/src/views/expertise-detail.astro web/src/pages/especialidades/[slug].astro "web/src/pages/en/expertise/[slug].astro"
git commit -m "feat(especialidades): landings con JSON-LD Service y FAQPage"
```

---

### Task 7: Navegación — menú, footer y CTA de la home

**Files:**
- Modify: `web/src/components/MenuOverlay.astro:15-22`
- Modify: `web/src/components/Footer.astro:17-24`
- Modify: `web/src/components/home/CtaBand.astro`

**Interfaces:**
- Consumes: clave de ruta `especialidades` y dict `nav_expertise` (Task 4).

- [ ] **Step 1: Item en el overlay del menú**

En `web/src/components/MenuOverlay.astro`, el array `items` pasa a (nuevo item primero — es la puerta comercial):

```typescript
const items: {key: string; label: string; accent: string; keyword: string}[] = [
  {key: 'especialidades', label: dict.nav_expertise, accent: '#FFC53D', keyword: lang === 'en' ? 'how I can help' : 'en qué ayudo'},
  {key: 'proyectos', label: dict.nav_projects, accent: '#5B8CFF', keyword: lang === 'en' ? 'what I build' : 'lo que construyo'},
  {key: 'experiencia', label: dict.nav_experience, accent: '#B06CFF', keyword: lang === 'en' ? 'the journey' : 'el viaje'},
  {key: 'personal', label: dict.nav_personal, accent: '#FF7847', keyword: lang === 'en' ? 'the person' : 'la persona'},
  {key: 'blog', label: dict.nav_blog, accent: '#4FD1C5', keyword: lang === 'en' ? 'what I think' : 'lo que pienso'},
  {key: 'cv', label: dict.nav_cv, accent: '#F4F4F0', keyword: lang === 'en' ? 'the hurry version' : 'para leer con prisa'},
  {key: 'contacto', label: dict.nav_contact, accent: '#D4FF3F', keyword: lang === 'en' ? 'let’s talk' : 'hablemos'},
]
```

- [ ] **Step 2: Item en el footer**

En `web/src/components/Footer.astro`, `navItems` pasa a:

```typescript
const navItems: {key: string; label: string}[] = [
  {key: 'especialidades', label: dict.nav_expertise},
  {key: 'proyectos', label: dict.nav_projects},
  {key: 'experiencia', label: dict.nav_experience},
  {key: 'personal', label: dict.nav_personal},
  {key: 'blog', label: dict.nav_blog},
  {key: 'cv', label: dict.nav_cv},
  {key: 'contacto', label: dict.nav_contact},
]
```

- [ ] **Step 3: Enlace secundario en el CtaBand**

En `web/src/components/home/CtaBand.astro`, bajo el `<a class="cta-link">` (dentro de la misma `<section>`):

```astro
  <p class="cta-secondary">
    <a href={pathFor('especialidades', lang)}>
      {lang === 'en' ? 'or see how I can help →' : 'o mira en qué puedo ayudarte →'}
    </a>
  </p>
```

Y en el `<style>` del componente:

```css
  .cta-secondary {
    margin: 1.25rem 0 0;
  }
  .cta-secondary a {
    font-family: var(--font-mono);
    font-size: var(--step-mono-label);
    color: var(--text-muted);
    text-decoration: none;
    transition: color var(--transition-fast);
  }
  .cta-secondary a:hover {
    color: var(--accent);
  }
```

- [ ] **Step 4: Verificar**

Run: `cd web && npx astro build`
Expected: build OK.

Run: `grep -c 'especialidades' web/dist/index.html`
Expected: ≥ 2 (menú + CTA + footer).

- [ ] **Step 5: Commit**

```bash
git add web/src/components/MenuOverlay.astro web/src/components/Footer.astro web/src/components/home/CtaBand.astro
git commit -m "feat(nav): especialidades en menu, footer y CTA de la home"
```

---

### Task 8: Enlace inverso proyecto → especialidad

**Files:**
- Modify: `web/src/views/project-detail.astro`

**Interfaces:**
- Consumes: `getServiceForProject(projectId)` (Task 3), dict `expertise_case_of` (Task 4).

- [ ] **Step 1: Consultar la especialidad y renderizar el enlace**

En el frontmatter de `web/src/views/project-detail.astro`, añadir a los imports:

```typescript
import {getServiceForProject} from '../lib/queries'
```

y tras `const category = ...`:

```typescript
// Enlace inverso al hub SEO: la especialidad que referencia este proyecto.
const service = await getServiceForProject(project._id)
```

En el `<footer class="pd-footer">`, tras el bloque de `project.externalUrl`:

```astro
      {
        service && (
          <p class="pd-service">
            {dict.expertise_case_of}{' '}
            <a href={`${pathFor('especialidades', lang)}${service.slug.current}/`}>{t(service.title, lang)}</a>
          </p>
        )
      }
```

Y en el `<style>`:

```css
  .pd-service {
    font-family: var(--font-mono);
    font-size: var(--step-small);
    color: var(--text-muted);
    margin: 0;
    width: 100%;
  }
  .pd-service a {
    color: var(--text);
    border-bottom: 1px solid var(--accent);
    text-decoration: none;
    padding-bottom: 0.15em;
  }
  .pd-service a:hover {
    color: var(--accent);
  }
```

- [ ] **Step 2: Verificar**

Run: `cd web && npx astro build`
Expected: build OK.

Run: `grep -o 'especialidades/gamificacion' web/dist/proyectos/ranquea/index.html`
Expected: al menos una coincidencia (Ranquea está referenciado por la especialidad de gamificación).

- [ ] **Step 3: Commit**

```bash
git add web/src/views/project-detail.astro
git commit -m "feat(proyectos): enlace inverso a la especialidad que referencia el caso"
```

---

### Task 9: SEO de la home — knowsAbout y fallback del título

**Files:**
- Modify: `web/src/views/home.astro:28-59`

**Interfaces:**
- Consumes: nada nuevo (el retitulado real ya llegó vía patch de siteSettings en Task 2; aquí se alinean los fallbacks de código).

- [ ] **Step 1: Actualizar fallbacks y knowsAbout**

En `web/src/views/home.astro`, el fallback del título y descripción pasa a:

```typescript
const title = t(settings?.seoTitle, lang) ||
  (lang === 'en'
    ? 'Álvaro Artiel — Product design consulting, gamification & digital project management'
    : 'Álvaro Artiel — Consultoría de diseño de producto, gamificación y gestión de proyectos digitales')
const description = t(settings?.seoDescription, lang) ||
  (lang === 'en'
    ? 'Digital product consultant: end-to-end product design, gamification and digital project management.'
    : 'Consultor de producto digital: diseño de producto, gamificación y gestión de proyectos digitales de punta a punta.')
```

Y `knowsAbout` en `personLd` pasa a:

```typescript
  knowsAbout: [
    'Gamification',
    'Gamificación',
    'Product Design',
    'Consultoría de diseño de producto',
    'Gestión de proyectos digitales',
    'Product Management',
    'UX/UI Design',
    'E-learning',
    'SaaS',
  ],
```

- [ ] **Step 2: Verificar**

Run: `cd web && npx astro build`
Expected: build OK.

Run: `grep -o 'Consultoría de diseño de producto' web/dist/index.html`
Expected: presente (en el title vía Sanity o fallback, y en el JSON-LD).

- [ ] **Step 3: Commit**

```bash
git add web/src/views/home.astro
git commit -m "feat(seo): la home declara la consultoria en title, description y knowsAbout"
```

---

### Task 10: Verificación final end-to-end

**Files:** ninguno (solo verificación).

- [ ] **Step 1: Build completo limpio**

Run: `cd web && npx astro build`
Expected: sin errores.

- [ ] **Step 2: Sitemap**

Run: `grep -o 'especialidades[a-z/-]*' web/dist/sitemap-0.xml | sort -u` y `grep -o 'en/expertise[a-z/-]*' web/dist/sitemap-0.xml | sort -u`
Expected: hub + 3 slugs en ambos idiomas (8 URLs nuevas en total).

- [ ] **Step 3: Metadatos de cada landing**

Run: `grep -o '<title>[^<]*</title>' web/dist/especialidades/*/index.html`
Expected: cada landing con su seoTitle único (contienen "Consultoría"/"consultor").

- [ ] **Step 4: JSON-LD válido**

Extraer los bloques `application/ld+json` de `web/dist/especialidades/gamificacion/index.html` y validarlos como JSON:

Run: `node -e "const html=require('fs').readFileSync('web/dist/especialidades/gamificacion/index.html','utf8');const m=[...html.matchAll(/<script type=\"application\/ld\+json\">(.*?)<\/script>/gs)];m.forEach(x=>JSON.parse(x[1]));console.log(m.length+' JSON-LD blocks OK')"`
Expected: `2 JSON-LD blocks OK` (Service + FAQPage).

- [ ] **Step 5: Revisión visual**

Levantar `astro dev --background` y revisar en el navegador: `/especialidades/`, una landing, el menú, el footer, y la ficha de un proyecto con enlace inverso. Comprobar acento ámbar y que el hero no rompe en móvil (device toolbar).

- [ ] **Step 6: Validación externa (manual, post-deploy)**

Tras desplegar: pasar una landing por https://validator.schema.org/ y https://search.google.com/test/rich-results, y enviar el sitemap actualizado en Google Search Console.
