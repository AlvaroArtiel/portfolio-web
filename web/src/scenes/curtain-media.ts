/**
 * Lonas k95: las imágenes heroMedia de la ficha de proyecto se sustituyen
 * visualmente por planos con curvatura vertical proporcional a la velocidad
 * de scroll (vertex shader). Las <img> reales quedan debajo (fallback y
 * fuente de las texturas — el CDN de Sanity sirve CORS *).
 */
import type {SceneModule} from '../lib/three-island'

const VERT = /* glsl */ `
  uniform float uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Curvatura: los bordes superior/inferior se retrasan según la velocidad
    float bend = sin(uv.y * 3.141592) * uVelocity * 0.35;
    pos.z += bend;
    pos.y += uVelocity * 0.08 * sin(uv.y * 3.141592);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(uMap, vUv);
  }
`

const curtainMedia: SceneModule = {
  init({scene, camera, el}) {
    let disposed = false
    const meshes: import('three').Mesh[] = []
    const uniformsList: {uVelocity: {value: number}}[] = []
    let velocity = 0
    let lastScroll = window.scrollY

    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'))

    const build = async () => {
      const THREE = await import('three')
      if (disposed || imgs.length === 0) return

      const loader = new THREE.TextureLoader()
      loader.setCrossOrigin('anonymous')
      const elRect = el.getBoundingClientRect()
      const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      const worldW = worldH * camera.aspect
      const perPxX = worldW / elRect.width
      const perPxY = worldH / elRect.height

      for (const img of imgs) {
        const src = img.currentSrc || img.src
        if (!src) continue
        try {
          const texture = await loader.loadAsync(src)
          if (disposed) {
            texture.dispose()
            return
          }
          texture.colorSpace = THREE.SRGBColorSpace
          const rect = img.getBoundingClientRect()
          const width = rect.width * perPxX
          const height = rect.height * perPxY
          const x = (rect.left - elRect.left + rect.width / 2) * perPxX - worldW / 2
          const y = worldH / 2 - (rect.top - elRect.top + rect.height / 2) * perPxY

          const uniforms = {uMap: {value: texture}, uVelocity: {value: 0}}
          const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: VERT,
            fragmentShader: FRAG,
          })
          const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 1, 24), material)
          // Respeta el orden de solape del DOM (las siguientes van delante)
          mesh.position.set(x, y, meshes.length * 0.05)
          scene.add(mesh)
          meshes.push(mesh)
          uniformsList.push(uniforms as never)
          img.style.visibility = 'hidden'
        } catch {
          // CORS o red: esa imagen se queda como <img> normal
        }
      }
    }
    void build()

    return {
      update() {
        const delta = window.scrollY - lastScroll
        lastScroll = window.scrollY
        velocity += (Math.max(-40, Math.min(40, delta)) * 0.02 - velocity) * 0.12
        for (const u of uniformsList) u.uVelocity.value = velocity
      },
      dispose() {
        disposed = true
        imgs.forEach((img) => (img.style.visibility = ''))
        for (const mesh of meshes) {
          mesh.geometry.dispose()
          const material = mesh.material as import('three').ShaderMaterial
          ;(material.uniforms.uMap.value as import('three').Texture)?.dispose()
          material.dispose()
        }
      },
    }
  },
}

export default curtainMedia
