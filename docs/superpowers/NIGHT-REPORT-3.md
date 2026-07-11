# NIGHT-REPORT 3 — Elevación de nivel (2026-07-11)

**Spec:** `docs/superpowers/specs/2026-07-11-elevacion-nivel-design.md` · **Plan:** `docs/superpowers/plans/2026-07-11-elevacion-nivel.md`
**Staging:** https://dev.alvaroartiel.com · **Protocolo:** doble puerta Fable por tarea (mecánicas → Sonnet, creativas → Fable inline), vara sesión 2 + memorabilidad.

## Lo hecho (12/12 tareas del plan)

1. **Crítico de contenido:** TenTuPlaza veraz (academia online de oposiciones ferroviarias, +5.000 alumnos, +770 reseñas 5★) en experiencia, proyecto y CV. Diagnóstico corregido: la causa era el SEED, no una doble fuente — /cv y /experiencia ya compartían los documentos de Sanity.
2. **Experiencia = viaje temporal:** orden cronológico 2018→hoy, año gigante violeta sticky con odómetro (rodillo por dígito), cada etapa una mini-escena con métrica protagonista respaldada, bullets bajo disclosure accesible, preview flotante de proyectos al cursor, coda «Y lo que venga.» con CTA.
3. **CV = documento suizo:** dos columnas (retrato b/n, contacto, aptitudes agrupadas, idiomas, imprimir) + main condensado (mismo dato de Sanity, distinta densidad), encabezado «CV — versión para leer con prisa», cero efectos, print.css revisado.
4. **Contacto = mad-lib conversacional:** frase display con inputs inline (labels sr-only, foco natural, validación inline con voz), select estilizado que se concatena al mensaje, panel vivo (email copiable + microexplosión lima, redes, «Respondo en <48h»), botón con viaje de estados. POST real verificado (302 → /gracias). **/gracias con premio:** monograma 3D celebrando + confeti + «mientras respondo…».
5. **Blog = revista:** entrada destacada con cover y «leer · X min», tiempo de lectura calculado, tags-chip teal, contador con voz («1 entrada — de momento»), interior con barra de progreso, pull-quotes display, imágenes full-bleed, bloque autor y «siguiente entrada» con estado-con-voz cuando no hay siguiente.
6. **Hero por capas:** 5 objetos flotantes reactivos (cursor, toggle, puzzle, púa, nota — DOM 2.5D, parallax + huida al hover), retrato real al hover del nombre (sutil al cargar en móvil), y salida del titular disuelto en sus propias partículas con scrub. 241 fps medidos.
7. **Cursor propio:** punto + aro con lag (difference), estados VER→/ARRASTRA/etiqueta de filtro; solo puntero fino, sin lag con reduced-motion, fuera con forced-colors.
8. **Experiencia de carga:** telón `--surface-0` con monograma dibujándose + palabra rotante (diseño/código/producto), solo 1ª visita por sesión (guard inline pre-paint), skippable, techo 1.5s, reduced=fade.
9. **Manifiesto palabra a palabra:** «Estrategia, diseño y código de la misma mano. Así no hay a quién echarle la culpa.» — scrub con acento del camaleón vivo; 3 opciones redactadas en decisions.md; estado apagado ajustado a AA-large (0.38).
10. **Microcopy con voz:** inventario completo; reescritos los neutros restantes («Sigue bajando, que hay chicha», estados del formulario) ES+EN — el resto ya tenía voz de sesiones anteriores.
11. **Retoques:** índice 01/10 + tilt en cartas, progreso sticky del caso en fichas, mini-preview de sección en el menú (color + palabra clave), cinta manuscrita por capítulo en /personal. Casa re-auditada: PASA la vara nueva sin cambios.
12. **Cierre:** 40 recorridos (10 páginas × 2 breakpoints × 2 idiomas) en `docs/superpowers/qa/sesion-3/`; reduced-motion verificado de todo lo nuevo; Lighthouse y CWV abajo.

## Métricas al cierre (staging)

- **Home:** Lighthouse A11y 100 · BP 100 · SEO 100 · LCP 331ms · CLS 0.
- **/contacto:** A11y 100 · BP 100 · SEO 100 (el mad-lib es accesible de verdad).
- **/experiencia:** LCP 444ms · CLS 0 (se detectó y corrigió un CLS 0.18 del carril del odómetro).
- Performance ≥90 holgado en todas las rutas medidas (LCP <450ms, CLS 0).
- FPS hero con todas las capas: ~241.

## Fixes de calidad encontrados por las puertas

- CLS 0.18 en /experiencia (auto-colocación de grid al activar el rail) → 0.00.
- Contraste del manifiesto apagado (1.61 → 2.96 → 3.1+, AA-large).
- `npm run build` regenera dist SIN `api/contact.php` → regla: siempre `node scripts/deploy.mjs` antes de zipear (documentado; el 404 del endpoint se detectó y corrigió en la puerta de Task 4).
- Caché de Hostinger sirve HTML viejo tras deploy → verificación siempre contra origen con `cache: no-store`.

## Decisiones (todas en decisions.md)

Orden cronológico + coda 2026 en experiencia · métricas solo respaldadas · idiomas del CV sin niveles · premio de /gracias = monograma celebrando (no personaje de la casa) · flotantes en DOM 2.5D (no WebGL) · manifiesto opción 3 · casa sin cambios.

## Limitaciones conocidas

- Los recorridos fullPage de QA muestran las secciones bajo el fold con opacity 0 (artefacto de los reveals por scroll; el recorrido real se validó frame a frame con scroll durante cada tarea).
- Reduced-motion verificado a nivel JS con override de `matchMedia` + CSS por inspección (el MCP no emula `prefers-reduced-motion` nativo).
- El telón de carga se verificó mecánicamente en navegador y visualmente con reconstrucción del DOM (la ventana de 1.5s es más corta que la latencia de captura).

---

## La pregunta final: ¿qué UNA cosa memorable tiene ahora cada página?

| Página | Lo que recordarás |
|---|---|
| **Home** | El titular que se deshace en sus propias partículas al bajar — y una frase que se enciende palabra a palabra: «…así no hay a quién echarle la culpa.» |
| **Proyectos** | El fichero de cartas con pestañas que se inclinan hacia tu cursor, con el aro «VER →» pidiéndote el clic. |
| **Ficha** | La barra azul que mide el caso mientras lo lees. |
| **Experiencia** | El año gigante violeta que rueda 2018→2026 mientras el scroll atraviesa la trayectoria — el tiempo se SIENTE. |
| **CV** | Que se queda quieto A PROPÓSITO: un documento suizo denso con retrato en b/n, en una web donde todo lo demás respira. |
| **Blog** | Abre con una revista, no con una lista — y te dice «1 entrada — de momento» sin complejos. |
| **Contacto** | El formulario ES una conversación: «Hola, soy ___. Tengo entre manos ___ y quiero contártelo.» |
| **/gracias** | El monograma celebrando tu mensaje bajo una lluvia de confeti. |
| **Personal** | La mesa revuelta de siempre, ahora con una nota manuscrita que cambia según el capítulo que cotilleas. |
| **La casa** | Tu personaje lleva la cara real de Álvaro. Eso no se olvida. |
| **Global** | El cursor deja de ser el del sistema: la web te responde desde el primer píxel, y la primera visita entra por un telón con la marca dibujándose. |
