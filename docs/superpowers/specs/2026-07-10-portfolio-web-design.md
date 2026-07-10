# alvaroartiel.com — Web personal / Portfolio / CV

**Fecha:** 2026-07-10 · **Estado:** Spec aprobado para plan de implementación autónomo
**Dominio:** alvaroartiel.com (raíz libre; la web de fotografía vive en fotografia.alvaroartiel.com)

---

## 1. Resumen y objetivos

Web personal de Álvaro Artiel — Product Lead & Digital Product Consultant (e-learning, SaaS, IA aplicada, gamificación). La web ES la marca: no existe identidad previa y se construye con este proyecto.

**Objetivos:**
1. Impresionar visualmente al nivel de las referencias (pxpush.com, russellnumo.nl, cinetica.studio, noth.in, k95.it, ryanritzenthaler.com, mauriciojuba.com).
2. Contar la historia "diseño producto de punta a punta: estrategia + UX + ejecución + IA".
3. Todo el contenido editable desde un backoffice (Sanity Studio) sin tocar código.
4. Bilingüe: español (base) e inglés.

**Principio rector:** *Piel elegante, alma juguetona.* Lo estático es premium y limpio; lo que se mueve tiene carácter y sorpresa. El nivel de juego se gradúa por zonas (máximo en home/personal, mínimo en CV/blog).

**Decisión clave:** la web principal es el "wow" (scroll-craft + acentos 3D). El modo jugable (casa navegable con personaje) es un **easter egg**, no una experiencia paralela.

---

## 2. Stack y arquitectura

| Capa | Tecnología | Justificación |
|---|---|---|
| Framework | **Astro 5** (output estático) | Cero JS por defecto, islas para lo interactivo, compatible con hosting estático de Hostinger (sin Node) |
| CMS | **Sanity** (plan gratuito) | Backoffice profesional sin construirlo; CDN de imágenes con recortes/optimización |
| Backoffice | **Sanity Studio** desplegado en `alvaroartiel.sanity.studio` (via `sanity deploy`) | Sin coste ni servidor propio |
| 3D/WebGL | **Three.js** | Partículas hero, logo 3D, casa easter egg |
| Animación | **GSAP + ScrollTrigger** | Scroll narrativo, reveals, deck apilado |
| Smooth scroll | **Lenis** | La sensación "cinetica" |
| Física 2D | **Matter.js** | Mesa revuelta de polaroids |
| Repositorio | GitHub (privado) | |
| CI/CD | **GitHub Actions**: build Astro → deploy a Hostinger vía FTP(S) | Webhook de Sanity → `repository_dispatch` → rebuild automático al publicar contenido |
| Formulario | Endpoint **PHP** en Hostinger (`/api/contact.php`, `mail()` + honeypot) | Hostinger sirve PHP aunque no Node; sin dependencias externas |
| Vídeo personal | Embeds de YouTube (lazy, facade) | Sin coste de almacenamiento |

**Flujo de edición:** Álvaro edita en Sanity Studio → publica → webhook dispara GitHub Action → Astro rebuild (consulta contenido vía GROQ) → deploy FTP → cambios en vivo en ~2-3 min.

**Estructura del repo (monorepo):**
```
portfolio-web/
├── web/          # Astro
├── studio/       # Sanity Studio
├── api/          # contact.php (se sube a Hostinger junto al build)
├── docs/superpowers/specs/
└── .github/workflows/deploy.yml
```

---

## 3. Sistema visual — "Monocromo camaleón, con navaja"

### 3.1 Color
Base constante + acento que cambia por sección. Las transiciones de acento al navegar son parte del espectáculo.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0C0C0E` | Fondo global (casi negro) |
| `--bg-elevated` | `#16161A` | Tarjetas, superficies |
| `--text` | `#F4F4F0` | Texto principal (blanco roto) |
| `--text-muted` | `#8A8A93` | Secundario |
| `--accent` (home) | `#D4FF3F` lima ácido | El gamberro de presentación |
| `--accent` (proyectos) | `#5B8CFF` azul eléctrico | |
| `--accent` (experiencia) | `#B06CFF` violeta | |
| `--accent` (personal) | `#FF7847` naranja cálido | |
| `--accent` (blog) | `#4FD1C5` teal | |
| `--accent` (cv) | neutro `#F4F4F0` | Sobrio, imprimible |

El acento se implementa como CSS custom property a nivel de página; los componentes compartidos (header, footer, links, selección de texto, scrollbar) lo heredan.

### 3.2 Tipografía (self-hosted, woff2)
- **Display:** Clash Display (Fontshare, gratuita) — grotesk rotunda, titulares enormes, momentos en mayúsculas.
- **Texto:** Instrument Sans — lectura limpia.
- **Mono:** JetBrains Mono — guiños técnicos (etiquetas, fechas, metadatos).

Escala fluida con `clamp()`; titulares de hero en el rango 8-14vw.

### 3.3 Voz
Español cercano y directo, con humor medido. Microcopy con carácter en hovers y easter eggs; sobrio en CV y fichas de proyecto.

---

## 4. Estructura del sitio

Patrón: **home-escaparate + páginas-mundo**. Rutas ES en raíz, EN bajo `/en/`.

```
/                    Home escaparate
/proyectos           Deck completo con filtros
/proyectos/[slug]    Ficha de proyecto
/experiencia         Timeline
/personal            Mesa revuelta
/blog                Lista
/blog/[slug]         Entrada
/cv                  CV puro imprimible
/contacto            Formulario
/gracias             Post-envío (fase posterior: teléfono aquí)
/en/...              Réplica inglesa de todo
```

### 4.1 Home (acento lima)
1. **Hero:** campo de partículas WebGL que forma el titular "Diseño productos digitales de punta a punta" (o retrato); las partículas huyen del cursor y se reagrupan. Subtítulo con keywords en mono. En móvil: reaccionan a touch/scroll.
2. **Logo/marca 3D** rotando en el hero; al hacer scroll se encoge y se acopla al header (momento pxpush). La "marca" es un monograma AA generado tipográficamente (no hay logo previo — se diseña como parte de F4).
3. **Quién soy** (scroll fino): 3-4 líneas del "Acerca de" condensado, texto que se revela con el scroll.
4. **Proyectos destacados:** deck apilado con los 3-4 flagged `featured` en Sanity → CTA "ver todos".
5. **Super-CTA con tipografía líquida** reactiva al cursor (efecto noth.in): "¿Trabajamos juntos?" → /contacto.
6. **Teaser personal:** 3-4 polaroids asomando desordenadas → /personal.
7. **Footer** + easter egg post-footer (ver §6).

### 4.2 /proyectos (azul)
- **Deck apilado** (pxpush): cada proyecto una tarjeta grande que se apila al hacer scroll.
- **Filtros:** `Producto propio · Cliente · Formación · Personal`. Al filtrar, las cartas se **rebarajan físicamente** (salen volando las excluidas, se reapilan las visibles).
- **Ficha de proyecto — dos niveles de media, sin límite:**
  1. **Sección superior (curada):** título enorme + metadatos mono + **2-3 imágenes obligatorias** integradas composicionalmente con el texto y los elementos del diseño (no una galería: cada slot tiene su posición y tamaño en el layout, con efecto "lona" k95 al hacer scroll).
  2. **Cuerpo flexible:** narrativa Portable Text donde se intercalan bloques de media ilimitados (imagen full-bleed, imagen doble, vídeo/YouTube, grid). El layout se adapta igual de bien a un proyecto con 3 medias que con 30 — el diseño define *patrones de bloque*, no una cantidad.
  3. Stack/rol/año, link externo si existe, navegación "siguiente proyecto" a pantalla completa.

### 4.3 /experiencia (violeta)
Timeline vertical con scroll narrativo: cada posición se despliega al entrar en viewport (empresa, rol, fechas, bullets). Línea de tiempo que se dibuja con el scroll. Los proyectos vinculados a cada etapa enlazan a sus fichas.

### 4.4 /personal (naranja)
**Mesa revuelta:** fotos y vídeos esparcidos con rotaciones aleatorias, anotaciones "a mano" (font handwriting solo aquí), **arrastrables con física Matter.js**; clic amplía (lightbox con navegación). Vídeos = tarjetas con play → embed YouTube.
- **Capítulos** (filtros suaves, no tabs duras): 🍳 Cocina · 🎭 Teatro · 🎸 Guitarra (carnavales y conciertos) · 📷 Fotografía. El capítulo fotografía incluye puente destacado a fotografia.alvaroartiel.com.
- **Móvil:** flujo vertical de polaroids con rotaciones ligeras y solapado suave, tap para ampliar, reacción sutil al giroscopio. Sin drag.

### 4.5 /blog (teal)
Lista tipográfica limpia (título grande, fecha mono, tags). Entrada: lectura cómoda, ancho de medida ~68ch, Portable Text con imágenes/código/embeds. Nivel de juego mínimo.

### 4.6 /cv (neutro)
Versión formal: datos, experiencia y formación en layout sobrio de una columna. **Print stylesheet** cuidada + botón "Descargar PDF" (abre diálogo de impresión; opcionalmente Sanity permite subir un PDF que sustituye al botón). Sin efectos.

### 4.7 /contacto + /gracias
Formulario (nombre, email, mensaje) → POST a `/api/contact.php` → redirect a /gracias. Honeypot + validación. Email destino: soy@alvaroartiel.com. Redes sociales desde Sanity (placeholders iniciales editables).

### 4.8 Header / Footer / Menú
- Header mínimo: monograma (destino del logo 3D) + hamburguesa.
- **Menú overlay** a pantalla completa: items enormes con hovers de carácter + **snake-trail del cursor** (el rastro-serpiente vive aquí, no compite con las partículas del hero). Selector ES/EN.
- Footer: contacto rápido, redes, "hecho con Astro + Sanity + cariño"… y si sigues bajando, §6.

---

## 5. Presupuesto de efectos y degradaciones

| Efecto | Dónde | Móvil | `prefers-reduced-motion` |
|---|---|---|---|
| Partículas hero | Home | Versión ligera (menos partículas, touch) | Imagen estática del titular |
| Logo 3D → header | Home | Igual, sin seguimiento de cursor | Estático |
| Tipografía líquida | Super-CTA home | Reacciona a scroll | Sin distorsión |
| Snake-trail | Menú overlay | No existe (no hay cursor) | No existe |
| Deck apilado | Home + /proyectos | Igual (scroll nativo) | Cartas sin parallax, apilado simple |
| Rebarajado por filtro | /proyectos | Transición simplificada | Corte directo |
| Lonas k95 | Ficha proyecto | Reducido | Sin curvatura |
| Mesa revuelta física | /personal | Montón vertical + giroscopio | Grid estática con rotaciones |
| Timeline dibujada | /experiencia | Igual | Aparece completa |
| Casa jugable | Easter egg | Joystick táctil virtual | Accesible; es opt-in explícito |

**Reglas:** todo efecto WebGL detecta capacidades (WebGL disponible, `deviceMemory`, FPS) y degrada a su fallback. Lighthouse objetivo ≥90 en Performance con efectos activos en desktop medio.

---

## 6. Easter eggs

### 6.1 Post-footer
Si se sigue haciendo scroll más allá del footer (a conciencia), se revela una sección oculta con una pieza 3D (vibra ryanritzenthaler) que sirve de **puerta de entrada a la casa**: "Has llegado demasiado lejos… ¿pasas?".

### 6.2 La casa (modo juego)
- **Alcance mínimo viable:** UNA habitación navegable en Three.js.
- **Personaje:** cuerpo low-poly simple + **foto de Álvaro como cabeza** (billboard/recortable).
- Control: WASD/flechas en desktop, joystick virtual en móvil. Cámara tercera persona fija-suave.
- **4-5 objetos interactivos** con prompt al acercarse: escritorio → /proyectos · estantería/diplomas → /experiencia y /cv · guitarra → /personal · ordenador → /blog · puerta/buzón → /contacto.
- Rendimiento: escena low-poly, luces horneadas, carga solo al entrar (chunk aparte, nunca pesa en la web normal).
- Acceso: post-footer + comando oculto en el menú. Sin promesa de "juego completo": es un juguete con encanto.

---

## 7. Modelo de datos (Sanity)

Todos los campos de texto visibles son **objetos localizados** `{es, en}` (i18n a nivel de campo).

| Schema | Campos clave |
|---|---|
| `siteSettings` | titular hero, subtítulo, textos "quién soy", email, redes[] (nombre, url, visible), PDF de CV opcional, textos SEO por defecto |
| `experience` | empresa, rol, tipo (fulltime/freelance/founder), fechas (inicio, fin opcional), ubicación, modalidad, resumen, bullets[], logo, proyectos relacionados[], orden, visible |
| `education` | centro, título, fechas, nota/premio, descripción, orden, visible |
| `project` | título, slug, categoría (`propio/cliente/formacion/personal`), `featured` (bool, deck home), año, rol, stack[], resumen, **heroMedia[] (2-3 imágenes obligatorias, sección superior curada)**, cuerpo (Portable Text con bloques de media ilimitados: imagen full-bleed, imagen doble, grid, vídeo/YouTube), imagen de portada (deck), url externa, proyecto siguiente (ref opcional; si vacío, orden), visible |
| `personalChapter` | título, emoji, descripción corta, orden (Cocina, Teatro, Guitarra, Fotografía) |
| `personalItem` | tipo (foto/video), capítulo (ref), imagen o youtubeUrl, anotación manuscrita, fecha aproximada, visible |
| `blogPost` | título, slug, fecha, tags[], extracto, cuerpo (Portable Text), imagen, idiomas disponibles, publicado |

Studio en español, con vistas ordenadas y previews. Sanity gestiona borradores/publicación nativamente.

---

## 8. i18n

- ES canónico en raíz; EN bajo `/en/` (mismo árbol). `hreflang` + selector en menú que conserva la página actual.
- Microcopy de interfaz en diccionarios JSON del repo; contenido en campos `{es, en}` de Sanity.
- **Carga inicial:** todos los textos EN los traduce Claude durante la implementación; Álvaro itera después desde el Studio.
- Si un campo EN está vacío → fallback a ES (nunca hueco).

---

## 9. Contenido inicial (seed)

Se carga vía script de import a Sanity (NDJSON) durante la implementación:

- **Identidad:** Álvaro Artiel · hero "Diseño productos digitales de punta a punta" (copy final se redacta en implementación) · keywords: Product Lead · UX/UI · E-learning · SaaS · IA aplicada.
- **Experiencia (7):** TenTuPlaza (Product & Digital Lead) · Ceustack (Co-founder & Product Lead) · Consultor independiente (+40 proyectos; BoxDigital, Okawa, Lalalastudio citados dentro) · Esperando el Render · AuraProds (nov 2024–ene 2026) · iUrban (sept 2023–oct 2024) · 8 Pecados (nov 2018–dic 2019). Textos = versión condensada del material de LinkedIn aportado. Fechas pendientes ([MES/AÑO]) quedan como "20XX – Actualidad" hasta que Álvaro las fije en el Studio.
- **Formación (6):** Grado UMA (2015-19) · Máster UX-UI y Programación Web Gauss (2022-23, Premio Proyecto del Año) · Especialista UX/UI Gauss (2023-24) · ESIC SEO&SEM (2020) · freeCodeCamp (2024-25) · DevTalles (2025-act.).
- **Proyectos (10):** *featured:* Ranquea, UltraCarta, Plataforma TenTuPlaza (marcada "en construcción"), Vaultz. *Resto:* Watcheers, BeNext, Campus AuraProds, CRM iUrban + design system, Web de fotografía (enlace a fotografia.alvaroartiel.com), ControlFacturación. Descripciones desde el material de LinkedIn/Notion; **imágenes: placeholders con arte generativo del sistema visual** — Álvaro las sustituye desde el Studio en iteraciones posteriores. Excluidos: Wowcery, Nikefit y resto del Notion antiguo.
- **Personal:** 4 capítulos creados; items con placeholders (2-3 por capítulo) para validar la mesa revuelta.
- **Blog:** 1 entrada de bienvenida ("Por qué esta web es como es") como demo del pipeline.
- **Contacto:** soy@alvaroartiel.com; redes como placeholders editables.

---

## 10. SEO, rendimiento, accesibilidad

- Meta/OG por página desde Sanity; OG images generadas con el sistema visual (plantilla + título).
- Sitemap, robots, `hreflang`, JSON-LD (Person + CreativeWork en proyectos).
- Imágenes vía CDN de Sanity (`?w=&fm=webp`), lazy, `srcset`.
- Fuentes subset + `font-display: swap`. JS de efectos en islas con `client:visible`.
- Navegable por teclado; la casa y los efectos nunca bloquean el contenido (el HTML semántico siempre existe debajo).
- Analítica: **ninguna en v1** (se puede añadir después; evita banner de cookies).

---

## 11. Fases de implementación (para el plan autónomo)

Cada fase termina con la web funcionando y desplegable. El "wow" se construye en capas sobre una base sólida — si la noche se acaba a mitad, lo construido es usable.

- **F0 — Cimientos:** monorepo, Astro + Sanity Studio configurados, schemas, seed de contenido, GitHub Actions deploy a Hostinger (staging primero), PHP contact endpoint.
- **F1 — Sistema:** tokens de color camaleón, tipografías, layout base, header/menú/footer, i18n routing ES/EN.
- **F2 — Páginas completas sin motion:** las 8 rutas con contenido real de Sanity, semántica y responsive perfectos, print CSS del CV. *(Web ya publicable, sobria.)*
- **F3 — Capa de movimiento:** Lenis, reveals GSAP, deck apilado + rebarajado, índice/hovers, timeline dibujada, menú overlay con snake-trail, transiciones de acento.
- **F4 — Capa WebGL:** partículas hero, monograma 3D → header, tipografía líquida del CTA, lonas k95 en fichas.
- **F5 — Mesa revuelta:** física Matter.js, lightbox, adaptación móvil + giroscopio.
- **F6 — Easter eggs:** post-footer + casa jugable (habitación, personaje con foto-cabeza, 5 objetos).
- **F7 — Pulido:** SEO/OG, reduced-motion y fallbacks, Lighthouse, QA cross-device, traducción EN completa, deploy a producción (alvaroartiel.com).

### 11.1 Protocolo de ejecución autónoma

- **Reflexión por fase:** al cerrar cada fase, el agente ejecutor revisa lo construido contra este spec y las referencias. Si detecta una **mejora real** (no un capricho: mejor rendimiento, mejor jerarquía visual, solución más simple con igual resultado), puede variar la decisión **documentándola** en `docs/superpowers/decisions.md` (qué cambia, por qué, qué decía el spec).
- **Enrutado de modelos:** toda decisión creativa o de dirección (variar el spec, diseño visual de componentes clave, copy, composición de las fichas, efectos) pasa por **Fable**. Las tareas de ejecución mecánica (scaffolding, schemas, configuración, seed de datos, tests, deploy, traducción inicial EN) se derivan a **modelos más baratos** (Sonnet/Haiku) vía subagentes.
- **Verificación continua:** cada fase termina con build verde + revisión visual con navegador (screenshots) antes de pasar a la siguiente.

**Fuera de alcance v1:** teléfono en /gracias, analítica, más habitaciones de la casa, comentarios en blog, dark/light toggle (la web es oscura por diseño), volcado de imágenes reales de proyectos y fotos personales (se hace desde el Studio en iteraciones).

---

## 12. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Efectos WebGL degradan rendimiento | Presupuesto de efectos (§5), detección de capacidades, islas lazy |
| Plan gratuito Sanity (límites API/assets) | Sobra para un portfolio personal; build estático apenas consume API |
| FTP deploy frágil | Action con reintentos + deploy atómico a carpeta temporal y swap |
| Noche insuficiente para F0-F7 | Fases incrementales: cada una deja la web desplegable |
| Copy hero definitivo | Se redacta en F2 con 2-3 alternativas dejadas en Sanity para que Álvaro elija |
