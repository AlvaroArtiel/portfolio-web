// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * Canonical URL. Por defecto staging; el build de producción se hace con
 * PUBLIC_SITE_URL=https://alvaroartiel.com (ver scripts/DEPLOY.md).
 */
export const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://dev.alvaroartiel.com';

// Pages that must stay out of the sitemap and search index (see Base.astro noindex prop).
const NOINDEX_PATHS = ['/casa/', '/en/house/'];

/** El endpoint PHP debe viajar en TODO build (antes solo lo copiaba deploy.mjs). */
const copyContactPhp = {
  name: 'copy-contact-php',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const outDir = fileURLToPath(dir);
      const apiDir = new URL('api/', dir);
      await mkdir(fileURLToPath(apiDir), { recursive: true });
      await copyFile(
        new URL('../api/contact.php', import.meta.url),
        fileURLToPath(new URL('contact.php', apiDir)),
      );
      console.log(`[copy-contact-php] api/contact.php → ${outDir}api/`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => new URL(page).pathname === path),
    }),
    copyContactPhp,
  ],
});
