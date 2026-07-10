/**
 * Motion infrastructure: Lenis smooth scroll + GSAP ScrollTrigger, wired
 * together and gated behind `prefers-reduced-motion`.
 *
 * Loaded once globally from `layouts/Base.astro` via a plain module script.
 * The gsap/lenis chunk is only fetched when motion is actually enabled
 * (dynamic `import()`), so reduced-motion users never download it and it
 * never blocks first paint.
 */

type RevealOptions = {
  /** Selector (relative to each matched element) for children to stagger in. */
  stagger?: string
  /** Gap between staggered children, in seconds. Default 0.08. */
  staggerAmount?: number
}

type ReadyCallback = () => void

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let ready = false
let reducedMotion = false
const readyQueue: ReadyCallback[] = []

// Populated once GSAP has been dynamically imported and initialized.
let gsapInstance: typeof import('gsap').gsap | null = null
let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null

function flushReadyQueue(): void {
  ready = true
  while (readyQueue.length > 0) {
    const cb = readyQueue.shift()
    cb?.()
  }
}

/**
 * Run `cb` once motion has finished initializing (or immediately if it
 * already has). Silently a no-op when reduced-motion is active — callers
 * relying on GSAP/ScrollTrigger inside `cb` should not run in that case.
 */
export function onReady(cb: ReadyCallback): void {
  if (reducedMotion) return
  if (ready) {
    cb()
    return
  }
  readyQueue.push(cb)
}

/**
 * Standard site reveal: fade + rise 24px, triggered once the element enters
 * the viewport. No-op (elements stay visible, untouched) when reduced-motion
 * is active or before GSAP has initialized.
 */
export function reveal(selector: string, opts: RevealOptions = {}): void {
  if (reducedMotion) return
  onReady(() => {
    if (!gsapInstance || !ScrollTrigger) return
    const gsap = gsapInstance

    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      const targets = opts.stagger ? Array.from(el.querySelectorAll<HTMLElement>(opts.stagger)) : el
      const hasChildren = Array.isArray(targets) ? targets.length > 0 : true
      if (!hasChildren) return

      gsap.set(targets, {opacity: 0, y: 24})

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: opts.stagger ? (opts.staggerAmount ?? 0.08) : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      })
    })
  })
}

/**
 * Access the initialized GSAP instances. Returns null before init or under
 * reduced-motion — always call from inside `onReady`.
 */
export function getMotion(): {gsap: NonNullable<typeof gsapInstance>; ScrollTrigger: NonNullable<typeof ScrollTrigger>} | null {
  return gsapInstance && ScrollTrigger ? {gsap: gsapInstance, ScrollTrigger} : null
}

async function init(): Promise<void> {
  if (prefersReducedMotion()) {
    reducedMotion = true
    return
  }

  const [{default: Lenis}, {gsap}, {ScrollTrigger: ST}] = await Promise.all([
    import('lenis'),
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])

  gsap.registerPlugin(ST)
  gsapInstance = gsap
  ScrollTrigger = ST

  const lenis = new Lenis()

  lenis.on('scroll', ST.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  flushReadyQueue()

  // Auto-apply the standard reveal to every section that opts in via markup.
  reveal('[data-reveal]')
}

init().catch((e) => console.error('motion init failed', e))
