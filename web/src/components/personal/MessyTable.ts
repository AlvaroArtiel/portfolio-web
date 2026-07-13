/**
 * Mesa revuelta: las polaroids de la grid se convierten en cuerpos Matter.js
 * dentro de una "mesa" (los bordes de la sección son las paredes). Caen al
 * cargar, se pueden agarrar y lanzar, colisionan y se duermen cuando reposan.
 * Un clic/tap sin arrastre abre el lightbox de siempre. Los filtros de
 * capítulo despiertan (impulso) a su capítulo y atenúan el resto.
 *
 * Táctil: misma física. El agarre se conduce con pointer events que solo
 * actúan cuando el gesto empieza sobre una polaroid (touch-action:none en la
 * pieza); en el resto de la mesa el scroll de página sigue siendo nativo.
 * Reduced-motion: la grid F2 tal cual, este módulo no hace nada.
 */

// La capa de física necesita recorrido vertical generoso para que la caída se
// sienta bien; el CRECIMIENTO VISIBLE de la mesa (el "viewport" recortado) se
// ajusta después, al montón ya asentado, para no dejar aire de sobra.
const PHYSICS_HEIGHT_VH = 120
// Lo VISIBLE nunca pasa de un alto de pantalla: la capa de física va anclada
// al fondo del viewport, así que las piezas caen desde fuera de cuadro.
const VIEWPORT_MAX_VH = 90
const SETTLED_MARGIN = 1.25 // área visible ≈ montón asentado + 25%
const SETTLED_MAX_VH = 0.7 // nunca más del 70% del alto de viewport
const SETTLED_MIN_PX = 240 // suelo razonable para no recortar en seco
const DRAG_CLICK_THRESHOLD = 6

export function initMessyTable(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  void initPhysics()
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
  viewport.style.cssText = `position:relative;height:${VIEWPORT_MAX_VH}vh;overflow:hidden;border-block:1px solid color-mix(in srgb, var(--text-muted) 20%, transparent);transition:height var(--dur-element) var(--ease-out-token);`
  sections[0].before(viewport)

  const table = document.createElement('div')
  table.style.cssText = `position:absolute;left:0;bottom:0;width:100%;height:${PHYSICS_HEIGHT_VH}vh;`
  viewport.appendChild(table)

  const items = polaroids.map((el) => {
    const rect = el.getBoundingClientRect()
    const cap = el.closest<HTMLElement>('[data-chapter-section]')?.dataset.cap ?? ''
    table.appendChild(el)
    // En la mesa las polaroids van algo más pequeñas: caben sin apilarse en
    // torre. En pantallas estrechas se reducen más (≈3 por fila): con piezas
    // al 42% del ancho la pila era tan alta como la mesa y nunca se dormía.
    const width = Math.min(rect.width, 230, table.clientWidth * 0.32)
    const height = rect.height * (width / rect.width)
    // user-select/touch-action fuera y sin drag nativo de imagen: el gesto de
    // agarre no debe competir con seleccionar el pie o arrastrar el <img>
    // fantasma del navegador (se sentía "raro": pinchabas y seleccionabas).
    el.style.cssText += `position:absolute;left:0;top:0;width:${width}px;margin:0;cursor:grab;will-change:transform;user-select:none;-webkit-user-select:none;touch-action:none;`
    el.querySelectorAll('img').forEach((img) => {
      img.draggable = false
    })
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

  // Margen lateral proporcional: con el fijo de 80px, en mesas estrechas el
  // recorrido útil colapsaba y todas las piezas caían en la misma franja.
  const dropMargin = Math.min(80, W * 0.06)
  const bodies = items.map((item, index) => {
    const body = Bodies.rectangle(
      dropMargin + ((index * 0.61803) % 1) * Math.max(60, W - dropMargin * 2 - item.w), // reparto áureo, sin torres
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
  const rawMouse = mouse as unknown as {
    mousewheel: EventListener
    mousedown: EventListener
    mousemove: EventListener
    mouseup: EventListener
    button: number
  }
  table.removeEventListener('wheel', rawMouse.mousewheel)
  // Sus listeners touch* también hacen preventDefault sobre TODA la mesa
  // (bloquearían el scroll de página en móvil): fuera. El agarre táctil se
  // conduce a mano más abajo, solo cuando el gesto empieza en una polaroid.
  table.removeEventListener('touchstart', rawMouse.mousedown)
  table.removeEventListener('touchmove', rawMouse.mousemove)
  table.removeEventListener('touchend', rawMouse.mouseup)
  // stiffness 0.2: agarre más directo (con 0.12 la polaroid "flotaba" detrás
  // del cursor y el gesto se sentía irresponsivo)
  const mouseConstraint = MouseConstraint.create(engine, {mouse, constraint: {stiffness: 0.2, damping: 0.12}})
  Composite.add(engine.world, mouseConstraint)

  // Puente táctil: alimenta la posición/botón del Mouse de Matter desde
  // pointer events. Solo secuestra el gesto si empieza sobre una polaroid
  // (touch-action:none en la pieza evita que el navegador lo convierta en
  // scroll); en el resto de la mesa la página scrollea con normalidad.
  const setMousePosition = (e: PointerEvent) => {
    const r = table.getBoundingClientRect()
    mouse.position.x = e.clientX - r.left
    mouse.position.y = e.clientY - r.top
  }
  table.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return // el ratón ya lo gestiona Matter
    if (!(e.target as HTMLElement).closest('.polaroid')) return
    setMousePosition(e)
    rawMouse.button = 0
  })
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' || rawMouse.button !== 0) return
    setMousePosition(e)
  })
  const releaseTouch = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return
    rawMouse.button = -1
  }
  window.addEventListener('pointerup', releaseTouch)
  window.addEventListener('pointercancel', releaseTouch)

  // Un lanzamiento puede apilar una polaroid más alto que el recorte actual:
  // vuelve al alto generoso mientras se agarra/lanza y hasta que se re-asiente.
  // El evento startdrag lleva `body`, pero los tipos de matter-js solo
  // declaran IEvent<MouseConstraint>: se amplía aquí.
  Events.on(mouseConstraint, 'startdrag', (e: Matter.IEvent<Matter.MouseConstraint> & {body?: Matter.Body}) => {
    settled = false
    viewport.style.height = `${VIEWPORT_MAX_VH}vh`
    // Feedback de agarre: la mano se cierra sobre la polaroid agarrada
    table.style.cursor = 'grabbing'
    const grabbed = e.body ? bodies.indexOf(e.body) : -1
    if (grabbed >= 0) items[grabbed].el.style.cursor = 'grabbing'
  })
  Events.on(mouseConstraint, 'enddrag', () => {
    table.style.cursor = ''
    items.forEach((item) => (item.el.style.cursor = 'grab'))
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
      viewport.style.height = `${VIEWPORT_MAX_VH}vh`
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
