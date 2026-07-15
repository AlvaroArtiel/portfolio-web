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
    startDate: '2025',
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
    startDate: '2025',
    endDate: '',
    location: {es: 'Málaga, España (remoto)', en: 'Málaga, Spain (remote)'},
    modality: {es: 'Remoto', en: 'Remote'},
    summary: {
      es: 'Co-fundé Ceustack para diseñar y construir productos propios de principio a fin: Ranquea y UltraCarta nacen aquí, desde la idea hasta el pixel y el código.',
      en: 'I co-founded Ceustack to design and build our own products end to end: Ranquea and UltraCarta both started here, from the idea to the pixel and the code.',
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
      es: 'Diseño del CRM interno de iUrban y del design system que lo unifica —de pantallas dispersas a un lenguaje visual consistente—, además del rebranding completo de la marca: nuevo logo, nueva web y una mascota/avatar propia.',
      en: 'Design of iUrban’s internal CRM and the design system that unifies it —from scattered screens to a consistent visual language— plus a full brand rebranding: a new logo, a new website and a custom mascot/avatar.',
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
      {
        es: 'Lideré el rebranding de la marca: nuevo logotipo, web corporativa nueva y una mascota/avatar de marca.',
        en: 'Led the brand rebranding: a new logo, a new corporate website and a brand mascot/avatar.',
      },
    ],
    order: 6,
    visible: true,
  },
  {
    id: 'experience-freelance-inicios',
    company: {es: 'Freelance', en: 'Freelance'},
    role: {es: 'Diseño y desarrollo web', en: 'Web Design & Development'},
    type: 'freelance',
    startDate: '2020',
    endDate: '2023',
    location: {es: 'Remoto', en: 'Remote'},
    modality: {es: 'Freelance', en: 'Freelance'},
    summary: {
      es: 'Mis primeros años por libre, compaginados con la formación: diseño y montaje de webs a medida para pequeños negocios y autónomos. Poco a poco, aquellos encargos sueltos se fueron convirtiendo en oficio.',
      en: 'My first years on my own, alongside my studies: designing and building custom websites for small businesses and freelancers. Little by little, those one-off gigs turned into a craft.',
    },
    bullets: [
      {
        es: 'Diseño y desarrollo de webs a medida para pequeños negocios.',
        en: 'Design and development of custom websites for small businesses.',
      },
      {
        es: 'Del primer contacto con el cliente a la web publicada y en marcha.',
        en: 'From the first client conversation to a published, live website.',
      },
    ],
    order: 7,
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
      es: 'Mi primera experiencia profesional en plantilla: diseño gráfico y web dentro de un estudio, donde aprendí el oficio del día a día —del encargo al arte final— trabajando codo con codo con el equipo.',
      en: 'My first professional job on staff: graphic and web design inside a studio, where I learned the craft day to day —from the brief to the final artwork— working side by side with the team.',
    },
    bullets: [
      {
        es: 'Diseño de identidad, piezas gráficas y webs para clientes del estudio.',
        en: 'Identity design, graphic pieces and websites for the studio’s clients.',
      },
      {
        es: 'Primer contacto con el ritmo real de una agencia: varios proyectos a la vez.',
        en: 'First taste of an agency’s real rhythm: several projects at once.',
      },
    ],
    order: 8,
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
    stack: ['Figma', 'Astro', 'Node.js', 'Gamificación'],
    summary: {
      es: 'Producto propio de Ceustack para crear ligas fotográficas gamificadas: los participantes suben fotos desde el móvil, el jurado puntúa sobre 100 y el ranking se actualiza en directo. Como Product Lead lidero producto y diseño.',
      en: 'Ceustack’s own product for running gamified photography leagues: participants upload photos from their phones, a jury scores each one out of 100 and the ranking updates live. As Product Lead I drive product and design.',
    },
    heroMediaCount: 3,
    order: 1,
    nextProjectId: 'project-ultracarta',
    externalUrl: 'https://ranquea.com',
    body: bodyOf(
      [
        'Ranquea es el producto propio de Ceustack para crear y compartir ligas fotográficas gamificadas. Nació de un problema tan concreto como aburrido: los concursos de fotografía se gestionaban con hojas de cálculo, formularios sueltos y recuentos manuales que consumían tiempo y enfriaban la competición.',
        'La propuesta es reducir todo eso a tres pasos. Se crea la liga con sus reglas, jornadas y jurado; los participantes suben sus fotos desde el móvil con un QR o un enlace, sin instalar nada; el jurado puntúa cada foto sobre 100 y Ranquea calcula la media y reordena el ranking al instante.',
        'Como Product Lead defino el producto y el diseño de interfaz. El reto está en sostener dos usos a la vez: que una comunidad ocasional lo entienda sin manual y que un club que compite cada mes encuentre profundidad —galerías públicas embebibles, logros y badges, moderación previa y analítica de participación.',
        'La mejor prueba es una temporada real. La Liga Miradas de Ceuta gestionó su temporada 2025-2026 íntegra en Ranquea: 28 participantes, 8 jornadas y un jurado puntuando sobre 100, con rankings general y mensual en directo y una galería pública con el podio de cada mes.',
        'Ranquea sigue en desarrollo activo desde Ceustack, cerca de cada comunidad que la usa. Puedes ver la web en ranquea.com y explorar una liga real en directo en la Liga Miradas de Ceuta.',
      ],
      [
        'Ranquea is Ceustack’s own product for creating and sharing gamified photography leagues. It grew out of a problem as concrete as it was tedious: photography contests were run on spreadsheets, scattered forms and manual tallies that ate up time and cooled the competition down.',
        'The idea is to boil all of that down to three steps. You create the league with its rules, rounds and jury; participants upload their photos from their phones via a QR or a link, with nothing to install; the jury scores each photo out of 100 and Ranquea averages the votes and reorders the ranking instantly.',
        'As Product Lead I define the product and the interface design. The challenge is holding two uses at once: letting a casual community understand it without a manual, while giving a club that competes every month real depth —embeddable public galleries, achievements and badges, pre-moderation and participation analytics.',
        'The best proof is a real season. Ceuta’s Liga Miradas ran its entire 2025-2026 season on Ranquea: 28 participants, 8 rounds and a jury scoring out of 100, with live general and monthly rankings and a public gallery showing each month’s podium.',
        'Ranquea remains under active development at Ceustack, close to every community that uses it. You can see the site at ranquea.com and explore a real league live in Ceuta’s Liga Miradas.',
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
      es: 'Producto de Ceustack para restaurantes: una carta digital que se actualiza en un minuto desde el móvil. La IA importa el menú y detecta alérgenos; el cliente la lee en su QR con filtros de dieta y un recomendador que sugiere plato y vino.',
      en: 'Ceustack’s product for restaurants: a digital menu you update in a minute from your phone. AI imports the menu and detects allergens; guests read it from a QR with diet filters and a recommender that suggests dish and wine.',
    },
    heroMediaCount: 3,
    order: 2,
    nextProjectId: 'project-tentuplaza-plataforma',
    externalUrl: 'https://ultracarta.com',
    body: bodyOf(
      [
        'UltraCarta es el producto de Ceustack para restaurantes que quieren una carta viva. La idea de partida: la carta cambia cada día —se agota la lubina, entra pescado fresco, el chef saca un plato del momento— pero el papel impreso y las pizarras no siguen ese ritmo. UltraCarta convierte la carta en algo que se actualiza en un minuto desde el móvil.',
        'El dueño gestiona todo desde una sola pantalla, sin formación: destaca lo del día, oculta lo que se ha agotado y activa el menú del día de un toque. Cada cambio se refleja al instante en el QR que ve el cliente, sin reimprimir nada.',
        'Como Product Lead definí producto y diseño de las dos caras del sistema. Para que montar la carta no sea un muro de trabajo el primer día, entra sola: una foto del menú físico, un PDF o una URL, y la IA la estructura, detecta los 14 alérgenos de la UE, etiqueta dietas y enriquece la bodega —varietal, cuerpo, crianza y maridaje, vino a vino.',
        'Sobre esa carta estructurada montamos un recomendador: en tres preguntas —cuántos sois, qué apetece, qué restricciones— propone una comanda completa con su vino emparejado, respetando lo que la cocina ha destacado ese día. La sala no tiene que insistir; el cliente decide.',
        'El lado del comensal está pensado para leerse bien en cualquier móvil, sin app ni registro: escanea el QR y tiene la carta con fotos, filtros de dieta y alérgenos plato a plato. De ojear la carta a recibir una propuesta con maridaje, todo cabe en la pantalla del teléfono.',
        'UltraCarta se mantiene como producto propio de Ceustack. Puedes ver la web en ultracarta.com y probar una carta real en la demo de La Barraca.',
      ],
      [
        'UltraCarta is Ceustack’s product for restaurants that want a living menu. The starting point: the menu changes every day —the sea bass runs out, fresh fish comes in, the chef puts out a special— but printed paper and chalkboards don’t keep up. UltraCarta turns the menu into something you update in a minute from your phone.',
        'The owner runs everything from a single screen, no training needed: feature today’s dish, hide what’s sold out and switch on the daily menu with one tap. Every change shows up instantly on the QR the customer sees, with nothing to reprint.',
        'As Product Lead I defined the product and design of both sides of the system. So that building the menu isn’t a wall of work on day one, it loads itself: a photo of the physical menu, a PDF or a URL, and the AI structures it, detects the 14 EU allergens, tags diets and enriches the wine list —varietal, body, ageing and pairing, wine by wine.',
        'On top of that structured menu we built a recommender: in three questions —how many of you, what you fancy, any restrictions— it proposes a full order with its paired wine, respecting what the kitchen featured that day. The floor staff don’t have to push; the guest decides.',
        'The diner-facing side is built to read well on any phone, with no app or sign-up: scan the QR and you have the menu with photos, diet filters and allergens dish by dish. From browsing the menu to getting a proposal with a wine pairing, it all fits on the phone screen.',
        'UltraCarta remains a Ceustack in-house product. You can see the site at ultracarta.com and try a real menu in the La Barraca demo.',
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
    stack: ['Figma', 'Astro', 'Node.js', 'Gamificación'],
    summary: {
      es: 'La nueva plataforma e-learning a medida de TenTuPlaza, academia nº1 de España en oposiciones de ADIF y RENFE con más de 5.000 alumnos. Dirijo producto y diseño del área del alumno: estudiar el temario, practicar con un motor de tests y analizar el rendimiento frente al grupo. En construcción por fases.',
      en: 'TenTuPlaza’s new custom e-learning platform — Spain’s nº1 academy for ADIF and RENFE public exams, with 5,000+ students. I lead product and design of the student area: studying the syllabus, practising with a test engine and analysing performance against the group. Being built in phases.',
    },
    heroMediaCount: 3,
    order: 3,
    nextProjectId: 'project-vaultz',
    externalUrl: 'https://tentuplaza.es',
    body: bodyOf(
      [
        'TenTuPlaza es la academia nº1 de España en oposiciones de ADIF y RENFE, con más de 5.000 alumnos. Como Product & Digital Lead dirijo el diseño y desarrollo de su nueva plataforma e-learning a medida: la casa digital donde preparan su plaza.',
        'El proyecto avanza por fases, priorizando en cada entrega el módulo con más impacto para alumnos y equipo docente. El corazón es el área del alumno, que reúne en un mismo sitio lo que antes vivía disperso: estudiar el temario, practicar con tests y analizar el rendimiento. El panel de inicio resume la racha de estudio, la nota media y qué toca hacer hoy.',
        'El motor de tests es la pieza más usada. Un configurador guía la creación del examen —temas, cantidad, dificultad, tiempo y modo de corrección— para que tanto un repaso rápido como un simulacro completo se monten en segundos.',
        'La corrección es donde se aprende de verdad: en modo inmediato cada respuesta se marca al momento, con la opción correcta y una explicación del porqué. El fallo deja de ser un número rojo y pasa a ser la siguiente cosa que estudiar.',
        'Sobre toda esa actividad, la analítica devuelve al alumno una lectura honesta de dónde está: evolución de la nota, comparativa con el grupo, aciertos y fallos por tema y en qué percentil se mueve. Menos sensación, más datos para decidir qué repasar.',
        'La plataforma sigue en construcción por fases desde TenTuPlaza. Puedes conocer la academia en tentuplaza.es.',
      ],
      [
        'TenTuPlaza is Spain’s nº1 academy for ADIF and RENFE public exams, with 5,000+ students. As Product & Digital Lead I direct the design and development of its new custom e-learning platform: the digital home where they prepare for their post.',
        'The project moves forward in phases, each release prioritising the module with the most impact for students and teaching staff. Its heart is the student area, which brings together in one place what used to be scattered: studying the syllabus, practising with tests and analysing performance. The home panel sums up the study streak, the average grade and what to do today.',
        'The test engine is the most-used piece. A configurator guides exam creation —topics, number of questions, difficulty, time and marking mode— so both a quick review and a full mock exam come together in seconds.',
        'Marking is where the real learning happens: in immediate mode each answer is graded on the spot, with the correct option and an explanation of why. A wrong answer stops being a red number and becomes the next thing to study.',
        'On top of all that activity, the analytics give the student an honest read of where they stand: grade evolution, comparison against the group, hits and misses by topic and which percentile they sit in. Less gut feeling, more data to decide what to review.',
        'The platform is still being built in phases at TenTuPlaza. You can get to know the academy at tentuplaza.es.',
      ],
    ),
  },
  {
    id: 'project-vaultz',
    title: {es: 'Vaultz', en: 'Vaultz'},
    category: 'cliente',
    featured: true,
    year: '2025',
    role: {es: 'Product Lead & Diseño', en: 'Product Lead & Design'},
    stack: ['Figma', 'Design System', 'UX Research'],
    summary: {
      es: 'App de finanzas personales para gestionar ingresos, gastos y ahorros, con una capa de educación financiera en formato social. Lideré el diseño de producto de punta a punta: research, arquitectura de información, UI y sistema de diseño.',
      en: 'A personal-finance app to manage income, expenses and savings, with a social-style financial-education layer. I led product design end to end: research, information architecture, UI and design system.',
    },
    heroMediaCount: 3,
    order: 4,
    nextProjectId: 'project-watcheers',
    externalUrl: '',
    body: bodyOf(
      [
        'Vaultz es una app de finanzas personales pensada para que cualquiera —no solo quien ya sabe de dinero— pueda gestionar sus ingresos, gastos y ahorros. A la gestión le suma una capa de educación financiera en formato social, para aprender a ahorrar sin irse a otra plataforma.',
        'Lideré el diseño de producto de punta a punta. Arranqué por el research —encuestas y entrevistas para construir personas y user journeys— y un análisis heurístico, y sobre eso definí la arquitectura de información: cuatro secciones claras (Metas, Análisis, Mi cuenta y Comunidad) y un onboarding que enlaza el banco sin fricción.',
        'De los wireframes a mano a la interfaz final, el foco fue que los números se entiendan de un vistazo: metas de ahorro con progreso, análisis de ingresos y gastos por mes, y una comunidad que convierte el ahorro en algo que se comparte. La estética es cálida y cercana, lo contrario del banco frío.',
        'Todo se apoya en un sistema de diseño propio: paleta tonal completa, tokens y una librería de componentes con sus estados —desde botones y campos con validación hasta el selector de fechas y los logos de bancos para la vinculación—, pensado para escalar y para que el equipo lo implemente sin ambigüedad.',
      ],
      [
        'Vaultz is a personal-finance app built so that anyone —not just people who already know about money— can manage their income, expenses and savings. On top of the management it adds a social-style financial-education layer, so you learn to save without leaving the app.',
        'I led product design end to end. I started from research —surveys and interviews to build personas and user journeys— and a heuristic analysis, and from there defined the information architecture: four clear sections (Goals, Analysis, My account and Community) and an onboarding that links your bank without friction.',
        'From hand-drawn wireframes to the final interface, the focus was making the numbers readable at a glance: savings goals with progress, monthly income-and-expense analysis, and a community that turns saving into something you share. The look is warm and close, the opposite of the cold bank.',
        'It all rests on its own design system: a full tonal palette, tokens and a component library with their states —from buttons and validated fields to the date picker and the bank logos for account linking— built to scale and to let the team implement it without ambiguity.',
      ],
    ),
  },
  {
    id: 'project-watcheers',
    title: {es: 'Watcheers', en: 'Watcheers'},
    category: 'formacion',
    featured: false,
    year: '2024',
    role: {es: 'UX/UI & Front-end', en: 'UX/UI & Front-end'},
    stack: ['Figma', 'HTML · CSS · JS', 'Bootstrap'],
    summary: {
      es: 'Web app de reservas para un complejo temático espacial: habitaciones y salas para amantes de la astronomía y la naturaleza. Mi trabajo de fin de máster —research, diseño y MVP maquetado a mano en HTML/CSS/JS— elegido Proyecto del Año en La Gauss.',
      en: 'A booking web app for a space-themed complex: rooms and venues for astronomy and nature lovers. My master’s final project —research, design and a hand-coded HTML/CSS/JS MVP— chosen Project of the Year at La Gauss.',
    },
    heroMediaCount: 3,
    order: 5,
    nextProjectId: 'project-benext',
    externalUrl: '',
    body: bodyOf(
      [
        'Watcheers es una web app de reservas para un complejo temático espacial: habitaciones y salas pensadas para amantes de la astronomía, la observación del cosmos y la naturaleza. Fue mi trabajo de fin de máster en La Gauss, donde lo eligieron Proyecto del Año.',
        'Partí de una investigación para encontrar un hueco dentro del alquiler vacacional y lo llevé a un nicho concreto: quien viaja para mirar al cielo. De ahí salió la marca —estética futurista pero minimalista, azul cosmos y naranja— y una experiencia donde cada estancia es una "expedición" (a Marte, a Andrómeda…) en vez de una simple habitación.',
        'Diseñé el sistema completo: research, wireframes, prototipo y una librería de componentes y tokens que mantiene coherentes las tarjetas de habitación, la navegación y la tipografía (Space Mono) en móvil y escritorio.',
        'Y lo maqueté a mano. Antes de que la IA escribiera código por nosotros, construí el MVP en HTML, CSS, JavaScript y Bootstrap. Diseñar y luego picar cada pantalla fue lo que sostuvo el proyecto de la idea al navegador —y lo que lo hizo defendible como pieza real, no como maqueta.',
      ],
      [
        'Watcheers is a booking web app for a space-themed complex: rooms and venues designed for lovers of astronomy, stargazing and nature. It was my master’s final project at La Gauss, where it was chosen Project of the Year.',
        'I started from research to find a gap within the vacation-rental sector and narrowed it to a specific niche: people who travel to look up at the sky. Out of that came the brand —futuristic yet minimalist, cosmos blue and orange— and an experience where every stay is an "expedition" (to Mars, to Andromeda…) rather than just a room.',
        'I designed the whole system: research, wireframes, prototype and a library of components and tokens that keeps the room cards, navigation and typography (Space Mono) consistent across mobile and desktop.',
        'And I hand-coded it. Before AI wrote code for us, I built the MVP in HTML, CSS, JavaScript and Bootstrap. Designing and then coding every screen is what carried the project from idea to browser —and what made it defensible as a real piece, not a mockup.',
      ],
    ),
  },
  {
    id: 'project-benext',
    title: {es: 'BeNext', en: 'BeNext'},
    category: 'cliente',
    featured: false,
    year: '2024',
    role: {es: 'UX/UI & Branding', en: 'UX/UI & Branding'},
    stack: ['Figma', 'Branding', 'Prototyping', 'Gamificación'],
    summary: {
      es: 'Web app para el mundo de los esports, los eventos en directo y la vida social online: BeNext Sphere, un "resort virtual" con arenas de competición, streaming y zonas sociales, envuelto en una estética futurista y neón. Diseño de producto y marca, del research a la iteración.',
      en: 'A web app for esports, live events and online social life: BeNext Sphere, a "virtual resort" with competition arenas, streaming and social zones, wrapped in a futuristic neon aesthetic. Product and brand design, from research to iteration.',
    },
    heroMediaCount: 3,
    order: 6,
    nextProjectId: 'project-campus-auraprods',
    externalUrl: '',
    body: bodyOf(
      [
        'BeNext es una web app que junta tres mundos: esports, eventos en directo y red social. La idea es un "resort virtual" —BeNext Sphere— donde la gente entra a competir en arenas, seguir eventos en streaming y moverse por zonas sociales con su avatar. El público objetivo: jóvenes muy digitales que ya viven online.',
        'El reto era que algo tan ambicioso no se sintiera caótico. Construí una marca de estética futurista y neón —oscuro, con acentos que brillan— y organicé el producto en zonas con nombre propio (Chrono Arena, Horologium Plaza, Time Oasis…) para que cada parte tenga identidad y el usuario no se pierda entre funciones.',
        'Seguí el proceso completo, de discovery e investigación a implementación e iteración. El diseño se apoya en un sistema de componentes y tokens —navegación, tarjetas de evento, formularios y estados— que mantiene coherente una interfaz densa tanto en móvil como en escritorio.',
        'El resultado es una plataforma que se siente a la vez espectacular y navegable: mucha energía visual, pero con una estructura clara debajo.',
      ],
      [
        'BeNext is a web app that brings together three worlds: esports, live events and social networking. The idea is a "virtual resort" —BeNext Sphere— where people come to compete in arenas, follow events via streaming and move through social zones with their avatar. The target audience: highly digital young people who already live online.',
        'The challenge was keeping something this ambitious from feeling chaotic. I built a futuristic, neon brand —dark, with accents that glow— and organised the product into named zones (Chrono Arena, Horologium Plaza, Time Oasis…) so each part has its own identity and users don’t get lost among features.',
        'I followed the full process, from discovery and research to implementation and iteration. The design rests on a system of components and tokens —navigation, event cards, forms and states— that keeps a dense interface consistent across mobile and desktop.',
        'The result is a platform that feels both spectacular and navigable: plenty of visual energy, but with a clear structure underneath.',
      ],
    ),
  },
  {
    id: 'project-campus-auraprods',
    title: {es: 'AuraProds', en: 'AuraProds'},
    category: 'cliente',
    featured: false,
    year: '2025',
    role: {es: 'Diseño de producto y web', en: 'Product & Web Design'},
    stack: ['Figma', 'WordPress', 'Design System', 'E-learning', 'Gamificación'],
    summary: {
      es: 'Un año como diseñador en AuraProds, escuela de formación 3D y audiovisual con +14.000 alumnos: renové toda su web pública y construí desde cero el campus de e-learning, con un sistema de gamificación (puntos, rangos, desafíos y retos) que mantiene a los alumnos volviendo.',
      en: 'A year as designer at AuraProds, a 3D and audiovisual training school with 14,000+ students: I redesigned its whole public site and built the e-learning campus from scratch, with a gamification system (points, ranks, challenges and monthly briefs) that keeps students coming back.',
    },
    heroMediaCount: 3,
    order: 7,
    nextProjectId: '',
    externalUrl: 'https://auraprods.com',
    body: bodyOf(
      [
        'AuraProds es una escuela de formación audiovisual —3D, edición de vídeo y VFX— con una comunidad de más de 14.000 alumnos. Pasé un año como diseñador encargándome de sus dos frentes digitales: la web pública que capta y convence, y el campus donde los alumnos aprenden y compiten.',
        'Renové toda la web, de la identidad a la última landing. La home ordena la propuesta en una ruta clara —del cero a vivir del 3D—, las páginas de curso desglosan el temario módulo a módulo con resultados reales, y el Hall of Fame convierte los trabajos de los alumnos en la mejor prueba social.',
        'El otro frente era construir el campus de e-learning desde cero. Diseñé un sistema donde avanzar en un curso se siente como avanzar, no solo como marcar casillas: cursos, clases y comunidad viviendo en un mismo lugar, con componentes reutilizables pensados para escalar a nuevos cursos sin rediseñar cada vez.',
        'La pieza que lo cambia todo es la gamificación. Los alumnos ganan Lúmenes al completar desafíos, suben de rango, compiten en un ranking mensual y participan en un reto temático cada mes. El progreso deja de ser una barra y se convierte en un motivo para volver.',
        'Alrededor de todo eso está la comunidad: un foro con hilos de presentaciones, work in progress, dudas y feedback entre alumnos y equipo. El campus no es un reproductor de vídeos, es un sitio donde pasan cosas.',
        'La web sigue en producción y el campus creció con cada curso nuevo. Puedes ver la web en auraprods.com y conocer el campus en su página pública.',
      ],
      [
        'AuraProds is an audiovisual training school —3D, video editing and VFX— with a community of more than 14,000 students. I spent a year as designer owning its two digital fronts: the public site that attracts and convinces, and the campus where students learn and compete.',
        'I redesigned the whole website, from the identity to the last landing page. The home lays out the offer as a clear path —from zero to living off 3D—, the course pages break the syllabus down module by module with real results, and the Hall of Fame turns student work into the best social proof.',
        'The other front was building the e-learning campus from scratch. I designed a system where moving through a course feels like moving forward, not just ticking boxes: courses, lessons and community living in one place, on reusable components built to scale to new courses without redesigning each time.',
        'The piece that changes everything is gamification. Students earn Lúmenes by completing challenges, climb through ranks, compete in a monthly leaderboard and take part in a themed brief every month. Progress stops being a bar and becomes a reason to come back.',
        'Around all that sits the community: a forum with introduction threads, work in progress, questions and feedback between students and team. The campus isn’t a video player, it’s a place where things happen.',
        'The site is still in production and the campus grew with every new course. You can see the site at auraprods.com and get to know the campus on its public page.',
      ],
    ),
  },
  {
    id: 'project-crm-iurban',
    title: {es: 'CRM iUrban', en: 'iUrban CRM'},
    category: 'cliente',
    featured: false,
    visible: false,
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
    visible: false,
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
    visible: false,
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
    caption: {es: 'Clase de cocina, delantal incluido', en: 'Cooking class, apron on'},
    date: '2026',
  },
  {
    id: 'personalItem-teatro-2',
    kind: 'photo',
    chapterId: 'personalChapter-teatro',
    caption: {es: 'El trío al completo', en: 'The whole trio'},
    date: '2016',
  },
  {
    id: 'personalItem-guitarra-1',
    kind: 'photo',
    chapterId: 'personalChapter-guitarra',
    caption: {es: 'Carnaval, casco incluido', en: 'Carnival, helmet and all'},
    date: '2017',
  },
  {
    id: 'personalItem-guitarra-2',
    kind: 'photo',
    chapterId: 'personalChapter-guitarra',
    caption: {es: 'Con el grupo antes de salir', en: 'With the group before going on'},
    date: '2019',
  },
  {
    id: 'personalItem-guitarra-3',
    kind: 'photo',
    chapterId: 'personalChapter-guitarra',
    caption: {es: 'Seis cuerdas en el escenario', en: 'Six strings on stage'},
    date: '2021',
  },
  {
    id: 'personalItem-fotografia-1',
    kind: 'photo',
    chapterId: 'personalChapter-fotografia',
    caption: {es: 'Detrás de la cámara', en: 'Behind the camera'},
    date: '2020',
  },
  {
    id: 'personalItem-fotografia-2',
    kind: 'photo',
    chapterId: 'personalChapter-fotografia',
    caption: {es: 'Grabando el carnaval', en: 'Filming the carnival'},
    date: '2022',
  },
  {
    id: 'personalItem-fotografia-3',
    kind: 'photo',
    chapterId: 'personalChapter-fotografia',
    caption: {es: 'Rodaje: a la caza del sonido', en: 'On a shoot, chasing the sound'},
    date: '2023',
  },
  // Sin capítulo: la sección personal ya no agrupa por categorías, es una sola
  // pila. Estas se mantienen en el modelo pero no aparecen en el teaser del home
  // (que coge 1 por capítulo).
  {
    id: 'personalItem-glaciar',
    kind: 'photo',
    caption: {es: 'Sobre el glaciar, piolet en mano', en: 'On the glacier, ice axe in hand'},
    date: '2024',
  },
  {
    id: 'personalItem-playa',
    kind: 'photo',
    caption: {es: 'Escapada a la playa', en: 'A day at the beach'},
    date: '2019',
  },
  {
    id: 'personalItem-retrato-melenas',
    kind: 'photo',
    caption: {es: 'Época melenas', en: 'The long-hair era'},
    date: '2019',
  },
  {
    id: 'personalItem-moto-bebe',
    kind: 'photo',
    caption: {es: 'Mi primer vehículo', en: 'My first set of wheels'},
    date: '1995',
  },
  {
    id: 'personalItem-camarero',
    kind: 'photo',
    caption: {es: 'De camarero: hay que hacer de todo', en: 'Waiting tables — you do a bit of everything'},
    date: '2018',
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
    es: 'Product Lead · Gamificación · UX/UI · E-learning · SaaS · IA aplicada',
    en: 'Product Lead · Gamification · UX/UI · E-learning · SaaS · Applied AI',
  },
  about: {
    es: 'Soy Álvaro Artiel, diseñador de producto. Llevo ideas desde el primer boceto hasta la interfaz que usa gente de verdad, tanto en productos propios (Ceustack) como en equipos de cliente. Me interesa el diseño que resuelve antes que el que decora. Una de mis obsesiones es la gamificación: puntos, rangos y retos que hacen que la gente quiera volver.',
    en: 'I’m Álvaro Artiel, a product designer. I take ideas from the first sketch to the interface real people use, both on my own products (Ceustack) and inside client teams. I care about design that solves before it decorates. One of my obsessions is gamification: points, ranks and challenges that make people want to come back.',
  },
  email: 'soy@alvaroartiel.com',
  socials: [
    {label: 'LinkedIn', url: '#', visible: true},
    {label: 'GitHub', url: '#', visible: true},
  ],
  seoTitle: {
    es: 'Álvaro Artiel — Diseño de producto y gamificación',
    en: 'Álvaro Artiel — Product Design & Gamification',
  },
  seoDescription: {
    es: 'Portfolio de Álvaro Artiel: diseño de producto digital de punta a punta, especializado en gamificación (puntos, rangos, retos, rankings) para e-learning, SaaS y comunidades.',
    en: 'Álvaro Artiel’s portfolio: end-to-end digital product design, specialized in gamification (points, ranks, challenges, leaderboards) for e-learning, SaaS and communities.',
  },
  cvSkillGroups: [
    {
      _type: 'skillGroup',
      _key: 'gamification',
      label: {es: 'Gamificación', en: 'Gamification'},
      items: ['Puntos y rangos', 'Retos y rankings', 'Rachas', 'Recompensas'],
    },
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
