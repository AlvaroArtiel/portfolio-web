/**
 * Hero insignia: miles de puntos forman el titular (muestreado de un canvas
 * 2D con el texto en Clash Display), huyen del cursor con un campo de
 * repulsión suavizado y vuelven a su sitio con inercia de muelle.
 *
 * El <h1> real sigue SIEMPRE en el DOM debajo del canvas (SEO/a11y); esta
 * escena solo lo cubre visualmente. La simulación corre en CPU sobre typed
 * arrays (≈6-7k puntos en desktop, ~40% en móvil) — sobra para 60fps.
 */
import type {SceneModule} from '../lib/three-island'

const ACCENT_RATIO = 0.08
// Constantes de simulación física, no cubiertas por EASE/DURATION (que son
// para tweens GSAP con tiempo fijo): esta es una simulación de muelle+
// fricción por frame. Re-tempadas (A4) para que el reagrupado "respire"
// igual de lento y elegante que el resto del sitio — antes era más nervioso
// (SPRING/FRICTION altos = respuesta rápida y seca). El titular debe
// reformarse en ~1.5-2s tras espantar las partículas.
const SPRING = 0.028
const FRICTION = 0.9
const REPULSE_RADIUS = 0.85
const REPULSE_FORCE = 0.045

type Sampled = {targets: Float32Array; count: number; aspect: number}

/** Dibuja el texto (con saltos de línea) y devuelve posiciones de píxeles con tinta. */
function sampleText(text: string, el: HTMLElement, step: number): Sampled {
  const width = 1200
  const height = 640
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', {willReadFrequently: true})!

  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const fontSize = 132
  ctx.font = `600 ${fontSize}px "Clash Display", sans-serif`

  // Partir en líneas que quepan en el canvas
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word
    if (ctx.measureText(attempt).width > width * 0.94 && current) {
      lines.push(current)
      current = word
    } else {
      current = attempt
    }
  }
  if (current) lines.push(current)

  const lineHeight = fontSize * 1.02
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((line, i) => ctx.fillText(line, width / 2, startY + i * lineHeight))

  const data = ctx.getImageData(0, 0, width, height).data
  const points: number[] = []
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        // Mapear a coordenadas de mundo centradas, altura visible ≈ 4.14 (fov 45, z=5)
        const worldH = 4.0
        const worldW = worldH * (width / height)
        points.push(((x - width / 2) / height) * worldH, ((height / 2 - y) / height) * worldH, 0)
        void worldW
      }
    }
  }
  return {targets: new Float32Array(points), count: points.length / 3, aspect: width / height}
}

const heroParticles: SceneModule = {
  init({scene, camera, el}) {
    const isMobile = window.matchMedia('(max-width: 720px)').matches
    const step = isMobile ? 5 : 3 // móvil ≈ 40% de partículas

    const title = el.querySelector('h1')?.textContent?.trim() || 'Álvaro Artiel'

    let disposed = false
    let points: import('three').Points | null = null
    let positions!: Float32Array
    let velocities!: Float32Array
    let targets!: Float32Array
    let count = 0

    const mouse = {x: 999, y: 999, tx: 999, ty: 999}

    const build = async () => {
      const THREE = await import('three')
      try {
        await document.fonts.load('600 132px "Clash Display"')
      } catch {
        /* la fuente del sistema también sirve */
      }
      if (disposed) return

      const sampled = sampleText(title, el, step)
      targets = sampled.targets
      count = sampled.count
      positions = new Float32Array(count * 3)
      velocities = new Float32Array(count * 3)

      const colors = new Float32Array(count * 3)
      const white = new THREE.Color('#F4F4F0')
      const lime = new THREE.Color('#D4FF3F')
      for (let i = 0; i < count; i++) {
        // Nacen dispersas alrededor de su destino
        positions[i * 3] = targets[i * 3] + (Math.random() - 0.5) * 6
        positions[i * 3 + 1] = targets[i * 3 + 1] + (Math.random() - 0.5) * 4
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
        const color = Math.random() < ACCENT_RATIO ? lime : white
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      const material = new THREE.PointsMaterial({
        size: isMobile ? 0.028 : 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      })
      points = new THREE.Points(geometry, material)
      // Encajar el texto en el ancho visible del stage (móvil estrecho)
      const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      const visibleW = worldH * camera.aspect
      const textW = 4.0 * sampled.aspect
      if (textW > visibleW * 0.95) points.scale.setScalar((visibleW * 0.95) / textW)
      scene.add(points)
    }
    void build()

    // Cursor → coordenadas de mundo en el plano z=0
    const toWorld = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      const worldW = worldH * camera.aspect
      mouse.tx = ((clientX - rect.left) / rect.width - 0.5) * worldW
      mouse.ty = (0.5 - (clientY - rect.top) / rect.height) * worldH
    }
    const onPointerMove = (e: PointerEvent) => toWorld(e.clientX, e.clientY)
    const onPointerLeave = () => {
      mouse.tx = 999
      mouse.ty = 999
    }
    el.addEventListener('pointermove', onPointerMove, {passive: true})
    el.addEventListener('pointerleave', onPointerLeave)

    return {
      update() {
        if (!points) return
        // Suavizado del campo de repulsión
        mouse.x += (mouse.tx - mouse.x) * 0.18
        mouse.y += (mouse.ty - mouse.y) * 0.18

        for (let i = 0; i < count; i++) {
          const ix = i * 3
          const dxm = positions[ix] - mouse.x
          const dym = positions[ix + 1] - mouse.y
          const distSq = dxm * dxm + dym * dym
          if (distSq < REPULSE_RADIUS * REPULSE_RADIUS) {
            const dist = Math.sqrt(distSq) || 0.001
            const force = ((REPULSE_RADIUS - dist) / REPULSE_RADIUS) * REPULSE_FORCE
            velocities[ix] += (dxm / dist) * force
            velocities[ix + 1] += (dym / dist) * force
          }
          // Muelle hacia el destino + fricción
          velocities[ix] += (targets[ix] - positions[ix]) * SPRING
          velocities[ix + 1] += (targets[ix + 1] - positions[ix + 1]) * SPRING
          velocities[ix + 2] += (targets[ix + 2] - positions[ix + 2]) * SPRING
          velocities[ix] *= FRICTION
          velocities[ix + 1] *= FRICTION
          velocities[ix + 2] *= FRICTION
          positions[ix] += velocities[ix]
          positions[ix + 1] += velocities[ix + 1]
          positions[ix + 2] += velocities[ix + 2]
        }
        points.geometry.attributes.position.needsUpdate = true
      },
      dispose() {
        disposed = true
        el.removeEventListener('pointermove', onPointerMove)
        el.removeEventListener('pointerleave', onPointerLeave)
        if (points) {
          points.geometry.dispose()
          ;(points.material as import('three').Material).dispose()
        }
      },
    }
  },
}

export default heroParticles
