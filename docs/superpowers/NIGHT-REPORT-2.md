# NIGHT-REPORT 2 — Remediación de acabado premium (sesión autónoma 2, 2026-07-10)

## Resumen ejecutivo

Los **19 defectos de la auditoría (A1–A6, B1–B13) están resueltos** y desplegados en staging. La sesión no añadió features: integró, corrigió y pulió. La home es ahora un recorrido continuo donde cada estado de scroll es una composición: el monograma nuevo vuela acotado al primer viewport y muere en el header, el acento muta durante el scroll (lima → azul → naranja → lima), el deck se lee como fichero con pestañas, el CTA líquido es legible en reposo y reacciona solo al cursor, y la casa pasó de bloqueo a diorama con el retrato real como cabeza del personaje. Todo el contenido publicado está respaldado por el material fuente disponible.

**La pregunta de la vara** — *"¿el recorrido de la home podría confundirse con una referencia?"* — Respuesta razonada: **sí en estructura y coreografía** (masa central + marco perimetral, fichero de cartas pxpush, camaleón intra-página tipo cinetica, líquido noth.in contenido, secreto compuesto); **el techo restante es el arte**: los placeholders generativos, dignos, siguen siendo abstracciones — con media real de proyectos la comparación deja de necesitar contexto. Ese último tramo no es de diseño sino de contenido (pendiente del usuario desde la sesión 1).

## URLs

| Qué | URL |
|---|---|
| **Staging** | https://dev.alvaroartiel.com |
| Backoffice | https://alvaroartiel.sanity.studio |
| Easter egg | https://dev.alvaroartiel.com/casa/ |

## Qué se hizo (por sprint)

- **Sprint 1 — Contenido veraz (B8, B4):** seed reescrito completo contra la única fuente verificable (spec original §9 + correcciones). **Esperando el Render corregido**: cliente (academia de formación online para creativos), Álvaro consultor web & producto e-learning — nada de "fundador/creador de contenido". Eliminados todos los outcomes/anécdotas no respaldados ("tiempo récord", "usuarios reales", "equipos piloto", historias de origen). Placeholders regenerados sin título dentro del arte (adiós título duplicado). Re-seed + verificación entrada a entrada en staging.
- **Sprint 2 — Sistema visual (A1, A2, A5, A6, B2, B3, B9, B10, B12, B13):**
  - **Monograma nuevo**: silueta lambda+travesaño, marfil mate con rim-light del acento, misma forma para el 3D y el SVG del header (una sola fuente). Coreografía acotada: vive SOLO en el primer viewport, sube por el borde derecho (jamás cruza el titular), barre por la franja del header y **muere** en el hueco (el SVG toma el relevo; revive al subir). Móvil: match-cut (ver decisions.md). Cero fantasmas.
  - **Elevación**: `--surface-0/1/2` + borde suave + sombra; cartas, modales, formulario y controles existen como objeto; hover sube un nivel.
  - **Composición por sección**: hero = titular masa central (~80%) con nombre/keywords como marco perimetral; quién soy = texto con 2-3 destacados en acento + columna de metadatos mono (+40 proyectos · 2018 · 3 productos, todos respaldados); deck a 88% centrado; teaser = claim grande + masa diagonal de polaroids. Escala de espaciado `--space-s/m/l` (96/160/240px).
  - **Timeline con ritmo**: fechas/logos a la izquierda de la línea, contenido a la derecha. Filtros siempre bajo el título (B10). B13 era artefacto de la auditoría (ancho mínimo de ventana, no bug); verificado scrollWidth==390 en todas las páginas + `overflow-x: clip` de cinturón.
  - **Secreto post-footer**: pieza marfil+rim lima descentrada a la derecha, texto SIEMPRE delante, composición de recompensa.
- **Sprint 3 — Coreografía (A3, A4, B1, B5, B6, B7):**
  - **`motion-tokens.ts`**: fuente única (2 curvas, 3 duraciones, scrub 1, reveals 32px/70ms, parallax ≤8%) + espejo CSS; re-tempo de partículas (reagrupado con inercia), deck, reveals, timeline, monograma.
  - **Camaleón intra-página**: `--accent` y tinte del fondo interpolan con scrub — hero lima → deck azul → teaser naranja → CTA lima (secciones reordenadas para la secuencia narrativa del spec); tinte suave en ficha y personal; sin bandas duras.
  - **Deck**: identidad en franja superior de 72px; en la home fichero literal con pestañas escalonadas (4 cartas); en /proyectos franja al top con offset único (decisión razonada para 10 cartas, ver decisions.md). En todo momento se sabe qué proyecto se ve y cuál viene. /proyectos a 88% centrado (B6).
  - **CTA líquido**: reposo = texto perfecto (ondulación ≤2px); distorsión SOLO radial/local al cursor (150px, ≤8% del cuerpo); vuelta a reposo en 500ms; móvil micro-ondulación por scroll.
  - **B7 auditado**: el rebarajado de filtros funciona y no rompe el apilado.
- **Sprint 4 — La casa (B11):** luz cálida direccional + blob shadows (nada flota); suelo surface-1 con retícula, paredes con zócalo; escritorio azul con monitor emisivo teal que parpadea, estantería violeta con libros de lomos de colores, guitarra naranja con silueta real extruida (se mece), puerta lima con marco y pomo, diploma enmarcado; **personaje con el retrato real** (`assets-entrada/retrato.png`, recorte circular con aro marfil) + cuerpo bicolor + bob al andar; cámara baja con fog y viñeta. WASD/prompts verificados.

## Métricas de cierre (staging)

- **Lighthouse: Accessibility 100 · Best Practices 100 · SEO 100** (home, desktop).
- **Performance: LCP 214 ms · CLS 0** (traza de navegación en staging; muy por encima del umbral ≥90).
- Altura de la home: 7108px (auditoría) → **6127px móvil / 6587px desktop** (~-14%; el resto del objetivo -15/20% quedó absorbido por el fichero de pestañas, que compacta el deck).
- QA: recorridos finales (11 rutas × desktop/móvil) en `docs/superpowers/qa/final/`; por sprint en `qa/sprint-2/` y `qa/sprint-3/`.

## Decisiones documentadas (decisions.md)

1. **Fuente de verdad del Sprint 1**: el volcado completo de LinkedIn no está en el repo — fuente = spec §9 + correcciones; lo no respaldado → neutral u omisión.
2. **B4 plegado en Sprint 1** (un solo ciclo de re-seed).
3. **Monograma**: acople a ~110vh y match-cut en móvil (la regla "nada tapa contenido" prima sobre el "~100vh" literal).
4. **Fichero con pestañas**: literal en la home (4 cartas); franja-identidad en /proyectos (10 cartas no caben como pestañas acumuladas).

## Limitaciones y pendientes (necesitan al usuario)

1. **Media real**: sigue siendo el techo del "¿podría ser una referencia?". Subir imágenes de proyectos/personal desde el Studio.
2. **Material de LinkedIn**: si el usuario aporta el volcado completo, se pueden re-enriquecer summaries/bullets hoy deliberadamente neutros (la regla dura obligó a podar).
3. Los pendientes 1-7 del NIGHT-REPORT 1 siguen vigentes (paso a producción, fechas exactas, redes, prueba real del formulario, webhook).
4. Minor detectado en QA: la mesa física de /personal en desktop deja aire de sobra sobre el montón asentado (el área de física es alta); no viola la vara pero es mejorable.
5. El match-cut del monograma en móvil es una interpretación del "mismo acople" del spec — si se prefiere el vuelo literal, hay que rediseñar el hero móvil para dejar un carril libre.

## Cómo validar (5 minutos)

- [ ] Home desktop: bajar despacio de arriba a abajo — monograma sube por la derecha y muere en el header; el acento muta lima→azul→naranja→lima; pestañas del deck; CTA legible que solo se deforma junto al cursor; secreto compuesto.
- [ ] Lo mismo a 390px (el monograma hace match-cut, nada tapa nada).
- [ ] /experiencia: Esperando el Render ahora dice "Consultor web & producto e-learning".
- [ ] /casa: pasear con WASD — el personaje lleva tu cara.
