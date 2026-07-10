# Decisiones de ejecución — alvaroartiel.com

## 2026-07-10 F0 — Versiones de framework: Astro 7 y Sanity 6 en lugar de Astro 5 / Sanity v4
- **Qué decía el plan/spec:** "Astro 5, Sanity v4" como tech stack.
- **Qué se hace:** mantener las versiones que instalan los scaffolders oficiales hoy: Astro ^7.0 y Sanity ^6.4.
- **Por qué:** el spec se escribió nombrando las versiones vigentes en su momento como sinónimo de "Astro/Sanity actual". Forzar un downgrade de dos majors a mano crea riesgo real (templates generados para v7, árboles de dependencias antiguos) sin beneficio. Todas las APIs que el plan usa (páginas estáticas, getStaticPaths, islas client:visible, View Transitions, GROQ) son núcleo estable. Si alguna API difiere, se adapta en la tarea correspondiente y se anota aquí.
