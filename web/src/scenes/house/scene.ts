/**
 * La casa jugable (remediación B11): de bloqueo a diorama con encanto.
 *
 * Dirección de arte:
 * - Luz ambiente cálida tenue + direccional principal; sombras de contacto
 *   (blobs) bajo personaje y muebles — nada flota.
 * - Habitación en neutros del sistema: suelo --surface-1 con retícula
 *   sutil, paredes --surface-0 con zócalo.
 * - Cada interactuable con el acento de su sección (escritorio azul,
 *   estantería violeta, guitarra naranja, pantalla teal, puerta lima) —
 *   el camaleón también vive aquí. Props compuestos de primitivas pero
 *   reconocibles, con micro-animación idle (el monitor parpadea).
 * - Personaje: cápsula bicolor con retrato billboard + bob al andar.
 * - Encuadre: cámara más baja y cercana, fog para profundidad (la viñeta
 *   CSS vive en views/house.astro).
 *
 * El HUD (prompt, modal, joystick, salida) es HTML dentro de la página.
 */
import type {SceneModule} from '../../lib/three-island'
import type {Lang} from '../../lib/i18n'
import {createControls} from './controls'
import {createCharacter} from './character'
import {interactables, t} from './interactables'

const ROOM = 11 // habitación ROOM×ROOM centrada en el origen
const SPEED = 4.2

interface AABB {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

const houseScene: SceneModule = {
  init({scene, camera, el}) {
    const lang = (document.documentElement.lang as Lang) || 'es'
    let disposed = false
    const disposables: {dispose(): void}[] = []
    const colliders: AABB[] = []
    const idles: ((t: number) => void)[] = []

    const hud = el.querySelector<HTMLElement>('.house-hud')!
    const prompt = hud.querySelector<HTMLElement>('.house-prompt')!
    const modal = document.getElementById('house-modal') as HTMLDialogElement
    const modalTitle = modal.querySelector<HTMLElement>('[data-house-title]')!
    const modalSummary = modal.querySelector<HTMLElement>('[data-house-summary]')!
    const modalLink = modal.querySelector<HTMLAnchorElement>('[data-house-link]')!

    const controls = createControls(hud)
    const char = {x: 0, z: 1.6, angle: 0}
    let character: ReturnType<typeof createCharacter> | null = null
    let nearest: (typeof interactables)[number] | null = null

    const build = async () => {
      const THREE = await import('three')
      if (disposed) return

      const track = (...items: Array<{dispose(): void}>) => disposables.push(...items)

      const material = (color: string, extra: Record<string, unknown> = {}) => {
        const m = new THREE.MeshStandardMaterial({color, roughness: 0.85, flatShading: true, ...extra})
        track(m)
        return m
      }

      /** Caja simple; registra geometría y colisión opcional. */
      const box = (
        w: number,
        h: number,
        d: number,
        x: number,
        y: number,
        z: number,
        mat: import('three').Material,
        solid = false,
      ) => {
        const geometry = new THREE.BoxGeometry(w, h, d)
        track({dispose: () => geometry.dispose()})
        const mesh = new THREE.Mesh(geometry, mat)
        mesh.position.set(x, y, z)
        scene.add(mesh)
        if (solid) colliders.push({minX: x - w / 2 - 0.35, maxX: x + w / 2 + 0.35, minZ: z - d / 2 - 0.35, maxZ: z + d / 2 + 0.35})
        return mesh
      }

      /** Sombra de contacto bajo un prop. */
      const blobShadow = (x: number, z: number, size: number) => {
        const canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 128
        const ctx = canvas.getContext('2d')!
        const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 62)
        gradient.addColorStop(0, 'rgba(0,0,0,0.5)')
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 128, 128)
        const texture = new THREE.CanvasTexture(canvas)
        const mat = new THREE.MeshBasicMaterial({map: texture, transparent: true, depthWrite: false})
        const geometry = new THREE.PlaneGeometry(size, size)
        const mesh = new THREE.Mesh(geometry, mat)
        mesh.rotation.x = -Math.PI / 2
        mesh.position.set(x, 0.012, z)
        scene.add(mesh)
        track({dispose: () => (geometry.dispose(), texture.dispose(), mat.dispose())})
      }

      /* -- Atmósfera ---------------------------------------------------- */
      scene.background = new THREE.Color('#0C0C0E')
      scene.fog = new THREE.Fog('#0C0C0E', 11, 24)

      // Ambiente cálido tenue + direccional principal
      const key = new THREE.DirectionalLight('#fff3e0', 1.5)
      key.position.set(4, 8, 3)
      const warm = new THREE.AmbientLight('#b9a48a', 0.55)
      const bounce = new THREE.HemisphereLight('#2a2a33', '#141419', 0.8)
      scene.add(key, warm, bounce)

      /* -- Habitación ---------------------------------------------------- */
      // Suelo surface-1 con retícula sutil
      const floorCanvas = document.createElement('canvas')
      floorCanvas.width = 256
      floorCanvas.height = 256
      const floorCtx = floorCanvas.getContext('2d')!
      floorCtx.fillStyle = '#141419'
      floorCtx.fillRect(0, 0, 256, 256)
      floorCtx.strokeStyle = 'rgba(244,244,240,0.055)'
      floorCtx.lineWidth = 1
      floorCtx.strokeRect(0.5, 0.5, 255, 255)
      const floorTexture = new THREE.CanvasTexture(floorCanvas)
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
      floorTexture.repeat.set(ROOM, ROOM)
      const floorMaterial = new THREE.MeshStandardMaterial({map: floorTexture, roughness: 0.95})
      const floorGeometry = new THREE.PlaneGeometry(ROOM, ROOM)
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -Math.PI / 2
      scene.add(floor)
      track({dispose: () => (floorGeometry.dispose(), floorTexture.dispose(), floorMaterial.dispose())})

      // Paredes surface-0 con zócalo surface-2 (la sur queda abierta a cámara)
      const wallMat = material('#101014')
      const skirtMat = material('#1A1A21')
      box(ROOM, 3, 0.25, 0, 1.5, -ROOM / 2, wallMat)
      box(0.25, 3, ROOM, -ROOM / 2, 1.5, 0, wallMat)
      box(0.25, 3, ROOM, ROOM / 2, 1.5, 0, wallMat)
      box(ROOM, 0.22, 0.29, 0, 0.11, -ROOM / 2 + 0.01, skirtMat)
      box(0.29, 0.22, ROOM, -ROOM / 2 + 0.01, 0.11, 0, skirtMat)
      box(0.29, 0.22, ROOM, ROOM / 2 - 0.01, 0.11, 0, skirtMat)

      /* -- Escritorio (azul, → proyectos) -------------------------------- */
      const deskBlue = material('#5B8CFF')
      const deskWood = material('#1A1A21')
      box(2.4, 0.09, 1.1, -3.4, 0.78, -3.2, deskBlue, true) // tablero
      box(0.08, 0.75, 0.08, -4.5, 0.38, -3.65, deskWood)
      box(0.08, 0.75, 0.08, -2.3, 0.38, -3.65, deskWood)
      box(0.08, 0.75, 0.08, -4.5, 0.38, -2.75, deskWood)
      box(0.08, 0.75, 0.08, -2.3, 0.38, -2.75, deskWood)
      // Monitor con pantalla emisiva teal (el "ordenador" del sistema) que
      // parpadea en idle
      box(0.66, 0.44, 0.05, -3.4, 1.12, -3.45, deskWood)
      const screenMat = new THREE.MeshStandardMaterial({
        color: '#0C0C0E',
        emissive: '#4FD1C5',
        emissiveIntensity: 0.75,
        roughness: 0.4,
      })
      track(screenMat)
      box(0.58, 0.36, 0.02, -3.4, 1.12, -3.42, screenMat)
      box(0.1, 0.18, 0.1, -3.4, 0.91, -3.45, deskWood) // pie del monitor
      box(0.7, 0.03, 0.24, -3.4, 0.84, -3.05, material('#26262e')) // teclado
      idles.push((time) => {
        screenMat.emissiveIntensity = 0.7 + Math.sin(time * 1.7) * 0.12 + Math.sin(time * 13.3) * 0.04
      })
      blobShadow(-3.4, -3.2, 3.2)

      /* -- Estantería (violeta, → experiencia) --------------------------- */
      const shelfViolet = material('#B06CFF')
      box(1.8, 0.06, 0.5, 3.6, 0.7, -3.6, shelfViolet, true)
      box(1.8, 0.06, 0.5, 3.6, 1.35, -3.6, shelfViolet)
      box(1.8, 0.06, 0.5, 3.6, 2.0, -3.6, shelfViolet)
      box(0.06, 2.15, 0.5, 2.75, 1.05, -3.6, shelfViolet)
      box(0.06, 2.15, 0.5, 4.45, 1.05, -3.6, shelfViolet)
      // Libros: lomos en los acentos del sistema
      const bookColors = ['#D4FF3F', '#5B8CFF', '#FF7847', '#4FD1C5', '#F4F4F0', '#B06CFF', '#5B8CFF', '#D4FF3F']
      bookColors.forEach((color, i) => {
        const height = 0.34 + (i % 3) * 0.05
        const shelfY = i < 4 ? 0.73 : 1.38
        box(0.09, height, 0.3, 3.05 + (i % 4) * 0.28, shelfY + height / 2, -3.6, material(color))
      })
      blobShadow(3.6, -3.6, 2.6)

      /* -- Diploma (marfil, → cv) ----------------------------------------- */
      box(0.95, 1.25, 0.05, 0, 1.8, -ROOM / 2 + 0.16, material('#1A1A21'))
      box(0.82, 1.12, 0.06, 0, 1.8, -ROOM / 2 + 0.17, material('#F4F4F0'))

      /* -- Guitarra (naranja, → personal): extrude de silueta real -------- */
      const guitarShape = new THREE.Shape()
      // Silueta acústica: caja en ocho (dos lóbulos)
      guitarShape.moveTo(0, -0.52)
      guitarShape.bezierCurveTo(0.34, -0.52, 0.4, -0.28, 0.3, -0.12)
      guitarShape.bezierCurveTo(0.24, -0.02, 0.26, 0.06, 0.3, 0.14)
      guitarShape.bezierCurveTo(0.38, 0.3, 0.26, 0.46, 0, 0.46)
      guitarShape.bezierCurveTo(-0.26, 0.46, -0.38, 0.3, -0.3, 0.14)
      guitarShape.bezierCurveTo(-0.26, 0.06, -0.24, -0.02, -0.3, -0.12)
      guitarShape.bezierCurveTo(-0.4, -0.28, -0.34, -0.52, 0, -0.52)
      const hole = new THREE.Path()
      hole.absarc(0, 0.02, 0.09, 0, Math.PI * 2, false)
      guitarShape.holes.push(hole)
      const guitarGeometry = new THREE.ExtrudeGeometry(guitarShape, {depth: 0.12, bevelEnabled: false})
      track({dispose: () => guitarGeometry.dispose()})
      const guitarOrange = material('#FF7847', {flatShading: false})
      const guitarBody = new THREE.Mesh(guitarGeometry, guitarOrange)
      const guitar = new THREE.Group()
      guitarBody.position.set(0, 0.5, 0)
      guitar.add(guitarBody)
      // Mástil + clavijero
      const neckMat = material('#1A1A21')
      const neckGeometry = new THREE.BoxGeometry(0.09, 0.85, 0.06)
      track({dispose: () => neckGeometry.dispose()})
      const neck = new THREE.Mesh(neckGeometry, neckMat)
      neck.position.set(0, 1.3, 0.03)
      guitar.add(neck)
      const headGeometry = new THREE.BoxGeometry(0.14, 0.22, 0.07)
      track({dispose: () => headGeometry.dispose()})
      const headstock = new THREE.Mesh(headGeometry, material('#FF7847'))
      headstock.position.set(0, 1.8, 0.03)
      guitar.add(headstock)
      guitar.position.set(4.2, 0, 2.6)
      guitar.rotation.set(0, -0.7, 0.18) // apoyada, ligeramente inclinada
      scene.add(guitar)
      colliders.push({minX: 3.8, maxX: 4.6, minZ: 2.2, maxZ: 3.0})
      // Idle: se mece imperceptiblemente, como recién dejada
      idles.push((time) => {
        guitar.rotation.z = 0.18 + Math.sin(time * 0.8) * 0.012
      })
      blobShadow(4.2, 2.6, 1.4)

      /* -- Puerta (lima, → contacto): marco + hoja + pomo ------------------ */
      const frameMat = material('#1A1A21')
      box(0.12, 2.55, 0.3, -ROOM / 2 + 0.2, 1.27, 2.05, frameMat)
      box(0.12, 2.55, 0.3, -ROOM / 2 + 0.2, 1.27, 3.55, frameMat)
      box(0.12, 0.16, 1.8, -ROOM / 2 + 0.2, 2.5, 2.8, frameMat)
      box(0.08, 2.4, 1.34, -ROOM / 2 + 0.18, 1.2, 2.8, material('#D4FF3F'), true)
      const knobGeometry = new THREE.SphereGeometry(0.055, 12, 12)
      track({dispose: () => knobGeometry.dispose()})
      const knob = new THREE.Mesh(knobGeometry, material('#F4F4F0', {flatShading: false}))
      knob.position.set(-ROOM / 2 + 0.28, 1.05, 3.28)
      scene.add(knob)

      /* -- Personaje ------------------------------------------------------ */
      character = createCharacter(THREE)
      character.group.position.set(char.x, 0, char.z)
      scene.add(character.group)
      track(character)

      // Encuadre inicial: más bajo y cinematográfico
      camera.position.set(0, 3.2, 7.2)
      camera.lookAt(0, 0.9, 0)
    }
    void build()

    const collides = (x: number, z: number): boolean => {
      const HALF = ROOM / 2 - 0.55
      if (x < -HALF || x > HALF || z < -HALF || z > HALF) return true
      return colliders.some((c) => x > c.minX && x < c.maxX && z > c.minZ && z < c.maxZ)
    }

    const openModal = () => {
      if (!nearest) return
      modalTitle.textContent = t(nearest.label, lang)
      modalSummary.textContent = t(nearest.summary, lang)
      modalLink.href = t(nearest.href, lang)
      modalLink.textContent = lang === 'en' ? 'Take me there →' : 'Llévame →'
      modal.showModal()
    }
    controls.onInteract(openModal)
    prompt.addEventListener('click', openModal)

    return {
      update(time, dt) {
        if (!character) return
        const step = Math.min(dt, 0.05) * SPEED
        const dir = controls.read()
        const moving = dir.x !== 0 || dir.z !== 0
        if (moving) {
          const nx = char.x + dir.x * step
          const nz = char.z + dir.z * step
          if (!collides(nx, char.z)) char.x = nx
          if (!collides(char.x, nz)) char.z = nz
          char.angle = Math.atan2(dir.x, dir.z)
        }
        character.group.position.set(char.x, 0, char.z)
        character.group.rotation.y += (char.angle - character.group.rotation.y) * 0.15
        character.setMoving(moving, dt)

        // Micro-animaciones idle de los props
        idles.forEach((idle) => idle(time))

        // Cámara tercera persona con lerp, ángulo bajo
        const targetX = char.x * 0.9
        const targetZ = char.z + 6.5
        camera.position.x += (targetX - camera.position.x) * 0.06
        camera.position.z += (targetZ - camera.position.z) * 0.06
        camera.position.y += (3.6 - camera.position.y) * 0.06
        camera.lookAt(char.x, 0.9, char.z)

        // Proximidad a interactuables
        nearest = null
        for (const item of interactables) {
          if (Math.hypot(char.x - item.x, char.z - item.z) < item.radius) {
            nearest = item
            break
          }
        }
        if (nearest) {
          prompt.hidden = false
          prompt.textContent =
            lang === 'en' ? `E / tap — ${t(nearest.label, lang)}` : `E / toca — ${t(nearest.label, lang)}`
        } else {
          prompt.hidden = true
        }
      },
      dispose() {
        disposed = true
        controls.dispose()
        disposables.forEach((d) => d.dispose())
      },
    }
  },
}

export default houseScene
