/**
 * Lenguaje de movimiento único del sitio (remediación A4, spec §5.1/§5.2).
 *
 * Antes de esta tarea cada efecto (partículas, deck, líquido, reveals,
 * timeline, menú, mesa) llevaba su propia curva y duración sueltas — el
 * sitio "respiraba" a ritmos distintos según la sección. Esta es la única
 * fuente de verdad: dos curvas (entrada / trayecto) y tres duraciones
 * (micro / elemento / sección). Prohibido un valor de easing o duración
 * suelto en el código: o importa de aquí, o lleva un comentario que
 * justifique por qué queda fuera del sistema (p. ej. un ease-in de salida,
 * o parámetros de un motor de físicas que no son "easing" en sentido CSS).
 *
 * Espejo CSS: `web/src/styles/tokens.css` define las mismas curvas y
 * duraciones como custom properties (`--ease-out-token`, `--ease-inout-token`,
 * `--dur-micro/element/section`) para que las transiciones CSS puras
 * compartan el mismo lenguaje sin depender de JS.
 */

/** Las dos únicas curvas del sitio. Prohibido un cubic-bezier suelto. */
export const EASE = {
  out: 'cubic-bezier(0.22, 1, 0.36, 1)', // entradas (reveals, apariciones)
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)', // trayectos/scrub (algo se desplaza de A a B)
} as const

/**
 * Versiones GSAP de las mismas curvas.
 *
 * GSAP no acepta strings cubic-bezier sin el plugin CustomEase (de pago,
 * Club GreenSock) — no lo usamos. Se documentan aquí los equivalentes core
 * más próximos: `expo.out` materializa EASE.out (entradas contundentes y
 * suaves) y `power2.inOut` materializa EASE.inOut (trayectos con
 * aceleración y frenada simétricas). No son bit-a-bit la misma curva que el
 * cubic-bezier CSS, pero comunican el mismo lenguaje de movimiento.
 */
export const EASE_GSAP = {
  out: 'expo.out',
  inOut: 'power2.inOut',
} as const

/** Duraciones del sitio, en segundos (para GSAP). */
export const DURATION = {micro: 0.2, element: 0.5, section: 0.9} as const

/** Rango de scrub admisible en ScrollTrigger: 0.8–1.2. Valor por defecto: 1. */
export const SCRUB = 1 as const

/** Reveal estándar: distancia de elevación (px) y separación del stagger (s). */
export const REVEAL = {rise: 32, stagger: 0.07} as const

/** Techo del parallax, como fracción del alto del elemento. */
export const PARALLAX_MAX = 0.08 as const
