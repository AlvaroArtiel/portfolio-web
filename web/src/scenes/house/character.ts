/**
 * Personaje (remediación B11): cápsula "vestida" mínimamente — piernas
 * oscuras y torso marfil, el bicolor del sistema — con la cabeza como
 * billboard del retrato real (web/public/house/retrato.png, recortado en
 * círculo con aro marfil). Si el retrato no carga, la cabeza cae al
 * monograma AA como placeholder. Bob al andar vía `setMoving`.
 */

function drawFallbackHead(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#1A1A21'
  ctx.beginPath()
  ctx.arc(128, 128, 118, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#F4F4F0'
  ctx.font = '600 100px "Clash Display", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('A', 100, 138)
  ctx.fillStyle = '#D4FF3F'
  ctx.fillText('A', 162, 138)
}

export function createCharacter(THREE: typeof import('three')) {
  const group = new THREE.Group()
  const disposables: {dispose(): void}[] = []

  // Cuerpo bicolor: piernas (cilindro oscuro) + torso (cápsula marfil)
  const legsMaterial = new THREE.MeshStandardMaterial({color: '#1A1A21', roughness: 0.85})
  const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.5, 12), legsMaterial)
  legs.position.y = 0.25
  group.add(legs)
  disposables.push({dispose: () => (legs.geometry.dispose(), legsMaterial.dispose())})

  const torsoMaterial = new THREE.MeshStandardMaterial({color: '#F4F4F0', roughness: 0.7})
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.42, 4, 12), torsoMaterial)
  torso.position.y = 0.85
  group.add(torso)
  disposables.push({dispose: () => (torso.geometry.dispose(), torsoMaterial.dispose())})

  // Cabeza billboard: retrato real recortado en círculo con aro marfil
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  drawFallbackHead(ctx)
  const texture = new THREE.CanvasTexture(canvas)

  const portrait = new Image()
  portrait.onload = () => {
    ctx.clearRect(0, 0, 256, 256)
    ctx.save()
    ctx.beginPath()
    ctx.arc(128, 128, 118, 0, Math.PI * 2)
    ctx.clip()
    // Cover: escala el retrato al círculo conservando proporción
    const scale = Math.max(236 / portrait.width, 236 / portrait.height)
    const w = portrait.width * scale
    const h = portrait.height * scale
    ctx.drawImage(portrait, 128 - w / 2, 128 - h / 2, w, h)
    ctx.restore()
    ctx.strokeStyle = '#F4F4F0'
    ctx.lineWidth = 10
    ctx.beginPath()
    ctx.arc(128, 128, 118, 0, Math.PI * 2)
    ctx.stroke()
    texture.needsUpdate = true
  }
  portrait.src = '/house/retrato.png'

  const headMaterial = new THREE.SpriteMaterial({map: texture})
  const head = new THREE.Sprite(headMaterial)
  head.scale.setScalar(0.66)
  head.position.y = 1.62
  group.add(head)
  disposables.push({
    dispose() {
      headMaterial.map?.dispose()
      headMaterial.dispose()
    },
  })

  // Sombra de contacto (blob): nada flota
  const blobCanvas = document.createElement('canvas')
  blobCanvas.width = 128
  blobCanvas.height = 128
  const blobCtx = blobCanvas.getContext('2d')!
  const gradient = blobCtx.createRadialGradient(64, 64, 8, 64, 64, 62)
  gradient.addColorStop(0, 'rgba(0,0,0,0.55)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  blobCtx.fillStyle = gradient
  blobCtx.fillRect(0, 0, 128, 128)
  const blobTexture = new THREE.CanvasTexture(blobCanvas)
  const blobMaterial = new THREE.MeshBasicMaterial({map: blobTexture, transparent: true, depthWrite: false})
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), blobMaterial)
  blob.rotation.x = -Math.PI / 2
  blob.position.y = 0.015
  group.add(blob)
  disposables.push({
    dispose() {
      blob.geometry.dispose()
      blobTexture.dispose()
      blobMaterial.dispose()
    },
  })

  let bobPhase = 0

  return {
    group,
    /** Bob al andar: llamado por la escena cada frame. */
    setMoving(moving: boolean, dt: number) {
      if (moving) {
        bobPhase += dt * 11
        const bob = Math.abs(Math.sin(bobPhase)) * 0.06
        torso.position.y = 0.85 + bob
        head.position.y = 1.62 + bob
      } else {
        bobPhase = 0
        torso.position.y += (0.85 - torso.position.y) * 0.2
        head.position.y += (1.62 - head.position.y) * 0.2
      }
    },
    dispose() {
      disposables.forEach((d) => d.dispose())
    },
  }
}
