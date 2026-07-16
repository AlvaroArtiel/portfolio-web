# Estado de ejecución — SEO Especialidades (16-07-2026, plan completo)

**Plan:** `docs/superpowers/plans/2026-07-15-seo-especialidades.md`
**Rama:** `feat/especialidades` (desde `29ab93e`). HEAD: `1874171`.
Ledger detallado: `.superpowers/sdd/progress.md` (sección `2026-07-15-seo-especialidades`).

## Hecho — las 10 tareas, con review por tarea + review final de rama (opus)

| Tarea | Commit(s) | Qué |
|---|---|---|
| 1. Schema `service` | `e690a0c` | studio/schemaTypes/service.ts |
| 2. Seed standalone | `b9f52ef` | Ejecutado contra el dataset (3 services + patch seoTitle) |
| 3. Tipos + queries | `6399e99` | Service, getServices, getService, getServiceForProject |
| 4. Ruta/i18n/acento/OG | `f34f0c8` | especialidades↔expertise, acento #ffc53d |
| 5. Hub | `036df9f` + revert `30e3659` | /especialidades/ + /en/expertise/ |
| 6. Landings | `fc7e538` | JSON-LD Service + FAQPage; fix GROQ `[@->visible != false]->`. Review retroactiva aprobada al retomar el 16-07 |
| 7. Navegación | `9311fb1` | MenuOverlay (primero, ámbar), Footer, CtaBand |
| 8. Enlace inverso | `14e6a76` | project-detail → especialidad |
| 9. Home SEO | `6553992` | Fallbacks title/description + knowsAbout ampliado |
| 10. Verificación final | — | Build 43 págs, sitemap 8 URLs nuevas, JSON-LD parseable, revisión visual desktop+móvil OK |
| Fix review final | `1874171` | `order asc` en serviceForProjectQuery (enlace inverso determinista) |

Minors aceptados y documentados en el ledger (areaServed, expertise_count, comillas, longitud de un seoTitle).

## Pendiente (fuera del plan, decisión/acción del usuario)

1. **Merge a main** (skill finishing-a-development-branch) y push.
2. **Deploy a staging** (dev.alvaroartiel.com) + purga de caché.
3. **Redeploy del Studio**: `cd studio && npx sanity deploy` para que el tipo Especialidad aparezca en el editor.
4. **Validación externa post-deploy**: validator.schema.org + rich results test sobre una landing, y reenviar sitemap en Google Search Console.
