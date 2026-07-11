/**
 * Objetos flotantes reactivos del hero (sesión 3 §3.5, patrón noth.in).
 *
 * Piezas 2.5D en DOM (SVG del mundo de Álvaro: cursor, componente UI, pieza
 * de puzzle, púa, nota) orbitando el titular: idle flotante por CSS, parallax
 * al ratón con lag en rAF y reacción de huida al hover. DOM y no WebGL a
 * propósito: coste ~0, jamás compiten con el canvas de partículas y nunca
 * cubren texto (sus anclas viven fuera de la caja del titular).
 *
 * Solo puntero fino y sin reduced-motion se mueve nada; en táctil/reduced
 * quedan como material estático del mundo (CSS los posa).
 */
import {DURATION, EASE} from './motion-tokens'

/** Profundidad de parallax por pieza (px de viaje máximo ≈ depth × 24). */
const PIECES: {className: string; depth: number; svg: string}[] = [
  {
    className: 'fl-cursor',
    depth: 1,
    svg: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 3l14 8.5-6.2 1.6L9.5 19 5 3z" fill="var(--text)" stroke="var(--surface-0)" stroke-width="1"/></svg>',
  },
  {
    className: 'fl-toggle',
    depth: 0.6,
    svg: '<svg viewBox="0 0 44 24" fill="none"><rect x="1" y="1" width="42" height="22" rx="11" stroke="var(--text)" stroke-width="2"/><circle cx="32" cy="12" r="7" fill="var(--accent)"/></svg>',
  },
  {
    className: 'fl-puzzle',
    depth: 1.4,
    svg: '<svg viewBox="0 0 32 32" fill="none"><path d="M4 12h6a4 4 0 118 0h10v8a4 4 0 100 8v0H4V12z" stroke="var(--text)" stroke-width="2" stroke-linejoin="round"/></svg>',
  },
  {
    className: 'fl-pick',
    depth: 0.8,
    svg: '<svg viewBox="0 0 24 28" fill="none"><path d="M12 26C7 20 2 14 2 8a10 6.5 0 0120 0c0 6-5 12-10 18z" stroke="var(--text)" stroke-width="2" stroke-linejoin="round"/></svg>',
  },
  {
    className: 'fl-note',
    depth: 1.2,
    svg: '<svg viewBox="0 0 24 28" fill="none"><path d="M9 22V4l10-2v16" stroke="var(--text)" stroke-width="2" stroke-linecap="round"/><ellipse cx="6" cy="22" rx="3.2" ry="2.4" fill="var(--text)"/><ellipse cx="16" cy="18" rx="3.2" ry="2.4" fill="var(--text)"/></svg>',
  },
]

export function initHeroFloaters(hero: HTMLElement): void {
  if (typeof window === 'undefined') return

  const layer = document.createElement('div')
  layer.className = 'hero-floaters'
  layer.setAttribute('aria-hidden', 'true')
  hero.appendChild(layer)

  const nodes: {el: HTMLElement; depth: number; x: number; y: number}[] = []
  for (const piece of PIECES) {
    const node = document.createElement('div')
    node.className = `hero-floater ${piece.className}`
    node.innerHTML = piece.svg
    layer.appendChild(node)
    nodes.push({el: node, depth: piece.depth, x: 0, y: 0})
  }

  const fine = window.matchMedia('(pointer: fine)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduced) return // estáticos: el CSS ya los posa

  layer.classList.add('is-alive')

  // Huida al hover: impulso en dirección opuesta al cursor + giro
  nodes.forEach((n) => {
    n.el.addEventListener('mouseenter', (e) => {
      const rect = n.el.getBoundingClientRect()
      const dx = rect.left + rect.width / 2 - e.clientX
      const dy = rect.top + rect.height / 2 - e.clientY
      const mag = Math.hypot(dx, dy) || 1
      n.el.style.transition = `translate ${DURATION.element}s ${EASE.out}, rotate ${DURATION.element}s ${EASE.out}`
      n.el.style.translate = `${(dx / mag) * 56}px ${(dy / mag) * 56}px`
      n.el.style.rotate = `${(Math.random() - 0.5) * 60}deg`
      window.setTimeout(() => {
        n.el.style.translate = '0px 0px'
        n.el.style.rotate = '0deg'
      }, DURATION.element * 1000 + 80)
    })
  })

  // Parallax con lag (persecución física en rAF)
  let tx = 0
  let ty = 0
  let raf = 0
  const tick = (): void => {
    let moving = false
    for (const n of nodes) {
      n.x += (tx * n.depth - n.x) * 0.06
      n.y += (ty * n.depth - n.y) * 0.06
      n.el.style.transform = `translate3d(${n.x}px, ${n.y}px, 0)`
      if (Math.abs(tx * n.depth - n.x) > 0.1 || Math.abs(ty * n.depth - n.y) > 0.1) moving = true
    }
    raf = moving ? requestAnimationFrame(tick) : 0
  }
  hero.addEventListener(
    'pointermove',
    (e) => {
      const rect = hero.getBoundingClientRect()
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 48
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 32
      if (!raf) raf = requestAnimationFrame(tick)
    },
    {passive: true},
  )
}
