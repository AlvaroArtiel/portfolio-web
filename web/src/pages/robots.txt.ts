import type {APIRoute} from 'astro'

// robots.txt dinámico: la URL del sitemap sigue a la `site` del build
// (PUBLIC_SITE_URL), así en dev apunta a dev.alvaroartiel.com y en producción a
// alvaroartiel.com sin tocar nada. Sustituye al antiguo public/robots.txt, que
// tenía el host fijado a dev.
export const GET: APIRoute = ({site}) => {
  const base = site ? site.href.replace(/\/$/, '') : ''
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap-index.xml\n`
  return new Response(body, {headers: {'Content-Type': 'text/plain; charset=utf-8'}})
}
