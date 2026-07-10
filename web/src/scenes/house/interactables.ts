/**
 * Interactuables de la casa: 5 objetos con radio de proximidad, resumen y
 * link real (spec §6.2: escritorio→proyectos, estantería→experiencia,
 * diploma→cv, guitarra→personal, puerta→contacto).
 */
import type {Lang} from '../../lib/i18n'

export interface Interactable {
  id: string
  /** Posición del objeto en el mundo (x, z; y implícita). */
  x: number
  z: number
  radius: number
  label: {es: string; en: string}
  summary: {es: string; en: string}
  href: {es: string; en: string}
}

export const interactables: Interactable[] = [
  {
    id: 'desk',
    x: -3.4,
    z: -3.2,
    radius: 2.3,
    label: {es: 'El escritorio', en: 'The desk'},
    summary: {
      es: 'Aquí nacen los proyectos: del primer boceto al deploy.',
      en: 'This is where projects are born: from first sketch to deploy.',
    },
    href: {es: '/proyectos/', en: '/en/projects/'},
  },
  {
    id: 'shelf',
    x: 3.6,
    z: -3.6,
    radius: 2.3,
    label: {es: 'La estantería', en: 'The bookshelf'},
    summary: {
      es: 'Cada balda, una etapa: agencias, startups y productos propios.',
      en: 'Every shelf a chapter: agencies, startups and own products.',
    },
    href: {es: '/experiencia/', en: '/en/experience/'},
  },
  {
    id: 'diploma',
    x: 0,
    z: -4.6,
    radius: 2.1,
    label: {es: 'El diploma', en: 'The diploma'},
    summary: {
      es: 'La versión formal, en una columna y lista para imprimir.',
      en: 'The formal version, single column and print-ready.',
    },
    href: {es: '/cv/', en: '/en/cv/'},
  },
  {
    id: 'guitar',
    x: 4.2,
    z: 2.6,
    radius: 2.2,
    label: {es: 'La guitarra', en: 'The guitar'},
    summary: {
      es: 'Carnavales, teatro, cocina y fotos: lo que no cabe en un CV.',
      en: 'Carnivals, theatre, cooking and photos: what a CV cannot hold.',
    },
    href: {es: '/personal/', en: '/en/personal/'},
  },
  {
    id: 'door',
    x: -4.6,
    z: 2.8,
    radius: 2.4,
    label: {es: 'La puerta', en: 'The door'},
    summary: {
      es: '¿Hablamos? Salida directa al formulario de contacto.',
      en: 'Shall we talk? Straight to the contact form.',
    },
    href: {es: '/contacto/', en: '/en/contact/'},
  },
]

export function t(field: {es: string; en: string}, lang: Lang): string {
  return field[lang]
}
