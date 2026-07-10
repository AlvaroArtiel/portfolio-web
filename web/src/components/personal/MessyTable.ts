/**
 * Mesa revuelta: en desktop las polaroids de la grid se convierten en
 * cuerpos Matter.js dentro de una "mesa" (los bordes de la sección son las
 * paredes). Caen al cargar, se pueden agarrar y lanzar, colisionan y se
 * duermen cuando reposan. Un clic sin arrastre abre el lightbox de siempre.
 * Los filtros de capítulo despiertan (impulso) a su capítulo y atenúan el
 * resto.
 *
 * Móvil: sin física — flujo de la grid F2 con parallax sutil de giroscopio
 * (permiso tras primer gesto en iOS; sin permiso, estático).
 * Reduced-motion: la grid F2 tal cual, este módulo no hace nada.
 */

const DESKTOP = '(min-width: 721px) and (hover: hover) and (pointer: fine)'
// La capa de física necesita recorrido vertical generoso para que la caída se
// sienta bien; el CRECIMIENTO VISIBLE de la mesa (el "viewport" recortado) se
// ajusta después, al montón ya asentado, para no dejar aire de sobra.
const PHYSICS_HEIGHT_VH = 120
const SETTLED_MARGIN = 1.25 // área visible ≈ montón asentado + 25%
const SETTLED_MAX_VH = 0.7 // nunca más del 70% del alto de viewport
const SETTLED_MIN_PX = 240 // suelo razonable para no recortar en seco
const DRAG_CLICK_THRESHOLD = 6

export function initMessyTable(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia(DESKTOP).matches) void initPhysics()
  else initGyroParallax()
}

async function initPhysics(): Promise<void> {
  const page = document.querySelector<HTMLElement>('.personal-page')
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-section]'))
  const polaroids = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-section] .polaroid'))
  if (!page || polaroids.length === 0) return

  const Matter = await import('matter-js')
  const {Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Runner, Sleeping, Events} = Matter

  // Con deep-link ?cap= el filtro de la página puede haber ocultado secciones
  // antes de llegar aquí: en modo física todo es visible (el filtro atenúa).
  sections.forEach((section) => (section.hidden = false))

  // La mesa sustituye a las secciones de capítulo (que quedan como fallback oculto).
  // `viewport` es lo que ocupa espacio en la página (se recorta al montón
  // asentado); `table` es la capa de física, con recorrido vertical generoso
  // para que la caída se sienta bien, anclada al fondo del viewport y
  // recortada por su overflow:hidden mientras cae.
  const viewport = document.createElement('div')
  viewport.className = 'messy-table'
  viewport.style.cssText = `position:relative;height:${PHYSICS_HEIGHT_VH}vh;overflow:hidden;border-block:1px solid color-mix(in srgb, var(--text-muted) 20%, transparent);transition:height var(--dur-element) var(--ease-out-token);`
  sections[0].before(viewport)

  const table = document.createElement('div')
  table.style.cssText = `position:absolute;left:0;bottom:0;width:100%;height:${PHYSICS_HEIGHT_VH}vh;`
  viewport.appendChild(table)

  const items = polaroids.map((el) => {
    const rect = el.getBoundingClientRect()
    const cap = el.closest<HTMLElement>('[data-chapter-section]')?.dataset.cap ?? ''
    table.appendChild(el)
    // En la mesa las polaroids van algo más pequeñas: caben sin apilarse en torre
    const width = Math.min(rect.width, 230)
    const height = rect.height * (width / rect.width)
    el.style.cssText += `position:absolute;left:0;top:0;width:${width}px;margin:0;cursor:grab;will-change:transform;`
    return {el, cap, w: width, h: height}
  })
  sections.forEach((section) => (section.style.display = 'none'))

  const bounds = () => ({w: table.clientWidth, h: table.clientHeight})
  let {w: W, h: H} = bounds()

  const engine = Engine.create({enableSleeping: true})
  engine.gravity.y = 1

  const wallOpts = {isStatic: true, restitution: 0.4}
  const walls = [
    Bodies.rectangle(W / 2, H + 60, W + 400, 120, wallOpts), // suelo
    Bodies.rectangle(-60, H / 2, 120, H * 3, wallOpts),
    Bodies.rectangle(W + 60, H / 2, 120, H * 3, wallOpts),
    Bodies.rectangle(W / 2, -H - 60, W + 400, 120, wallOpts), // techo alto: deja caer desde arriba
  ]
  Composite.add(engine.world, walls)

  // Reajustar paredes si la mesa cambia de tamaño (resize de ventana)
  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const next = bounds()
      W = next.w
      H = next.h
      Body.setPosition(walls[0], {x: W / 2, y: H + 60})
      Body.setPosition(walls[1], {x: -60, y: H / 2})
      Body.setPosition(walls[2], {x: W + 60, y: H / 2})
      Body.setPosition(walls[3], {x: W / 2, y: -H - 60})
      if (settled) settleTable()
    }, 250)
  })

  const bodies = items.map((item, index) => {
    const body = Bodies.rectangle(
      80 + ((index * 0.61803) % 1) * Math.max(60, W - 160 - item.w), // reparto áureo, sin torres
      -((index % 4) * 120) - 100, // en tandas desde arriba
      item.w,
      item.h,
      {restitution: 0.25, friction: 0.6, frictionAir: 0.015, angle: (Math.random() - 0.5) * 0.5},
    )
    Composite.add(engine.world, body)
    return body
  })

  // Agarrar y lanzar
  const mouse = Mouse.create(table)
  // Matter añade un listener 'wheel' no-pasivo que hace preventDefault y
  // bloquea el scroll nativo sobre la mesa (120vh): lo quitamos.
  table.removeEventListener('wheel', (mouse as unknown as {mousewheel: EventListener}).mousewheel)
  const mouseConstraint = MouseConstraint.create(engine, {mouse, constraint: {stiffness: 0.12, damping: 0.12}})
  Composite.add(engine.world, mouseConstraint)

  // Un lanzamiento puede apilar una polaroid más alto que el recorte actual:
  // vuelve al alto generoso mientras se agarra/lanza y hasta que se re-asiente.
  Events.on(mouseConstraint, 'startdrag', () => {
    settled = false
    viewport.style.height = `${PHYSICS_HEIGHT_VH}vh`
  })

  // Clic sin arrastre = abrir el lightbox de esa polaroid
  let downPoint: {x: number; y: number} | null = null
  let dragDistance = 0
  table.addEventListener('pointerdown', (e) => {
    downPoint = {x: e.clientX, y: e.clientY}
    dragDistance = 0
  })
  table.addEventListener('pointermove', (e) => {
    if (downPoint) dragDistance = Math.hypot(e.clientX - downPoint.x, e.clientY - downPoint.y)
  })
  table.addEventListener(
    'click',
    (e) => {
      if (dragDistance > DRAG_CLICK_THRESHOLD) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    {capture: true},
  )

  // Filtros: el capítulo elegido despierta; el resto se atenúa
  document.querySelectorAll<HTMLAnchorElement>('[data-personal-filters] a').forEach((link) => {
    link.addEventListener('click', () => {
      const cap = link.dataset.cap ?? ''
      items.forEach((item, i) => {
        const match = cap === '' || item.cap === cap
        item.el.style.opacity = match ? '1' : '0.3'
        if (match) {
          Sleeping.set(bodies[i], false)
          Body.applyForce(bodies[i], bodies[i].position, {
            x: (Math.random() - 0.5) * 0.12,
            y: -0.14 - Math.random() * 0.08,
          })
        }
      })
      // El impulso puede levantar el montón por encima del recorte actual:
      // vuelve al alto generoso mientras se re-asienta.
      settled = false
      viewport.style.height = `${PHYSICS_HEIGHT_VH}vh`
    })
  })

  // Recorta el viewport visible a la altura real del montón asentado + ~25%
  // de margen de juego, sin superar nunca el 70% del alto de ventana. La capa
  // de física (table) no cambia: solo se ajusta cuánto de ella se ve.
  let settled = false
  const settleTable = () => {
    let minTop = Infinity
    let maxBottom = -Infinity
    for (let i = 0; i < items.length; i++) {
      const {h} = items[i]
      const {y} = bodies[i].position
      if (y - h / 2 < minTop) minTop = y - h / 2
      if (y + h / 2 > maxBottom) maxBottom = y + h / 2
    }
    const pileHeight = maxBottom - minTop
    const target = Math.min(pileHeight * SETTLED_MARGIN, window.innerHeight * SETTLED_MAX_VH)
    viewport.style.height = `${Math.max(target, SETTLED_MIN_PX)}px`
  }

  // Sincronizar DOM ↔ física
  Events.on(engine, 'afterUpdate', () => {
    for (let i = 0; i < items.length; i++) {
      const {el, w, h} = items[i]
      const body = bodies[i]
      el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`
    }
    if (!settled && bodies.every((b) => b.isSleeping)) {
      settled = true
      settleTable()
    }
  })

  // Estado inicial de atenuación si se entra con ?cap= en la URL
  const initialCap = new URLSearchParams(location.search).get('cap') ?? ''
  if (initialCap) {
    items.forEach((item) => {
      item.el.style.opacity = item.cap === initialCap ? '1' : '0.3'
    })
  }

  const runner = Runner.create()
  Runner.run(runner, engine)

  // Pausa fuera de viewport (y cuerpos dormidos por su cuenta al reposar)
  const observer = new IntersectionObserver(
    (entries) => {
      runner.enabled = entries[0]?.isIntersecting ?? true
    },
    {rootMargin: '100px'},
  )
  observer.observe(viewport)
}

/** Parallax sutil por giroscopio en móvil; permiso tras gesto en iOS. */
function initGyroParallax(): void {
  const polaroids = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-section] .polaroid'))
  if (polaroids.length === 0) return

  const apply = (beta: number, gamma: number) => {
    polaroids.forEach((el, i) => {
      const depth = 0.4 + (i % 3) * 0.3
      el.style.translate = `${gamma * 0.35 * depth}px ${(beta - 45) * 0.2 * depth}px`
    })
  }
  const listen = () => window.addEventListener('deviceorientation', (e) => apply(e.beta ?? 45, e.gamma ?? 0), {passive: true})

  const DOE = window.DeviceOrientationEvent as unknown as
    | {requestPermission?: () => Promise<'granted' | 'denied'>}
    | undefined
  if (DOE?.requestPermission) {
    // iOS: pedir permiso solo tras el primer gesto del usuario
    const onFirstTouch = () => {
      DOE.requestPermission!()
        .then((res) => {
          if (res === 'granted') listen()
        })
        .catch(() => {
          /* sin permiso → estático */
        })
      window.removeEventListener('touchend', onFirstTouch)
    }
    window.addEventListener('touchend', onFirstTouch, {once: true})
  } else if ('DeviceOrientationEvent' in window) {
    listen()
  }
}
