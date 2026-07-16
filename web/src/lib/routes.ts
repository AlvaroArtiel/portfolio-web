import type {Lang} from './i18n'

/**
 * ES ↔ EN slug map for the first path segment. Spanish routes live at the
 * root (`/proyectos`), English ones under `/en/` (`/en/projects`).
 */
export const routeMap: Record<string, string> = {
  especialidades: 'expertise',
  proyectos: 'projects',
  experiencia: 'experience',
  personal: 'personal',
  blog: 'blog',
  cv: 'cv',
  contacto: 'contact',
  gracias: 'thanks',
  casa: 'house',
}

const reverseMap: Record<string, string> = Object.fromEntries(
  Object.entries(routeMap).map(([es, en]) => [en, es]),
)

/** Language a pathname belongs to. */
export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
}

/**
 * Translate a pathname to the target language, preserving deeper segments
 * (e.g. `/proyectos/vaultz` → `/en/projects/vaultz`). Unknown segments are
 * kept as-is: content slugs are shared between languages.
 */
export function altPath(pathname: string, target: Lang): string {
  const current = langFromPath(pathname)
  if (current === target) return pathname
  const segments = pathname.split('/').filter(Boolean)
  if (current === 'en') segments.shift() // drop the 'en' prefix
  const [head, ...rest] = segments
  const translatedHead =
    head === undefined ? undefined : target === 'en' ? (routeMap[head] ?? head) : (reverseMap[head] ?? head)
  const parts = target === 'en' ? ['en'] : []
  if (translatedHead !== undefined) parts.push(translatedHead, ...rest)
  const path = '/' + parts.join('/')
  return path === '/' ? '/' : path + '/'
}

/** Build a localized href from a Spanish route key (e.g. `proyectos`). */
export function pathFor(esKey: string, lang: Lang): string {
  if (esKey === '') return lang === 'en' ? '/en/' : '/'
  const slug = lang === 'en' ? (routeMap[esKey] ?? esKey) : esKey
  return lang === 'en' ? `/en/${slug}/` : `/${slug}/`
}
