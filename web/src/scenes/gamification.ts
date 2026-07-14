/**
 * Bloque de especialidad "gamificación": tokens (Lúmenes) flotando en la banda
 * que el visitante recoge acercando el cursor. Cada recogida sube un contador y
 * una barra de progreso; al 100% la banda entra en estado "desbloqueado" (badge
 * + chips resaltados). Es el bucle acción→puntos→recompensa en vivo — una
 * demostración de la especialidad, no un juego completo.
 *
 * El contenido real (titular, texto, badge, stat, chips) vive SIEMPRE en el DOM
 * por debajo; esta escena solo lo enriquece. Sin WebGL2 / reduced-motion la
 * escena no monta y la banda se queda en su estado estático "completado".
 *
 * Contrato con el DOM (dentro de `el`):
 *   - al montar: se añade la clase `is-interactive` (0% jugable) y se quita el
 *     estado estático; al completar se añade `is-complete`.
 *   - `[data-gami-bar]`   → se fija su `style.width` en %.
 *   - `[data-gami-count]` → se fija su `textContent` con los puntos recogidos.
 */
import type {SceneModule} from '../lib/three-island'

const LIME = '#D4FF3F'
const TARGET = 6 // recogidas para llenar la barra
const IDLE_AUTOCOMPLETE_S = 6 // si nadie juega, se completa solo a partir de aquí
const MAX_TOKENS = 6
const COLLECT_RADIUS = 0.6

type Token = {
  group: import('three').Group
  bob: number // fase del balanceo
  collecting: number // 0 = libre; >0 = animación de recogida en curso (0→1)
}

const gamification: SceneModule = {
  init({scene, camera, el}) {
    let disposed = false
    let THREE: typeof import('three')
    const tokens: Token[] = []

    let collected = 0
    let inViewTime = 0
    let userCollected = 0
    const pointer = {x: 999, y: 999, tx: 999, ty: 999}

    const barEl = el.querySelector<HTMLElement>('[data-gami-bar]')
    const countEl = el.querySelector<HTMLElement>('[data-gami-count]')

    // Geometría del stage en unidades de mundo (plano z=0, como el resto de escenas)
    const worldH = () => 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
    const worldW = () => worldH() * camera.aspect

    const randomSpawn = () => {
      const wx = worldW()
      const wy = worldH()
      return {
        x: (Math.random() - 0.5) * wx * 0.92,
        y: (Math.random() - 0.5) * wy * 0.72,
      }
    }

    const makeToken = (): Token => {
      const group = new THREE.Group()
      // Halo suave + núcleo brillante = "moneda de luz"
      const halo = new THREE.Mesh(
        new THREE.CircleGeometry(0.2, 32),
        new THREE.MeshBasicMaterial({color: LIME, transparent: true, opacity: 0.12, depthWrite: false}),
      )
      const core = new THREE.Mesh(
        new THREE.CircleGeometry(0.11, 32),
        new THREE.MeshBasicMaterial({color: LIME, transparent: true, opacity: 0.92, depthWrite: false}),
      )
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.12, 0.145, 32),
        new THREE.MeshBasicMaterial({color: LIME, transparent: true, opacity: 0.5, depthWrite: false}),
      )
      group.add(halo, ring, core)
      const {x, y} = randomSpawn()
      group.position.set(x, y, 0)
      scene.add(group)
      return {group, bob: Math.random() * Math.PI * 2, collecting: 0}
    }

    const updateDom = () => {
      const progress = Math.min(1, collected / TARGET)
      if (barEl) barEl.style.width = `${Math.round(progress * 100)}%`
      if (countEl) countEl.textContent = String(collected)
      if (progress >= 1) el.classList.add('is-complete')
    }

    const build = async () => {
      THREE = await import('three')
      if (disposed) return
      el.classList.add('is-interactive') // pasa del estado estático "completado" al jugable
      for (let i = 0; i < MAX_TOKENS; i++) tokens.push(makeToken())
      collected = 0
      updateDom()
    }
    void build()

    const toWorld = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      pointer.tx = ((clientX - rect.left) / rect.width - 0.5) * worldW()
      pointer.ty = (0.5 - (clientY - rect.top) / rect.height) * worldH()
    }
    const onPointerMove = (e: PointerEvent) => toWorld(e.clientX, e.clientY)
    const onPointerLeave = () => {
      pointer.tx = 999
      pointer.ty = 999
    }
    el.addEventListener('pointermove', onPointerMove, {passive: true})
    el.addEventListener('pointerleave', onPointerLeave)

    const startCollect = (token: Token, byUser: boolean) => {
      if (token.collecting > 0) return
      token.collecting = 0.0001
      collected += 1
      if (byUser) userCollected += 1
      updateDom()
    }

    const OPACITIES = [0.12, 0.5, 0.92] // halo, ring, core
    const respawn = (token: Token) => {
      const {x, y} = randomSpawn()
      token.group.position.set(x, y, 0)
      token.group.scale.setScalar(1)
      token.group.children.forEach((child, i) => {
        const mat = (child as import('three').Mesh).material as import('three').MeshBasicMaterial
        mat.opacity = OPACITIES[i]
      })
      token.collecting = 0
      token.bob = Math.random() * Math.PI * 2
    }

    return {
      update(_t, dt) {
        if (!THREE || tokens.length === 0) return
        const d = Math.min(dt || 0.016, 0.05)
        inViewTime += d

        // Suavizado del puntero
        pointer.x += (pointer.tx - pointer.x) * 0.2
        pointer.y += (pointer.ty - pointer.y) * 0.2

        const done = collected >= TARGET
        // Autopiloto amable: si nadie juega, la barra se completa sola
        let autopilotFire = false
        if (!done && userCollected === 0 && inViewTime > IDLE_AUTOCOMPLETE_S) {
          autopilotFire = Math.random() < d * 1.4 // ~1 recogida por ~0.7s
        }

        for (const token of tokens) {
          if (token.collecting > 0) {
            // Animación de recogida: sube, encoge y se desvanece; luego respawnea
            token.collecting += d * 2.6
            token.group.position.y += d * 1.6
            const k = Math.max(0, 1 - token.collecting)
            token.group.scale.setScalar(0.2 + k)
            const core = token.group.children[2] as import('three').Mesh
            ;(core.material as import('three').MeshBasicMaterial).opacity = 0.92 * k
            const halo = token.group.children[0] as import('three').Mesh
            ;(halo.material as import('three').MeshBasicMaterial).opacity = 0.12 * k
            const ring = token.group.children[1] as import('three').Mesh
            ;(ring.material as import('three').MeshBasicMaterial).opacity = 0.5 * k
            if (token.collecting >= 1) respawn(token)
            continue
          }

          // Flotar: balanceo vertical + leve pulso de escala
          token.bob += d
          token.group.position.y += Math.sin(token.bob * 1.4) * d * 0.12
          token.group.rotation.z += d * 0.25
          const pulse = 1 + Math.sin(token.bob * 2) * 0.06
          token.group.scale.setScalar(pulse)

          // Recogida por proximidad del cursor
          const dx = token.group.position.x - pointer.x
          const dy = token.group.position.y - pointer.y
          if (!done && dx * dx + dy * dy < COLLECT_RADIUS * COLLECT_RADIUS) {
            startCollect(token, true)
          } else if (autopilotFire) {
            startCollect(token, false)
            autopilotFire = false
          }
        }
      },
      dispose() {
        disposed = true
        el.removeEventListener('pointermove', onPointerMove)
        el.removeEventListener('pointerleave', onPointerLeave)
        for (const token of tokens) {
          token.group.traverse((o) => {
            const mesh = o as import('three').Mesh
            mesh.geometry?.dispose?.()
            const mat = mesh.material as import('three').Material | undefined
            mat?.dispose?.()
          })
          scene.remove(token.group)
        }
        tokens.length = 0
      },
    }
  },
}

export default gamification
