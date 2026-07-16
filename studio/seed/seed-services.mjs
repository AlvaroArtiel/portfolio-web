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
