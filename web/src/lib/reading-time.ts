/**
 * Tiempo de lectura estimado a partir de bloques Portable Text (sesión 3 §3.4).
 * 200 palabras/min, mínimo 1 — lo usan la lista del blog y el interior.
 */
interface PortableChild {
  text?: string
}
interface PortableBlock {
  _type?: string
  children?: PortableChild[]
}

export function readingTime(blocks: unknown[] | undefined | null): number {
  if (!blocks?.length) return 1
  let words = 0
  for (const block of blocks as PortableBlock[]) {
    if (block?._type !== 'block' || !Array.isArray(block.children)) continue
    for (const child of block.children) {
      const text = child?.text
      if (text) words += text.split(/\s+/).filter(Boolean).length
    }
  }
  return Math.max(1, Math.round(words / 200))
}
