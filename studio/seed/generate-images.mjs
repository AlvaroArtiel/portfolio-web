// Generates deterministic placeholder PNGs (1600x1000) with simple generative
// geometric art in the project's visual system, used to seed Sanity image
// assets until real media is provided.
//
// Usage: node generate-images.mjs (called by seed.mjs, or run standalone)

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const IMG_DIR = path.join(__dirname, 'img')

const BG = '#16161A'
const TEXT = '#F4F4F0'

// Small deterministic PRNG (mulberry32) seeded from a string, so the same
// (title, seed) pair always produces the same composition.
function seededRandom(seedStr) {
  let h = 1779033703 ^ seedStr.length
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h = (h ^ (h >>> 16)) >>> 0
    return h / 4294967296
  }
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  }[c]))
}

function shapesSvg(rand, accent, count) {
  const shapes = []
  for (let i = 0; i < count; i++) {
    const kind = Math.floor(rand() * 3)
    const opacity = (0.15 + rand() * 0.5).toFixed(2)
    const fillOrStroke = rand() > 0.5
    const color = rand() > 0.3 ? accent : TEXT
    if (kind === 0) {
      const cx = Math.floor(rand() * 1600)
      const cy = Math.floor(rand() * 1000)
      const r = Math.floor(40 + rand() * 260)
      shapes.push(
        fillOrStroke
          ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}"/>`
          : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="3" opacity="${opacity}"/>`,
      )
    } else if (kind === 1) {
      const x = Math.floor(rand() * 1600)
      const y = Math.floor(rand() * 1000)
      const w = Math.floor(60 + rand() * 400)
      const h = Math.floor(60 + rand() * 400)
      const rot = Math.floor(rand() * 45)
      shapes.push(
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${
          fillOrStroke ? color : 'none'
        }" stroke="${color}" stroke-width="3" opacity="${opacity}" transform="rotate(${rot} ${x + w / 2} ${
          y + h / 2
        })"/>`,
      )
    } else {
      const x1 = Math.floor(rand() * 1600)
      const y1 = Math.floor(rand() * 1000)
      const x2 = Math.floor(rand() * 1600)
      const y2 = Math.floor(rand() * 1000)
      shapes.push(
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${Math.ceil(
          2 + rand() * 6,
        )}" opacity="${opacity}"/>`,
      )
    }
  }
  return shapes.join('\n  ')
}

/**
 * Builds an SVG composition for a placeholder image.
 * @param {string} title - overlay text (project/chapter title); can be empty.
 * @param {string} accent - hex accent color for the section.
 * @param {string} seedKey - unique deterministic seed (e.g. slug + variant).
 */
export function buildSvg(title, accent, seedKey) {
  const rand = seededRandom(seedKey)
  const shapes = shapesSvg(rand, accent, 9 + Math.floor(rand() * 6))
  const label = title ? escapeXml(title) : ''
  const fontSize = label.length > 22 ? 64 : 92
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <rect width="1600" height="1000" fill="${BG}"/>
  ${shapes}
  ${
    label
      ? `<text x="80" y="880" font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="${TEXT}" letter-spacing="-1">${label}</text>`
      : ''
  }
</svg>`
}

/**
 * Generates a placeholder PNG at studio/seed/img/<filename>.png (1600x1000).
 * Idempotent: re-running overwrites deterministically from the same inputs.
 */
export async function generatePlaceholder({ filename, title, accent, seedKey }) {
  await mkdir(IMG_DIR, { recursive: true })
  const svg = buildSvg(title, accent, seedKey)
  const outPath = path.join(IMG_DIR, `${filename}.png`)
  await sharp(Buffer.from(svg)).png().toFile(outPath)
  return outPath
}

// Allow standalone execution for manual inspection.
if (process.argv[1] && process.argv[1].endsWith('generate-images.mjs')) {
  const { PROJECTS, PERSONAL_ITEMS } = await import('./content.mjs')
  const ACCENT_PROJECT = '#5B8CFF'
  const ACCENT_PERSONAL = '#FF7847'

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

  console.log('Placeholder images generated in', IMG_DIR)
}
