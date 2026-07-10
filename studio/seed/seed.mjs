// Seeds the Sanity `production` dataset with initial bilingual content and
// generated placeholder images. Idempotent: every document uses a
// deterministic _id and is written with createOrReplace.
//
// Usage: node studio/seed/seed.mjs   (run from anywhere; paths are resolved
// relative to this file)

import {createClient} from '@sanity/client'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {generatePlaceholder, IMG_DIR} from './generate-images.mjs'
import {
  EXPERIENCE,
  EDUCATION,
  PROJECTS,
  PERSONAL_CHAPTERS,
  PERSONAL_ITEMS,
  BLOG_POST,
  SITE_SETTINGS,
} from './content.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_ENV_PATH = path.join(__dirname, '..', '..', '.env')

const ACCENT_PROJECT = '#5B8CFF'
const ACCENT_PERSONAL = '#FF7847'
const ACCENT_BLOG = '#4FD1C5'

// ---------------------------------------------------------------------------
// .env parsing (no dependency — root .env has simple KEY=VALUE lines)
// ---------------------------------------------------------------------------

async function loadRootEnv() {
  const raw = await readFile(ROOT_ENV_PATH, 'utf8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

// ---------------------------------------------------------------------------
// Relations (experience -> related projects)
// ---------------------------------------------------------------------------

const RELATED_PROJECTS = {
  'experience-tentuplaza': ['project-tentuplaza-plataforma'],
  'experience-ceustack': ['project-ranquea', 'project-ultracarta', 'project-vaultz'],
  'experience-consultor-independiente': [
    'project-watcheers',
    'project-benext',
    'project-controlfacturacion',
  ],
  'experience-esperando-render': [],
  'experience-auraprods': ['project-campus-auraprods'],
  'experience-iurban': ['project-crm-iurban'],
  'experience-8pecados': [],
}

async function main() {
  const env = await loadRootEnv()
  const projectId = env.SANITY_PROJECT_ID
  const dataset = env.SANITY_DATASET
  const token = env.SANITY_AUTH_TOKEN
  if (!projectId || !dataset || !token) {
    throw new Error(
      'Missing SANITY_PROJECT_ID / SANITY_DATASET / SANITY_AUTH_TOKEN in root .env',
    )
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  })

  console.log(`Seeding project ${projectId} / dataset ${dataset}...`)

  // -------------------------------------------------------------------------
  // 1. Generate placeholder images
  // -------------------------------------------------------------------------
  console.log('Generating placeholder images...')
  for (const p of PROJECTS) {
    await generatePlaceholder({
      filename: `${p.id}-cover`,
      title: p.title.es,
      accent: ACCENT_PROJECT,
      seedKey: `${p.id}-cover`,
    })
    await generatePlaceholder({
      filename: `${p.id}-hero-1`,
      title: p.title.es,
      accent: ACCENT_PROJECT,
      seedKey: `${p.id}-hero-1`,
    })
    await generatePlaceholder({
      filename: `${p.id}-hero-2`,
      title: p.title.es,
      accent: ACCENT_PROJECT,
      seedKey: `${p.id}-hero-2`,
    })
  }
  for (const item of PERSONAL_ITEMS) {
    await generatePlaceholder({
      filename: item.id,
      title: '',
      accent: ACCENT_PERSONAL,
      seedKey: item.id,
    })
  }
  await generatePlaceholder({
    filename: 'blogPost-por-que-esta-web-cover',
    title: BLOG_POST.title.es,
    accent: ACCENT_BLOG,
    seedKey: 'blogPost-por-que-esta-web-cover',
  })
  console.log('Images generated in', IMG_DIR)

  // -------------------------------------------------------------------------
  // 2. Upload image assets
  // -------------------------------------------------------------------------
  const assetCache = new Map()
  async function uploadImage(filename) {
    if (assetCache.has(filename)) return assetCache.get(filename)
    const filePath = path.join(IMG_DIR, `${filename}.png`)
    const buffer = await readFile(filePath)
    const asset = await client.assets.upload('image', buffer, {filename: `${filename}.png`})
    assetCache.set(filename, asset)
    console.log(`  uploaded ${filename} -> ${asset._id}`)
    return asset
  }

  function imageField(asset) {
    return {
      _type: 'image',
      asset: {_type: 'reference', _ref: asset._id},
    }
  }

  console.log('Uploading project images...')
  const projectAssets = {}
  for (const p of PROJECTS) {
    const cover = await uploadImage(`${p.id}-cover`)
    const hero1 = await uploadImage(`${p.id}-hero-1`)
    const hero2 = await uploadImage(`${p.id}-hero-2`)
    projectAssets[p.id] = {cover, hero1, hero2}
  }

  console.log('Uploading personal item images...')
  const personalAssets = {}
  for (const item of PERSONAL_ITEMS) {
    personalAssets[item.id] = await uploadImage(item.id)
  }

  console.log('Uploading blog cover image...')
  const blogCoverAsset = await uploadImage('blogPost-por-que-esta-web-cover')

  // -------------------------------------------------------------------------
  // 3. Build & write documents
  // -------------------------------------------------------------------------
  const docs = []

  for (const e of EXPERIENCE) {
    docs.push({
      _id: e.id,
      _type: 'experience',
      company: e.company,
      role: e.role,
      type: e.type,
      startDate: e.startDate,
      endDate: e.endDate,
      location: e.location,
      modality: e.modality,
      summary: e.summary,
      bullets: e.bullets.map((b) => ({...b, _key: `${e.id}-${e.bullets.indexOf(b)}`})),
      relatedProjects: (RELATED_PROJECTS[e.id] || []).map((refId, i) => ({
        _type: 'reference',
        _ref: refId,
        _key: `${e.id}-rel-${i}`,
      })),
      order: e.order,
      visible: true,
    })
  }

  for (const ed of EDUCATION) {
    docs.push({
      _id: ed.id,
      _type: 'education',
      school: ed.school,
      degree: ed.degree,
      startDate: ed.startDate,
      endDate: ed.endDate,
      award: ed.award,
      description: ed.description,
      order: ed.order,
      visible: true,
    })
  }

  for (const p of PROJECTS) {
    const assets = projectAssets[p.id]
    docs.push({
      _id: p.id,
      _type: 'project',
      title: p.title,
      slug: {_type: 'slug', current: p.id.replace(/^project-/, '')},
      category: p.category,
      featured: p.featured,
      year: p.year,
      role: p.role,
      stack: p.stack,
      summary: p.summary,
      heroMedia: [imageField(assets.hero1), imageField(assets.hero2)].map((img, i) => ({
        ...img,
        _key: `${p.id}-hero-${i}`,
      })),
      cover: imageField(assets.cover),
      body: p.body,
      externalUrl: p.externalUrl || undefined,
      nextProject: p.nextProjectId
        ? {_type: 'reference', _ref: p.nextProjectId}
        : undefined,
      visible: true,
      order: p.order,
    })
  }

  for (const c of PERSONAL_CHAPTERS) {
    docs.push({
      _id: c.id,
      _type: 'personalChapter',
      title: c.title,
      emoji: c.emoji,
      description: c.description,
      order: c.order,
    })
  }

  for (const item of PERSONAL_ITEMS) {
    docs.push({
      _id: item.id,
      _type: 'personalItem',
      kind: item.kind,
      chapter: {_type: 'reference', _ref: item.chapterId},
      image: imageField(personalAssets[item.id]),
      caption: item.caption,
      date: item.date,
      visible: true,
    })
  }

  docs.push({
    _id: BLOG_POST.id,
    _type: 'blogPost',
    title: BLOG_POST.title,
    slug: {_type: 'slug', current: BLOG_POST.slug},
    date: BLOG_POST.date,
    tags: BLOG_POST.tags,
    excerpt: BLOG_POST.excerpt,
    body: BLOG_POST.body,
    cover: imageField(blogCoverAsset),
    published: BLOG_POST.published,
  })

  docs.push({
    _id: SITE_SETTINGS.id,
    _type: 'siteSettings',
    heroTitle: SITE_SETTINGS.heroTitle,
    heroSubtitle: SITE_SETTINGS.heroSubtitle,
    about: SITE_SETTINGS.about,
    email: SITE_SETTINGS.email,
    socials: SITE_SETTINGS.socials.map((s, i) => ({
      ...s,
      _type: 'social',
      _key: `social-${i}`,
    })),
    seoTitle: SITE_SETTINGS.seoTitle,
    seoDescription: SITE_SETTINGS.seoDescription,
  })

  console.log(`Writing ${docs.length} documents with createOrReplace...`)
  const tx = client.transaction()
  for (const doc of docs) {
    tx.createOrReplace(doc)
  }
  await tx.commit()

  console.log('Done. Document counts by type:')
  const types = [
    'project',
    'experience',
    'education',
    'personalChapter',
    'personalItem',
    'blogPost',
    'siteSettings',
  ]
  for (const t of types) {
    const count = await client.fetch(`count(*[_type == $t])`, {t})
    console.log(`  ${t}: ${count}`)
  }
}

main().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
