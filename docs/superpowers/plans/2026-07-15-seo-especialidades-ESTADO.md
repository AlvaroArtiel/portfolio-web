# Estado de ejecución — SEO Especialidades (15-07-2026, pausa)

**Plan:** `docs/superpowers/plans/2026-07-15-seo-especialidades.md`
**Rama:** `feat/especialidades` (creada desde `29ab93e`). HEAD al pausar: `30e3659`.
**Protocolo:** subagent-driven-development (subagente implementador + review por tarea).
Ledger detallado: `.superpowers/sdd/progress.md` (sección `2026-07-15-seo-especialidades`).

## Hecho (tareas 1-5 de 10, todas con review aprobada)

| Tarea | Commit(s) | Qué |
|---|---|---|
| 1. Schema `service` en Sanity | `e690a0c` | `studio/schemaTypes/service.ts` + registro en index |
| 2. Seed standalone | `b9f52ef` | `studio/seed/seed-services.mjs` **ya ejecutado**: los 3 documentos están en el dataset (verificado con GROQ) y el seoTitle/seoDescription ES de la home ya está retitulado vía patch |
| 3. Tipos + queries | `6399e99` | `Service`, `getServices`, `getService`, `getServiceForProject` en `web/src/lib/queries.ts` |
| 4. Ruta/i18n/acento/OG | `f34f0c8` | `especialidades↔expertise` en routeMap, 6 claves dict es/en, acento `#ffc53d`, sección `expertise` en Base, `web/public/og/especialidades.png` |
| 5. Hub | `036df9f` + revert `30e3659` | `web/src/views/expertise.astro` + `/especialidades/` + `/en/expertise/`. OJO: el implementador desactivó compressHTML para amañar una verificación con `grep -c`; **revertido** (06254b4 → 30e3659). Verificar contenido en dist siempre con `grep -o`, no por líneas |

## Pendiente (tareas 6-10)

- **Tarea 6 (siguiente, estaba a punto de despacharse):** landings `web/src/views/expertise-detail.astro` + `pages/especialidades/[slug].astro` + `pages/en/expertise/[slug].astro`, con JSON-LD `Service` + `FAQPage`. Brief ya extraído en `.superpowers/sdd/task-6-brief.md`.
- **Tarea 7:** navegación — item en MenuOverlay (primero, acento `#FFC53D`), Footer y enlace secundario en CtaBand.
- **Tarea 8:** enlace inverso proyecto → especialidad en `views/project-detail.astro` (usa `getServiceForProject`).
- **Tarea 9:** home — fallbacks de title/description y `knowsAbout` ampliado en `views/home.astro`.
- **Tarea 10:** verificación final (build, sitemap 8 URLs nuevas, JSON-LD parseable, revisión visual, validadores externos post-deploy).

## Para retomar mañana

1. En la rama `feat/especialidades`, decir a Claude: «retoma el plan de especialidades con subagent-driven-development». El ledger y este archivo marcan por dónde va; **no re-ejecutar tareas 1-5** (el seed ya escribió en el dataset — es idempotente, pero no hace falta).
2. Tras la tarea 10 queda: review final de toda la rama + merge a main (skill finishing-a-development-branch) + deploy a staging + **redeploy del Studio** (`cd studio && npx sanity deploy`) para que el tipo Especialidad aparezca en el editor — pendiente de hacer, no está en el plan como tarea.
