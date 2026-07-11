/**
 * Preview flotante que sigue al cursor (patrón mauriciojuba, sesión 3).
 *
 * Una ÚNICA capa fija reutilizada por todos los anclajes de la página:
 * cualquier elemento con `data-preview-src` (y opcional `data-preview-alt`)
 * muestra su imagen en una tarjeta que persigue al cursor con lag suave.
 * La usan /experiencia (proyectos relacionados) y /blog (filas de entradas).
 *
 * Solo puntero fino y sin reduced-motion: en táctil o con motion reducido
 * no se monta nada (los enlaces siguen siendo enlaces).
 */
import {EASE, DURATION} from './motion-tokens'

/** Factor de persecución por frame (lag físico del seguimiento, no un easing CSS). */
const LERP = 0.18
const OFFSET = 24
const WIDTH = 280
const HEIGHT = 186

let layer: HTMLDivElement | null = null
let img: HTMLImageElement | null = null
let rafId = 0
let targetX = 0
let targetY = 0
let x = 0
let y = 0
let visible = false

function ensureLayer(): void {
  if (layer) return
  layer = document.createElement('div')
  layer.className = 'hover-preview'
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    `width: ${WIDTH}px`,
    `height: ${HEIGHT}px`,
    'z-index: 60',
    'pointer-events: none',
    'border-radius: 8px',
    'overflow: hidden',
    'background: var(--surface-2)',
    'border: var(--border-soft)',
    'box-shadow: var(--shadow-2)',
    'opacity: 0',
    'transform: translate3d(-9999px, -9999px, 0) scale(0.92)',
    `transition: opacity ${DURATION.element}s ${EASE.out}`,
  ].join(';')
  img = document.createElement('img')
  img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; display: block'
  layer.appendChild(img)
  document.body.appendChild(layer)
}

function tick(): void {
  if (!layer) return
  x += (targetX - x) * LERP
  y += (targetY - y) * LERP
  // La tarjeta vuela junto al cursor sin salirse del viewport: se abate al
  // lado contrario cuando no cabe por la derecha o por abajo.
  const px = x + OFFSET + WIDTH > window.innerWidth ? x - OFFSET - WIDTH : x + OFFSET
  const py = y + OFFSET + HEIGHT > window.innerHeight ? y - OFFSET - HEIGHT : y + OFFSET
  layer.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${visible ? 1 : 0.92})`
  if (visible || Math.abs(targetX - x) > 0.5 || Math.abs(targetY - y) > 0.5) {
    rafId = requestAnimationFrame(tick)
  } else {
    rafId = 0
  }
}

function startLoop(): void {
  if (!rafId) rafId = requestAnimationFrame(tick)
}

function show(anchor: HTMLElement, e: MouseEvent): void {
  if (!layer || !img) return
  const src = anchor.dataset.previewSrc
  if (!src) return
  img.src = src
  img.alt = anchor.dataset.previewAlt ?? ''
  targetX = e.clientX
  targetY = e.clientY
  // Primer frame sin viaje desde la posición anterior
  x = targetX
  y = targetY
  visible = true
  layer.style.opacity = '1'
  startLoop()
}

function hide(): void {
  if (!layer) return
  visible = false
  layer.style.opacity = '0'
}

/**
 * Activa la preview flotante para todos los `[data-preview-src]` bajo `root`.
 * Idempotente por elemento (marca `data-preview-bound`).
 */
export function initHoverPreview(root: ParentNode = document): void {
  if (typeof window === 'undefined') return
  if (!window.matchMedia('(pointer: fine)').matches) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const anchors = root.querySelectorAll<HTMLElement>('[data-preview-src]:not([data-preview-bound])')
  if (anchors.length === 0) return
  ensureLayer()

  anchors.forEach((anchor) => {
    anchor.setAttribute('data-preview-bound', '')
    anchor.addEventListener('mouseenter', (e) => show(anchor, e))
    anchor.addEventListener('mousemove', (e) => {
      targetX = e.clientX
      targetY = e.clientY
      startLoop()
    })
    anchor.addEventListener('mouseleave', hide)
  })
}
