/**
 * Accessible lightbox for the personal photo grid, built on the native
 * `<dialog>` element (focus trapping, Escape-to-close and the backdrop all
 * come for free from the platform).
 *
 * Expects the page to render:
 *   - a `<dialog id="lightbox">` with `[data-lightbox-img]`,
 *     `[data-lightbox-caption]`, `[data-lightbox-prev]`, `[data-lightbox-next]`
 *     and `[data-lightbox-close]` descendants;
 *   - one or more `[data-lightbox-trigger]` buttons carrying
 *     `data-lightbox-index` (0-based order), `data-lightbox-src` (full-res
 *     image URL) and `data-lightbox-alt` (caption/alt text).
 *
 * Video polaroids are not part of the lightbox: they load an inline embed
 * in place instead (see the `data-video-facade` handling in personal.astro).
 */
export function initLightbox(): void {
  const dialog = document.querySelector<HTMLDialogElement>('#lightbox')
  if (!dialog) return

  const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-lightbox-trigger]')).sort(
    (a, b) => Number(a.dataset.lightboxIndex ?? 0) - Number(b.dataset.lightboxIndex ?? 0),
  )
  if (triggers.length === 0) return

  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-img]')
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')
  const prevBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]')
  const nextBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]')
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]')
  if (!img || !caption || !prevBtn || !nextBtn || !closeBtn) return

  let current = 0
  let opener: HTMLElement | null = null

  function show(index: number): void {
    current = (index + triggers.length) % triggers.length
    const trigger = triggers[current]
    const src = trigger.dataset.lightboxSrc ?? ''
    const alt = trigger.dataset.lightboxAlt ?? ''
    img!.src = src
    img!.alt = alt
    caption!.textContent = alt
  }

  function open(index: number, from: HTMLElement): void {
    opener = from
    show(index)
    dialog!.showModal()
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => open(index, trigger))
  })

  prevBtn.addEventListener('click', () => show(current - 1))
  nextBtn.addEventListener('click', () => show(current + 1))
  closeBtn.addEventListener('click', () => dialog!.close())

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(current - 1)
    else if (event.key === 'ArrowRight') show(current + 1)
  })

  // Click on the backdrop (the dialog's own box, not its content) closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })

  // The platform already restores focus on Escape/close events; we only need
  // to point it back at the polaroid that opened the dialog.
  dialog.addEventListener('close', () => {
    opener?.focus()
  })
}
