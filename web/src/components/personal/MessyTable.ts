/**
 * Mesa revuelta: las polaroids de la grid se convierten en cuerpos Matter.js
 * dentro de una "mesa" (los bordes de la sección son las paredes). Caen al
 * cargar, se pueden agarrar y lanzar, colisionan y se duermen cuando reposan.
 * Un clic/tap sin arrastre abre el lightbox de siempre.
 *
 * Táctil: misma física. El agarre se conduce con pointer events que solo
 * actúan cuando el gesto empieza sobre una polaroid (touch-action:none en la
 * pieza); en el resto de la mesa el scroll de página sigue siendo nativo.
 * Reduced-motion: la grid tal cual, este módulo no hace nada.
 */

// La capa de física necesita recorrido vertical para que la caída se sienta
// bien; el alto VISIBLE de la mesa se fija de forma determinista (ver
// computeViewportHeight) y NO cambia al interactuar: así ni varía entre cargas
// ni salta al agarrar/lanzar.
const PHYSICS_HEIGHT_VH = 110
// El alto visible nunca pasa del 70% del viewport (antes llegaba al 90%) y
// nunca baja de un suelo razonable. Las piezas van algo más pequeñas (ver más
// abajo) para que las 12 quepan en ~2 filas sin recortarse.
const VIEWPORT_MAX_VH = 0.7
const VIEWPORT_MIN_PX = 240
// Al asentarse, el viewport se ajusta a la altura REAL del montón + un pelín de
// aire. Se mide una sola vez y se CONGELA: no se re-expande al agarrar/lanzar
// (esa re-expansión era lo que se sentía "raro").
const SETTLED_MARGIN = 1.05
// Ancho útil máximo del montón (centrado). En pantallas anchas, sin esto las 12
// piezas caben en una sola fila y la mesa queda bajísima; confinándolo se
// apilan en ~2-3 filas y se ve como un montón de verdad.
const TABLE_MAX_W = 1180
const DRAG_CLICK_THRESHOLD = 6

export function initMessyTable(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  void initPhysics()
}

async function initPhysics(): Promise<void> {
  const container = document.querySelector<HTMLElement>('[data-photo-table]')
  const grid = container?.querySelector<HTMLElement>('.polaroid-grid')
  const polaroids = Array.from(container?.querySelectorAll<HTMLElement>('.polaroid') ?? [])
  if (!container || !grid || polaroids.length === 0) return

  const Matter = await import('matter-js')
  const {Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Runner, Events} = Matter

  // La mesa sustituye a la grid (que queda como fallback oculto). `viewport` es
  // lo que ocupa espacio en la página; `table` es la capa de física, con
  // recorrido vertical generoso, anclada al fondo del viewport y recortada por
  // su overflow:hidden mientras las piezas caen.
  const viewport = document.createElement('div')
  viewport.className = 'messy-table'
  viewport.style.cssText = `position:relative;width:100%;overflow:hidden;border-block:1px solid color-mix(in srgb, var(--text-muted) 20%, transparent);transition:height var(--dur-element, 240ms) var(--ease-out-token, ease-out);`
  grid.before(viewport)

  const table = document.createElement('div')
  table.style.cssText = `position:absolute;left:0;bottom:0;width:100%;height:${PHYSICS_HEIGHT_VH}vh;`
  viewport.appendChild(table)

  const items = polaroids.map((el) => {
    const rect = el.getBoundingClientRect()
    table.appendChild(el)
    // En la mesa las polaroids van bastante más pequeñas que en la grid: así
    // las 12 caben en ~2 filas y el montón no obliga a una mesa altísima. En
    // pantallas estrechas se reducen aún más (≈3 por fila).
    const width = Math.min(rect.width, 190, table.clientWidth * 0.27)
    const height = rect.height * (width / rect.width)
    // user-select/touch-action fuera y sin drag nativo de imagen: el gesto de
    // agarre no debe competir con seleccionar el pie o arrastrar el <img>
    // fantasma del navegador.
    el.style.cssText += `position:absolute;left:0;top:0;width:${width}px;margin:0;cursor:grab;will-change:transform;user-select:none;-webkit-user-select:none;touch-action:none;`
    el.querySelectorAll('img').forEach((img) => {
      img.draggable = false
    })
    return {el, w: width, h: height}
  })
  grid.style.display = 'none'

  // Alto visible INICIAL (mientras las piezas caen): estimación del "footprint"
  // por nº/ancho/alto para no abrir un hueco enorme durante la caída. Al
  // asentarse, settleTable() lo recorta al montón real. Como la estimación
  // suele quedar cerca del montón, el ajuste final apenas se nota.
  const computeViewportHeight = (): number => {
    const W = table.clientWidth
    const gap = 18
    const maxW = Math.max(...items.map((i) => i.w))
    const avgH = items.reduce((sum, i) => sum + i.h, 0) / items.length
    const perRow = Math.max(1, Math.floor((W + gap) / (maxW + gap)))
    const rows = Math.ceil(items.length / perRow)
    // Las piezas se apilan con solape (0.82 de fila) + un margen de aire.
    const est = rows * avgH * 0.82 + avgH * 0.55
    return Math.max(VIEWPORT_MIN_PX, Math.min(est, window.innerHeight * VIEWPORT_MAX_VH))
  }
  viewport.style.height = `${computeViewportHeight()}px`

  const bounds = () => ({w: table.clientWidth, h: table.clientHeight})
  let {w: W, h: H} = bounds()
  // Columna útil centrada (ver TABLE_MAX_W).
  let contentW = Math.min(W, TABLE_MAX_W)
  let ox = (W - contentW) / 2

  const engine = Engine.create({enableSleeping: true})
  engine.gravity.y = 1

  const wallOpts = {isStatic: true, restitution: 0.4}
  // El suelo se sube 40px respecto al borde inferior de la mesa (superficie en
  // H-40): así las esquinas de las polaroids GIRADAS, que sobresalen de su caja
  // física, no asoman por debajo del recorte del viewport.
  const FLOOR_TOP = 40
  const floorY = () => H + 60 - FLOOR_TOP // centro; superficie = centro-60 = H-40
  const walls = [
    Bodies.rectangle(W / 2, floorY(), W + 400, 120, wallOpts), // suelo
    Bodies.rectangle(ox - 60, H / 2, 120, H * 3, wallOpts), // pared izq (columna)
    Bodies.rectangle(ox + contentW + 60, H / 2, 120, H * 3, wallOpts), // pared der (columna)
    Bodies.rectangle(W / 2, -H - 60, W + 400, 120, wallOpts), // techo alto: deja caer desde arriba
  ]
  Composite.add(engine.world, walls)

  // Reajustar alto visible y paredes si la mesa cambia de tamaño (resize).
  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      const next = bounds()
      W = next.w
      H = next.h
      contentW = Math.min(W, TABLE_MAX_W)
      ox = (W - contentW) / 2
      Body.setPosition(walls[0], {x: W / 2, y: floorY()})
      Body.setPosition(walls[1], {x: ox - 60, y: H / 2})
      Body.setPosition(walls[2], {x: ox + contentW + 60, y: H / 2})
      Body.setPosition(walls[3], {x: W / 2, y: -H - 60})
      // Ya asentada → re-mide el montón; si aún cae, estimación inicial.
      if (settled) settleTable()
      else viewport.style.height = `${computeViewportHeight()}px`
    }, 250)
  })

  // Margen lateral proporcional dentro de la columna útil: con el fijo de 80px,
  // en columnas estrechas el recorrido colapsaba y todo caía en la misma franja.
  const dropMargin = Math.min(80, contentW * 0.06)
  const bodies = items.map((item, index) => {
    const body = Bodies.rectangle(
      ox + dropMargin + ((index * 0.61803) % 1) * Math.max(60, contentW - dropMargin * 2 - item.w), // reparto áureo dentro de la columna
      -((index % 4) * 120) - 100, // en tandas desde arriba
      item.w,
      item.h,
      {restitution: 0.25, friction: 0.6, frictionAir: 0.015, angle: (Math.random() - 0.5) * 0.4},
    )
    Composite.add(engine.world, body)
    return body
  })

  // Ajuste snug al montón asentado: se mide la altura real de las piezas ya en
  // reposo y se recorta el viewport a esa altura + un pelín de aire (nunca por
  // encima del tope). Se hace UNA vez y se congela — no se re-expande al
  // interactuar.
  let settled = false
  const settleTable = () => {
    // Se mide sobre las CAJAS REALES del DOM (con la rotación aplicada), no
    // sobre la altura física: una polaroid girada ocupa más caja y, si no se
    // cuenta, su esquina superior asoma y se recorta. Las piezas reposan en el
    // fondo de la mesa, así que basta encuadrar desde la cima visible del
    // montón hasta el fondo del viewport.
    const tableTop = table.getBoundingClientRect().top
    let minTop = Infinity
    for (const {el} of items) {
      const top = el.getBoundingClientRect().top - tableTop
      if (top < minTop) minTop = top
    }
    const pileHeight = table.clientHeight - minTop + 12 // + un pelín de aire arriba
    // En escritorio el tope es firme (nunca "demasiado alta"); en móvil, donde
    // las piezas hacen más filas y se scrollea igual, se deja subir más para no
    // recortar ninguna.
    const maxVh = window.innerWidth < 720 ? 0.85 : VIEWPORT_MAX_VH
    const target = Math.min(pileHeight * SETTLED_MARGIN, window.innerHeight * maxVh)
    viewport.style.height = `${Math.max(target, VIEWPORT_MIN_PX)}px`
  }

  // Agarrar y lanzar
  const mouse = Mouse.create(table)
  // Matter añade un listener 'wheel' no-pasivo que hace preventDefault y
  // bloquea el scroll nativo sobre la mesa: lo quitamos.
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

  // Feedback de agarre: la mano se cierra sobre la polaroid agarrada. El alto
  // de la mesa NO cambia al agarrar/lanzar (era una de las fuentes del salto).
  Events.on(mouseConstraint, 'startdrag', (e: Matter.IEvent<Matter.MouseConstraint> & {body?: Matter.Body}) => {
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

  // Sincronizar DOM ↔ física
  Events.on(engine, 'afterUpdate', () => {
    for (let i = 0; i < items.length; i++) {
      const {el, w, h} = items[i]
      const body = bodies[i]
      el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`
    }
    // Primera vez que todo reposa: recortar al montón y congelar.
    if (!settled && bodies.every((b) => b.isSleeping)) {
      settled = true
      settleTable()
    }
  })

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
