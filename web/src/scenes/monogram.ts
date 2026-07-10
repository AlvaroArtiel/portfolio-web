/**
 * Monograma "AA" 3D (momento pxpush, remediación A1/B2/B12).
 *
 * La marca: dos A geométricas — silueta lambda (trazo triangular con
 * escote entre las patas) más travesaño — en marfil mate con rim-light
 * del acento de la sección. La MISMA silueta (constantes de abajo)
 * genera el SVG estático del header (Header.astro): una sola fuente de
 * forma para la marca 2D y 3D.
 *
 * Coreografía única y acotada: vive SOLO entre scroll 0 y ~100vh de la
 * home. Con el scroll interpola (scrub, curva de trayecto) desde su
 * posición de hero (arriba-derecha, en diagonal compositiva con el
 * titular) hasta el hueco exacto del header (#monogram-slot) y ahí
 * MUERE: la capa se oculta, el bucle se pausa y el header muestra su
 * versión SVG. Si el usuario vuelve a subir, revive. A partir de 100vh
 * nunca hay pieza 3D flotante.
 */
import type {SceneModule} from '../lib/three-island'
import {onReady, getMotion} from '../lib/motion'
import {SCRUB} from '../lib/motion-tokens'

/* ------------------------------------------------------------------ */
/* Silueta compartida 2D/3D                                            */
/* La A vive en x ∈ [-0.55, 0.55], y ∈ [-0.5, 0.55] (y hacia arriba).  */
/* Header.astro replica estos puntos en su path SVG (viewBox 0 0 100   */
/* 100, sx = 50 + x·80, sy = 50 − y·80).                               */
/* ------------------------------------------------------------------ */

const A_OUTLINE: Array<[number, number]> = [
  [-0.55, -0.5], // pie izquierdo exterior
  [0, 0.55], // ápice
  [0.55, -0.5], // pie derecho exterior
  [0.3, -0.5], // pie derecho interior
  [0, 0.1], // valle del escote
  [-0.3, -0.5], // pie izquierdo interior
]

const A_BAR = {halfWidth: 0.26, yTop: -0.12, yBottom: -0.24}
const A_DEPTH = 0.1 // extrusión fina: la marca es un trazo, no un bloque

/** Geometrías (lambda + travesaño) de una A. El llamador las dispone. */
export function makeAGeometries(THREE: typeof import('three')) {
  const lambda = new THREE.Shape()
  A_OUTLINE.forEach(([x, y], i) => (i === 0 ? lambda.moveTo(x, y) : lambda.lineTo(x, y)))
  lambda.closePath()

  const bar = new THREE.Shape()
  bar.moveTo(-A_BAR.halfWidth, A_BAR.yBottom)
  bar.lineTo(-A_BAR.halfWidth, A_BAR.yTop)
  bar.lineTo(A_BAR.halfWidth, A_BAR.yTop)
  bar.lineTo(A_BAR.halfWidth, A_BAR.yBottom)
  bar.closePath()

  const extrude = {depth: A_DEPTH, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2}
  return [new THREE.ExtrudeGeometry(lambda, extrude), new THREE.ExtrudeGeometry(bar, extrude)]
}

/**
 * Grupo del monograma completo (dos A en marfil, la segunda retrasada).
 * Reutilizado por la pieza del secreto post-footer para que toda marca
 * 3D del sitio salga de la misma forma.
 */
export function makeMonogramGroup(THREE: typeof import('three')) {
  const material = new THREE.MeshStandardMaterial({color: '#F4F4F0', metalness: 0.05, roughness: 0.6})
  const group = new THREE.Group()
  const geometries: import('three').BufferGeometry[] = []

  const buildA = (x: number, z: number, scale: number) => {
    const a = new THREE.Group()
    for (const geometry of makeAGeometries(THREE)) {
      geometries.push(geometry)
      a.add(new THREE.Mesh(geometry, material))
    }
    a.position.set(x, 0, z)
    a.scale.setScalar(scale)
    return a
  }

  group.add(buildA(-0.3, 0, 1), buildA(0.34, -0.12, 0.92))

  return {
    group,
    dispose() {
      geometries.forEach((g) => g.dispose())
      material.dispose()
    },
  }
}

/** Punto de pantalla (px) → coordenadas de mundo en el plano z=0. */
function screenToWorld(camera: import('three').PerspectiveCamera, x: number, y: number) {
  const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
  const worldW = worldH * camera.aspect
  return {
    x: (x / window.innerWidth - 0.5) * worldW,
    y: (0.5 - y / window.innerHeight) * worldH,
    worldH,
  }
}

/**
 * Curva de trayecto (ease-in-out cúbica), evaluada a mano por frame porque
 * este vuelo no es un tween GSAP de duración fija sino una interpolación
 * continua atada al progreso de scroll (`p`, 0-1). Es la materialización
 * local de EASE.inOut (motion-tokens.ts) — incluida aquí, no importada,
 * porque opera sobre un progreso normalizado y no sobre una curva de
 * bezier de string; misma familia de curva, coreografía sin tocar (A4).
 */
function easeInOut(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

const monogram: SceneModule = {
  init({scene, camera, el}) {
    const isMobile = window.matchMedia('(max-width: 720px)').matches
    let disposed = false
    const mouse = {x: 0, y: 0}
    let dockProgress = 0 // 0 = flotando en el hero, 1 = acoplado (y muerto)
    let dead = false

    const slot = document.getElementById('monogram-slot')

    const built = {current: null as ReturnType<typeof makeMonogramGroup> | null}

    /**
     * El 3D muere en el header: la capa pasa a display:none (el bucle de
     * three-island se pausa solo, vía IntersectionObserver) y el SVG del
     * header toma el relevo. Se invoca desde el ScrollTrigger, que sigue
     * vivo aunque el rAF de la escena esté pausado — así también revive.
     */
    const setDead = (next: boolean) => {
      if (dead === next) return
      dead = next
      el.style.display = next ? 'none' : ''
      if (slot) slot.style.opacity = next ? '1' : '0'
    }

    const build = async () => {
      const THREE = await import('three')
      if (disposed) return
      const monogramGroup = makeMonogramGroup(THREE)
      built.current = monogramGroup
      scene.add(monogramGroup.group)

      // Luz: clave blanca suave + rim del acento de la sección + ambiente bajo.
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#D4FF3F'
      const key = new THREE.DirectionalLight('#ffffff', 1.6)
      key.position.set(2, 3, 4)
      const rim = new THREE.DirectionalLight(accent, 2.4)
      rim.position.set(-3, -0.5, -2.5)
      const rim2 = new THREE.DirectionalLight(accent, 1.2)
      rim2.position.set(3.5, 1.5, -1.5)
      scene.add(key, rim, rim2, new THREE.AmbientLight('#404040', 1.1))

      // Scroll → progreso de acople (scrub sobre el primer viewport).
      onReady(() => {
        const motion = getMotion()
        if (!motion || disposed) return
        motion.gsap.to(
          {p: 0},
          {
            p: 1,
            ease: 'none',
            scrollTrigger: {start: 0, end: () => window.innerHeight * 1.1, scrub: SCRUB},
            onUpdate() {
              dockProgress = (this.targets()[0] as {p: number}).p
              // Móvil: acople por match-cut (la pieza se funde en su esquina
              // y el SVG toma el relevo) — a 390px cualquier vuelo literal
              // cruzaría subtítulo o botón de menú. Desktop: vuelo completo.
              if (isMobile) {
                el.style.opacity = String(Math.max(0, 1 - Math.max(0, (dockProgress - 0.35) / 0.15)))
                setDead(dockProgress >= 0.5)
              } else {
                setDead(dockProgress >= 0.999)
              }
            },
          },
        )
      })
    }
    void build()

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX / window.innerWidth - 0.5
      mouse.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onPointerMove, {passive: true})

    // Mientras el 3D vive, la marca es el 3D (dos marcas a la vez, jamás).
    if (slot) slot.style.opacity = '0'

    return {
      update(t) {
        const monogramGroup = built.current
        if (!monogramGroup) return
        const p = Math.min(1, Math.max(0, dockProgress))
        if (dead) return

        // Ancla hero (en px de página, sube con el contenido) — arriba-dcha,
        // diagonal compositiva con el titular; en móvil, esquina despejada
        // que nunca toca el texto.
        const heroPx = isMobile
          ? {x: window.innerWidth * 0.68, y: window.innerHeight * 0.17}
          : {x: window.innerWidth * 0.83, y: window.innerHeight * 0.2}
        // Desktop: parallax suave (la pieza "se despega" para iniciar el vuelo).
        // Móvil: 1:1 con el contenido — sale por arriba como parte de la página
        // y nunca puede chocar con el titular que sube.
        const heroScreenY = heroPx.y - window.scrollY * (isMobile ? 1 : 0.25)

        // Ancla dock: rect real del hueco del header, cada frame.
        const slotRect = slot?.getBoundingClientRect()
        const dockPx = slotRect
          ? {x: slotRect.left + slotRect.width / 2, y: slotRect.top + slotRect.height / 2}
          : {x: 48, y: 28}

        // Trayectoria en dos fases para no cruzar jamás la masa del titular:
        // 1) ASCENSO (p 0→0.72): sube pegado al borde derecho (siempre a la
        //    derecha del titular) hasta la franja del header, encogiendo ya
        //    a escala de dock.
        // 2) BARRIDO (p 0.72→1): ya diminuto y con el titular fuera de
        //    pantalla, se desliza por la franja del header hasta el hueco
        //    (empezando a la izquierda del botón de menú: no lo tapa).
        // El barrido ocurre en la banda vacía entre el hero (100svh) y la
        // siguiente sección (garantizada por la escala de espaciado): cuando
        // arranca, el titular ya salió y el "quién soy" aún no ha llegado.
        const RISE_END = 0.85
        const pRise = easeInOut(Math.min(1, p / RISE_END))
        const pSweep = easeInOut(p < RISE_END ? 0 : (p - RISE_END) / (1 - RISE_END))
        const edgeX = window.innerWidth * 0.9
        // Móvil (match-cut): la pieza se queda en su esquina, sube con un
        // parallax suave y encoge mientras se funde (opacidad en onUpdate).
        const flightX = isMobile ? heroPx.x : heroPx.x + (edgeX - heroPx.x) * pRise + (dockPx.x - (heroPx.x + (edgeX - heroPx.x) * pRise)) * pSweep
        const flightY = isMobile ? heroScreenY : heroScreenY + (dockPx.y - heroScreenY) * pRise
        const hero = screenToWorld(camera, flightX, flightY)

        // Escalas en unidades de mundo: hero ~34vh de alto; dock = alto del slot.
        const modelH = 1.05 // alto del glifo a escala 1
        const worldPerPx = hero.worldH / window.innerHeight
        const heroScale = ((isMobile ? 0.12 : 0.22) * window.innerHeight * worldPerPx) / modelH
        const dockScale = ((slotRect?.height ?? 28) * worldPerPx) / modelH

        const x = hero.x
        const y = hero.y
        const s = isMobile ? heroScale * (1 - 0.4 * pRise) : heroScale + (dockScale - heroScale) * pRise
        monogramGroup.group.position.set(x, y, 0)
        monogramGroup.group.scale.setScalar(s)

        // Presentación: giro leve que sigue al cursor y se aquieta al acoplar.
        const follow = 1 - p
        const targetY = (-0.28 + mouse.x * 0.5 + Math.sin(t * 0.35) * 0.06) * follow
        const targetX = (mouse.y * 0.3 + Math.sin(t * 0.5) * 0.03) * follow
        monogramGroup.group.rotation.y += (targetY - monogramGroup.group.rotation.y) * 0.06
        monogramGroup.group.rotation.x += (targetX - monogramGroup.group.rotation.x) * 0.06
      },
      dispose() {
        disposed = true
        window.removeEventListener('pointermove', onPointerMove)
        if (slot) slot.style.opacity = '1'
        built.current?.dispose()
      },
    }
  },
}

export default monogram
