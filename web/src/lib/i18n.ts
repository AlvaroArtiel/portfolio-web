export type Lang = 'es' | 'en'

/** A locale-keyed field as stored in Sanity: { es: T; en?: T } */
export type LocaleField<T = string> = {es?: T; en?: T} | null | undefined

/**
 * Read a locale field with fallback: requested language, then Spanish
 * (the mandatory source language in the Studio), then an empty string.
 */
export function t<T = string>(field: LocaleField<T>, lang: Lang): T | '' {
  return (field?.[lang] ?? field?.es ?? '') as T | ''
}

export const languages: Lang[] = ['es', 'en']
export const defaultLang: Lang = 'es'

type UiDictionary = Record<string, string>

export const ui: Record<Lang, UiDictionary> = {
  es: {
    nav_projects: 'Proyectos',
    nav_experience: 'Experiencia',
    nav_personal: 'Personal',
    nav_blog: 'Blog',
    nav_cv: 'CV',
    nav_contact: 'Contacto',
    read_more: 'Leer más',
    next_project: 'Siguiente proyecto',
    back_to_projects: 'Volver a proyectos',
    form_name: 'Nombre',
    form_email: 'Email',
    form_message: 'Mensaje',
    form_submit: 'Enviar',
    form_success: 'Mensaje enviado correctamente.',
    form_error: 'Ha ocurrido un error. Inténtalo de nuevo.',
    download_cv: 'Descargar CV',
    view_project: 'Ver proyecto',
    external_link: 'Enlace externo',
    all_categories: 'Todos',
  },
  en: {
    nav_projects: 'Projects',
    nav_experience: 'Experience',
    nav_personal: 'Personal',
    nav_blog: 'Blog',
    nav_cv: 'CV',
    nav_contact: 'Contact',
    read_more: 'Read more',
    next_project: 'Next project',
    back_to_projects: 'Back to projects',
    form_name: 'Name',
    form_email: 'Email',
    form_message: 'Message',
    form_submit: 'Send',
    form_success: 'Message sent successfully.',
    form_error: 'Something went wrong. Please try again.',
    download_cv: 'Download CV',
    view_project: 'View project',
    external_link: 'External link',
    all_categories: 'All',
  },
}
