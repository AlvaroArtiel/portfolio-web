/**
 * Snake-trail del cursor para el overlay del menú: una cadena de segmentos
 * sigue al ratón con retardo (cada nodo persigue al anterior). Vive solo
 * mientras el menú está abierto; al cerrarse se detiene el rAF y se limpia
 * el canvas, sin dejar listeners ni memoria creciendo.
 *
 * Móvil / puntero táctil: no existe (no se inicia).
 */

const SEGMENTS = 26
const EASE_HEAD = 0.35
const EASE_TAIL = 0.55

type Point = {x: number; y: number}

export function initSnakeTrail(): void {
  const canvas = document.getElementById('menu-trail') as HTMLCanvasElement | null
  if (!canvas) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const points: Point[] = Array.from({length: SEGMENTS}, () => ({x: -100, y: -100}))
  const mouse: Point = {x: -100, y: -100}
  let rafId = 0
  let running = false

  const resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = canvas.clientWidth * dpr
    canvas.height = canvas.clientHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const onMove = (event: MouseEvent): void => {
    mouse.x = event.clientX
    mouse.y = event.clientY
  }

  const accent = (): string =>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4ff3f'

  function frame(): void {
    if (!running) return
    // La cabeza persigue al ratón; cada nodo persigue al anterior.
    points[0].x += (mouse.x - points[0].x) * EASE_HEAD
    points[0].y += (mouse.y - points[0].y) * EASE_HEAD
    for (let i = 1; i < SEGMENTS; i++) {
      points[i].x += (points[i - 1].x - points[i].x) * EASE_TAIL
      points[i].y += (points[i - 1].y - points[i].y) * EASE_TAIL
    }

    ctx!.clearRect(0, 0, canvas!.clientWidth, canvas!.clientHeight)
    ctx!.lineCap = 'round'
    ctx!.lineJoin = 'round'
    const color = accent()
    for (let i = 1; i < SEGMENTS; i++) {
      const t = 1 - i / SEGMENTS
      ctx!.strokeStyle = color
      ctx!.globalAlpha = 0.55 * t + 0.05
      ctx!.lineWidth = 14 * t + 1
      ctx!.beginPath()
      ctx!.moveTo(points[i - 1].x, points[i - 1].y)
      ctx!.lineTo(points[i].x, points[i].y)
      ctx!.stroke()
    }
    ctx!.globalAlpha = 1
    rafId = requestAnimationFrame(frame)
  }

  function start(): void {
    if (running) return
    running = true
    resize()
    // La serpiente nace donde esté el cursor, no en (-100,-100).
    points.forEach((p) => {
      p.x = mouse.x
      p.y = mouse.y
    })
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', resize)
    rafId = requestAnimationFrame(frame)
  }

  function stop(): void {
    if (!running) return
    running = false
    cancelAnimationFrame(rafId)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('resize', resize)
    ctx!.clearRect(0, 0, canvas!.clientWidth, canvas!.clientHeight)
  }

  // Vive exactamente mientras el menú está abierto.
  const observer = new MutationObserver(() => {
    if (document.documentElement.hasAttribute('data-menu-open')) start()
    else stop()
  })
  observer.observe(document.documentElement, {attributes: true, attributeFilter: ['data-menu-open']})

  // Seguir el ratón también antes de abrir, para nacer en el sitio correcto.
  window.addEventListener('mousemove', onMove, {passive: true})
}
