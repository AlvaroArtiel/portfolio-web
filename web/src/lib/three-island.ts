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
  /**
   * Abort the mount. If the scene hasn't mounted yet (still waiting for
   * visibility), the pending observer is disconnected and `mountScene`
   * resolves to `null`. If the scene has already mounted, the same cleanup
   * `unmount()` would perform runs automatically.
   */
  signal?: AbortSignal
}

/**
 * Elements currently mounted or waiting to mount. Guards against a second
 * concurrent `mountScene` call for the same element, which would otherwise
 * leak observers/canvases from the first call.
 */
const pendingOrMountedElements = new WeakSet<HTMLElement>()

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
 * hidden. Resolves to an unmount function, or `null` if the capability
 * check failed, the mount was aborted via `options.signal` before it
 * finished, or `el` was already mounted/waiting via a prior call.
 *
 * Pass `options.signal` to cancel the mount: aborting before visibility is
 * reached disconnects the pending `IntersectionObserver` and resolves to
 * `null`; aborting after mounting runs the same cleanup `unmount()` would.
 * Calling `mountScene` again for an element that is already mounted or
 * waiting logs a warning and returns `null` instead of mounting a second
 * time.
 */
export async function mountScene(
  el: HTMLElement,
  loader: () => Promise<SceneModule>,
  options: MountSceneOptions = {},
): Promise<(() => void) | null> {
  if (!canRunWebGL()) return null

  if (pendingOrMountedElements.has(el)) {
    console.warn('mountScene: element is already mounted or waiting to mount; ignoring duplicate call.')
    return null
  }
  pendingOrMountedElements.add(el)

  const {signal} = options

  const becameVisible = await waitUntilVisible(el, options.eager ?? false, signal)
  if (!becameVisible) {
    pendingOrMountedElements.delete(el)
    return null
  }

  const THREE = await import('three')
  const sceneModule = await loader()

  const computedStyle = window.getComputedStyle(el)
  const originalPosition = el.style.position
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

  const unmount = (): void => {
    if (disposed) return
    disposed = true
    pendingOrMountedElements.delete(el)
    stop()
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    document.removeEventListener('visibilitychange', onDocumentVisibilityChange)
    signal?.removeEventListener('abort', onAbort)
    dispose?.()
    renderer.dispose()
    canvas.remove()
    el.style.position = originalPosition
  }

  const onAbort = (): void => unmount()

  if (signal) {
    if (signal.aborted) {
      unmount()
      return null
    }
    signal.addEventListener('abort', onAbort)
  }

  return unmount
}

/**
 * Resolve `true` once `el` is within 200px of the viewport (mirrors
 * `client:visible` semantics), or immediately if `eager` is true. Resolves
 * `false` without ever creating (or after disconnecting) the observer if
 * `signal` is already aborted or fires an `abort` event first.
 */
function waitUntilVisible(el: HTMLElement, eager: boolean, signal?: AbortSignal): Promise<boolean> {
  if (signal?.aborted) return Promise.resolve(false)
  if (eager) return Promise.resolve(true)

  return new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          cleanup()
          resolve(true)
        }
      },
      {rootMargin: '200px'},
    )

    const onAbort = (): void => {
      cleanup()
      resolve(false)
    }

    const cleanup = (): void => {
      observer.disconnect()
      signal?.removeEventListener('abort', onAbort)
    }

    signal?.addEventListener('abort', onAbort)
    observer.observe(el)
  })
}
