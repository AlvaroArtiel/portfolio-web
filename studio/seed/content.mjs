// Seed content for alvaroartiel.com — condensed from the design spec
// (docs/superpowers/specs/2026-07-10-portfolio-web-design.md, §9 and §3.3)
// and the LinkedIn-derived career material referenced there.
//
// Voice (§3.3): close and direct Spanish, measured humor, sober in
// project sheets and CV-adjacent content. English copy is a natural
// translation, not literal.

let keyCounter = 0
function key() {
  keyCounter += 1
  return `k${keyCounter.toString(36)}${Date.now().toString(36)}`
}

/** Builds a Portable Text paragraph block for a localeBlock/body field. */
function block(text) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    children: [{_type: 'span', _key: key(), text, marks: []}],
    markDefs: [],
  }
}

/** Builds the {es:[blocks], en:[blocks]} shape for `project.body` / `blogPost.body`. */
function bodyOf(esParagraphs, enParagraphs) {
  return {
    es: esParagraphs.map(block),
    en: enParagraphs.map(block),
  }
}

// ---------------------------------------------------------------------------
// Experience (7)
// ---------------------------------------------------------------------------

export const EXPERIENCE = [
  {
    id: 'experience-tentuplaza',
    company: {es: 'TenTuPlaza', en: 'TenTuPlaza'},
    role: {es: 'Product & Digital Lead', en: 'Product & Digital Lead'},
    type: 'fulltime',
    startDate: '2024',
    endDate: '',
    location: {es: 'Málaga, España', en: 'Málaga, Spain'},
    modality: {es: 'Híbrido', en: 'Hybrid'},
    summary: {
      es: 'Lidero la estrategia digital y de producto de TenTuPlaza, academia online de oposiciones ferroviarias con más de 5.000 alumnos: nueva plataforma e-learning a medida, UX/UI, coordinación de equipos y marketing.',
      en: 'I lead digital and product strategy at TenTuPlaza, an online academy for railway public-exam preparation with 5,000+ students: a new custom e-learning platform, UX/UI, team coordination and marketing.',
    },
    bullets: [
      {
        es: 'Dirijo el diseño y desarrollo de la nueva plataforma e-learning a medida (ver ficha de proyecto).',
        en: 'I direct the design and development of the new custom e-learning platform (see project sheet).',
      },
      {
        es: 'Defino la estrategia digital y de producto de la academia, del UX/UI al marketing.',
        en: 'I define the academy’s digital and product strategy, from UX/UI to marketing.',
      },
      {
        es: 'Coordino los equipos de diseño y desarrollo, de discovery a entrega.',
        en: 'I coordinate the design and development teams, from discovery to delivery.',
      },
      {
        es: 'Más de 5.000 alumnos y más de 770 reseñas de 5★ avalan la academia.',
        en: 'Over 5,000 students and 770+ five-star reviews back the academy.',
      },
    ],
    order: 1,
    visible: true,
  },
  {
    id: 'experience-ceustack',
    company: {es: 'Ceustack', en: 'Ceustack'},
    role: {es: 'Co-fundador & Product Lead', en: 'Co-founder & Product Lead'},
    type: 'founder',
    startDate: '2024',
    endDate: '',
    location: {es: 'Málaga, España (remoto)', en: 'Málaga, Spain (remote)'},
    modality: {es: 'Remoto', en: 'Remote'},
    summary: {
      es: 'Co-fundé Ceustack para diseñar y construir productos propios de principio a fin: Ranquea, UltraCarta y Vaultz nacen aquí, desde la idea hasta el pixel y el código.',
      en: 'I co-founded Ceustack to design and build our own products end to end: Ranquea, UltraCarta and Vaultz all started here, from the idea to the pixel and the code.',
    },
    bullets: [
      {
        es: 'Defino producto, marca y experiencia de cada iniciativa propia.',
        en: 'I define product, brand and experience for each in-house initiative.',
      },
      {
        es: 'Reparto el tiempo entre estrategia, diseño de interfaz y decisiones técnicas de alto nivel.',
        en: 'I split my time between strategy, interface design and high-level technical decisions.',
      },
    ],
    order: 2,
    visible: true,
  },
  {
    id: 'experience-consultor-independiente',
    company: {es: 'Consultor independiente', en: 'Independent consultant'},
    role: {es: 'Product Design & UX/UI', en: 'Product Design & UX/UI'},
    type: 'freelance',
    startDate: '2024',
    endDate: '',
    location: {es: 'Remoto', en: 'Remote'},
    modality: {es: 'Freelance', en: 'Freelance'},
    summary: {
      es: 'Más de 40 proyectos de diseño de producto y UX/UI para agencias y clientes directos, entre ellos BoxDigital, Okawa y Lalalastudio. Cada encargo, del brief a los entregables listos para desarrollo.',
      en: 'More than 40 product design and UX/UI projects for agencies and direct clients, including BoxDigital, Okawa and Lalalastudio. Every engagement, from the brief to development-ready deliverables.',
    },
    bullets: [
      {
        es: '+40 proyectos entregados para agencias y marcas (BoxDigital, Okawa, Lalalastudio, entre otros).',
        en: '40+ projects delivered for agencies and brands (BoxDigital, Okawa, Lalalastudio, among others).',
      },
      {
        es: 'Investigación, wireframes, UI y sistemas de diseño según el alcance de cada proyecto.',
        en: 'Research, wireframes, UI and design systems depending on each project’s scope.',
      },
      {
        es: 'Trabajo directo con equipos de desarrollo para asegurar que el diseño llega intacto a producción.',
        en: 'Direct work with development teams to make sure the design reaches production intact.',
      },
    ],
    order: 3,
    visible: true,
  },
  {
    id: 'experience-esperando-render',
    company: {es: 'Esperando el Render', en: 'Esperando el Render'},
    role: {es: 'Consultor web & producto e-learning', en: 'Web & e-learning product consultant'},
    type: 'freelance',
    startDate: '2024',
    endDate: '',
    location: {es: 'Remoto', en: 'Remote'},
    modality: {es: 'Freelance', en: 'Freelance'},
    summary: {
      es: 'Consultoría web y de producto para Esperando el Render, academia de formación online para profesionales creativos: mantenimiento de la plataforma, optimización y páginas comerciales para el lanzamiento de nuevos cursos.',
      en: 'Web and product consulting for Esperando el Render, an online training academy for creative professionals: platform maintenance, optimization and commercial pages for new course launches.',
    },
    bullets: [
      {
        es: 'Mantengo y optimizo la plataforma web de la academia.',
        en: 'I maintain and optimize the academy’s web platform.',
      },
      {
        es: 'Diseño y desarrollo páginas comerciales para el lanzamiento de cada curso.',
        en: 'I design and build commercial pages for each course launch.',
      },
      {
        es: 'Coordino aspectos técnicos y de producto del catálogo de cursos online.',
        en: 'I coordinate technical and product aspects of the online course catalog.',
      },
    ],
    order: 4,
    visible: true,
  },
  {
    id: 'experience-auraprods',
    company: {es: 'AuraProds', en: 'AuraProds'},
    role: {es: 'Product Designer', en: 'Product Designer'},
    type: 'fulltime',
    startDate: '11/2024',
    endDate: '01/2026',
    location: {es: 'Málaga, España', en: 'Málaga, Spain'},
    modality: {es: 'Híbrido', en: 'Hybrid'},
    summary: {
      es: 'Diseño de producto para el campus de e-learning de AuraProds: de la arquitectura de la experiencia de aprendizaje a los componentes de interfaz que la sostienen.',
      en: 'Product design for AuraProds’ e-learning campus: from the learning-experience architecture to the interface components that support it.',
    },
    bullets: [
      {
        es: 'Diseñé el campus de formación online desde cero (ver ficha de proyecto).',
        en: 'I designed the online training campus from scratch (see project sheet).',
      },
      {
        es: 'Definí patrones de interfaz reutilizables para cursos, progreso y certificación.',
        en: 'I defined reusable interface patterns for courses, progress and certification.',
      },
      {
        es: 'Colaboré con los equipos de contenidos y desarrollo durante el proceso de lanzamiento.',
        en: 'I collaborated with the content and development teams during the launch process.',
      },
    ],
    order: 5,
    visible: true,
  },
  {
    id: 'experience-iurban',
    company: {es: 'iUrban', en: 'iUrban'},
    role: {es: 'UX/UI Designer', en: 'UX/UI Designer'},
    type: 'fulltime',
    startDate: '09/2023',
    endDate: '10/2024',
    location: {es: 'Málaga, España', en: 'Málaga, Spain'},
    modality: {es: 'Presencial', en: 'On-site'},
    summary: {
      es: 'Diseño del CRM interno de iUrban y del design system que lo unifica: de pantallas dispersas a un lenguaje visual y de interacción consistente.',
      en: 'Design of iUrban’s internal CRM and the design system that unifies it: from scattered screens to a consistent visual and interaction language.',
    },
    bullets: [
      {
        es: 'Rediseñé el CRM interno (ver ficha de proyecto).',
        en: 'I redesigned the internal CRM (see project sheet).',
      },
      {
        es: 'Construí un design system con componentes documentados para acelerar iteraciones futuras.',
        en: 'I built a design system with documented components to speed up future iterations.',
      },
    ],
    order: 6,
    visible: true,
  },
  {
    id: 'experience-8pecados',
    company: {es: '8 Pecados', en: '8 Pecados'},
    role: {es: 'Diseñador gráfico y web', en: 'Graphic & web designer'},
    type: 'fulltime',
    startDate: '11/2018',
    endDate: '12/2019',
    location: {es: 'Málaga, España', en: 'Málaga, Spain'},
    modality: {es: 'Presencial', en: 'On-site'},
    summary: {
      es: 'Mis primeros pasos profesionales: diseño gráfico y web para clientes locales, donde aprendí a defender una idea de diseño frente a un cliente real y un plazo real.',
      en: 'My first professional steps: graphic and web design for local clients, where I learned to defend a design idea in front of a real client and a real deadline.',
    },
    bullets: [
      {
        es: 'Diseño de identidad, piezas gráficas y webs a medida para pequeños negocios.',
        en: 'Identity design, graphic pieces and custom websites for small businesses.',
      },
      {
        es: 'Primer contacto con el ciclo completo cliente–diseño–entrega.',
        en: 'First contact with the full client–design–delivery cycle.',
      },
    ],
    order: 7,
    visible: true,
  },
]

// ---------------------------------------------------------------------------
// Education (6)
// ---------------------------------------------------------------------------

export const EDUCATION = [
  {
    id: 'education-uma',
    school: {es: 'Universidad de Málaga (UMA)', en: 'University of Málaga (UMA)'},
    degree: {es: 'Grado en Ingeniería Informática', en: 'BSc in Computer Engineering'},
    startDate: '2015',
    endDate: '2019',
    award: {es: '', en: ''},
    description: {
      es: 'Base técnica en desarrollo de software que más tarde reorienté hacia el diseño de producto y la experiencia de usuario.',
      en: 'Technical foundation in software development that I later steered towards product design and user experience.',
    },
    order: 1,
    visible: true,
  },
  {
    id: 'education-master-gauss',
    school: {es: 'Escuela Gauss', en: 'Gauss School'},
    degree: {
      es: 'Máster en UX/UI y Programación Web',
      en: 'Master’s in UX/UI and Web Programming',
    },
    startDate: '2022',
    endDate: '2023',
    award: {es: 'Premio Proyecto del Año Web Gauss', en: 'Gauss Web Project of the Year Award'},
    description: {
      es: 'Formación intensiva que combina diseño de interfaz, investigación de usuarios y desarrollo front-end. El proyecto final recibió el Premio Proyecto del Año.',
      en: 'Intensive program combining interface design, user research and front-end development. The final project received the Project of the Year award.',
    },
    order: 2,
    visible: true,
  },
  {
    id: 'education-especialista-gauss',
    school: {es: 'Escuela Gauss', en: 'Gauss School'},
    degree: {es: 'Especialista en UX/UI', en: 'UX/UI Specialist'},
    startDate: '2023',
    endDate: '2024',
    award: {es: '', en: ''},
    description: {
      es: 'Profundización en metodologías de investigación, prototipado y testing con usuarios.',
      en: 'Deep dive into research methodologies, prototyping and user testing.',
    },
    order: 3,
    visible: true,
  },
  {
    id: 'education-esic',
    school: {es: 'ESIC Business & Marketing School', en: 'ESIC Business & Marketing School'},
    degree: {es: 'Especialista en SEO & SEM', en: 'SEO & SEM Specialist'},
    startDate: '2020',
    endDate: '2020',
    award: {es: '', en: ''},
    description: {
      es: 'Fundamentos de posicionamiento orgánico y de pago aplicados a producto digital.',
      en: 'Fundamentals of organic and paid search applied to digital product.',
    },
    order: 4,
    visible: true,
  },
  {
    id: 'education-freecodecamp',
    school: {es: 'freeCodeCamp', en: 'freeCodeCamp'},
    degree: {
      es: 'Certificaciones de desarrollo web',
      en: 'Web development certifications',
    },
    startDate: '2024',
    endDate: '2025',
    award: {es: '', en: ''},
    description: {
      es: 'Formación autodidacta continua para mantener el criterio técnico al día con el diseño.',
      en: 'Ongoing self-directed training to keep technical judgment current alongside design.',
    },
    order: 5,
    visible: true,
  },
  {
    id: 'education-devtalles',
    school: {es: 'DevTalles', en: 'DevTalles'},
    degree: {
      es: 'Formación continua en desarrollo web',
      en: 'Ongoing web development training',
    },
    startDate: '2025',
    endDate: '',
    award: {es: '', en: ''},
    description: {
      es: 'Cursos en curso sobre frameworks y buenas prácticas modernas de desarrollo.',
      en: 'Ongoing courses on modern frameworks and development best practices.',
    },
    order: 6,
    visible: true,
  },
]

// ---------------------------------------------------------------------------
// Projects (10)
// ---------------------------------------------------------------------------

export const PROJECTS = [
  {
    id: 'project-ranquea',
    title: {es: 'Ranquea', en: 'Ranquea'},
    category: 'propio',
    featured: true,
    year: '2025',
    role: {es: 'Product Lead & Diseño', en: 'Product Lead & Design'},
    stack: ['Figma', 'Astro', 'Node.js'],
    summary: {
      es: 'Plataforma propia de Ceustack para crear y compartir rankings colaborativos, con un diseño pensado para que decidir en grupo sea rápido y hasta divertido.',
      en: 'Ceustack’s in-house platform for building and sharing collaborative rankings, designed to make deciding as a group fast and even fun.',
    },
    heroMediaCount: 2,
    order: 1,
    nextProjectId: 'project-ultracarta',
    externalUrl: '',
    body: bodyOf(
      [
        'Ranquea es la plataforma de Ceustack para crear y compartir rankings colaborativos: crear un ranking y votarlo debería ser cuestión de segundos, no de configurar una herramienta compleja.',
        'Como Product Lead, defino producto y diseño de interfaz, cuidando que la experiencia se mantenga simple para uso ocasional y con suficiente profundidad para equipos que la usan con frecuencia.',
        'Sigue en desarrollo activo desde Ceustack.',
      ],
      [
        'Ranquea is Ceustack’s platform for creating and sharing collaborative rankings: creating a ranking and voting on it should take seconds, not require configuring a complex tool.',
        'As Product Lead, I define the product and interface design, keeping the experience simple enough for occasional use while giving it enough depth for teams that use it frequently.',
        'It’s under active development at Ceustack.',
      ],
    ),
  },
  {
    id: 'project-ultracarta',
    title: {es: 'UltraCarta', en: 'UltraCarta'},
    category: 'propio',
    featured: true,
    year: '2025',
    role: {es: 'Product Lead & Diseño', en: 'Product Lead & Design'},
    stack: ['Figma', 'React', 'Node.js'],
    summary: {
      es: 'Herramienta de Ceustack para diseñar cartas de restaurante digitales que se actualizan al momento, sin depender de imprimir de nuevo cada vez que cambia un plato.',
      en: 'Ceustack’s tool for designing digital restaurant menus that update instantly, without reprinting every time a dish changes.',
    },
    heroMediaCount: 2,
    order: 2,
    nextProjectId: 'project-tentuplaza-plataforma',
    externalUrl: '',
    body: bodyOf(
      [
        'UltraCarta es la herramienta de Ceustack para diseñar cartas de restaurante digitales que se actualizan al instante, sin depender de reimprimir cada vez que cambia un plato o un precio.',
        'Como Product Lead, diseñé el editor para el dueño del restaurante —sencillo de usar sin formación previa, y flexible para adaptarse a cartas distintas, de menú del día a carta de vinos— y el lado del cliente final, pensado para leerse bien en cualquier móvil.',
        'UltraCarta se mantiene como producto propio de Ceustack.',
      ],
      [
        'UltraCarta is Ceustack’s tool for designing digital restaurant menus that update instantly, without needing to reprint every time a dish or price changes.',
        'As Product Lead, I designed the editor for restaurant owners —simple enough to use without training, and flexible enough to handle different menus, from daily specials to wine lists— along with the customer-facing side, built to read well on any phone.',
        'UltraCarta remains a Ceustack in-house product.',
      ],
    ),
  },
  {
    id: 'project-tentuplaza-plataforma',
    title: {es: 'Plataforma TenTuPlaza', en: 'TenTuPlaza Platform'},
    category: 'cliente',
    featured: true,
    year: '2025',
    role: {es: 'Product & Digital Lead', en: 'Product & Digital Lead'},
    stack: ['Figma', 'Astro', 'Node.js'],
    summary: {
      es: 'La nueva plataforma e-learning a medida de TenTuPlaza, academia online de oposiciones ferroviarias con más de 5.000 alumnos — actualmente en construcción, con nuevas piezas publicándose por fases.',
      en: 'TenTuPlaza’s new custom e-learning platform — the online academy for railway public-exam preparation with 5,000+ students. Currently in construction, with new pieces shipping in phases.',
    },
    heroMediaCount: 2,
    order: 3,
    nextProjectId: 'project-vaultz',
    externalUrl: '',
    body: bodyOf(
      [
        'Como Product & Digital Lead de TenTuPlaza dirijo el diseño y desarrollo de la nueva plataforma e-learning a medida: la casa digital donde más de 5.000 alumnos preparan sus oposiciones ferroviarias.',
        'El proyecto avanza por fases: cada entrega prioriza el módulo con más impacto inmediato para alumnos y equipo docente, evitando el clásico "todo a la vez" que nunca termina de lanzar.',
        'Esta ficha se actualizará según avance la construcción — de momento documenta el enfoque de producto y las primeras piezas visibles.',
      ],
      [
        'As TenTuPlaza’s Product & Digital Lead I direct the design and development of the new custom e-learning platform: the digital home where 5,000+ students prepare for their railway public exams.',
        'The project moves forward in phases: each release prioritizes the module with the most immediate impact for students and teaching staff, avoiding the classic "build everything at once" trap that never quite ships.',
        'This sheet will be updated as construction progresses — for now it documents the product approach and the first visible pieces.',
      ],
    ),
  },
  {
    id: 'project-vaultz',
    title: {es: 'Vaultz', en: 'Vaultz'},
    category: 'propio',
    featured: true,
    year: '2025',
    role: {es: 'Product Lead & Diseño', en: 'Product Lead & Design'},
    stack: ['Figma', 'React', 'Node.js'],
    summary: {
      es: 'Producto propio de Ceustack para organizar y proteger información sensible en equipo, con un diseño que prioriza la confianza sin sacrificar la simplicidad.',
      en: 'Ceustack’s in-house product for organizing and protecting sensitive information as a team, designed to prioritize trust without sacrificing simplicity.',
    },
    heroMediaCount: 2,
    order: 4,
    nextProjectId: 'project-watcheers',
    externalUrl: '',
    body: bodyOf(
      [
        'Vaultz resuelve un problema incómodo de cualquier equipo: dónde guardar credenciales, contratos y datos sensibles sin recurrir a hojas de cálculo compartidas por email.',
        'Diseñé la experiencia alrededor de la confianza: cada acción sensible (compartir, revocar, exportar) se comunica con claridad visual y confirmaciones explícitas, sin volverse tedioso.',
        'El reto visual fue transmitir seguridad sin caer en la estética fría de "sala de servidores": Vaultz usa el mismo lenguaje cálido y directo del resto de productos de Ceustack. Actualmente en desarrollo en Ceustack.',
      ],
      [
        'Vaultz solves an uncomfortable problem every team has: where to keep credentials, contracts and sensitive data without falling back on spreadsheets shared over email.',
        'I designed the experience around trust: every sensitive action (share, revoke, export) is communicated with clear visual language and explicit confirmations, without becoming tedious.',
        'The visual challenge was to convey security without the cold "server room" aesthetic: Vaultz shares the same warm, direct language as the rest of Ceustack’s products. Currently in development at Ceustack.',
      ],
    ),
  },
  {
    id: 'project-watcheers',
    title: {es: 'Watcheers', en: 'Watcheers'},
    category: 'cliente',
    featured: false,
    year: '2024',
    role: {es: 'UX/UI Designer (freelance)', en: 'UX/UI Designer (freelance)'},
    stack: ['Figma', 'Design System'],
    summary: {
      es: 'Diseño de producto para Watcheers como consultor independiente: investigación, flujos y UI de una plataforma social en torno al consumo de contenido audiovisual.',
      en: 'Product design for Watcheers as an independent consultant: research, flows and UI for a social platform centered on watching content together.',
    },
    heroMediaCount: 2,
    order: 5,
    nextProjectId: 'project-benext',
    externalUrl: '',
    body: bodyOf(
      [
        'Watcheers llegó a mí a través de mi trabajo como consultor independiente, con una necesidad clara: convertir una idea social en torno al consumo audiovisual en una interfaz coherente y usable.',
        'Trabajé la arquitectura de la información desde cero, priorizando los flujos con más fricción para la persona usuaria.',
        'El resultado fue un sistema de componentes reutilizable, documentado para que el equipo de desarrollo pudiera implementarlo sin ambigüedades.',
      ],
      [
        'Watcheers came to me through my work as an independent consultant, with a clear need: turn a social idea around watching content together into a coherent, usable interface.',
        'I worked the information architecture from scratch, prioritizing the flows with the most friction for the user.',
        'The result was a reusable component system, documented so the development team could implement it without ambiguity.',
      ],
    ),
  },
  {
    id: 'project-benext',
    title: {es: 'BeNext', en: 'BeNext'},
    category: 'cliente',
    featured: false,
    year: '2024',
    role: {es: 'UX/UI Designer (freelance)', en: 'UX/UI Designer (freelance)'},
    stack: ['Figma', 'Prototyping'],
    summary: {
      es: 'Diseño UX/UI para BeNext, encargo dentro de mi actividad como consultor independiente centrado en clarificar un producto con demasiadas ideas compitiendo por espacio.',
      en: 'UX/UI design for BeNext, an engagement within my independent consulting work focused on clarifying a product with too many ideas competing for space.',
    },
    heroMediaCount: 2,
    order: 6,
    nextProjectId: 'project-campus-auraprods',
    externalUrl: '',
    body: bodyOf(
      [
        'BeNext llegó con un problema habitual: mucho potencial, demasiadas funciones compitiendo por la pantalla principal. Mi trabajo fue de poda tanto como de diseño.',
        'Prioricé qué resolver primero, y diseñé un flujo principal claro antes de expandir a funciones secundarias.',
        'El resultado fue una interfaz más simple que la versión inicial, y más fácil de mantener a medida que el producto creciera.',
      ],
      [
        'BeNext arrived with a familiar problem: plenty of potential, too many features competing for the main screen. My job was as much about pruning as about designing.',
        'I prioritized what to solve first, and designed a clear primary flow before expanding into secondary features.',
        'The result was a simpler interface than the initial version, and easier to maintain as the product grew.',
      ],
    ),
  },
  {
    id: 'project-campus-auraprods',
    title: {es: 'Campus AuraProds', en: 'AuraProds Campus'},
    category: 'cliente',
    featured: false,
    year: '2025',
    role: {es: 'Product Designer', en: 'Product Designer'},
    stack: ['Figma', 'Design System', 'E-learning'],
    summary: {
      es: 'Diseño del campus de e-learning de AuraProds, desde la arquitectura de la experiencia de aprendizaje hasta los componentes de interfaz reutilizables.',
      en: 'Design of AuraProds’ e-learning campus, from the learning-experience architecture to reusable interface components.',
    },
    heroMediaCount: 2,
    order: 7,
    nextProjectId: 'project-crm-iurban',
    externalUrl: '',
    body: bodyOf(
      [
        'El campus de AuraProds necesitaba transmitir progreso y logro sin recurrir a la estética genérica de "curso online". Diseñé un sistema donde avanzar en un curso se siente como avanzar, no solo como marcar casillas.',
        'Definí patrones reutilizables para lecciones, evaluaciones y certificación, pensados para escalar a nuevos cursos sin rediseñar cada vez.',
        'Trabajé con el equipo de contenidos para que el diseño respondiera a cómo se produce y consume el material real, no a una maqueta abstracta. El campus quedó en producción sobre esta base de componentes.',
      ],
      [
        'The AuraProds campus needed to convey progress and achievement without falling into generic "online course" aesthetics. I designed a system where moving through a course feels like moving forward, not just checking boxes.',
        'I defined reusable patterns for lessons, assessments and certification, built to scale to new courses without redesigning each time.',
        'I worked with the content team so the design responded to how the real material is produced and consumed, not to an abstract mockup. The campus went into production on this component base.',
      ],
    ),
  },
  {
    id: 'project-crm-iurban',
    title: {es: 'CRM iUrban', en: 'iUrban CRM'},
    category: 'cliente',
    featured: false,
    year: '2024',
    role: {es: 'UX/UI Designer', en: 'UX/UI Designer'},
    stack: ['Figma', 'Design System'],
    summary: {
      es: 'Rediseño del CRM interno de iUrban y creación de un design system que unifica pantallas usadas a diario por los equipos comerciales.',
      en: 'Redesign of iUrban’s internal CRM and creation of a design system unifying screens used daily by sales teams.',
    },
    heroMediaCount: 2,
    order: 8,
    nextProjectId: 'project-fotografia',
    externalUrl: '',
    body: bodyOf(
      [
        'El CRM interno de iUrban había crecido a base de parches, con pantallas dispersas y sin una interfaz unificada. Empecé por revisar los flujos existentes antes de tocar una sola pantalla.',
        'A partir de esa revisión, diseñé un design system con componentes documentados que unificó la interfaz sin obligar a rehacer toda la aplicación de golpe.',
        'Apliqué el nuevo sistema priorizando las pantallas de mayor uso.',
      ],
      [
        'iUrban’s internal CRM had grown patch by patch, with scattered screens and no unified interface. I started by reviewing the existing flows before touching a single screen.',
        'From that review, I designed a design system with documented components that unified the interface without forcing a full rebuild at once.',
        'I applied the new system prioritizing the highest-use screens.',
      ],
    ),
  },
  {
    id: 'project-fotografia',
    title: {es: 'Web de fotografía', en: 'Photography site'},
    category: 'personal',
    featured: false,
    year: '2025',
    role: {es: 'Diseño & desarrollo', en: 'Design & development'},
    stack: ['Astro', 'Fotografía'],
    summary: {
      es: 'Mi propio espacio para publicar fotografía personal, con un diseño minimal que deja que las imágenes hablen. Disponible en fotografia.alvaroartiel.com.',
      en: 'My own space to publish personal photography, with a minimal design that lets the images speak. Available at fotografia.alvaroartiel.com.',
    },
    heroMediaCount: 2,
    order: 9,
    nextProjectId: 'project-controlfacturacion',
    externalUrl: 'https://fotografia.alvaroartiel.com',
    body: bodyOf(
      [
        'Fuera del trabajo por encargo, la fotografía es donde diseño sin brief. Esta web es el resultado: un espacio propio, minimal, donde las imágenes son las protagonistas absolutas.',
        'El diseño evita cualquier distracción: tipografía discreta, navegación mínima y foco total en la imagen a máxima calidad posible.',
        'Se actualiza según voy disparando, sin calendario editorial — el ritmo lo marca la cámara, no el proyecto.',
      ],
      [
        'Outside of client work, photography is where I design without a brief. This site is the result: a minimal, personal space where the images are the absolute protagonists.',
        'The design avoids any distraction: discreet typography, minimal navigation and total focus on the image at the highest possible quality.',
        'It updates as I shoot, with no editorial calendar — the camera sets the pace, not the project.',
      ],
    ),
  },
  {
    id: 'project-controlfacturacion',
    title: {es: 'ControlFacturación', en: 'ControlFacturación'},
    category: 'cliente',
    featured: false,
    year: '2024',
    role: {es: 'UX/UI Designer (freelance)', en: 'UX/UI Designer (freelance)'},
    stack: ['Figma', 'Dashboards'],
    summary: {
      es: 'Diseño de un panel de control de facturación como consultor independiente: convertir números dispersos en decisiones rápidas para quien los mira cada día.',
      en: 'Design of a billing control dashboard as an independent consultant: turning scattered numbers into fast decisions for whoever looks at them every day.',
    },
    heroMediaCount: 2,
    order: 10,
    nextProjectId: '',
    externalUrl: '',
    body: bodyOf(
      [
        'ControlFacturación necesitaba convertir hojas de cálculo dispersas en un panel que cualquier persona del equipo pudiera leer en segundos, sin formación previa.',
        'Prioricé una jerarquía visual clara entre lo urgente (facturas pendientes, retrasos) y lo informativo (histórico, tendencias), evitando el efecto "pared de números".',
        'El resultado es un panel pensado para leerse en segundos antes de actuar sobre los datos.',
      ],
      [
        'ControlFacturación needed to turn scattered spreadsheets into a dashboard anyone on the team could read in seconds, with no prior training.',
        'I prioritized a clear visual hierarchy between what’s urgent (pending invoices, delays) and what’s informative (history, trends), avoiding the "wall of numbers" effect.',
        'The result is a dashboard designed to be read in seconds before acting on the data.',
      ],
    ),
  },
]

// ---------------------------------------------------------------------------
// Personal chapters (4) + items (2 per chapter = 8)
// ---------------------------------------------------------------------------

export const PERSONAL_CHAPTERS = [
  {
    id: 'personalChapter-cocina',
    title: {es: 'Cocina', en: 'Cooking'},
    emoji: '\u{1F373}',
    description: {
      es: 'Donde experimento sin miedo a equivocarme: recetas propias, fallos memorables y algún que otro acierto que repito desde entonces.',
      en: 'Where I experiment without fear of getting it wrong: my own recipes, memorable failures and the occasional hit I still repeat.',
    },
    order: 1,
  },
  {
    id: 'personalChapter-teatro',
    title: {es: 'Teatro', en: 'Theatre'},
    emoji: '\u{1F3AD}',
    description: {
      es: 'Subirse a un escenario enseña a improvisar bajo presión — una habilidad que, sorprendentemente, también sirve en diseño de producto.',
      en: 'Getting on stage teaches you to improvise under pressure — a skill that, surprisingly, also helps in product design.',
    },
    order: 2,
  },
  {
    id: 'personalChapter-guitarra',
    title: {es: 'Guitarra', en: 'Guitar'},
    emoji: '\u{1F3B8}',
    description: {
      es: 'Carnavales y algún concierto de por medio: la guitarra es la excusa perfecta para desconectar de pantallas un rato.',
      en: 'Carnival gigs and the occasional concert: the guitar is the perfect excuse to unplug from screens for a while.',
    },
    order: 3,
  },
  {
    id: 'personalChapter-fotografia',
    title: {es: 'Fotografía', en: 'Photography'},
    emoji: '\u{1F4F7}',
    description: {
      es: 'Una selección aparece aquí, pero el archivo completo vive en fotografia.alvaroartiel.com.',
      en: 'A selection lives here, but the full archive lives at fotografia.alvaroartiel.com.',
    },
    order: 4,
  },
]

export const PERSONAL_ITEMS = [
  {
    id: 'personalItem-cocina-1',
    kind: 'photo',
    chapterId: 'personalChapter-cocina',
    caption: {es: 'El experimento que salió bien', en: 'The experiment that actually worked'},
    date: '2025',
  },
  {
    id: 'personalItem-cocina-2',
    kind: 'photo',
    chapterId: 'personalChapter-cocina',
    caption: {es: 'Domingo de masa madre', en: 'Sourdough Sunday'},
    date: '2025',
  },
  {
    id: 'personalItem-teatro-1',
    kind: 'photo',
    chapterId: 'personalChapter-teatro',
    caption: {es: 'Minutos antes de salir a escena', en: 'Minutes before going on stage'},
    date: '2024',
  },
  {
    id: 'personalItem-teatro-2',
    kind: 'photo',
    chapterId: 'personalChapter-teatro',
    caption: {es: 'El elenco al completo', en: 'The full cast'},
    date: '2024',
  },
  {
    id: 'personalItem-guitarra-1',
    kind: 'photo',
    chapterId: 'personalChapter-guitarra',
    caption: {es: 'Ensayo antes de carnaval', en: 'Rehearsal before carnival'},
    date: '2025',
  },
  {
    id: 'personalItem-guitarra-2',
    kind: 'photo',
    chapterId: 'personalChapter-guitarra',
    caption: {es: 'Última fila, primera guitarra', en: 'Back row, first guitar'},
    date: '2025',
  },
  {
    id: 'personalItem-fotografia-1',
    kind: 'photo',
    chapterId: 'personalChapter-fotografia',
    caption: {es: 'De la última sesión', en: 'From the latest session'},
    date: '2026',
  },
  {
    id: 'personalItem-fotografia-2',
    kind: 'photo',
    chapterId: 'personalChapter-fotografia',
    caption: {es: 'Luz de hora dorada', en: 'Golden hour light'},
    date: '2025',
  },
]

// ---------------------------------------------------------------------------
// Blog post (1)
// ---------------------------------------------------------------------------

export const BLOG_POST = {
  id: 'blogPost-por-que-esta-web',
  title: {
    es: 'Por qué esta web es como es',
    en: 'Why this website is the way it is',
  },
  slug: 'por-que-esta-web-es-como-es',
  date: '2026-07-10',
  tags: ['meta', 'diseño', 'proceso'],
  excerpt: {
    es: 'Una entrada meta (sí, lo sé) sobre las decisiones detrás de este portfolio: por qué monocromo con acentos, por qué tanto efecto y por qué hay una casa jugable escondida.',
    en: 'A meta post (yes, I know) about the decisions behind this portfolio: why monochrome with accents, why so many effects, and why there’s a playable house hidden in it.',
  },
  body: bodyOf(
    [
      'Empecemos por lo obvio: sí, escribir un post sobre por qué esta web es como es es un poco meta. Pero también es la forma más honesta de explicar las decisiones sin esconderlas detrás de un "porque sí, queda bien".',
      'La base visual es monocromo casi negro con un acento que cambia según la sección: lima en home, azul en proyectos, violeta en experiencia, naranja en lo personal, teal en el blog. La idea es que el sitio se sienta como un mismo objeto que cambia de humor, no como cinco webs distintas cosidas entre sí.',
      'Los efectos —partículas, tipografía líquida, mesa revuelta con física— no están para presumir de librería. Cada uno responde a una pregunta concreta de esa sección: cómo presentar un titular, cómo invitar a escribir, cómo mostrar recuerdos desordenados sin que parezcan una galería aburrida. Y todos tienen una versión reducida o estática para quien prefiere menos movimiento.',
      'Y sí, hay una casa jugable escondida al final del scroll. No pretende ser un juego completo: es un capricho con encanto, la clase de detalle que solo tiene sentido en una web personal. Si has llegado hasta aquí leyendo, probablemente ya la hayas encontrado — o estés a punto.',
    ],
    [
      'Let’s start with the obvious: yes, writing a post about why this website is the way it is, is a bit meta. But it’s also the most honest way to explain the decisions without hiding them behind a "because it looks good."',
      'The visual base is near-black monochrome with an accent that shifts per section: lime on home, blue on projects, violet on experience, orange on the personal page, teal on the blog. The idea is that the site feels like one object changing mood, not five different websites stitched together.',
      'The effects — particles, liquid typography, a physics-driven cluttered table — aren’t there to show off a library. Each one answers a concrete question for that section: how to present a headline, how to invite someone to write, how to show scattered memories without turning them into a boring gallery. And each has a reduced or static version for anyone who prefers less motion.',
      'And yes, there’s a playable house hidden at the end of the scroll. It doesn’t pretend to be a full game: it’s a charming little indulgence, the kind of detail that only makes sense on a personal website. If you’ve read this far, you’ve probably already found it — or you’re about to.',
    ],
  ),
  published: true,
}

// ---------------------------------------------------------------------------
// Site settings (singleton)
// ---------------------------------------------------------------------------

export const SITE_SETTINGS = {
  id: 'siteSettings-main',
  heroTitle: {
    es: 'Diseño productos digitales de punta a punta',
    en: 'I design digital products end to end',
  },
  heroSubtitle: {
    es: 'Product Lead · UX/UI · E-learning · SaaS · IA aplicada',
    en: 'Product Lead · UX/UI · E-learning · SaaS · Applied AI',
  },
  about: {
    es: 'Soy Álvaro Artiel, diseñador de producto. Llevo ideas desde el primer boceto hasta la interfaz que usa gente de verdad, tanto en productos propios (Ceustack) como en equipos de cliente. Me interesa el diseño que resuelve antes que el que decora.',
    en: 'I’m Álvaro Artiel, a product designer. I take ideas from the first sketch to the interface real people use, both on my own products (Ceustack) and inside client teams. I care about design that solves before it decorates.',
  },
  email: 'soy@alvaroartiel.com',
  socials: [
    {label: 'LinkedIn', url: '#', visible: true},
    {label: 'GitHub', url: '#', visible: true},
  ],
  seoTitle: {
    es: 'Álvaro Artiel — Diseño de producto',
    en: 'Álvaro Artiel — Product Design',
  },
  seoDescription: {
    es: 'Portfolio de Álvaro Artiel: diseño de producto digital de punta a punta, proyectos propios y de cliente, experiencia y formación.',
    en: 'Álvaro Artiel’s portfolio: end-to-end digital product design, in-house and client projects, experience and education.',
  },
  cvSkillGroups: [
    {_type: 'skillGroup', _key: 'design', label: {es: 'Diseño', en: 'Design'}, items: ['Figma', 'UX/UI']},
    {
      _type: 'skillGroup',
      _key: 'dev',
      label: {es: 'Desarrollo', en: 'Development'},
      items: ['React', 'Astro', 'Node.js', 'TypeScript', 'Sanity'],
    },
    {_type: 'skillGroup', _key: 'marketing', label: {es: 'Marketing', en: 'Marketing'}, items: ['SEO']},
  ],
  cvLanguages: {es: 'Español · Inglés', en: 'Spanish · English'},
}
