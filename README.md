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
