/**
 * Reveal por líneas (patrón "cinetica"): el párrafo entra línea a línea en
 * vez de como bloque único. Sin SplitText (de pago, Club GreenSock):
 * dividimos manualmente en palabras, las envolvemos en `<span class="lr-word">`
 * conservando cualquier envoltura existente (p. ej. `<em class="hl">`), y
 * agrupamos esas palabras en líneas comparando `offsetTop` tras el layout del
 * navegador — no hay forma fiable de saber dónde rompe el texto sin medir.
 *
 * Gated tras `onReady`: sin motion (reduced-motion o antes de que GSAP
 * inicialice) el split no ocurre y el párrafo queda intacto y legible.
 */
import {onReady, getMotion} from './motion'
import {DURATION, REVEAL, EASE_GSAP} from './motion-tokens'

/** Tolerancia (px) para considerar dos palabras en la misma línea. */
const LINE_TOLERANCE = 4
/** Debounce del reagrupado en resize. */
const RESIZE_DEBOUNCE = 200

/**
 * Envuelve cada "palabra" (token no-espacio) de un nodo de texto en un
 * `span.lr-word`, dejando los espacios como nodos de texto sueltos entre
 * ellos (así el ajuste de línea del navegador no cambia).
 */
function wrapTextNode(textNode: Text): void {
  const text = textNode.textContent ?? ''
  if (text.trim() === '') return
  const parts = text.split(/(\s+)/)
  const frag = document.createDocumentFragment()
  for (const part of parts) {
    if (part === '') continue
    if (/^\s+$/.test(part)) {
      frag.appendChild(document.createTextNode(part))
    } else {
      const span = document.createElement('span')
      span.className = 'lr-word'
      span.textContent = part
      frag.appendChild(span)
    }
  }
  textNode.replaceWith(frag)
}

/**
 * Recorre los hijos de `root` envolviendo palabras. Recursivo: cualquier
 * elemento hijo (p. ej. `<em class="hl">`) conserva su envoltorio propio —
 * solo se envuelven las palabras dentro de él, no el elemento en sí.
 */
function wrapWords(root: HTMLElement): void {
  // Snapshot: vamos a mutar la lista de hijos mientras iteramos.
  const children = Array.from(root.childNodes)
  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      wrapTextNode(child as Text)
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      wrapWords(child as HTMLElement)
    }
  }
}

/** Agrupa palabras (en orden de documento) por línea renderizada. */
function groupLines(words: HTMLElement[]): HTMLElement[][] {
  const lines: HTMLElement[][] = []
  let currentTop: number | null = null
  for (const word of words) {
    const top = word.offsetTop
    if (currentTop === null || Math.abs(top - currentTop) > LINE_TOLERANCE) {
      lines.push([word])
      currentTop = top
    } else {
      lines[lines.length - 1].push(word)
    }
  }
  return lines
}

/**
 * Divide el/los elemento(s) que casen `selector` en palabras y las revela
 * línea a línea al entrar en viewport. No-op bajo reduced-motion (todo el
 * camino pasa por `onReady`, que no corre en ese caso).
 */
export function initLineReveal(selector: string): void {
  onReady(() => {
    const motion = getMotion()
    if (!motion) return
    const {gsap, ScrollTrigger} = motion

    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      wrapWords(el)
      const words = Array.from(el.querySelectorAll<HTMLElement>('.lr-word'))
      if (words.length === 0) return

      gsap.set(words, {opacity: 0, y: REVEAL.rise})

      let fired = false
      let timeline: ReturnType<typeof gsap.timeline> | null = null
      let trigger: InstanceType<typeof ScrollTrigger> | null = null

      const build = () => {
        if (fired) return
        timeline?.kill()
        trigger?.kill()

        const lines = groupLines(words)
        const tl = gsap.timeline({paused: true})
        lines.forEach((line, i) => {
          tl.to(
            line,
            {
              opacity: 1,
              y: 0,
              duration: DURATION.element,
              ease: EASE_GSAP.out,
            },
            i * REVEAL.stagger,
          )
        })
        timeline = tl

        trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            fired = true
            tl.play()
          },
        })
      }

      build()

      let resizeTimer: ReturnType<typeof setTimeout> | undefined
      window.addEventListener('resize', () => {
        if (fired) return
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(build, RESIZE_DEBOUNCE)
      })
    })
  })
}
