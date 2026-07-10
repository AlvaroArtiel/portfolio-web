/**
 * Monograma "AA" 3D (momento pxpush): dos A geométricas extruidas —
 * diseñadas como triángulo con contraforma triangular, legibles a 24px —
 * que rotan siguiendo al cursor en el hero y, al hacer scroll, se
 * interpolan (posición/escala) hasta acoplarse al hueco del header, donde
 * quedan como logo persistente.
 *
 * Vive en una capa fija sobre la página (pointer-events: none). Fallback
 * sin WebGL: el monograma tipográfico del header, que nunca se toca.
 */
import type {SceneModule} from '../lib/three-island'
import {onReady, getMotion} from '../lib/motion'

/** Silueta de A: triángulo con hueco triangular (contraforma). */
export function makeA(THREE: typeof import('three')) {
  const shape = new THREE.Shape()
  shape.moveTo(-0.5, -0.5)
  shape.lineTo(0, 0.5)
  shape.lineTo(0.5, -0.5)
  shape.lineTo(0.28, -0.5)
  shape.lineTo(0, 0.06)
  shape.lineTo(-0.28, -0.5)
  shape.closePath()
  const hole = new THREE.Path()
  hole.moveTo(0, -0.12)
  hole.lineTo(0.12, -0.34)
  hole.lineTo(-0.12, -0.34)
  hole.closePath()
  // La barra de la A se insinúa con la contraforma: silueta simple y rotunda
  shape.holes.push(hole)
  return new THREE.ExtrudeGeometry(shape, {depth: 0.22, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2})
}

/** Convierte un punto de pantalla a coordenadas de mundo en el plano z=0. */
function screenToWorld(camera: import('three').PerspectiveCamera, x: number, y: number) {
  const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
  const worldW = worldH * camera.aspect
  return {
    x: (x / window.innerWidth - 0.5) * worldW,
    y: (0.5 - y / window.innerHeight) * worldH,
  }
}

const monogram: SceneModule = {
  init({scene, camera, el}) {
    const baseScale = window.matchMedia('(max-width: 720px)').matches ? 0.3 : 0.55
    let group: import('three').Group | null = null
    let disposed = false
    const mouse = {x: 0, y: 0}
    let dockProgress = 0 // 0 = flotando en el hero, 1 = acoplado al header

    const slot = document.getElementById('monogram-slot')
    const heroStage = document.getElementById('hero-stage')

    const anchors = {hero: {x: 0, y: 0, scale: 1}, dock: {x: 0, y: 0, scale: 0.12}}
    const computeAnchors = () => {
      // Flotando: zona derecha del hero, despejada del titular
      const heroRect = heroStage?.getBoundingClientRect()
      const hx = heroRect ? heroRect.right - heroRect.width * 0.16 : window.innerWidth * 0.8
      const hy = heroRect ? heroRect.top + window.scrollY + heroRect.height * 0.3 : window.innerHeight * 0.3
      const heroWorld = screenToWorld(camera, hx, Math.max(60, hy - window.scrollY))
      anchors.hero = {x: heroWorld.x, y: heroWorld.y, scale: 1}
      if (slot) {
        const r = slot.getBoundingClientRect() // header es fixed: rect estable
        const dockWorld = screenToWorld(camera, r.left + r.width / 2, r.top + r.height / 2)
        anchors.dock = {x: dockWorld.x, y: dockWorld.y, scale: 0.16}
      }
    }

    const build = async () => {
      const THREE = await import('three')
      if (disposed) return
      group = new THREE.Group()

      const geoA = makeA(THREE)
      const matBase = new THREE.MeshStandardMaterial({color: '#F4F4F0', metalness: 0.15, roughness: 0.45})
      const matAccent = new THREE.MeshStandardMaterial({color: '#D4FF3F', metalness: 0.2, roughness: 0.35})
      const a1 = new THREE.Mesh(geoA, matBase)
      const a2 = new THREE.Mesh(geoA, matAccent)
      a1.position.set(-0.28, 0, 0)
      a2.position.set(0.3, 0, -0.12)
      group.add(a1, a2)
      group.scale.setScalar(baseScale)
      scene.add(group)

      const key = new THREE.DirectionalLight('#ffffff', 2.2)
      key.position.set(2, 3, 4)
      const rim = new THREE.DirectionalLight('#D4FF3F', 0.8)
      rim.position.set(-3, -1, 2)
      scene.add(key, rim, new THREE.AmbientLight('#404040', 1.2))

      computeAnchors()
      window.addEventListener('resize', computeAnchors)

      // Scroll → progreso de acople (scrub sobre el primer viewport)
      onReady(() => {
        const motion = getMotion()
        if (!motion || disposed) return
        motion.gsap.to(
          {p: 0},
          {
            p: 1,
            ease: 'none',
            scrollTrigger: {start: 0, end: () => window.innerHeight * 0.9, scrub: 0.3},
            onUpdate() {
              dockProgress = (this.targets()[0] as {p: number}).p
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

    const headerMonogram = slot

    return {
      update(t) {
        if (!group) return
        const p = dockProgress
        const x = anchors.hero.x + (anchors.dock.x - anchors.hero.x) * p
        const y = anchors.hero.y + (anchors.dock.y - anchors.hero.y) * p
        const s = (anchors.hero.scale + (anchors.dock.scale - anchors.hero.scale) * p) * baseScale
        group.position.set(x, y, 0)
        group.scale.setScalar(s)

        // Sigue al cursor con suavidad; al acoplarse se aquieta
        const follow = 1 - p
        group.rotation.y += ((mouse.x * 0.9 * follow + Math.sin(t * 0.4) * 0.08) - group.rotation.y) * 0.06
        group.rotation.x += ((mouse.y * 0.5 * follow) - group.rotation.x) * 0.06

        // El AA tipográfico del header cede el sitio cuando el 3D llega
        if (headerMonogram) headerMonogram.style.opacity = p > 0.92 ? '0' : '1'
      },
      dispose() {
        disposed = true
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('resize', computeAnchors)
        if (headerMonogram) headerMonogram.style.opacity = '1'
        group?.traverse((obj) => {
          const mesh = obj as import('three').Mesh
          if (mesh.isMesh) {
            mesh.geometry.dispose()
            ;(mesh.material as import('three').Material).dispose()
          }
        })
      },
    }
  },
}

export default monogram
