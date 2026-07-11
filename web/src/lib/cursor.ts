/**
 * Cursor propio con estados (sesión 3 §3.6, G2): punto 1:1 + aro que persigue
 * con lag. Estados declarativos por atributo:
 *   - `data-cursor="view"`  → píldora «VER →» (cartas de proyecto/blog)
 *   - `data-cursor="drag"`  → píldora «ARRASTRA» (polaroids)
 *   - `data-cursor-label="…"` → píldora con etiqueta arbitraria (filtros)
 *   - cualquier interactivo sin atributo → el aro crece
 *
 * Accesibilidad y presupuesto:
 *   - Solo puntero fino; jamás en táctil ni en `forced-colors`.
 *   - `prefers-reduced-motion`: el aro va 1:1 (sin persecución animada).
 *   - No usamos `!important`: quien fuerce el cursor del sistema (hoja de
 *     usuario / extensión) lo recupera; los campos de texto conservan caret.
 */
import {EASE, DURATION} from './motion-tokens'

const INTERACTIVE = 'a, button, [role="button"], summary, select, label, input, textarea'

export function initCursor(): void {
  if (typeof window === 'undefined') return
  if (!window.matchMedia('(pointer: fine)').matches) return
  if (window.matchMedia('(forced-colors: active)').matches) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lang = document.documentElement.lang === 'en' ? 'en' : 'es'
  const LABELS: Record<string, string> = {
    view: lang === 'en' ? 'VIEW →' : 'VER →',
    drag: lang === 'en' ? 'DRAG' : 'ARRASTRA',
  }

  const style = document.createElement('style')
  style.textContent = `
    html.has-custom-cursor,
    html.has-custom-cursor a,
    html.has-custom-cursor button,
    html.has-custom-cursor summary,
    html.has-custom-cursor select,
    html.has-custom-cursor label,
    html.has-custom-cursor [role="button"] { cursor: none; }
    .aa-cursor-dot {
      position: fixed; top: 0; left: 0; width: 7px; height: 7px;
      border-radius: 50%; background: var(--accent);
      z-index: 999; pointer-events: none;
      transform: translate(-50%, -50%);
      transition: scale ${DURATION.micro}s ${EASE.out};
    }
    .aa-cursor-ring {
      position: fixed; top: 0; left: 0; width: 36px; height: 36px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--text) 45%, transparent);
      z-index: 998; pointer-events: none;
      display: flex; align-items: center; justify-content: center;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
      transition:
        width ${DURATION.micro}s ${EASE.out},
        height ${DURATION.micro}s ${EASE.out},
        background ${DURATION.micro}s ${EASE.out},
        border-color ${DURATION.micro}s ${EASE.out};
    }
    .aa-cursor-ring .aa-cursor-label {
      font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.06em;
      color: var(--bg); white-space: nowrap; padding: 0 0.9em;
      opacity: 0; transition: opacity ${DURATION.micro}s ${EASE.out};
    }
    .aa-cursor-ring.is-grown { width: 56px; height: 56px; }
    .aa-cursor-ring.is-label {
      width: auto; height: 30px; background: var(--accent);
      border-color: var(--accent); mix-blend-mode: normal;
    }
    .aa-cursor-ring.is-label .aa-cursor-label { opacity: 1; }
    .aa-cursor-hidden .aa-cursor-dot, .aa-cursor-hidden .aa-cursor-ring { opacity: 0; }
  `
  document.head.appendChild(style)

  const dot = document.createElement('span')
  dot.className = 'aa-cursor-dot'
  dot.setAttribute('aria-hidden', 'true')
  const ring = document.createElement('span')
  ring.className = 'aa-cursor-ring'
  ring.setAttribute('aria-hidden', 'true')
  const label = document.createElement('span')
  label.className = 'aa-cursor-label'
  ring.appendChild(label)
  document.body.append(dot, ring)
  document.documentElement.classList.add('has-custom-cursor', 'aa-cursor-hidden')

  let x = -100
  let y = -100
  let rx = -100
  let ry = -100
  let raf = 0

  const tick = (): void => {
    // Persecución del aro (lag físico); 1:1 con reduced-motion
    const k = reduced ? 1 : 0.16
    rx += (x - rx) * k
    ry += (y - ry) * k
    ring.style.translate = `${rx}px ${ry}px`
    raf = Math.abs(x - rx) > 0.15 || Math.abs(y - ry) > 0.15 ? requestAnimationFrame(tick) : 0
  }

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      dot.style.translate = `${x}px ${y}px`
      document.documentElement.classList.remove('aa-cursor-hidden')
      if (!raf) raf = requestAnimationFrame(tick)
    },
    {passive: true},
  )
  document.addEventListener('pointerdown', () => (dot.style.scale = '0.6'))
  document.addEventListener('pointerup', () => (dot.style.scale = '1'))
  document.documentElement.addEventListener('mouseleave', () =>
    document.documentElement.classList.add('aa-cursor-hidden'),
  )

  // Estados por delegación
  const setState = (el: Element | null): void => {
    ring.classList.remove('is-grown', 'is-label')
    if (!el) return
    const tagged = el.closest<HTMLElement>('[data-cursor], [data-cursor-label]')
    if (tagged) {
      const kind = tagged.dataset.cursor
      const text = tagged.dataset.cursorLabel ?? (kind ? LABELS[kind] : '')
      if (text) {
        label.textContent = text
        ring.classList.add('is-label')
        return
      }
    }
    if (el.closest(INTERACTIVE)) ring.classList.add('is-grown')
  }
  document.addEventListener('pointerover', (e) => setState(e.target as Element), {passive: true})
}
