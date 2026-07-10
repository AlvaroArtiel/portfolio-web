// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Canonical production URL. Currently points at the staging subdomain;
 * flip to https://alvaroartiel.com once the apex domain goes live.
 */
export const SITE_URL = 'https://dev.alvaroartiel.com';

// Pages that must stay out of the sitemap and search index (see Base.astro noindex prop).
const NOINDEX_PATHS = ['/casa/', '/en/house/'];

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => new URL(page).pathname === path),
    }),
  ],
});
