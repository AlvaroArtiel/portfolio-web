import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing PUBLIC_SANITY_PROJECT_ID or PUBLIC_SANITY_DATASET env vars. Check web/.env.',
  )
}

/**
 * Public, read-only Sanity client. The dataset is public (aclMode: public),
 * so no API token is required. CDN is enabled for fast, cached reads.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(sanityClient)

export interface UrlForOptions {
  w?: number
  h?: number
}

/**
 * Build a CDN image URL from a Sanity image reference, with optional
 * width/height constraints.
 */
export function urlFor(source: SanityImageSource, options: UrlForOptions = {}) {
  let img = builder.image(source).auto('format')
  if (options.w) img = img.width(options.w)
  if (options.h) img = img.height(options.h)
  return img
}
