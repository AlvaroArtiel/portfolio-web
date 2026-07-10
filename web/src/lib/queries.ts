import {sanityClient} from './sanity'
import type {LocaleField} from './i18n'

/** Minimal Sanity image reference shape, as returned by GROQ projections. */
export interface SanityImageRef {
  _type: 'image'
  asset: {_ref: string; _type: 'reference'}
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

export interface SanityImageWithLayout extends SanityImageRef {
  layout?: 'full' | 'double' | 'grid'
}

export interface SanityFileRef {
  _type: 'file'
  asset: {_ref: string; _type: 'reference'; url?: string}
}

export interface SanitySlug {
  current: string
}

export type LocaleBlockField = LocaleField<unknown[]>

/** Rich body content: portable text blocks, images with layout, and YouTube embeds. */
export type BodyBlock =
  | {_type: 'block'; [key: string]: unknown}
  | ({_type: 'image'} & SanityImageWithLayout)
  | {_type: 'youtube'; url?: string}

export interface Social {
  label: string
  url: string
  visible?: boolean
}

export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  heroTitle?: LocaleField
  heroSubtitle?: LocaleField
  about?: LocaleField
  email?: string
  socials?: Social[]
  cvPdf?: SanityFileRef
  /** Direct CDN URL of the uploaded CV file, if any (see siteSettingsQuery projection). */
  cvPdfUrl?: string
  seoTitle?: LocaleField
  seoDescription?: LocaleField
}

export interface Experience {
  _id: string
  _type: 'experience'
  company?: LocaleField
  role?: LocaleField
  type?: 'fulltime' | 'freelance' | 'founder'
  startDate?: string
  endDate?: string
  location?: LocaleField
  modality?: LocaleField
  summary?: LocaleField
  bullets?: LocaleField[]
  logo?: SanityImageRef
  relatedProjects?: {_ref: string; _type: 'reference'}[]
  order?: number
  visible?: boolean
}

export interface Education {
  _id: string
  _type: 'education'
  school?: LocaleField
  degree?: LocaleField
  startDate?: string
  endDate?: string
  award?: LocaleField
  description?: LocaleField
  order?: number
  visible?: boolean
}

export interface Project {
  _id: string
  _type: 'project'
  title?: LocaleField
  slug: SanitySlug
  category?: 'propio' | 'cliente' | 'formacion' | 'personal'
  featured?: boolean
  year?: string
  role?: LocaleField
  stack?: string[]
  summary?: LocaleField
  heroMedia?: SanityImageRef[]
  cover?: SanityImageRef
  body?: {es?: BodyBlock[]; en?: BodyBlock[]}
  externalUrl?: string
  /** Reference in list queries; dereferenced by the detail query. */
  nextProject?: {_ref?: string; _id?: string; title?: LocaleField; slug?: SanitySlug; cover?: SanityImageRef} | null
  visible?: boolean
  order?: number
}

export interface PersonalChapter {
  _id: string
  _type: 'personalChapter'
  title?: LocaleField
  emoji?: string
  description?: LocaleField
  order?: number
}

export interface PersonalItem {
  _id: string
  _type: 'personalItem'
  kind?: 'photo' | 'video'
  chapter?: {_ref: string; _type: 'reference'}
  image?: SanityImageRef
  youtubeUrl?: string
  caption?: LocaleField
  date?: string
  visible?: boolean
}

export interface PersonalChapterWithItems extends PersonalChapter {
  items: PersonalItem[]
}

export interface BlogPost {
  _id: string
  _type: 'blogPost'
  title?: LocaleField
  slug: SanitySlug
  date?: string
  tags?: string[]
  excerpt?: LocaleField
  body?: LocaleBlockField
  cover?: SanityImageRef
  published?: boolean
}

const siteSettingsQuery = /* groq */ `
  *[_type == 'siteSettings'][0]{
    ...,
    "cvPdfUrl": cvPdf.asset->url
  }
`

const experiencesQuery = /* groq */ `
  *[_type == 'experience' && visible != false] | order(order asc)
`

const educationQuery = /* groq */ `
  *[_type == 'education' && visible != false] | order(order asc)
`

const projectsQuery = /* groq */ `
  *[_type == 'project' && visible != false] | order(order asc)
`

const projectBySlugQuery = /* groq */ `
  *[_type == 'project' && slug.current == $slug][0]{
    ...,
    nextProject->{_id, title, "slug": slug, cover}
  }
`

const chaptersWithItemsQuery = /* groq */ `
  *[_type == 'personalChapter'] | order(order asc) {
    ...,
    "items": *[_type == 'personalItem' && chapter._ref == ^._id && visible != false] | order(date asc)
  }
`

const postsQuery = /* groq */ `
  *[_type == 'blogPost' && published == true] | order(date desc)
`

const postBySlugQuery = /* groq */ `
  *[_type == 'blogPost' && slug.current == $slug && published == true][0]
`

export function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch(siteSettingsQuery)
}

export function getExperiences(): Promise<Experience[]> {
  return sanityClient.fetch(experiencesQuery)
}

export function getEducation(): Promise<Education[]> {
  return sanityClient.fetch(educationQuery)
}

export function getProjects(): Promise<Project[]> {
  return sanityClient.fetch(projectsQuery)
}

export function getProject(slug: string): Promise<Project | null> {
  return sanityClient.fetch(projectBySlugQuery, {slug})
}

export function getChaptersWithItems(): Promise<PersonalChapterWithItems[]> {
  return sanityClient.fetch(chaptersWithItemsQuery)
}

export function getPosts(): Promise<BlogPost[]> {
  return sanityClient.fetch(postsQuery)
}

export function getPost(slug: string): Promise<BlogPost | null> {
  return sanityClient.fetch(postBySlugQuery, {slug})
}
