// Generates static Open Graph images (1200x630) for the site: one default
// image plus one per top-level section, using the same section accent
// colors as the app (see src/styles/tokens.css). SVG -> PNG via sharp,
// following the same generative pattern as studio/seed/generate-images.mjs.
//
// Usage: npm run og   (writes into web/public/og/*.png)

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'og')

const WIDTH = 1200
const HEIGHT = 630
const BG = '#0C0C0E'
const TEXT = '#F4F4F0'

const PAGES = [
  { filename: 'default', title: 'Álvaro Artiel', accent: '#D4FF3F' },
  { filename: 'home', title: 'Álvaro Artiel', accent: '#D4FF3F' },
  { filename: 'proyectos', title: 'Proyectos', accent: '#5B8CFF' },
  { filename: 'experiencia', title: 'Experiencia', accent: '#B06CFF' },
  { filename: 'personal', title: 'Personal', accent: '#FF7847' },
  { filename: 'blog', title: 'Blog', accent: '#4FD1C5' },
  { filename: 'cv', title: 'CV', accent: '#F4F4F0' },
]

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c],
  )
}

/**
 * Builds the OG image SVG: dark background, an accent bar, the page title
 * in large display type, and a small "alvaroartiel.com" mono label.
 */
function buildSvg({ title, accent }) {
  const label = escapeXml(title)
  const fontSize = label.length > 14 ? 84 : 108
  const barY = HEIGHT - 220
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <rect x="80" y="${barY}" width="120" height="10" fill="${accent}"/>
  <text x="80" y="${barY - 40}" font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="${TEXT}" letter-spacing="-2">${label}</text>
  <text x="80" y="72" font-family="'Courier New', monospace" font-size="28" fill="${accent}" letter-spacing="0.05em">ALVAROARTIEL.COM</text>
</svg>`
}

async function generateOne(page) {
  const svg = buildSvg(page)
  const outPath = path.join(OUT_DIR, `${page.filename}.png`)
  await sharp(Buffer.from(svg)).png().toFile(outPath)
  console.log(`  generated ${outPath}`)
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  console.log('Generating OG images...')
  for (const page of PAGES) {
    await generateOne(page)
  }
  console.log(`Done. ${PAGES.length} images written to ${OUT_DIR}`)
}

main().catch((err) => {
  console.error('OG generation failed:', err.message)
  process.exit(1)
})
