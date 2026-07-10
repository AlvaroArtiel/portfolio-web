/**
 * Personaje: cápsula low-poly con la cara como billboard. Si existiera un
 * retrato en assets (no lo hay a día de hoy — ver NIGHT-REPORT), aquí se
 * cargaría; de momento la cabeza lleva el monograma AA como placeholder.
 */

export function createCharacter(THREE: typeof import('three')) {
  const group = new THREE.Group()

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.32, 0.7, 4, 12),
    new THREE.MeshStandardMaterial({color: '#5B8CFF', roughness: 0.7}),
  )
  body.position.y = 0.68
  group.add(body)

  // Cabeza billboard: canvas circular con el monograma (placeholder de retrato)
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#16161A'
  ctx.beginPath()
  ctx.arc(128, 128, 124, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#D4FF3F'
  ctx.lineWidth = 8
  ctx.stroke()
  ctx.fillStyle = '#F4F4F0'
  ctx.font = '600 110px "Clash Display", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('A', 96, 138)
  ctx.fillStyle = '#D4FF3F'
  ctx.fillText('A', 168, 138)

  const texture = new THREE.CanvasTexture(canvas)
  const head = new THREE.Sprite(new THREE.SpriteMaterial({map: texture}))
  head.scale.setScalar(0.62)
  head.position.y = 1.55
  group.add(head)

  return {
    group,
    dispose() {
      body.geometry.dispose()
      ;(body.material as import('three').Material).dispose()
      head.material.map?.dispose()
      head.material.dispose()
    },
  }
}
