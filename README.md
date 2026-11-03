# portfolio-web

Código del portfolio personal de Álvaro Artiel — [alvaroartiel.com](https://alvaroartiel.com).

Sitio estático en Astro con contenido editable desde Sanity, bilingüe (ES/EN) y desplegado en
hosting compartido. Sin framework de UI: el diseño se apoya en tipografía, tokens CSS y
animación ligera.

## Stack

| Pieza | Tecnología |
|---|---|
| Sitio | Astro 7 · TypeScript strict · CSS con custom properties |
| Contenido | Sanity 6 (CMS headless) |
| Formulario | Endpoint PHP (`api/contact.php`) |
| Hosting | Hostinger (estático + PHP) |

## Estructura

```
web/      Sitio Astro: páginas, componentes, estilos y tokens de diseño
studio/   Sanity Studio (esquemas de contenido)
api/      Endpoint PHP del formulario de contacto
docs/     Spec de diseño, planes y auditorías de QA
scripts/  Build y notas de despliegue
```

## Desarrollo

Usa Node.js 24 LTS, o Node.js 22.23.4 o posterior dentro de la rama 22.
Instala con `npm ci` para reproducir las versiones verificadas del lockfile.

```bash
# Sitio
cd web && npm install && npm run dev     # http://localhost:4321
npm run build                            # build de producción a web/dist

# CMS
cd studio && npm install && npm run dev
```

Variables de entorno: copia `.env.example` a `.env`. El sitio necesita el ID de proyecto y el
dataset de Sanity para leer contenido; el Studio y los scripts de seed necesitan además un token
de escritura.

## Actualizaciones de seguridad

El sitio conserva Astro 7 y el CMS Sanity 6. El Studio usa ESLint 10 con la
configuración oficial de Sanity 7 y TypeScript 6.

Los `overrides` de `studio/package.json` corrigen dependencias transitivas que sus
consumidores aún fijan en versiones vulnerables:

- `minimatch` 10 → 11.0.4: evita la amplificación de patrones glob. Se limita a
  consumidores de la API moderna; la actualización de ESLint elimina los consumidores de v3.
- `@vercel/frameworks`: `js-yaml` 3.15.2 y `smol-toml` 1.9.1, dentro de sus respectivas ramas mayores.
- `@module-federation/dts-plugin`: `undici` 7.30.1, dentro de la misma rama mayor.

Retira cada override cuando el paquete consumidor permita una versión corregida.
Después de cualquier actualización, ejecuta `npm ci`, `npm audit` y `npm run build`
en ambos directorios. Comprueba también `npm run astro -- check` en `web`, y
`npx tsc --noEmit --incremental false`, `npx eslint .` y
`npm run build -- --no-auto-updates` en `studio`; este último compila las
dependencias locales sin recurrir a las actualizaciones automáticas del Studio.

## Detalles con algo de gracia

- **Tokens por sección**: cada sección del sitio (proyectos, experiencia, personal, blog…)
  reasigna `--accent`, así que el color acompaña a la navegación sin duplicar estilos.
- **Tipografías self-hosted** en woff2, sin peticiones a terceros.
- **i18n con fallback**: los campos localizados caen a español si falta la traducción inglesa.
- **QA visual versionada**: en `docs/superpowers/qa/` hay capturas de cada página en desktop y
  móvil, sesión a sesión.
- Hay un secreto después del footer. Suerte.

## Licencia

El código está publicado como muestra de trabajo. El contenido (textos, fotografías y diseño) es
propio y no se cede para su reutilización.
