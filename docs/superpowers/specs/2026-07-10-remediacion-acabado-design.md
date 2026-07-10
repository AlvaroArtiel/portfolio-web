# Remediación de acabado premium — alvaroartiel.com (Sesión autónoma 2)

**Fecha:** 2026-07-10 · **Estado:** aprobado para sesión autónoma
**Contexto previo obligatorio:** `docs/superpowers/specs/2026-07-10-portfolio-web-design.md` (spec original) y `docs/superpowers/audit-2026-07-10.md` (catálogo de defectos B1-B13 / A1-A6 — este spec los resuelve TODOS).

---

## 0. Misión y veredicto de partida

La sesión 1 construyó un **esqueleto funcional completo** (aprobado) con **cero acabado premium** (rechazado por el usuario). El diagnóstico está en la auditoría: módulos correctos sin integración — "piezas de marcas distintas encajadas en un frankenstein". Esta sesión NO añade features: **integra, corrige y pule hasta el nivel de las referencias** (pxpush.com, russellnumo.nl, cinetica.studio, noth.in, k95.it, ryanritzenthaler.com, mauriciojuba.com).

**Definición de éxito:** un recorrido de scroll continuo por la home (y cada página) donde CADA estado intermedio es una composición intencional, con UN lenguaje de movimiento, colores que mutan durante el scroll, nada tapa contenido jamás, y contenido 100% veraz. El criterio último no es "funciona": es **"¿esta captura podría ser de una de las referencias?"**.

---

## 1. Protocolo de la sesión (OBLIGATORIO — pedido explícito del usuario)

### 1.1 Arranque
1. El orquestador es **Fable**. Lee este spec, la auditoría y el spec original; navega staging (`https://dev.alvaroartiel.com`) con chrome-devtools para calibrar el estado real.
2. Fable crea el plan de implementación con **superpowers:writing-plans** (guardado en `docs/superpowers/plans/`), derivado de este spec, con las tareas de §3-§8.
3. Ejecución con **superpowers:subagent-driven-development**: tareas mecánicas → subagentes Sonnet/Haiku; tareas creativas → Fable inline. Toda revisión la hace Fable.

### 1.2 Doble puerta Fable en CADA tarea
- **Puerta de entrada (pre):** antes de ejecutar, Fable revisa el estado actual del área afectada y el enunciado de la tarea contra la vara de calidad (§2). Si la tarea, tal como está planeada, no alcanzaría la vara → Fable la re-especifica ahí mismo (y lo anota en `decisions.md`).
- **Puerta de salida (post):** al terminar, Fable valida con la **verificación de recorrido** (§1.3). Si el resultado no cumple TODA la vara → Fable define la mejora concreta y **se ejecuta dentro del mismo plan antes de cerrar la tarea** (iterando hasta cumplir o hasta 3 iteraciones; a la 3ª sin éxito, documentar en decisions.md la limitación y la mejor alternativa aplicada).
- Ninguna tarea se marca completada sin pasar la puerta de salida.

### 1.3 Verificación de recorrido (sustituye a las capturas sueltas)
Para cada página afectada por una tarea: secuencia de screenshots cada ~600px de scroll, de arriba a abajo, **desktop 1440px Y móvil 390px**, revisadas UNA A UNA por Fable. La pregunta en cada frame: *"¿es una composición intencional? ¿algo tapa algo? ¿podría ser una referencia?"*. Los recorridos finales de cada sprint se guardan en `docs/superpowers/qa/sprint-N/`.

### 1.4 Reglas heredadas que siguen vigentes
- Deploy SOLO a `dev.alvaroartiel.com`. Prohibido tocar el dominio raíz y los demás sites.
- Sanity solo free tier. Zip de deploy con `Compress-Archive` (nunca bsdtar).
- Commits frecuentes; `decisions.md` para toda variación; `NIGHT-REPORT-2.md` al cierre con lo mismo que el primero.
- Si una tarea bloquea >30 min → fallback documentado y seguir.

---

## 2. La vara de calidad (checklist de las dos puertas)

Una tarea/página cumple si y solo si:

1. **Composición:** cada estado de scroll es intencional; ninguna zona muerta >25% del viewport sin propósito compositivo; las secciones NO comparten una plantilla única (cada una tiene su composición, ver §4).
2. **Legibilidad absoluta:** ningún texto tapado, distorsionado hasta lo ilegible, ni con contraste <AA en tamaño lectura.
3. **Nada tapa contenido:** ningún elemento 3D/decorativo se superpone a texto o UI en NINGÚN punto del recorrido, desktop ni móvil.
4. **Un solo lenguaje de movimiento:** todo movimiento usa los tokens de §5.1. Cero easings/duraciones ad-hoc.
5. **Elevación perceptible:** toda superficie interactiva se distingue del fondo (sistema §4.2).
6. **Paleta estricta:** solo colores del sistema (tokens). Nada de tonos fuera de paleta (el oliva del secreto, los saturados de la casa: fuera).
7. **Camaleón intra-página:** en la home, el acento muta durante el scroll (§5.3).
8. **Veracidad:** ni una afirmación de contenido no respaldada por el material fuente (§7).
9. **Móvil primero de verdad:** el recorrido móvil se revisa con el mismo rigor que desktop.
10. Lighthouse Performance ≥85 (bajamos 5 pts de margen durante la remediación; recuperar ≥90 al cierre).

---

## 3. SPRINT 1 — Contenido veraz (mecánico, primero)

**Resuelve:** B8.

- Reescribir TODO el seed (7 experiencias, 10 proyectos, siteSettings, capítulos) usando EXCLUSIVAMENTE el material fuente que está en el spec original §9 y su detalle completo (el volcado de LinkedIn está en la sección "Contenido inicial" + el histórico del spec). Regla dura: **prohibido inventar hechos, roles, fechas o relatos**. Lo que no esté en el material → frase neutral u omisión.
- Correcciones conocidas: Esperando el Render = **cliente** (academia de formación online para profesionales creativos; Álvaro es consultor web & producto e-learning: mantenimiento, optimización, páginas comerciales, lanzamientos de cursos). NO es proyecto propio ni "creador de contenido".
- Auditar una a una las otras 6 experiencias y los 10 proyectos contra la fuente; corregir en `content.mjs` y re-seedear (idempotente).
- Puerta de salida: Fable relee cada entrada publicada en staging contra el material fuente.

## 4. SPRINT 2 — Sistema visual

**Resuelve:** A1, A2, A5, A6, B2, B3, B4, B6, B9, B10, B13.

### 4.1 El monograma (decisión cerrada)
- **Rediseño:** la pieza actual (bitono verde/blanco con aire clipart) se sustituye por un monograma AA de geometría limpia: extrusión fina, material marfil `#F4F4F0` mate con rim-light del acento de la sección actual. Reconocible en 24px. Es LA marca: sobriedad, no adorno.
- **Coreografía única y acotada:** el monograma 3D vive SOLO en el primer viewport de la home. Entre scroll 0 y ~100vh interpola (escala/posición, scrub) hasta el hueco exacto del header y ahí **muere** (se desmonta y el header muestra su versión SVG estática, que es la que existe en el resto de páginas). A partir de 100vh NUNCA hay pieza 3D flotante. En móvil: posición que jamás solape el titular (p.ej. bajo el subtítulo o esquina), mismo acople.
- Eliminar todas las demás apariciones del monograma flotante (deck, teaser, secreto, etc.).

### 4.2 Sistema de elevación (tokens nuevos en `tokens.css`)
- `--surface-0` `#0C0C0E` (fondo) · `--surface-1` `#141419` + borde `1px rgba(244,244,240,.07)` (cartas, superficies) · `--surface-2` `#1A1A21` + sombra `0 24px 60px rgba(0,0,0,.5)` (elementos elevados/activos).
- Aplicar a: cartas del deck, polaroids (mantienen su blanco), modales, formulario, entradas de blog. Ninguna superficie interactiva vuelve a ser `#0C0C0E` sobre `#0C0C0E`.

### 4.3 Composición por sección (mata la plantilla única A2)
Prescripción por sección de la home (el plan puede afinar dentro de esto):
- **Hero:** titular centrado ópticamente como masa dominante (ancho ~80% con partículas); nombre y keywords como marco perimetral (arriba-izq / abajo-izq); monograma arriba-dcha en diagonal compositiva con el titular. Sin mitades vacías.
- **Quién soy:** texto a ancho de lectura generoso (~60-70% centrado-izquierda) con 2-3 palabras clave del párrafo destacadas en acento; a la derecha, columna estrecha con metadatos mono (años, nº proyectos, stack) que dan ritmo — no vacío.
- **Deck destacados:** cartas a ~88% de ancho centradas (mata la columna muerta B6), ver estados §5.4.
- **CTA:** full-bleed centrado (§5.5).
- **Teaser personal:** composición asimétrica intencional: polaroids en masa diagonal + claim corto grande ("Fuera del horario laboral también pasan cosas") + link; el conjunto ocupa el viewport con equilibrio, no isla-izquierda.
- **Espaciado:** escala vertical fija (p.ej. 96/160/240px) — se acabaron los vacíos de 500px arbitrarios. La home debe perder ~15-20% de altura total solo con esto.
- **/experiencia (B9):** dar ritmo a la timeline: fechas y logos al lado izquierdo de la línea, contenido a la derecha; entradas alternando densidad; la columna izquierda deja de estar vacía.
- **/proyectos ficha y demás páginas:** revisar contra la misma regla de composición (auditoría de recorrido).

### 4.4 Fixes puntuales de maquetación
- **B10:** los filtros de capítulos de /personal se integran bajo el título de la página (nunca en la franja del header). Verificar equivalente en /proyectos.
- **B13:** revisar meta viewport / manejo de resize para que 390px renderice a 390px.
- **B3:** secreto post-footer: z-order texto SIEMPRE sobre la pieza; pieza en marfil+rim lima (paleta §2.6); sin monograma fantasma; composición del momento cuidada (es una recompensa, debe sentirse como tal).
- **B4:** regenerar placeholders SIN el título dentro del arte (composiciones abstractas puras con el acento del proyecto) para eliminar el título duplicado.

## 5. SPRINT 3 — Coreografía (un solo lenguaje)

**Resuelve:** A3, A4, B1, B5 (+re-tempo de todos los efectos).

### 5.1 Tokens de movimiento (`web/src/lib/motion-tokens.ts` — fuente única)
- **Curvas:** `ease-out` estándar `cubic-bezier(0.22,1,0.36,1)` (expo-out suave) para entradas; `ease-in-out` `cubic-bezier(0.65,0,0.35,1)` para trayectos/scrub; NADA elástico/bounce.
- **Duraciones:** micro 200ms (hovers) · elemento 500ms (reveals) · sección 900ms (transiciones grandes). Scrub siempre suave (scrub: 0.8-1.2).
- **Distancias:** reveals 32px rise + fade; staggers 70ms; parallax máximo 8% del alto del elemento.
- **Regla:** TODOS los módulos (partículas, deck, liquid, trail, timeline, mesa, reveals, menú) importan de aquí. Prohibido valor suelto.

### 5.2 Re-tempo de módulos existentes
Con los tokens definidos, pasar módulo a módulo ajustando easing/duración/amplitud para que el sitio entero "respire igual". Partículas: menos nerviosas (inercia mayor, reagrupado más lento y elegante). Reveals: idénticos en todas las páginas.

### 5.3 Camaleón intra-página (A3)
En la home, `--accent` (y un tinte sutil de fondo, ±3% de luminancia) interpolan DURANTE el scroll entre secciones: hero lima → deck azul → teaser naranja → CTA/contacto lima. Implementación: ScrollTrigger que interpola las custom properties en `:root` con scrub. Los cortes duros de banda desaparecen: las secciones se funden (sin líneas de costura visibles). Aplicar el mismo patrón suave en páginas largas (ficha, personal).

### 5.4 Estados intermedios del deck (B5)
Rediseñar la carta para que su **identidad viva en una franja superior** (título + año + categoría en una barra del alto de ~72px al TOP de la carta): cuando la carta siguiente cubre a la anterior, lo último visible de la tapada es su franja de identidad — el apilado se lee como un fichero de cartas con pestañas (patrón pxpush real). La imagen y el resumen viven debajo de la franja. Verificar el recorrido completo: en TODO momento se sabe qué proyecto se está viendo y cuál viene.

### 5.5 CTA líquido rehecho (B1)
- Reposo = **texto perfectamente legible** (distorsión 0 o ≤2px de ondulación lenta).
- La distorsión responde SOLO a proximidad/velocidad del cursor, radial y local (radio ~150px alrededor del puntero), amplitud máxima ~8% del cuerpo de letra. Al salir el cursor, vuelve a reposo en 500ms.
- Móvil: micro-ondulación con el scroll (legible siempre). Sin colisión con el header (padding-top correcto).

## 6. SPRINT 4 — La casa (dirección de arte)

**Resuelve:** B11. La casa pasa de bloqueo a diorama con encanto. Sin ampliar alcance funcional.

- **Luz:** ambiente cálida tenue + una direccional principal; suelo recibe sombra; **sombras de contacto** (blob shadows) bajo personaje y muebles — nada flota.
- **Materiales/paleta:** habitación en neutros del sistema (suelo `--surface-1` con retícula sutil, paredes `--surface-0` con zócalo) y CADA interactuable con el acento de su sección (escritorio azul proyectos, estantería violeta, guitarra naranja, ordenador teal, puerta lima) — el camaleón también vive aquí.
- **Props legibles:** compuestos de primitivas pero reconocibles: escritorio = tablero+patas+monitor con pantalla emisiva; estantería con libros de lomos de colores; guitarra con forma real (extrude de silueta); puerta con marco y pomo. Cada prop con su micro-animación idle (monitor parpadea, etc.).
- **Personaje:** cápsula vestida mínimamente (cuerpo bicolor), cabeza billboard con `assets-entrada/retrato.*` si existe (si no, placeholder circular con el monograma nuevo y anotación en NIGHT-REPORT-2); bob al andar + rotación suave hacia la dirección de movimiento.
- **Encuadre:** cámara más cinematográfica (ángulo más bajo, leve fog para profundidad, viñeta sutil).
- Puerta de salida: screenshot de la casa junto a un frame de las referencias low-poly de calidad (tipo Monument Valley-ish); pregunta de la vara: *"¿esto tiene dirección de arte?"*.

## 7. Material fuente para el Sprint 1

El material completo de LinkedIn (7 experiencias con bullets reales, formación, aptitudes) y la lista curada de proyectos están en el spec original — sección §9 "Contenido inicial (seed)" — y deben tratarse como única fuente de verdad. Cualquier hueco (p.ej. fecha exacta de inicio de TenTuPlaza) se deja neutro ("2024 — Actualidad") sin adornar. Tono: spec original §3.3 (cercano, directo, humor medido) — el tono se aplica a la REDACCIÓN, nunca a los HECHOS.

## 8. Orden, alcance y cierre

- **Orden:** Sprint 1 → 2 → 3 → 4. Dentro de cada sprint, primero fixes mecánicos, después pasadas creativas de Fable.
- **Fuera de alcance:** features nuevas, analítica, producción, más habitaciones, cambios de stack.
- **Cierre de sesión:** recorridos finales completos (todas las páginas × 2 breakpoints) en `docs/superpowers/qa/final/`; Lighthouse ≥90 recuperado; `NIGHT-REPORT-2.md`; push. La única pregunta que debe poder responderse con "sí" al final: **"¿el recorrido de la home podría confundirse con una referencia?"**.
