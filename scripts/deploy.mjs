#!/usr/bin/env node
// Build the Astro site and stage the contact-form PHP endpoint into dist/.
//
// This script is deliberately NOT a full deploy pipeline: it does not upload
// anything anywhere (no FTP, no API calls). It only performs the two purely
// mechanical steps (build + copy) that precede the actual publish, which is
// carried out by the orchestrating agent via the Hostinger MCP tools
// (hosting_createWebsiteSubdomainV1, hosting_deployStaticWebsite).
// See scripts/DEPLOY.md for the full flow.

import {spawnSync} from 'node:child_process'
import {copyFileSync, existsSync, mkdirSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const webDir = join(rootDir, 'web')
const distDir = join(webDir, 'dist')
const contactSrc = join(rootDir, 'api', 'contact.php')
const contactDestDir = join(distDir, 'api')
const contactDest = join(contactDestDir, 'contact.php')

function step(label, fn) {
  console.log(`\n> ${label}`)
  fn()
}

step('Building web/ (npm run build)', () => {
  // Pass a single command string (not an argv array) when shell:true, per
  // Node's guidance, to avoid unescaped-argument concatenation.
  const result = spawnSync('npm run build', {
    cwd: webDir,
    stdio: 'inherit',
    shell: true,
  })
  if (result.status !== 0) {
    console.error('Build failed.')
    process.exit(result.status ?? 1)
  }
})

step('Copying api/contact.php into web/dist/api/contact.php', () => {
  if (!existsSync(contactSrc)) {
    console.error(`Missing source file: ${contactSrc}`)
    process.exit(1)
  }
  if (!existsSync(contactDestDir)) {
    mkdirSync(contactDestDir, {recursive: true})
  }
  copyFileSync(contactSrc, contactDest)
  console.log(`Copied to ${contactDest}`)
})

console.log('\nDone. web/dist is ready to be deployed to dev.alvaroartiel.com.')
console.log('See scripts/DEPLOY.md for the remaining MCP-based publish steps.')
