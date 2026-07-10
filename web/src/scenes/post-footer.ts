/**
 * Pieza del secreto post-footer: una A del monograma girando despacio,
 * misma estética (blanco roto + lima) que el logo 3D del hero. Decorativa:
 * el texto y la puerta a /casa son HTML y existen siempre debajo.
 */
import type {SceneModule} from '../lib/three-island'
import {makeA} from './monogram'

const postFooterScene: SceneModule = {
  init({scene, camera}) {
    let mesh: import('three').Mesh | null = null
    let disposed = false
    camera.position.z = 4

    const build = async () => {
      const THREE = await import('three')
      if (disposed) return
      mesh = new THREE.Mesh(
        makeA(THREE),
        new THREE.MeshStandardMaterial({color: '#D4FF3F', metalness: 0.25, roughness: 0.4}),
      )
      mesh.scale.setScalar(1.4)
      scene.add(mesh)
      const key = new THREE.DirectionalLight('#ffffff', 2)
      key.position.set(2, 3, 4)
      scene.add(key, new THREE.AmbientLight('#404040', 1.4))
    }
    void build()

    return {
      update(t) {
        if (!mesh) return
        mesh.rotation.y = t * 0.5
        mesh.rotation.x = Math.sin(t * 0.3) * 0.25
      },
      dispose() {
        disposed = true
        if (mesh) {
          mesh.geometry.dispose()
          ;(mesh.material as import('three').Material).dispose()
        }
      },
    }
  },
}

export default postFooterScene
