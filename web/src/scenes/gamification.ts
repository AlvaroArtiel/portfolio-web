/**
 * Bloque de especialidad "gamificación": tokens (Lúmenes) flotando en la banda
 * que el visitante recoge — con el cursor en escritorio, tocándolos en móvil.
 * Es un mini-juego cronometrado: el crono arranca al recoger el primer punto y
 * para al pillar el último; guarda tu mejor tiempo y se puede reiniciar. Un
 * autopiloto amable completa el nivel para quien no juega (remate de marca).
 *
 * El contenido real (titular, texto, badge, stat, chips) vive SIEMPRE en el DOM
 * por debajo; esta escena solo lo enriquece. Sin WebGL2 / reduced-motion la
 * escena no monta y la banda se queda en su estado estático "completado".
 *
 * Contrato con el DOM (dentro de `el`):
 *   - al montar: clase `is-interactive`; al completar: `is-complete`.
 *   - `[data-gami-bar]`    → style.width en %.
 *   - `[data-gami-count]`  → textContent con los puntos recogidos.
 *   - `[data-gami-timer]`  → textContent con el tiempo ("—" | "4.2s").
 *   - `[data-gami-best]`   → mejor tiempo (usa data-label para el prefijo).
 *   - `[data-gami-reset]`  → botón que reinicia la partida.
 */
import type {SceneModule} from '../lib/three-island'

const LIME = '#D4FF3F'
const N_COINS = 8 // monedas fijas; recogerlas todas = nivel completado
const TARGET = N_COINS
const IDLE_AUTOCOMPLETE_S = 6 // si nadie juega, se completa solo a partir de aquí
const COLLECT_RADIUS = 0.6 // proximidad del cursor / arrastre del dedo
const TAP_RADIUS = 1.0 // tap en móvil: radio más generoso (monedas pequeñas y móviles)
const BEST_KEY = 'aa-gami-best-ms'
const OPACITIES = [0.12, 0.5, 0.92] // halo, ring, core

type Token = {
  group: import('three').Group
  bob: number // fase del balanceo
  collecting: number // 0 = libre; >0 = animación de recogida en curso (0→1)
  collected: boolean // recogida y oculta: ya no cuenta ni se puede volver a pillar
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

    // Cronómetro: arranca al recoger el primer punto (por el usuario) y para al
    // completar. El autopiloto no lo arranca (deja "—" para no-jugadores).
    type TimerState = 'idle' | 'running' | 'done'
    let timerState: TimerState = 'idle'
    let startMs = 0
    let elapsedMs = 0
    let lastShownTenths = -1

    const barEl = el.querySelector<HTMLElement>('[data-gami-bar]')
    const countEl = el.querySelector<HTMLElement>('[data-gami-count]')
    const timerEl = el.querySelector<HTMLElement>('[data-gami-timer]')
    const bestEl = el.querySelector<HTMLElement>('[data-gami-best]')
    const resetBtn = el.querySelector<HTMLButtonElement>('[data-gami-reset]')

    const readBest = (): number | null => {
      try {
        const v = localStorage.getItem(BEST_KEY)
        return v ? Number(v) : null
      } catch {
        return null
      }
    }
    const writeBest = (ms: number) => {
      try {
        localStorage.setItem(BEST_KEY, String(Math.round(ms)))
      } catch {
        /* localStorage no disponible: el mejor tiempo simplemente no persiste */
      }
    }
    let best = readBest()
    const fmt = (ms: number) => `${(ms / 1000).toFixed(1)}s`

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
      return {group, bob: Math.random() * Math.PI * 2, collecting: 0, collected: false}
    }

    const updateTimerText = () => {
      if (timerEl) timerEl.textContent = timerState === 'idle' ? '—' : fmt(elapsedMs)
    }

    const updateDom = () => {
      const progress = Math.min(1, collected / TARGET)
      if (barEl) barEl.style.width = `${Math.round(progress * 100)}%`
      if (countEl) countEl.textContent = String(collected)
      updateTimerText()
      if (bestEl) {
        if (best != null) {
          bestEl.textContent = `${bestEl.dataset.label ?? 'Mejor'} ${fmt(best)}`
          bestEl.hidden = false
        } else {
          bestEl.hidden = true
        }
      }
      if (progress >= 1) el.classList.add('is-complete')
    }

    const startCollect = (token: Token, byUser: boolean) => {
      if (token.collecting > 0 || token.collected) return
      token.collecting = 0.0001
      collected += 1
      if (byUser) {
        userCollected += 1
        if (timerState === 'idle') {
          timerState = 'running'
          startMs = performance.now()
        }
      }
      if (collected >= TARGET && timerState === 'running') {
        timerState = 'done'
        elapsedMs = performance.now() - startMs
        if (best == null || elapsedMs < best) {
          best = elapsedMs
          writeBest(best)
        }
      }
      updateDom()
    }

    // Reinicia la partida: monedas nuevas, contador y crono a cero.
    const reset = () => {
      collected = 0
      userCollected = 0
      timerState = 'idle'
      startMs = 0
      elapsedMs = 0
      lastShownTenths = -1
      inViewTime = 0
      el.classList.remove('is-complete')
      for (const token of tokens) {
        const {x, y} = randomSpawn()
        token.group.position.set(x, y, 0)
        token.group.scale.setScalar(1)
        token.group.visible = true
        token.collecting = 0
        token.collected = false
        token.bob = Math.random() * Math.PI * 2
        token.group.children.forEach((child, i) => {
          ;((child as import('three').Mesh).material as import('three').MeshBasicMaterial).opacity = OPACITIES[i]
        })
      }
      updateDom()
    }

    const build = async () => {
      THREE = await import('three')
      if (disposed) return
      el.classList.add('is-interactive') // pasa del estado estático "completado" al jugable
      for (let i = 0; i < N_COINS; i++) tokens.push(makeToken())
      reset()
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

    // Tap (móvil sobre todo): recoge la moneda más cercana al punto tocado dentro
    // de un radio generoso. Si no hay ninguna cerca, no hace nada (deja scrollear).
    const collectAt = (clientX: number, clientY: number, radius: number): boolean => {
      const rect = el.getBoundingClientRect()
      const wx = ((clientX - rect.left) / rect.width - 0.5) * worldW()
      const wy = (0.5 - (clientY - rect.top) / rect.height) * worldH()
      let nearest: Token | null = null
      let nd = radius * radius
      for (const token of tokens) {
        if (token.collecting > 0 || token.collected) continue
        const dx = token.group.position.x - wx
        const dy = token.group.position.y - wy
        const d = dx * dx + dy * dy
        if (d < nd) {
          nd = d
          nearest = token
        }
      }
      if (nearest) {
        startCollect(nearest, true)
        return true
      }
      return false
    }
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, a')) return // no robar el clic al botón/enlaces
      if (collected >= TARGET) return
      // Solo preventDefault si de verdad recogemos algo: así un tap en vacío
      // conserva el scroll nativo de la página en móvil.
      if (collectAt(e.clientX, e.clientY, TAP_RADIUS)) e.preventDefault()
    }
    el.addEventListener('pointerdown', onPointerDown)

    const onReset = () => reset()
    resetBtn?.addEventListener('click', onReset)

    return {
      update(_t, dt) {
        if (!THREE || tokens.length === 0) return
        const d = Math.min(dt || 0.016, 0.05)
        inViewTime += d

        // Suavizado del puntero
        pointer.x += (pointer.tx - pointer.x) * 0.2
        pointer.y += (pointer.ty - pointer.y) * 0.2

        // Cronómetro en marcha: refresca el texto ~10 veces/s (por décimas)
        if (timerState === 'running') {
          elapsedMs = performance.now() - startMs
          const tenths = Math.floor(elapsedMs / 100)
          if (tenths !== lastShownTenths) {
            lastShownTenths = tenths
            updateTimerText()
          }
        }

        const done = collected >= TARGET
        // Autopiloto amable: si nadie juega, el nivel se completa solo (sin crono)
        let autopilotFire = false
        if (!done && userCollected === 0 && inViewTime > IDLE_AUTOCOMPLETE_S) {
          autopilotFire = Math.random() < d * 1.4 // ~1 recogida por ~0.7s
        }

        for (const token of tokens) {
          if (token.collected) continue

          if (token.collecting > 0) {
            // Animación de recogida: sube, encoge y se desvanece; luego se oculta
            token.collecting += d * 2.6
            token.group.position.y += d * 1.6
            const k = Math.max(0, 1 - token.collecting)
            token.group.scale.setScalar(0.2 + k)
            token.group.children.forEach((child, i) => {
              ;((child as import('three').Mesh).material as import('three').MeshBasicMaterial).opacity = OPACITIES[i] * k
            })
            if (token.collecting >= 1) {
              token.collected = true
              token.group.visible = false
            }
            continue
          }

          // Flotar: balanceo vertical + leve pulso de escala
          token.bob += d
          token.group.position.y += Math.sin(token.bob * 1.4) * d * 0.12
          token.group.rotation.z += d * 0.25
          const pulse = 1 + Math.sin(token.bob * 2) * 0.06
          token.group.scale.setScalar(pulse)

          // Recogida por proximidad del cursor (o del dedo al arrastrar)
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
        el.removeEventListener('pointerdown', onPointerDown)
        resetBtn?.removeEventListener('click', onReset)
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
