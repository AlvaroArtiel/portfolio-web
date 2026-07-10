# Decisiones de ejecución — alvaroartiel.com

## 2026-07-10 F0 — Versiones de framework: Astro 7 y Sanity 6 en lugar de Astro 5 / Sanity v4
- **Qué decía el plan/spec:** "Astro 5, Sanity v4" como tech stack.
- **Qué se hace:** mantener las versiones que instalan los scaffolders oficiales hoy: Astro ^7.0 y Sanity ^6.4.
- **Por qué:** el spec se escribió nombrando las versiones vigentes en su momento como sinónimo de "Astro/Sanity actual". Forzar un downgrade de dos majors a mano crea riesgo real (templates generados para v7, árboles de dependencias antiguos) sin beneficio. Todas las APIs que el plan usa (páginas estáticas, getStaticPaths, islas client:visible, View Transitions, GROQ) son núcleo estable. Si alguna API difiere, se adapta en la tarea correspondiente y se anota aquí.
## 2026-07-10 F0 — Zip de deploy: Compress-Archive, no bsdtar
- **Qué decía el plan:** desplegar `web/dist` con `hosting_deployStaticWebsite` (sin detallar formato).
- **Qué se hace:** generar el zip con PowerShell `Compress-Archive`; los zips de `bsdtar` provocan error 500 en el extractor de Hostinger. Documentado en `scripts/DEPLOY.md`.
- **Por qué:** verificado empíricamente con dos intentos fallidos + uno exitoso.
## 2026-07-10 F3 — View transitions cross-document (CSS) en lugar de ClientRouter de Astro
- **Qué decía el plan:** "View Transitions API de Astro con crossfade del --accent (fallback: cambio directo)".
- **Qué se hace:** `@view-transition { navigation: auto }` en CSS (cross-document view transitions, MPA). Mismo efecto de crossfade del acento entre páginas.
- **Por qué:** el ClientRouter de Astro convierte la navegación en SPA y los scripts por página (deck, filtros, lightbox, overlay) dejarían de reinicializarse sin refactorizar todos a `astro:page-load`. La variante cross-document es CSS puro, cero riesgo, y el fallback (cambio directo) es exactamente el que pide el plan para navegadores sin soporte.
## 2026-07-10 F4 — CORS del CDN de Sanity para texturas WebGL
- **Qué pasaba:** `cdn.sanity.io` devolvía 403 a peticiones con cabecera `Origin` (las texturas de las lonas k95 no cargaban).
- **Qué se hace:** añadidos orígenes CORS al proyecto Sanity vía API de gestión: `http://localhost:4321`, `https://dev.alvaroartiel.com`, `https://alvaroartiel.com`; las `<img>` de heroMedia llevan `crossorigin="anonymous"`.
- **Por qué:** requisito del efecto lona (TextureLoader necesita CORS); sin ello el fallback (imágenes normales) seguía funcionando.
## 2026-07-10 F7 — OG images por sección, no por página
- **Qué decía el plan:** "OG images: plantilla generativa por página con título".
- **Qué se hace:** una imagen OG generativa por sección (7 PNGs con el acento correspondiente); las fichas de proyecto heredan la de proyectos.
- **Por qué:** con arte placeholder, generar 20+ OG con títulos aporta poco; cuando el usuario suba media real conviene regenerarlas con arte definitivo. `web/scripts/generate-og.mjs` queda listo para ampliarse por página.
## 2026-07-10 Remediación (sesión 2) — Fuente de verdad del Sprint 1: solo spec §9 + correcciones
- **Qué decía el spec de remediación:** usar el material fuente del spec original §9 "y su detalle completo (el volcado de LinkedIn está en la sección Contenido inicial + el histórico del spec)".
- **Qué se hace:** el volcado completo de LinkedIn NO está en el repositorio (vivía en la conversación de la sesión 1, no disponible). La única fuente verificable es el §9 del spec original más las correcciones explícitas del spec de remediación (Esperando el Render). Se aplica la regla dura del propio spec: toda afirmación no respaldada por esas fuentes → frase neutral u omisión.
- **Por qué:** preferible un seed más sobrio y 100% veraz que conservar redacciones ricas imposibles de verificar.
## 2026-07-10 Remediación (sesión 2) — B4 (placeholders sin título) se pliega en el Sprint 1
- **Qué decía el spec de remediación:** B4 aparece en el Sprint 2 (§4.4).
- **Qué se hace:** regenerar los placeholders sin título dentro de la tarea del seed (Sprint 1).
- **Por qué:** ambos cambios requieren re-seed de Sanity + redeploy; hacerlo junto evita un ciclo completo de seed/deploy extra sin alterar ningún resultado.
## 2026-07-10 Remediación (sesión 2) — Coreografía del monograma: barrido a ~110vh y match-cut en móvil
- **Qué decía el spec de remediación (§4.1):** "entre scroll 0 y ~100vh interpola hasta el hueco exacto del header y ahí muere"; en móvil "posición que jamás solape el titular, mismo acople".
- **Qué se hace:** desktop: ascenso pegado al borde derecho (siempre fuera de la masa del titular) hasta la franja del header y barrido final al hueco, completándose a ~110vh — el barrido solo arranca cuando el titular ha salido de pantalla, para no taparlo jamás (vara §2.3 prima sobre el "~100vh" literal). Móvil (≤720px): el vuelo literal es imposible sin cruzar subtítulo o botón de menú (todo el ancho es contenido); el acople es un match-cut: la pieza sube 1:1 con el contenido, se funde al salir, y el SVG del header aparece — nunca hay dos marcas estables visibles.
- **Por qué:** la regla dura "nada tapa contenido en ningún punto del recorrido" es incompatible con un vuelo en línea recta sobre un titular centrado; esta coreografía conserva el momento pxpush en desktop y da a móvil un relevo limpio.
## 2026-07-10 Remediación (sesión 2) — Fichero con pestañas: literal en la home, franja-identidad en /proyectos
- **Qué decía el spec (§5.4):** offsets escalonados ~72px por carta para que el apilado se lea como fichero con pestañas.
- **Qué se hace:** el fichero literal (offsets +72px/carta) vive en el deck de la home (4 cartas = 288px de pestañas, caben de sobra). En /proyectos (10 cartas) 10 pestañas acumuladas ocuparían 720px de un viewport de ~900: allí todas las cartas comparten offset y la franja de identidad al top garantiza el objetivo de B5 — en todo momento se lee qué proyecto se ve (su franja pinned) y cuál viene (su franja asoma desde abajo).
- **Por qué:** el patrón pxpush real opera con ≤5 items; a 10 items el literal rompe la composición que la vara §2.1 exige.
## 2026-07-10 Cierre — contact.php: sanitización añadida sobre el código literal del plan
- **Qué decía el plan:** crear `api/contact.php` "con este contenido exacto".
- **Qué se hace:** se añade `str_replace(["\r","\n"], ' ', $name)` (el nombre entra en la cabecera Subject: vector de inyección de cabeceras / spam relay detectado por la revisión final) y el redirect del honeypot respeta `lang`.
- **Por qué:** vulnerabilidad real que no debe desplegarse; cambio mínimo que preserva el comportamiento especificado.
