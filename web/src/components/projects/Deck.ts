/**
 * Stacked deck behaviour (pxpush pattern): cards stick at the same offset so
 * each incoming card covers the previous one; the covered card scales down
 * slightly with a scrubbed parallax. Also owns the "reshuffle" animation when
 * a category filter changes: excluded cards fly out with faked physics, the
 * remaining ones re-stack.
 *
 * The sticky stacking itself is pure CSS (works under reduced-motion and
 * without JS); this module only adds the parallax and the reshuffle, so it is
 * inert when `motion.ts` is inert.
 */
import {onReady, getMotion} from '../../lib/motion'

const MOBILE_QUERY = '(max-width: 720px)'

function initParallax(): void {
  const motion = getMotion()
  if (!motion || window.matchMedia(MOBILE_QUERY).matches) return
  const {gsap, ScrollTrigger} = motion

  document.querySelectorAll<HTMLElement>('[data-deck]').forEach((deck) => {
    const cards = Array.from(deck.querySelectorAll<HTMLElement>('[data-deck-card]'))
    cards.forEach((card, index) => {
      const next = cards[index + 1]
      if (!next) return
      // Solo escala en la tarjeta; la atenuación va a la imagen para no
      // hundir el contraste del texto (auditoría AA).
      const scrollTrigger = {trigger: next, start: 'top bottom', end: 'top top+=12%', scrub: true}
      gsap.to(card, {scale: 0.94, ease: 'none', scrollTrigger})
      const media = card.querySelector('.pc-media, .card-media')
      if (media) gsap.to(media, {opacity: 0.55, ease: 'none', scrollTrigger: {...scrollTrigger}})
    })
    // Los triggers dependen de la altura de las tarjetas (imágenes lazy).
    deck.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), {once: true})
    })
  })
}

function initReshuffle(): void {
  document.addEventListener('deck:filter', (event) => {
    const motion = getMotion()
    const deck = document.querySelector<HTMLElement>('[data-deck]')
    if (!motion || !deck) return // sin motion: Filters hace el corte directo
    event.preventDefault()

    const {gsap, ScrollTrigger} = motion
    const cat = (event as CustomEvent<{cat: string}>).detail.cat
    const cards = Array.from(deck.querySelectorAll<HTMLElement>('[data-deck-card]'))
    const leaving = cards.filter((card) => !card.hidden && cat !== '' && card.dataset.category !== cat)
    const entering = cards.filter((card) => card.hidden && (cat === '' || card.dataset.category === cat))
    const staying = cards.filter((card) => !card.hidden && (cat === '' || card.dataset.category === cat))

    // Física fingida: cada carta excluida sale volando con su propio impulso.
    leaving.forEach((card, index) => {
      const drift = (Math.random() - 0.5) * 600
      gsap.to(card, {
        x: drift,
        y: 320 + Math.random() * 240,
        rotation: (Math.random() - 0.5) * 40,
        opacity: 0,
        duration: 0.55,
        delay: index * 0.06,
        ease: 'power2.in',
        onComplete: () => {
          card.hidden = true
          gsap.set(card, {clearProps: 'all'})
          ScrollTrigger.refresh()
        },
      })
    })

    // Las que entran se reapilan desde abajo con stagger.
    entering.forEach((card) => {
      card.hidden = false
    })
    if (entering.length > 0) {
      gsap.fromTo(
        entering,
        {y: 120, opacity: 0, rotation: () => (Math.random() - 0.5) * 6},
        {y: 0, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: leaving.length > 0 ? 0.25 : 0, onComplete: () => ScrollTrigger.refresh()},
      )
    }
    if (leaving.length === 0 && entering.length === 0 && staying.length > 0) ScrollTrigger.refresh()
  })
}

export function initDeck(): void {
  onReady(() => {
    initParallax()
    initReshuffle()
  })
}
