/**
 * Controles de la casa: WASD/flechas en teclado y joystick táctil virtual
 * (un nub arrastrable dentro de una base circular, montado en el HUD).
 * Expone un vector de movimiento normalizado y el evento de "interactuar".
 */

export interface Controls {
  /** Vector [-1..1] en x (derecha) y z (adelante). */
  read(): {x: number; z: number}
  onInteract(cb: () => void): void
  dispose(): void
}

export function createControls(hud: HTMLElement): Controls {
  const keys = new Set<string>()
  const interactCbs: (() => void)[] = []

  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase()
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
      keys.add(k)
      e.preventDefault()
    }
    if (k === 'e' || k === 'enter') interactCbs.forEach((cb) => cb())
  }
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  // Joystick táctil
  const stick = {x: 0, z: 0, active: false}
  const base = document.createElement('div')
  base.className = 'house-joystick'
  const nub = document.createElement('div')
  nub.className = 'house-joystick-nub'
  base.appendChild(nub)
  hud.appendChild(base)

  const RADIUS = 44
  const onTouch = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    const rect = base.getBoundingClientRect()
    const dx = touch.clientX - (rect.left + rect.width / 2)
    const dy = touch.clientY - (rect.top + rect.height / 2)
    const len = Math.hypot(dx, dy) || 1
    const clamped = Math.min(len, RADIUS)
    stick.x = (dx / len) * (clamped / RADIUS)
    stick.z = (dy / len) * (clamped / RADIUS)
    stick.active = true
    nub.style.transform = `translate(${(dx / len) * clamped}px, ${(dy / len) * clamped}px)`
    e.preventDefault()
  }
  const onTouchEnd = () => {
    stick.x = 0
    stick.z = 0
    stick.active = false
    nub.style.transform = ''
  }
  base.addEventListener('touchstart', onTouch, {passive: false})
  base.addEventListener('touchmove', onTouch, {passive: false})
  base.addEventListener('touchend', onTouchEnd)
  base.addEventListener('touchcancel', onTouchEnd)

  return {
    read() {
      let x = 0
      let z = 0
      if (keys.has('a') || keys.has('arrowleft')) x -= 1
      if (keys.has('d') || keys.has('arrowright')) x += 1
      if (keys.has('w') || keys.has('arrowup')) z -= 1
      if (keys.has('s') || keys.has('arrowdown')) z += 1
      if (stick.active) {
        x = stick.x
        z = stick.z
      }
      const len = Math.hypot(x, z)
      return len > 1 ? {x: x / len, z: z / len} : {x, z}
    },
    onInteract(cb) {
      interactCbs.push(cb)
    },
    dispose() {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      base.remove()
    },
  }
}
