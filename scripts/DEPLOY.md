# Deploy — staging (dev.alvaroartiel.com)

The site is not deployed via FTP or CI. Publishing to the Hostinger-hosted
staging subdomain is done through the Hostinger MCP tools, driven by the
orchestrating agent. `scripts/deploy.mjs` only handles the local build/copy
steps (3-4 below); everything else is orchestration, not code.

## Flow

1. **Load the required MCP tools.** Via `ToolSearch`, fetch the schemas for:
   - `hosting_createWebsiteSubdomainV1`
   - `hosting_deployStaticWebsite`

2. **Ensure the `dev` subdomain exists.** Check whether a `dev` subdomain
   already exists on `alvaroartiel.com`; if not, create it with
   `hosting_createWebsiteSubdomainV1` so that `dev.alvaroartiel.com` resolves
   to a vhost on the hosting account.

3. **Build the site.** From the repo root:
   ```
   node scripts/deploy.mjs
   ```
   This runs `npm run build` inside `web/`, producing `web/dist/`.

4. **Stage the contact-form endpoint.** Still part of `scripts/deploy.mjs`:
   `api/contact.php` is copied to `web/dist/api/contact.php` so the static
   deploy includes the PHP mail-forwarding endpoint alongside the built site.

5. **Deploy `web/dist` to the `dev.alvaroartiel.com` vhost.** Use
   `hosting_deployStaticWebsite` to upload the contents of `web/dist` to the
   vhost created/confirmed in step 2.

## Verification

After deploying, verify with the chrome-devtools MCP that
`https://dev.alvaroartiel.com` responds and renders the expected page (even
if it is only a placeholder/test page at this stage).

## Notes

- No FTP credentials or CI pipeline are used; the Hostinger MCP tools are the
  only supported path to staging.
- `scripts/deploy.mjs` never uploads anything — it is safe to run repeatedly
  and locally, it only prepares `web/dist`.

> **Nota operativa (2026-07-10):** `hosting_deployStaticWebsite` devuelve un 500 en el paso de deploy si el zip se genera con `bsdtar` (`tar -a`). Crear el archivo con PowerShell `Compress-Archive -Path web/dist/* -DestinationPath dist_YYYYMMDD_HHMMSS.zip` — con ese formato el deploy es aceptado. El subdominio `dev` ya existe; no hace falta `hosting_createWebsiteSubdomainV1`.

## Salida a producción (cuando el usuario lo apruebe)

1. Build con la URL canónica real:
   `PUBLIC_SITE_URL=https://alvaroartiel.com node scripts/deploy.mjs`
   (en PowerShell: `$env:PUBLIC_SITE_URL='https://alvaroartiel.com'; node scripts/deploy.mjs`)
2. Verificar en `web/dist/index.html` que canonical/hreflang/OG apuntan a alvaroartiel.com.
3. Deploy al vhost de producción SOLO con aprobación explícita del usuario.
