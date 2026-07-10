/**
 * Camaleón intra-página (remediación A3): el acento —y un tinte sutil del
 * fondo— MUTAN DURANTE el scroll al atravesar secciones, en vez de cambiar
 * solo al navegar entre páginas. Un ScrollTrigger por transición interpola
 * las custom properties en `:root` con scrub, de modo que las secciones se
 * funden sin cortes de banda.
 *
 * Reduced-motion / sin GSAP: no se registra nada — el acento queda fijo por
 * sección (el fallback que pide el spec).
 */
import {onReady, getMotion} from './motion'
import {SCRUB} from './motion-tokens'

const SURFACE_0 = '#0c0c0e'
/** Cuánto acento se mezcla en el fondo (±3% de luminancia percibida). */
const BG_TINT = 0.035

interface Stop {
  /** Selector de la sección que "posee" este acento. */
  selector: string
  /** Acento (hex) al que muta la página cuando la sección entra. */
  accent: string
}

/**
 * Registra la mutación continua del acento a lo largo de la página.
 * `stops` en orden de documento; el primero define el estado inicial.
 */
export function initChameleon(stops: Stop[]): void {
  onReady(() => {
    const motion = getMotion()
    if (!motion || stops.length < 2) return
    const {gsap, ScrollTrigger} = motion
    const root = document.documentElement

    const apply = (accent: string) => {
      root.style.setProperty('--accent', accent)
      // Tinte de fondo: el negro base se inclina imperceptiblemente hacia
      // el acento — cose las secciones sin bandas.
      root.style.setProperty('--surface-0', gsap.utils.interpolate(SURFACE_0, accent)(BG_TINT))
    }

    for (let i = 0; i < stops.length - 1; i++) {
      const from = stops[i]
      const to = stops[i + 1]
      const target = document.querySelector(to.selector)
      if (!target) continue
      const mix = gsap.utils.interpolate(from.accent, to.accent)

      // La transición ocurre cuando la sección entrante cruza la mitad del
      // viewport: cada acento mantiene su meseta mientras SU sección ocupa
      // el centro de la vista, y la mutación se percibe justo en el relevo.
      ScrollTrigger.create({
        trigger: target,
        start: 'top 45%',
        end: 'top 5%',
        scrub: SCRUB,
        onUpdate(self) {
          apply(mix(self.progress))
        },
      })
    }
  })
}

/**
 * Variante suave para páginas largas de un solo acento (ficha, personal):
 * el fondo gana el tinte del acento progresivamente a lo largo de la página.
 */
export function initChameleonTint(accent: string): void {
  onReady(() => {
    const motion = getMotion()
    if (!motion) return
    const {gsap, ScrollTrigger} = motion
    const root = document.documentElement
    const mix = gsap.utils.interpolate(SURFACE_0, accent)

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: SCRUB,
      onUpdate(self) {
        // Sube hasta el tinte máximo a mitad de página y vuelve al cierre.
        const wave = Math.sin(self.progress * Math.PI)
        root.style.setProperty('--surface-0', mix(BG_TINT * wave))
      },
    })
  })
}
