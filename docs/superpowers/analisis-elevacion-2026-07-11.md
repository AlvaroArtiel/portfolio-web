# Análisis de elevación — dev.alvaroartiel.com (2026-07-11)

Tercera pasada. La remediación funcionó (deck con pestañas y elevación ✓, monograma acotado ✓, contenido de /experiencia veraz ✓, composiciones ✓). Ahora el objetivo cambia: **de "sin defectos" a "la hostia"**. Análisis contra referencias buscando qué falta y qué puede subir de nivel, global y por sección.

⚠️ **1 crítico de contenido detectado:** el **CV** describe TenTuPlaza como "plataforma que da soporte a comercio local y experiencias de ciudad" — FALSO (academia online de oposiciones ferroviarias, +5.000 alumnos). /experiencia y /cv tienen copys distintos: el CV mantiene texto alucinado. Auditar TODA la superficie de contenido de /cv contra el material fuente (y confirmar que ambas páginas beben del MISMO contenido de Sanity).

---

## A. Global — lo que falta como experiencia de marca

| # | Mejora | Referencia | Detalle |
|---|---|---|---|
| G1 | **Experiencia de carga** | noth.in (su loader es precioso) | Hoy la web "aparece". Una entrada de marca de 1-1.5s (cortina `--surface-0` + monograma dibujándose + contador o palabra rotando) que además tapa el pop de fuentes/WebGL. Solo primera visita por sesión; skippable. |
| G2 | **Cursor propio con estados** | Todas las refs | Punto + aro con lag suave; estados: link (crece), carta de proyecto ("VER →"), polaroid (mano/DRAG), filtros (etiqueta). El cursor es el actor principal de una web de interacción y hoy es el del sistema. |
| G3 | **Momento manifiesto tipográfico** | cinetica (letras que aparecen con el scroll) | Entre deck y teaser de la home: una frase-manifiesto grande ("Lo técnico es el medio. Lo que sientes al usarlo es el fin." — redactable) que se revela palabra a palabra con scrub. Da respiro narrativo y el momento cinetica que amas. |
| G4 | **Transición de página con identidad** | pxpush (sus filtros/áreas de color) | El crossfade actual es correcto pero anónimo. Cortina vertical rápida con el ACENTO de la página destino (barrido 500ms) → refuerza el camaleón como sistema de navegación. |
| G5 | **Microcopy con voz** | — (nuestro spec §3.3) | "Baja para ver más", "1 entrada", "Enviar"… neutros. Pasada de voz en TODO el microcopy: "Sigue bajando, que hay chicha ↓", "Esto acaba de empezar", "Lanzar al buzón →". El gamberro vive en los detalles. |
| G6 | **Una sorpresa de hover por página** | ryanritzenthaler | Presupuesto explícito: cada página tiene UN hover memorable (hoy solo el menú y las filas lo intentan). Definidos por sección abajo. |
| G7 | **Marca de estado vivo** | mauriciojuba | Línea mono en header o footer: "Disponible para proyectos · Ceuta/Málaga · 18:42 local" — sensación de persona viva detrás. Editable desde Sanity. |

## B. Por sección

### B1. Hero (diagnóstico del usuario: "se queda vacío, el efecto guay pero ya")
El titular de partículas es el único actor; alrededor, nada. Referencias: los heros de russellnumo/noth.in tienen CAPAS (fondo, sujeto, elementos flotantes, UI perimetral).
- **Capa de objetos flotantes reactivos** (noth.in): 4-6 piezas 3D/2.5D pequeñas orbitando el titular con parallax al ratón y micro-rotación — objetos de su mundo: un cursor, un componente UI, una pieza de puzzle, una nota, una guitarra mini. Al hover, reaccionan (huyen/giran). Presupuesto FPS ya existente.
- **El retrato entra en escena**: hover sobre "Álvaro Artiel" (o un "(soy este)" en mono) revela el retrato real recortado con efecto — humaniza; TODAS las refs personales muestran persona.
- **Salida coreografiada**: al scrollear, el titular se DESHACE en sus propias partículas hacia arriba (el sistema ya existe; hoy la salida es un fade genérico). Primera transición = declaración de intenciones.
- **Línea de estado** (G7) como marco perimetral que completa las esquinas vacías.

### B2. Experiencia (diagnóstico: "demasiado parecida al CV y ambas muy sosas") — LA GRAN OBRA de esta fase
Concepto nuevo: **"Trayectoria" como viaje, no como lista**. Diferenciación total del CV:
- **Año gigante sticky** (cinetica): al scrollear, un año enorme violeta translúcido (display, ~30vw) fijo al lateral va cambiando (2018 → 2026) conforme atraviesas etapas — el tiempo se SIENTE.
- **Cada etapa = mini-escena**: logo/marca de la empresa grande, rol como titular display, 1 métrica destacada tipográficamente (+5.000 alumnos, +40 proyectos, 2 SaaS lanzados), bullets colapsados en "ver detalle".
- **Proyectos relacionados con preview flotante al hover** (el patrón mauriciojuba que descartamos para /proyectos encaja PERFECTO aquí — G6 de esta página).
- Entrada/salida de etapas con la coreografía del sistema (motion-tokens).
- **El CV se diferencia quedándose QUIETO a propósito**: documento puro dos columnas (sidebar: foto, datos, aptitudes, idiomas, botón descargar; main: experiencia densa + formación), header propio "Versión imprimible / para RRHH". Su sosería pasa a ser su concepto — pero bien maquetado, denso, tipo suizo. Hoy es una repetición pobre de /experiencia; debe ser OTRO documento.

### B3. Blog (diagnóstico: "completamente desaprovechado")
Hoy: una fila con hairlines. Ni imagen, ni jerarquía, ni invitación a leer.
- **Entrada destacada** (la última): tarjeta grande con cover, extracto y "leer (4 min)" — el blog abre con contenido, no con lista.
- **Filas con preview flotante al cursor** (mauriciojuba): cover + título grande que se desplaza al hover (G6 de esta página).
- **Meta enriquecida**: tiempo de lectura calculado, tags-chip con acento teal, contador de entradas con voz ("1 entrada — de momento").
- **Interior del post**: barra de progreso de lectura en acento, pull-quotes grandes, imágenes full-bleed, bloque autor al pie con retrato + CTA a contacto, "siguiente entrada" al estilo ficha de proyecto.

### B4. Contacto (diagnóstico: "lo más básico del mundo")
Hoy: 3 inputs + botón en media pantalla vacía. Concepto nuevo: **el formulario como conversación** (es un product designer — el form ES la demo):
- **Mad-lib tipográfico**: "Hola, soy **____**. Tengo entre manos **[un producto / una web / una idea / otra cosa]** y quiero contártelo. Escríbeme a **____**" — inputs inline subrayados en acento dentro de la frase display. Memorable, personal y rapidísimo (patrón clásico de estudios top).
- **Panel de datos vivo** (columna dcha.): email gigante clicable con "copiado ✓" + microconfeti lima, redes, línea de estado (G7), "respondo en <48h".
- **Botón enviar** con viaje: reposo → "Lanzando…" (avioncito/trayectoria) → "En el buzón ✓".
- **/gracias con premio**: hoy inexistente como momento; añadir sorpresa (el personaje de la casa saluda, o mini-animación) + "mientras tanto…" enlaces a personal/blog.

### B5. Proyectos (lista ya fuerte — retoques)
- Hover de carta: tilt sutil 3D + la imagen despierta (zoom 1.04 + parallax) + cursor "VER →" (G2/G6).
- Índice "01 / 04" mono en la pestaña de cada carta (colecciona, guía).
- Ficha: **barra sticky de progreso del caso** (secciones del proyecto) + "siguiente proyecto" a pantalla completa con preview interactiva (hoy es un link correcto pero frío).

### B6. Personal / Casa / Menú
- Personal: ya es la página con más alma. Solo: cinta de contexto por capítulo (frase manuscrita al filtrar) + contador de items con voz.
- Casa: (pendiente re-audit tras sprint 4) — si sigue floja tras la mejora, se decide en ejecución con la doble puerta.
- Menú: el snake-trail existe; añadir preview de sección al hover de cada item (color + palabra clave) para que el overlay venda cada mundo.

## C. Qué transmitimos (el filtro para ejecutarlo todo)
Cada mejora debe pasar este filtro: **"ingeniero + product designer que diseña de punta a punta, con oficio serio y alma gamberra"**. El hero demuestra oficio técnico (partículas + 3D); experiencia demuestra trayectoria (viaje temporal); blog demuestra pensamiento; contacto demuestra diseño de interacción; personal demuestra persona. Si una mejora no refuerza su página-mensaje, fuera.

## D. Orden propuesto de ejecución (a validar con el usuario)
1. **Contenido crítico**: fix CV TenTuPlaza + auditoría total /cv (y unificar fuente con /experiencia). [mecánico, primero]
2. **Experiencia + CV** (la gran obra: concepto trayectoria + CV documento).
3. **Contacto + gracias** (conversación mad-lib).
4. **Blog** (destacada + previews + interior).
5. **Hero por capas** (flotantes + retrato + salida coreografiada).
6. **Global**: loader, cursor, manifiesto, transición cortina, microcopy, estado vivo.
7. Retoques proyectos/personal/menú.
