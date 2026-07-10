/**
 * Shared Three.js island infrastructure. This is the ONLY module scene
 * consumers should go through — it owns capability detection, lazy mounting,
 * resize handling, and visibility-driven pausing so individual scenes stay
 * trivial (build a scene graph, return update/dispose).
 *
 * Nothing here imports `three` at the top level: the library and the scene
 * module are only ever pulled in via dynamic `import()` once we already know
 * WebGL2 is viable and the host element is near the viewport. Devices that
 * fail `canRunWebGL()` never download either chunk — whatever static
 * fallback markup already lives under/behind the element is left untouched.
 */

/** Contract every Three.js scene module must implement. */
export interface SceneModule {
  /**
   * Build the scene. Called once, after the renderer/camera/canvas exist.
   * Return an optional per-frame `update` callback and an optional `dispose`
   * cleanup invoked on unmount.
   */
  init(ctx: {
    scene: import('three').Scene
    camera: import('three').PerspectiveCamera
    renderer: import('three').WebGLRenderer
    el: HTMLElement
  }): {
    update?: (t: number, dt: number) => void
    dispose?: () => void
  }
}

export interface MountSceneOptions {
  /** Mount immediately instead of waiting for the element to be near-viewport. */
  eager?: boolean
}

/**
 * Capability gate: WebGL2 + (unreported or >=4GB) deviceMemory +
 * !prefers-reduced-motion. Cheap and synchronous — safe to call before
 * deciding whether to import anything heavy.
 */
export function canRunWebGL(): boolean {
  if (typeof window === 'undefined') return false

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

  const deviceMemory = (navigator as Navigator & {deviceMemory?: number}).deviceMemory
  if (typeof deviceMemory === 'number' && deviceMemory < 4) return false

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    return gl !== null
  } catch {
    return false
  }
}

/**
 * Mount a lazily-loaded Three.js scene inside `el`.
 *
 * Returns `null` immediately (no imports performed) when `canRunWebGL()` is
 * false, leaving whatever fallback markup already exists in place.
 *
 * Otherwise waits until `el` is within 200px of the viewport (unless
 * `eager` is set), then dynamically imports `three` and the scene module,
 * creates a transparent absolutely-positioned canvas, and starts a rAF loop
 * that pauses whenever the element scrolls off-screen or the document is
 * hidden. Resolves to an unmount function, or `null` if capability check
 * failed.
 */
export async function mountScene(
  el: HTMLElement,
  loader: () => Promise<SceneModule>,
  options: MountSceneOptions = {},
): Promise<(() => void) | null> {
  if (!canRunWebGL()) return null

  await waitUntilVisible(el, options.eager ?? false)

  const THREE = await import('three')
  const sceneModule = await loader()

  const computedStyle = window.getComputedStyle(el)
  if (computedStyle.position === 'static') {
    el.style.position = 'relative'
  }

  const canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  canvas.style.inset = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  el.appendChild(canvas)

  const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true})
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.z = 5

  const setSize = (): void => {
    const width = el.clientWidth || 1
    const height = el.clientHeight || 1
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  setSize()

  const {update, dispose} = sceneModule.init({scene, camera, renderer, el})

  let running = false
  let disposed = false
  let rafId: number | null = null
  let lastTime = 0

  const isDocumentVisible = (): boolean => document.visibilityState === 'visible'
  let elementIntersecting = true

  const shouldRun = (): boolean => elementIntersecting && isDocumentVisible()

  const frame = (time: number): void => {
    if (disposed) return
    const t = time / 1000
    const dt = lastTime === 0 ? 0 : t - lastTime
    lastTime = t

    update?.(t, dt)
    renderer.render(scene, camera)

    rafId = window.requestAnimationFrame(frame)
  }

  const start = (): void => {
    if (running || disposed) return
    running = true
    lastTime = 0
    rafId = window.requestAnimationFrame(frame)
  }

  const stop = (): void => {
    running = false
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  const syncRunState = (): void => {
    if (shouldRun()) start()
    else stop()
  }

  const resizeObserver = new ResizeObserver(() => setSize())
  resizeObserver.observe(el)

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      elementIntersecting = entry?.isIntersecting ?? false
      syncRunState()
    },
    {rootMargin: '200px'},
  )
  visibilityObserver.observe(el)

  const onDocumentVisibilityChange = (): void => syncRunState()
  document.addEventListener('visibilitychange', onDocumentVisibilityChange)

  syncRunState()

  return function unmount(): void {
    disposed = true
    stop()
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    document.removeEventListener('visibilitychange', onDocumentVisibilityChange)
    dispose?.()
    renderer.dispose()
    canvas.remove()
  }
}

/**
 * Resolve once `el` is within 200px of the viewport (mirrors `client:visible`
 * semantics), or immediately if `eager` is true.
 */
function waitUntilVisible(el: HTMLElement, eager: boolean): Promise<void> {
  if (eager) return Promise.resolve()

  return new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          resolve()
        }
      },
      {rootMargin: '200px'},
    )
    observer.observe(el)
  })
}
