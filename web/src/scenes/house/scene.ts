/**
 * La casa jugable (alcance mínimo del spec §6.2): una habitación low-poly,
 * personaje cápsula con billboard, cámara en tercera persona con lerp,
 * colisiones AABB simples y 5 interactuables con prompt + modal in-game.
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

    const hud = el.querySelector<HTMLElement>('.house-hud')!
    const prompt = hud.querySelector<HTMLElement>('.house-prompt')!
    const modal = document.getElementById('house-modal') as HTMLDialogElement
    const modalTitle = modal.querySelector<HTMLElement>('[data-house-title]')!
    const modalSummary = modal.querySelector<HTMLElement>('[data-house-summary]')!
    const modalLink = modal.querySelector<HTMLAnchorElement>('[data-house-link]')!

    const controls = createControls(hud)
    const char = {x: 0, z: 3, angle: 0}
    let character: ReturnType<typeof createCharacter> | null = null
    let nearest: (typeof interactables)[number] | null = null

    const addBox = (
      THREE: typeof import('three'),
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      color: string,
      solid = true,
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({color, roughness: 0.85, flatShading: true}),
      )
      mesh.position.set(x, y, z)
      scene.add(mesh)
      disposables.push({
        dispose() {
          mesh.geometry.dispose()
          ;(mesh.material as import('three').Material).dispose()
        },
      })
      if (solid) colliders.push({minX: x - w / 2 - 0.35, maxX: x + w / 2 + 0.35, minZ: z - d / 2 - 0.35, maxZ: z + d / 2 + 0.35})
      return mesh
    }

    const build = async () => {
      const THREE = await import('three')
      if (disposed) return

      scene.background = new THREE.Color('#0C0C0E')
      scene.fog = new THREE.Fog('#0C0C0E', 10, 22)

      // Suelo y paredes
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(ROOM, ROOM),
        new THREE.MeshStandardMaterial({color: '#16161A', roughness: 1}),
      )
      floor.rotation.x = -Math.PI / 2
      scene.add(floor)
      disposables.push({dispose: () => floor.geometry.dispose()})

      // Pared sur omitida: es el lado de la cámara (el límite sigue existiendo
      // en las colisiones); la niebla cierra la composición.
      const wallColor = '#1D1D23'
      addBox(THREE, ROOM, 3, 0.3, 0, 1.5, -ROOM / 2, wallColor, false)
      addBox(THREE, 0.3, 3, ROOM, -ROOM / 2, 1.5, 0, wallColor, false)
      addBox(THREE, 0.3, 3, ROOM, ROOM / 2, 1.5, 0, wallColor, false)

      // 5 muebles primitivos con acentos del sistema
      addBox(THREE, 2.4, 0.85, 1.1, -3.4, 0.42, -3.2, '#5B8CFF') // escritorio
      addBox(THREE, 0.5, 0.5, 0.35, -3.4, 1.1, -3.5, '#0C0C0E', false) // monitor
      addBox(THREE, 1.8, 2.4, 0.5, 3.6, 1.2, -3.6, '#B06CFF') // estantería
      addBox(THREE, 0.9, 1.2, 0.08, 0, 1.8, -ROOM / 2 + 0.2, '#F4F4F0', false) // diploma en pared
      addBox(THREE, 0.5, 1.5, 0.4, 4.2, 0.75, 2.6, '#FF7847') // guitarra (aprox)
      addBox(THREE, 1.1, 2.4, 0.18, -ROOM / 2 + 0.2, 1.2, 2.8, '#D4FF3F') // puerta

      // Personaje + luces
      character = createCharacter(THREE)
      character.group.position.set(char.x, 0, char.z)
      scene.add(character.group)
      disposables.push(character)

      const key = new THREE.DirectionalLight('#ffffff', 1.6)
      key.position.set(4, 8, 3)
      scene.add(key, new THREE.AmbientLight('#8A8A93', 0.9))

      camera.position.set(0, 5, 9)
      camera.lookAt(0, 0.8, 0)
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
      update(_t, dt) {
        if (!character) return
        const step = Math.min(dt, 0.05) * SPEED
        const dir = controls.read()
        if (dir.x !== 0 || dir.z !== 0) {
          const nx = char.x + dir.x * step
          const nz = char.z + dir.z * step
          if (!collides(nx, char.z)) char.x = nx
          if (!collides(char.x, nz)) char.z = nz
          char.angle = Math.atan2(dir.x, dir.z)
        }
        character.group.position.set(char.x, 0, char.z)
        character.group.rotation.y += (char.angle - character.group.rotation.y) * 0.15

        // Cámara tercera persona con lerp
        const targetX = char.x
        const targetZ = char.z + 4.2
        camera.position.x += (targetX - camera.position.x) * 0.06
        camera.position.z += (targetZ - camera.position.z) * 0.06
        camera.position.y += (3.4 - camera.position.y) * 0.06
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
