# Elevación de nivel — alvaroartiel.com (Sesión autónoma 3)

**Fecha:** 2026-07-11 · **Estado:** aprobado para sesión autónoma
**Contexto obligatorio (leer antes de planificar):** spec original (`2026-07-10-portfolio-web-design.md`), spec de remediación (`2026-07-10-remediacion-acabado-design.md` — su protocolo §1 y su vara §2 SIGUEN VIGENTES ÍNTEGROS en esta sesión), y el análisis fuente de esta sesión (`docs/superpowers/analisis-elevacion-2026-07-11.md`).

---

## 0. Misión

La web ya no tiene defectos estructurales: ahora es **correcta pero no memorable**. Esta sesión la sube de "sin fallos" a "nivel referencia": cada página con su concepto propio y su mensaje, y una capa de marca global (cursor, carga, manifiesto, voz). El filtro de TODAS las decisiones: *"ingeniero + product designer que diseña de punta a punta, con oficio serio y alma gamberra"* — cada página demuestra una faceta: hero=oficio técnico, experiencia=trayectoria, blog=pensamiento, contacto=diseño de interacción, personal=persona.

**Las direcciones creativas ya están validadas por el usuario** (no re-decidir el QUÉ; el CÓMO fino es de Fable):
- Experiencia = "viaje temporal" / CV = documento suizo estático (divorcio total).
- Contacto = formulario mad-lib conversacional.
- Global: cursor propio con estados + experiencia de carga + manifiesto palabra a palabra. (La cortina de acento entre páginas quedó DESCARTADA: se mantiene el crossfade actual.)
- Hero: objetos flotantes reactivos + retrato al hover del nombre + salida en partículas. (La línea de estado vivo quedó descartada como marco del hero; puede usarse discretamente en footer si suma.)

## 1. Protocolo (idéntico a la sesión 2 — resumen operativo)

1. Orquesta **Fable**: lee los 3 documentos de contexto, navega staging para calibrar, crea el plan con **superpowers:writing-plans** y ejecuta con **superpowers:subagent-driven-development** (mecánico→Sonnet/Haiku, creativo→Fable inline, revisión siempre Fable).
2. **Doble puerta Fable en cada tarea** (pre: re-especificar si no alcanzaría la vara; post: verificación de recorrido — secuencias de screenshots cada ~600px, desktop 1440 Y móvil 390, frame a frame — e iterar la mejora dentro del mismo plan hasta cumplir, máx. 3 iteraciones).
3. Vara de calidad = la de la sesión 2 (§2 del spec de remediación) + un punto nuevo: **11. Memorabilidad — cada página responde "¿qué UNA cosa recordará quien la vea?"; si la respuesta es "nada", la tarea no cierra.**
4. Reglas fijas: deploy solo a `dev.alvaroartiel.com`; Sanity free tier; `Compress-Archive`; commits frecuentes; `decisions.md`; informe final `NIGHT-REPORT-3.md`; bloqueo >30min → fallback documentado y seguir; Lighthouse Performance ≥85 durante, ≥90 al cierre.
5. **Regla de contenido (aprendida a la tercera):** ningún subagente redacta hechos. Todo copy factual sale del material fuente del spec original §9; todo copy creativo (microcopy, manifiesto, claims) lo redacta Fable. Verificación factual entrada a entrada en la puerta de salida.

## 2. TAREA 0 — Crítico de contenido (primero, mecánico)

- El **CV** describe TenTuPlaza como "plataforma que da soporte a comercio local y experiencias de ciudad" → FALSO. Realidad: academia online de oposiciones ferroviarias, +5.000 alumnos, +770 reseñas 5★; Álvaro lidera estrategia digital y de producto (nueva plataforma e-learning a medida, UX/UI, coordinación de equipos, marketing).
- Causa probable: /cv y /experiencia no beben del mismo contenido. **Unificar**: ambas páginas renderizan los MISMOS documentos `experience` de Sanity (el CV en versión condensada — mismo dato, distinta densidad). Prohibido tener dos copys paralelos del mismo hecho.
- Auditoría completa de /cv (y /en/cv) contra material fuente antes de cerrar.

## 3. Las obras por sección (orden de ejecución validado)

### 3.1 Experiencia — concepto "viaje temporal" (LA obra grande)
- **Año gigante sticky**: cifra display violeta translúcida (~25-30vw) fija en el lateral que muta (2018→2026) conforme el scroll atraviesa etapas; el cambio de cifra con la coreografía del sistema (motion-tokens; rodillo/contador, no corte).
- **Cada etapa = mini-escena**: marca/logo presente, rol como titular display, **una métrica protagonista** por etapa tipográficamente enorme (+5.000 alumnos · +40 proyectos · 2 SaaS lanzados · Premio Gauss), resumen corto, bullets colapsados bajo "ver detalle" (disclosure accesible).
- **Sorpresa de hover de la página**: los proyectos relacionados muestran **preview flotante que sigue al cursor** (patrón mauriciojuba).
- Móvil: el año gigante pasa a cabecera de etapa (grande pero en flujo); todo el resto degrada según sistema.

### 3.2 CV — documento suizo (el divorcio)
- Dos columnas: sidebar (retrato pequeño en b/n, datos de contacto, aptitudes agrupadas, idiomas, botón imprimir/descargar) + main (experiencia condensada y densa, formación, sin efectos).
- Encabezado propio: "CV — versión para leer con prisa" (voz medida). Tipografía y retícula impecables tipo suizo; acento neutro. Print CSS revisado con la nueva estructura.
- Su concepto ES la quietud — pero quietud DISEÑADA, no pobreza. La vara: ¿parece el CV de un director de arte suizo? 

### 3.3 Contacto — mad-lib conversacional
- Frase display con inputs inline subrayados en lima: «Hola, soy **[nombre]**. Tengo entre manos **[un producto / una web / una idea / otra cosa]** (select estilizado) y quiero contártelo: **[mensaje]**. Respóndeme en **[email]**.» — accesible (labels reales para lector de pantalla, orden de foco natural, validación inline con voz).
- Panel lateral vivo: email gigante clicable con "Copiado ✓" + microexplosión de partículas lima; redes; "Respondo en <48h".
- Botón enviar con viaje de estados (reposo → lanzando → en el buzón ✓). El POST sigue siendo `/api/contact.php` (mapear los campos mad-lib a name/email/message; el select se concatena al mensaje).
- **/gracias con premio**: mini-momento (p.ej. el personaje de la casa saluda o pieza 3D celebrando) + "mientras respondo…" con enlaces a personal/blog.

### 3.4 Blog — de lista muerta a revista
- **Entrada destacada** (la más reciente): tarjeta grande con cover, extracto, "leer · X min".
- Resto en filas tipográficas con **preview flotante al cursor** y meta enriquecida (tiempo de lectura calculado, tags-chip teal). Contador con voz ("1 entrada — de momento").
- **Interior**: barra de progreso de lectura teal, pull-quotes display, imágenes full-bleed del Portable Text, bloque autor al pie (retrato + una línea + CTA contacto), "siguiente entrada" con la entidad de la ficha de proyecto.
- Diseñado para verse BIEN con 1 sola entrada (estado actual) y escalar.

### 3.5 Hero por capas
- **Objetos flotantes reactivos** (noth.in): 4-6 piezas pequeñas del mundo de Álvaro (cursor, componente UI, pieza de puzzle, púa/guitarra mini, nota) orbitando el titular con parallax al ratón y reacción al hover (huyen/giran). Materiales del sistema (marfil/acentos), nunca tapan texto (vara §2.3), presupuesto FPS vigente.
- **Retrato al hover del nombre**: hover sobre "Álvaro Artiel" revela el retrato real (`assets-entrada/retrato.png`, recorte cuidado) con efecto del sistema; en móvil, tap o aparición sutil al cargar.
- **Salida en partículas**: al iniciar scroll, el titular se disuelve en sus propias partículas (ascendiendo/dispersando con scrub) en lugar del fade — reutiliza el sistema de partículas existente.

### 3.6 Capa global de marca
- **Cursor propio**: punto + aro con lag suave (mix-blend según fondo); estados: enlaces (crece), cartas proyecto/blog ("VER →"), polaroids ("ARRASTRA"), filtros (etiqueta). Desaparece en móvil; respeta reduced-motion (sin lag animado); nunca rompe accesibilidad (cursor real disponible para quien lo fuerce).
- **Experiencia de carga**: 1-1.5s primera visita por sesión (sessionStorage): telón `--surface-0`, monograma dibujándose + una palabra que rota (diseño/código/producto). Sale con la coreografía del sistema y revela el hero YA estable (fuentes y WebGL listos detrás). Skippable con click/tecla. Reduced-motion: fade simple.
- **Manifiesto palabra a palabra** (home, entre deck y teaser personal): frase revelándose con scrub (cinetica). Redacción de Fable (2-3 opciones en `decisions.md`, elegir la mejor; tono §3.3: seria PERO con remate gamberro). Tipografía display grande, acento mutando con el camaleón de la zona.
- **Pasada de microcopy con voz en TODO el sitio**: inventario de todos los textos utilitarios (hints, contadores, botones, estados vacíos, 404 si existe, footer) y reescritura con la voz definida. Bilingüe (la voz también en EN, adaptada no traducida literal).

### 3.7 Retoques menores (si el presupuesto de la sesión lo permite, en este orden)
- Cartas de proyecto: tilt sutil + zoom de imagen al hover + índice "01/04" en pestaña + cursor "VER →".
- Ficha: progreso sticky del caso; "siguiente proyecto" con preview más rica.
- Menú overlay: mini-preview de sección al hover (palabra clave + color).
- Personal: cinta manuscrita de contexto al filtrar capítulo.
- Casa: re-auditar tras sprint 4 de la sesión 2; si no pasa la vara nueva (§1.3 punto 11), mejorar dentro del presupuesto restante.

## 4. Cierre de sesión
- Recorridos finales completos (todas las páginas × 2 breakpoints × 2 idiomas) en `docs/superpowers/qa/sesion-3/`.
- Lighthouse ≥90 en todas las rutas; verificación reduced-motion de TODO lo nuevo (cursor, loader, manifiesto, hero capas, año sticky).
- `NIGHT-REPORT-3.md` + push. Pregunta final de la sesión: **"¿Qué una cosa memorable tiene ahora cada página?"** — el informe debe responderla página a página.
