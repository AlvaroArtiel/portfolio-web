/**
 * Menu overlay behaviour: open/close with animation, Escape and outside-click
 * to close, focus trap while open. Without JS the header button is a plain
 * anchor to the footer nav, so everything here is progressive enhancement.
 */
export function initMenuOverlay(): void {
  const toggle = document.getElementById('menu-toggle')
  const overlay = document.getElementById('menu-overlay')
  if (!toggle || !overlay) return

  // Promote the fallback anchor to a real toggle button.
  toggle.removeAttribute('href')
  toggle.setAttribute('tabindex', '0')
  overlay.hidden = false

  const root = document.documentElement
  let lastFocused: HTMLElement | null = null

  const focusables = (): HTMLElement[] =>
    Array.from(overlay.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])'))

  const isOpen = () => root.hasAttribute('data-menu-open')

  function open(): void {
    lastFocused = document.activeElement as HTMLElement | null
    root.setAttribute('data-menu-open', '')
    toggle!.setAttribute('aria-expanded', 'true')
    document.body.style.overflow = 'hidden'
    focusables()[0]?.focus()
  }

  function close(): void {
    root.removeAttribute('data-menu-open')
    toggle!.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
    ;(lastFocused ?? toggle!).focus()
  }

  toggle.addEventListener('click', (event) => {
    event.preventDefault()
    isOpen() ? close() : open()
  })
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      isOpen() ? close() : open()
    }
  })

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return

    if (event.key === 'Escape') {
      close()
      return
    }

    // Focus trap: Tab circula entre el overlay y el botón de cierre.
    if (event.key === 'Tab') {
      const nodes = [toggle!, ...focusables()]
      const current = document.activeElement as HTMLElement
      const index = nodes.indexOf(current)
      if (index === -1) {
        event.preventDefault()
        nodes[0].focus()
        return
      }
      const next = event.shiftKey ? (index - 1 + nodes.length) % nodes.length : (index + 1) % nodes.length
      event.preventDefault()
      nodes[next].focus()
    }
  })

  // Clic fuera de los items (en el fondo del overlay) cierra.
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close()
  })

  // Cerrar al navegar (los links del overlay son navegación normal).
  overlay.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => close())
  })
}
