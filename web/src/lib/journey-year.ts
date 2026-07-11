/**
 * Año gigante del viaje temporal de /experiencia (sesión 3, patrón cinetica).
 *
 * Un contador de 4 dígitos estilo odómetro vive sticky en el carril lateral;
 * cada dígito es un rodillo vertical (0-9) que gira hasta la cifra objetivo
 * cuando el scroll cruza una etapa. Sin GSAP disponible (reduced-motion o
 * fallo de init) el módulo no arranca: el CSS enseña entonces los años por
 * etapa (`.stage-year`), que son el fallback estático.
 */
import {onReady, getMotion} from './motion'
import {DURATION, EASE_GSAP} from './motion-tokens'

export interface JourneyYearOptions {
  /** Contenedor del viaje: recibe la clase `is-live` cuando el rodillo manda. */
  journey: HTMLElement
  /** Elemento donde se construye el odómetro (su contenido se sustituye). */
  display: HTMLElement
  /** Etapas en orden de documento, cada una con `data-year="YYYY"`. */
  stages: HTMLElement[]
}

export function initJourneyYear({journey, display, stages}: JourneyYearOptions): void {
  const years = stages.map((s) => s.dataset.year ?? '')
  if (years.length === 0 || years.some((y) => !/^\d{4}$/.test(y))) return

  onReady(() => {
    const motion = getMotion()
    if (!motion) return
    const {gsap, ScrollTrigger} = motion

    // Odómetro: 4 columnas, cada una con un rodillo 0-9.
    display.textContent = ''
    const reels: HTMLElement[] = []
    for (let i = 0; i < 4; i++) {
      const col = document.createElement('span')
      col.className = 'jy-col'
      const reel = document.createElement('span')
      reel.className = 'jy-reel'
      for (let d = 0; d <= 9; d++) {
        const digit = document.createElement('span')
        digit.textContent = String(d)
        reel.appendChild(digit)
      }
      col.appendChild(reel)
      display.appendChild(col)
      reels.push(reel)
    }

    let current = ''
    const setYear = (year: string, instant = false): void => {
      if (year === current) return
      current = year
      year.split('').forEach((ch, i) => {
        gsap.to(reels[i], {
          yPercent: -Number(ch) * 10,
          duration: instant ? 0 : DURATION.element,
          ease: EASE_GSAP.inOut,
          overwrite: 'auto',
        })
      })
    }

    journey.classList.add('is-live')
    setYear(years[0], true)

    stages.forEach((stage, i) => {
      ScrollTrigger.create({
        trigger: stage,
        start: 'top 60%',
        end: 'bottom 60%',
        onEnter: () => setYear(years[i]),
        onEnterBack: () => setYear(years[i]),
        // Al salir por arriba, el año vigente vuelve a ser el de la etapa anterior
        // (entre etapas hay huecos de grid donde ningún trigger está activo).
        onLeaveBack: () => {
          if (i > 0) setYear(years[i - 1])
        },
      })
    })
  })
}
